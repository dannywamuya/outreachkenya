import SearchResults from './SearchResults';
import SearchInput from './ui/search-input';

export default function SearchEmails() {
	return (
		<div className='w-full space-y-4 rounded-lg border p-8 shadow-lg flex flex-col h-full'>
			<SearchInput placeholder='Search Public Email Addresses' />
			<h2>Popular 🔥</h2>
			<SearchResults />
		</div>
	);
}
