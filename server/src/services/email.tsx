import Email from '../../emails/Email';
import { supabase } from '../db';
import { deleteOtp } from './otp';
import { isNotPersonal } from '../lib/personalProviders';
import transport from '../lib/nodemailer';
import { render } from '@react-email/components';
import React from 'react';

interface SendEmailInput {
	to: string[];
	from: string;
	subject: string;
	text: string;
	html: string;
	otp: string;
	agreedToTerms: boolean;
	files: File[];
}

async function verifyOtp(from: string, otp: string) {
	const { data: otpData, error: otpError } = await supabase
		.from('email_otps')
		.select('otp, expires_at')
		.eq('email', from)
		.limit(1)
		.single();

	if (otpError || !otpData) {
		throw new Error('Error verifying OTP');
	}

	const { otp: storedOtp, expires_at: expiresAt } = otpData;

	if (new Date() > new Date(expiresAt)) {
		await deleteOtp(from);
		throw new Error('OTP has expired. Please try again');
	}

	if (storedOtp !== otp) {
		await deleteOtp(from);
		throw new Error('Invalid OTP');
	}
}

async function send(
	email: string,
	from: string,
	subject: string,
	html: string,
	text: string,
	files: File[]
) {
	try {
		await transport.sendMail({
			to: email,
			from,
			subject,
			html: render(<Email html={html} subject={subject} />),
			text,
			attachments: await Promise.all(
				files.map(async (file) => ({
					filename: file.name,
					contentType: file.type,
					content: Buffer.from(await file.arrayBuffer()),
				}))
			),
		});
		return { status: 'sent', email };
	} catch (emailError: any) {
		return { status: 'error', email, error: emailError.message };
	}
}

export async function sendEmails({
	to,
	from,
	subject,
	html,
	text,
	otp,
	agreedToTerms,
	files,
}: SendEmailInput) {
	try {
		if (!agreedToTerms) {
			throw new Error(
				'You must agree to the terms of use before sending an email.'
			);
		}

		await verifyOtp(from, otp);

		const emailTasks = to.map(async (email) => {
			return await send(email, from, subject, html, text, files);
		});

		const results = await Promise.all(emailTasks);

		await deleteOtp(from);

		return results;
	} catch (error: any) {
		console.error('Error sending email:', error);
		throw new Error(error.message ?? 'Error sending email');
	}
}
