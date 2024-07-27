import Email from '../../emails/Email';
import { supabase } from '../db';
import { deleteOtp } from './otp';
import transport from '../lib/nodemailer';
import { render } from '@react-email/components';
import React from 'react';
import env from '../env';

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

		const res = await transport.sendMail({
			to,
			from: { name: 'OutreachKenya', address: env.EMAIL_FROM },
			subject,
			html: render(<Email html={html} subject={subject} from={from} />),
			text,
			attachments: await Promise.all(
				files.map(async (file) => ({
					filename: file.name,
					contentType: file.type,
					content: Buffer.from(await file.arrayBuffer()),
				}))
			),
		});

		await deleteOtp(from);

		return res;
	} catch (error: any) {
		console.error('Error sending email:', error);
		throw new Error(error.message ?? 'Error sending email');
	}
}
