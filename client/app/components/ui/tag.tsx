import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, XIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from './badge';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { InputProps } from './input';
import SearchInput from './search-input';
import SearchResults from '../SearchResults';
import { toast } from './use-toast';

type InputTagsProps = Omit<InputProps, 'value' | 'onChange'> & {
	value: string[];
	onChange: (tags: string[]) => void;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
	({ className, value, onChange, ...props }, ref) => {
		const [pendingDataPoint, setPendingDataPoint] = useState('');
		const [popoverWidth, setPopoverWidth] = useState<number>(0);
		const [isPopoverOpen, setIsPopoverOpen] = useState(false);
		const triggerContainerRef = useRef<HTMLDivElement | null>(null);
		const triggerRef = useRef<HTMLButtonElement | null>(null);
		const popoverContentRef = useRef<HTMLDivElement | null>(null);
		const [query, setQuery] = useState('');

		useEffect(() => {
			const handler = setTimeout(() => {
				setQuery(pendingDataPoint);
			}, 500);

			return () => {
				clearTimeout(handler);
			};
		}, [pendingDataPoint]);

		useEffect(() => {
			const handleResize = () => {
				if (triggerContainerRef.current && triggerRef.current) {
					setPopoverWidth(triggerContainerRef.current.offsetWidth);
				}
			};

			handleResize(); // Call on mount and layout changes

			window.addEventListener('resize', handleResize); // Adjust on window resize
			return () => window.removeEventListener('resize', handleResize);
		}, [triggerContainerRef, triggerRef]);

		// Close the popover when clicking outside of it
		useEffect(() => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const handleOutsideClick = (event: any) => {
				if (
					isPopoverOpen &&
					triggerContainerRef.current &&
					!triggerContainerRef.current.contains(event.target) &&
					popoverContentRef.current &&
					!popoverContentRef.current.contains(event.target)
				) {
					setIsPopoverOpen(false);
				}
			};

			document.addEventListener('mousedown', handleOutsideClick);

			return () => {
				document.removeEventListener('mousedown', handleOutsideClick);
			};
		}, [isPopoverOpen]);

		const handleOpenChange = useCallback((open: boolean) => {
			if (open && triggerContainerRef.current) {
				setPopoverWidth(triggerContainerRef.current.offsetWidth);
			}
			setIsPopoverOpen(open);
		}, []);

		useEffect(() => {
			if (pendingDataPoint.includes(',')) {
				const newDataPoints = new Set([
					...value,
					...pendingDataPoint.split(',').map((chunk) => chunk.trim()),
				]);
				onChange(Array.from(newDataPoints));
				setPendingDataPoint('');
			}
		}, [pendingDataPoint, onChange, value]);

		const addPendingDataPoint = () => {
			if (pendingDataPoint) {
				const newDataPoints = new Set([...value, pendingDataPoint]);
				onChange(Array.from(newDataPoints));
				toast({ title: `Added ${pendingDataPoint}` });
				setPendingDataPoint('');
			}
		};

		function addToForm(email: string) {
			onChange(Array.from(new Set([...value, email])));
		}

		useEffect(() => {
			if (value.length === 0) setIsPopoverOpen(false);
		}, [value]);

		return (
			<div>
				<div
					className={cn('relative flex items-center', className)}
					ref={triggerContainerRef}>
					<Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
						<div
							className={cn(
								'flex w-full flex-wrap gap-2 text-sm  disabled:cursor-not-allowed disabled:opacity-50',
								className
							)}>
							<SearchInput
								className='flex-1 outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400'
								value={pendingDataPoint}
								onChange={(e) => setPendingDataPoint(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ',') {
										e.preventDefault();
										addPendingDataPoint();
									} else if (
										e.key === 'Backspace' &&
										pendingDataPoint.length === 0 &&
										value.length > 0
									) {
										e.preventDefault();
										onChange(value.slice(0, -1));
									}
								}}
								{...props}
								ref={ref}
							/>
							<PopoverTrigger asChild>
								<Button
									disabled={!value.length}
									ref={triggerRef}
									variant='shine'
									size='icon'
									className='rounded-full'
									onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
									{value.length}
								</Button>
							</PopoverTrigger>
						</div>
						<PopoverContent
							ref={popoverContentRef}
							className='md:mr-0 mr-12 space-y-2 space-x-2 max-h-[400px] overflow-y-auto'
							style={{
								width: `${popoverWidth}px`,
							}}>
							<div className='w-full px-4 py-2 items-center flex justify-between'>
								<p className='text-sm'>{value.length} / 10</p>
								<Button
									iconPlacement='right'
									variant='expandIcon'
									Icon={() => <X className='h-4 w-4 ml-1' />}
									onClick={() => onChange([])}
									className='h-6 w-fit text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'>
									Clear
								</Button>
							</div>
							{value.map((item) => (
								<Badge key={item} variant='secondary'>
									{item}
									<Button
										variant='ghost'
										size='icon'
										className='ml-2 h-4 w-4 hover:scale-110'
										onClick={() => {
											onChange(value.filter((i) => i !== item));
										}}>
										<XIcon className='w-4 h-4' />
									</Button>
								</Badge>
							))}
						</PopoverContent>
					</Popover>
				</div>
				<SearchResults query={query} addToForm={addToForm} value={value} />
			</div>
		);
	}
);

InputTags.displayName = 'InputTags';

export { InputTags };
