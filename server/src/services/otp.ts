import env from '../env';
import { supabase } from '../db';
import otpGenerator from 'otp-generator';
import { add } from 'date-fns';
import OTP from '../../emails/OTP';
import { resend } from '../lib/resend';

export function generateOtp() {
	return otpGenerator.generate(6, {
		upperCaseAlphabets: false,
		digits: true,
		specialChars: false,
		lowerCaseAlphabets: false,
	});
}

function getText(otp: string) {
	return `Your OTP Code

Your OTP code is:

This code expires in 10 minutes.

${otp}

If you didn't try to send an email, you can safely ignore this.
`;
}

export async function createOTP(email: string) {
	try {
		await supabase.from('email_otps').delete().eq('email', email);

		const otp = generateOtp();
		const expiresAt = add(new Date(), { minutes: 10 });

		const { error } = await supabase
			.from('email_otps')
			.insert({ email, otp, expires_at: expiresAt.toISOString() });

		if (error) {
			throw new Error('Error storing OTP: ' + error.message);
		}

		const { error: emailError } = await resend.emails.send({
			from: env.EMAIL_FROM,
			to: email,
			subject: 'Your OTP',
			react: OTP({ otp }),
			text: getText(otp),
		});

		if (emailError) {
			throw new Error(`Failed to send OTP: ${emailError.message}`);
		}

		return { message: 'OTP sent. Please verify to proceed.' };
	} catch (error: any) {
		throw new Error('Error generating OTP: ' + error.message);
	}
}

export async function deleteOtp(email: string) {
	await supabase.from('email_otps').delete().eq('email', email);
}
