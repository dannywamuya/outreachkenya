import React from 'react';
import { SearchResult } from '../lib/types';
import { Button } from './ui/button';
import { Mail } from 'lucide-react';

type SearchResultItemProps = {
	result: SearchResult;
	addToForm: () => void;
};

const SearchResultItem: React.FC<SearchResultItemProps> = ({
	result,
	addToForm,
}) => {
	return (
		<div className='gap-6 flex items-center hover:bg-accent px-4 py-2 justify-between w-full max-w-[60vw] md:max-w-[35vw]'>
			<div className='flex-1 min-w-0'>
				<p className='truncate text-md font-medium'>
					{result?.first_name} {result?.last_name}
					{result.position ? (
						<span className='text-sm font-semibold text-muted-foreground'>
							{' '}
							({result?.position})
						</span>
					) : null}
				</p>
				<p className='text-sm truncate space-x-1'>
					{result.organisation ? (
						<span className='font-medium text-primary'>
							{result?.organisation}
						</span>
					) : null}
				</p>
				<p className='text-sm text-gray-600 truncate'>
					{result.email}{' '}
					{result.count > 0 ? (
						<strong>
							{result.count.toLocaleString('en-US')}
							{result.heat ? '🔥' : null}
						</strong>
					) : null}
				</p>
			</div>
			<div>
				<Button size={'icon'} variant={'outline'} onClick={addToForm}>
					<Mail className='h-4 w-4' />
				</Button>
			</div>
		</div>
	);
};

export default SearchResultItem;
