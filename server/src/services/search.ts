import { supabase } from '../db';

export async function searchEmails(query: string) {
	const { data, error } = await supabase
		.from('search')
		.select('*')
		.or(
			`email.ilike.%${query}%,first_name.ilike.%${query}%,organisation.ilike.%${query}%,last_name.ilike.%${query}%`
		)
		.limit(25)
		.order('count', { ascending: false });

	if (error) {
		console.error(error);
		return [];
	}

	const totalEmails = data.reduce((a, b) => a + b.count, 0);

	const resultsWithRating = data.map((item) => {
		const percentage = totalEmails > 0 ? (item.count / totalEmails) * 100 : 0;
		return {
			...item,
			heat: percentage > 25,
		};
	});

	return resultsWithRating;
}

export async function updateEmailCounts(emails: string[]) {
	const updates = emails.map(async (email) => {
		const { data, error } = await supabase
			.from('search')
			.select('count')
			.eq('email', email)
			.single();

		if (error && error.code !== 'PGRST116') {
			console.error(`Error fetching count for ${email}:`, error);
			return;
		}

		if (data) {
			const newCount = data.count + 1;

			const { error: updateError } = await supabase
				.from('search')
				.update({ email, count: newCount })
				.eq('email', email);

			if (updateError) {
				console.error(`Error updating count for ${email}:`, updateError);
			}
		}
	});

	await Promise.all(updates);
}
