import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchResultItem from './SearchResultItem';
import { SearchResult } from '../lib/types';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface SearchResultsProps {
	query: string;
	addToForm: (email: string) => void;
	value: string[];
}

const SearchResults: React.FC<SearchResultsProps> = ({
	query,
	addToForm,
	value,
}: SearchResultsProps) => {
	const [results, setResults] = useState<SearchResult[]>([]);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			if (query.length > 2) {
				setLoading(true);
				try {
					const response = await axios.post('http://localhost:3000/search', {
						query,
					});
					setResults(
						(response.data.data as SearchResult[]).filter(
							(v) => !new Set(value).has(v.email)
						)
					);
					setOpen(true);
				} catch (error) {
					console.error('Error fetching search results:', error);
				} finally {
					setLoading(false);
				}
			} else {
				setResults([]);
			}
		};

		fetchData();
	}, [query, value]);

	const Searching = () => (
		<button className='text-sm p-0 m-0 text-primary font-medium'>
			Searching...
		</button>
	);

	const ShowResults = () => (
		<button
			className='text-sm p-0 m-0 text-primary hover:underline underline-offset-4 font-medium'
			onClick={() => setOpen(true)}>
			Search Results ({results.length})
		</button>
	);

	return (
		<>
			{loading ? <Searching /> : null}
			{!open && results.length > 0 && !loading ? <ShowResults /> : null}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger />
				<PopoverContent
					side='bottom'
					className='absolute w-auto max-h-[50vh] overflow-auto p-0'>
					<div className='overflow-y-auto'>
						{results.map((result, index) => (
							<SearchResultItem
								key={index}
								result={result}
								addToForm={() => {
									addToForm(result.email);
								}}
							/>
						))}
					</div>
				</PopoverContent>
			</Popover>
		</>
	);
};

export default SearchResults;
