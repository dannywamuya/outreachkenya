import './env';
import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { createOTP } from './services/otp';
import { rateLimit } from 'elysia-rate-limit';
import searchEmails from './services/search';
import { sendEmail } from './services/email';

const app = new Elysia()
	.use(cors())
	.get('/', () => 'Hello Elysia')
	.group('', (app) =>
		app
			.use(
				rateLimit({
					duration: 60000,
					max: 3,
					errorResponse: 'Too Many Requests. Try again in 1 min',
				})
			)
			.post(
				'/create_otp',
				async ({ set, body: { email } }) => {
					try {
						const { message } = await createOTP(email);
						return { success: true, message };
					} catch (error: any) {
						set.status = 400;
						return { success: false, message: error.message };
					}
				},
				{
					body: t.Object({
						email: t.String(),
					}),
				}
			)
			.post(
				'/send',
				async ({ set, body }) => {
					try {
						const data = await sendEmail(body);
						return {
							success: true,
							data,
							message: 'Email was sent successfully',
						};
					} catch (error: any) {
						set.status = 400;
						return { success: false, message: error.message };
					}
				},
				{
					body: t.Object({
						to: t.Array(t.String()),
						from: t.String(),
						subject: t.String(),
						html: t.String(),
						text: t.String(),
						otp: t.String(),
						agreedToTerms: t.Boolean(),
					}),
				}
			)
			.post(
				'/search',
				async ({ body: { query }, set }) => {
					try {
						const data = await searchEmails(query);
						return {
							success: true,
							data,
						};
					} catch (error: any) {
						set.status = 400;
						return { success: false, message: error.message };
					}
				},
				{ body: t.Object({ query: t.String() }) }
			)
	)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
