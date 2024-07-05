import { supabase } from '../db';

export default async function searchEmails(query: string) {
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
