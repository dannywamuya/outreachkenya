import './env';
import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { sendEmail } from './lib/email';
import { rateLimit } from 'elysia-rate-limit';

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
				'/send',
				async ({ set, body: { to, from, subject, html, text } }) => {
					try {
						await sendEmail({ to, from, subject, html, text });
						return { success: true };
					} catch (error: any) {
						set.status = 400;
						return { success: false, error: error.message };
					}
				},
				{
					body: t.Object({
						to: t.Array(t.String()),
						from: t.String(),
						subject: t.String(),
						html: t.String(),
						text: t.String(),
					}),
				}
			)
	)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
