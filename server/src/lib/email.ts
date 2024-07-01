import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import env from '../env';
import { supabase } from '../db';

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
	const oneWeekAgo = new Date();
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

	const { data, error } = await supabase
		.from('sent_emails')
		.select('to')
		.eq('from', from as string)
		.gte('sent_at', oneWeekAgo.toISOString());

	if (error) {
		console.error('Error fetching sent emails:', error);
		return;
	}

	const sentEmailAddresses = new Set(data.map(({ to }) => to));

	const newRecipients = (to as string[]).filter(
		(email) => !sentEmailAddresses.has(email)
	);

	const queuedRecipients = (to as string[]).filter((email) =>
		sentEmailAddresses.has(email)
	);

	if (newRecipients.length > 0) {
		await transport.sendMail({
			to: newRecipients,
			from,
			subject,
			html,
			text,
		});

		const sentEmails = newRecipients.map((email) => ({
			to: email,
			from: from as string,
			subject: subject as string,
			html: html as string,
			text: text as string,
		}));

		const { error: insertError } = await supabase
			.from('sent_emails')
			.insert(sentEmails);

		if (insertError) {
			console.error('Error inserting sent emails:', insertError);
		} else {
			console.log('Email sent and tracked for new recipients');
		}
	}

	if (queuedRecipients.length > 0) {
		const queuedEmails = queuedRecipients.map((email) => ({
			to: email,
			from: from as string,
			subject: subject as string,
			html: html as string,
			text: text as string,
		}));

		const { error: insertError } = await supabase
			.from('queued_emails')
			.insert(queuedEmails);

		if (insertError) {
			console.error('Error inserting queued emails:', insertError);
		} else {
			console.log('Email added to queue');
		}
	}
}
