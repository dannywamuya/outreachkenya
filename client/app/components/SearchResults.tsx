import { useState } from 'react';
import SearchResultItem from './SearchResultItem';
import { SearchResult } from '../lib/types';

const mockResults: SearchResult[] = [
	{
		firstName: 'John',
		lastName: 'Doe',
		email: 'john.doe@example.com',
		organisation: 'Human Rights Org',
		position: 'Director',
	},
	{
		firstName: 'Jane',
		lastName: 'Smith',
		email: 'jane.smith@example.com',
		organisation: 'Justice League',
	},
	{
		firstName: 'John',
		lastName: 'Doe',
		email: 'john.doe@example.com',
		position: 'Director',
	},
	{
		firstName: 'Jane',
		lastName: 'Smith',
		email: 'jane.smith@example.com',
	},
	{
		email: 'john.doe@example.com',
		organisation: 'Human Rights',
		position: 'Director',
	},
	{
		email: 'jane.smith@example.com',
	},
];

export default function SearchResults() {
	const [results] = useState<SearchResult[]>(mockResults);
	return (
		<div className='overflow-y-auto '>
			{results.map((result, index) => (
				<SearchResultItem key={index} result={result} />
			))}
		</div>
	);
}
