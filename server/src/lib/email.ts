import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import env from '../env';

const transport = nodemailer.createTransport({
	host: env.EMAIL_SERVER_HOST,
	port: env.EMAIL_SERVER_PORT,
	auth: {
		user: env.EMAIL_SERVER_USER,
		pass: env.EMAIL_SERVER_PASSWORD,
	},
});

export async function sendEmail({
	to,
	from,
	subject,
	html,
	text,
}: Mail.Options) {
	return await transport.sendMail({
		to,
		from,
		subject,
		html,
		text,
	});
}
