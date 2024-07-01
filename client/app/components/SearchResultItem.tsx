import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { SearchResult } from '../lib/types';

type SearchResultItemProps = {
	result: SearchResult;
};

const SearchResultItem: React.FC<SearchResultItemProps> = ({ result }) => {
	return (
		<div className='flex items-center space-x-2 px-4 py-2'>
			<Avatar>
				<AvatarImage
					src={result.image}
					alt={`${result.firstName} ${result.lastName}`}
				/>
				<AvatarFallback>{`${result.firstName[0]}${result.lastName[0]}`}</AvatarFallback>
			</Avatar>
			<div>
				<h3 className='text-lg font-semibold'>
					{result.firstName} {result.lastName}
				</h3>
				<p className='text-sm'>
					{result.position} at {result.organisation}
				</p>
				<p className='text-sm text-gray-600'>{result.email}</p>
			</div>
		</div>
	);
};

export default SearchResultItem;
