import { z } from 'zod';

export const formSchema = z.object({
	to: z
		.array(z.string().email())
		.min(1, 'Add at least one email address')
		.max(10, 'The maximum recepients at a time can not exceed 10'),
	from: z.string().email(),
	subject: z.string().min(1, 'Subject is too short').max(256),
	text: z.string().min(1, 'Email is too short'),
	html: z.string().min(1, 'Email is too short'),
	otp: z.string().optional(),
	agreedToTerms: z.boolean().default(true),
});

export type EmailFormInput = z.TypeOf<typeof formSchema>;
