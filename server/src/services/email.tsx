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
}

export async function sendEmail({
	to,
	from,
	subject,
	html,
	text,
	otp,
	agreedToTerms,
}: SendEmailInput) {
	try {
		if (!agreedToTerms) {
			throw new Error(
				'You must agree to the terms of use before sending an email.'
			);
		}

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

		const recipients = to.filter(isNotPersonal);

		const emailTasks = recipients.map(async (email) => {
			try {
				const { data: searchData } = await supabase
					.from('search')
					.select('email')
					.eq('email', email)
					.single();

				const found = searchData?.email ? true : false;

				await transport.sendMail({
					to: email,
					from,
					subject,
					html: render(
						<Email deleteEmail='' found={found} html={html} subject={subject} />
					),
					text: `${text} ${
						found
							? `Your email was found in our database. Please click here if you would like to delete it ${'link'}`
							: ''
					}`,
				});

				return { status: 'sent', email };
			} catch (emailError: any) {
				return { status: 'error', email, error: emailError.message };
			}
		});

		const results = await Promise.all(emailTasks);

		await deleteOtp(from);

		return results;
	} catch (error: any) {
		console.error('Error sending email:', error);
		throw new Error(error.message ?? 'Error sending email');
	}
}
