import { supabase } from '../db';

export default async function searchEmails(query: string) {
	const { data, error } = await supabase
		.from('search')
		.select()
		.or(
			`email.ilike.%${query}%,first_name.ilike.%${query}%,organisation.ilike.%${query}%,last_name.ilike.%${query}%`
		)
		.limit(25);

	if (error) {
		console.error(error);
		return [];
	}

	return data ? data : [];
}
