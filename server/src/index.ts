import './env';
import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { createOTP } from './services/otp';
import { rateLimit } from 'elysia-rate-limit';
import { updateEmailCounts, searchEmails } from './services/search';
import { sendEmails } from './services/email';
import { Value } from '@sinclair/typebox/value';
import env from './env';

const emailSchema = t.Object({
	to: t.Array(t.String()),
	from: t.String(),
	subject: t.String(),
	html: t.String(),
	text: t.String(),
	otp: t.String(),
	agreedToTerms: t.Boolean(),
	files: t.Array(
		t.File({
			type: ['audio', 'video', 'image', 'application/pdf', 'text'],
		})
	),
});

const app = new Elysia()
	.use(cors())
	.get('/', () => 'Hello Elysia')
	.group('', (app) =>
		app
			.use(
				rateLimit({
					duration: 60000,
					max: 15,
					errorResponse: 'Too Many Requests. Try again in 1 min',
				})
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
	.group('', (app) =>
		app
			.use(
				rateLimit({
					duration: 60000,
					max: 5,
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
					const input = body as object as any;
					const transformedInput = {
						...input,
						to: Object.keys(input)
							.filter((key) => key.startsWith('to['))
							.map((key) => input[key]),
						files: Object.keys(input)
							.filter((key) => key.startsWith('files['))
							.map((key) => input[key]),
						agreedToTerms: input.agreedToTerms === 'true',
					};

					try {
						const parsed = Value.Check(emailSchema, transformedInput);

						if (parsed) {
							const data = await sendEmails(transformedInput);
							return {
								success: true,
								data,
								message: 'Email was sent successfully',
							};
						} else {
							const errors = Array.from(
								Value.Errors(emailSchema, transformedInput)
							);
							set.status = 400;

							return {
								success: false,
								message: 'Failed to send email',
								errors,
							};
						}
					} catch (error: any) {
						set.status = 400;
						return { success: false, message: error.message };
					}
				},
				{
					body: t.Any(),
					async afterHandle(context) {
						const { success, data } = context.response as {
							success: boolean;
							data: Awaited<ReturnType<typeof sendEmails>>;
						};

						if (success) {
							await updateEmailCounts(
								data.accepted.map((email) => email as string)
							);
						}
					},
				}
			)
	)
	.listen(env.PORT);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port} (${env.NODE_ENV})`
);
