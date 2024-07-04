import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import env from '../env';
import { supabase } from '../db';
import otpGenerator from 'otp-generator';

export function generateOtp() {
	return otpGenerator.generate(6, {
		upperCaseAlphabets: true,
		digits: true,
		specialChars: false,
		lowerCaseAlphabets: false,
	});
}

const transport = nodemailer.createTransport({
	host: env.EMAIL_SERVER_HOST,
	port: env.EMAIL_SERVER_PORT,
	auth: {
		user: env.EMAIL_SERVER_USER,
		pass: env.EMAIL_SERVER_PASSWORD,
	},
});

export async function createOTP(email: string) {
	try {
		await supabase.from('email_otps').delete().eq('email', email);

		const otp = generateOtp();

		const { error } = await supabase.from('email_otps').insert({ email, otp });

		if (error) {
			throw new Error('Error storing OTP: ' + error.message);
		}

		await transport.sendMail({
			to: email,
			from: env.EMAIL_FROM,
			subject: 'Your OTP Code',
			text: `Your OTP code is ${otp}`,
		});

		return { message: 'OTP sent. Please verify to proceed.' };
	} catch (error: any) {
		throw new Error('Error generating OTP: ' + error.message);
	}
}

export async function sendEmail({
	to,
	from,
	subject,
	html,
	text,
	otp,
}: Mail.Options & { otp: string }) {
	try {
		const { data, error } = await supabase
			.from('email_otps')
			.select('otp')
			.eq('email', `${from}`)
			.limit(1);

		if (error || !data || data.length === 0) {
			throw new Error('Error verifying OTP: ' + error?.message);
		}

		if (data[0].otp !== otp) {
			throw new Error('Invalid OTP');
		}

		const res = await transport.sendMail({
			to,
			from,
			subject,
			html,
			text,
		});

		await supabase.from('email_otps').delete().eq('email', `${from}`);

		return res;
	} catch (error: any) {
		throw new Error('Error sending email: ' + error.message);
	}
}
