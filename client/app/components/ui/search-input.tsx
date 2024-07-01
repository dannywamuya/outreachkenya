import { cn } from '../../lib/utils';
import { Search } from 'lucide-react';
import * as React from 'react';

export interface SearchInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	icon?: React.ReactNode;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
	({ className, ...props }, ref) => {
		return (
			<div
				className={cn(
					'flex h-10 items-center rounded-md border border-input pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2',
					className
				)}>
				<Search className='h-[16px] w-[16px]' />
				<input
					{...props}
					type='search'
					ref={ref}
					className='w-full p-2 bg-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-md'
				/>
			</div>
		);
	}
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
