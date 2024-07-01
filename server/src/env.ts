import * as z from 'zod';

const envSchema = z.object({
	EMAIL_SERVER_HOST: z.string(),
	EMAIL_SERVER_PORT: z
		.string()
		.refine((v) => !isNaN(parseInt(v)))
		.transform((v) => parseInt(v)),
	EMAIL_SERVER_USER: z.string(),
	EMAIL_SERVER_PASSWORD: z.string(),
	DATABASE_URL: z.string(),
	SUPABASE_URL: z.string(),
	SUPABASE_KEY: z.string(),
	NODE_ENV: z.string(),
});

const results = envSchema.safeParse(Bun.env);

if (!results.success) {
	throw new Error(
		`Missing ${results.error.errors
			.map(({ path }) => `${path}`)
			.join(', ')} env variables.`
	);
} else {
	console.log('🔥 Successfully loaded env');
}

export default results.data;
