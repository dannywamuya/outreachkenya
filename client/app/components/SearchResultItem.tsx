import React from 'react';
import { SearchResult } from '../lib/types';
import { Button } from './ui/button';
import { Mail } from 'lucide-react';

type SearchResultItemProps = {
	result: SearchResult;
};

const SearchResultItem: React.FC<SearchResultItemProps> = ({ result }) => {
	return (
		<div className='gap-6 flex items-center hover:bg-accent px-4 py-2 justify-between w-full max-w-[60vw] md:max-w-[35vw]'>
			<div className='flex-1 min-w-0'>
				<h4 className='text-md font-semibold truncate'>
					{result?.firstName} {result?.lastName}
				</h4>
				<p className='text-sm truncate space-x-1'>
					{result.position ? <span>{result?.position}</span> : null}
					{result.organisation ? (
						<span className='font-medium'>{result?.organisation}</span>
					) : null}
				</p>
				<p className='text-sm text-gray-600 truncate'>{result.email}</p>
			</div>
			<div>
				<Button size={'icon'} variant={'outline'}>
					<Mail className='h-4 w-4' />
				</Button>
			</div>
		</div>
	);
};

export default SearchResultItem;
