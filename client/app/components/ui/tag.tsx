import React, { useCallback, useEffect, useRef, useState } from 'react';
import { XIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from './badge';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Input, InputProps } from './input';

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
				setPendingDataPoint('');
			}
		};

		useEffect(() => {
			if (value.length === 0) setIsPopoverOpen(false);
		}, [value]);

		return (
			<div
				className={cn('relative flex items-center', className)}
				ref={triggerContainerRef}>
				<Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
					<div
						className={cn(
							'flex w-full flex-wrap gap-2 text-sm  disabled:cursor-not-allowed disabled:opacity-50',
							className
						)}>
						<Input
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
								variant='outline'
								size='icon'
								className='bg-background rounded-2xl flex items-center justify-center'
								onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
								{value.length}
							</Button>
						</PopoverTrigger>
					</div>
					<PopoverContent
						ref={popoverContentRef}
						className='w-full space-y-3 space-x-2 max-h-[400px] overflow-y-auto'
						style={{
							width: `${popoverWidth}px`,
						}}>
						{value.map((item) => (
							<Badge key={item} variant='secondary'>
								{item}
								<Button
									variant='ghost'
									size='icon'
									className='ml-2 h-3 w-3'
									onClick={() => {
										onChange(value.filter((i) => i !== item));
									}}>
									<XIcon className='w-3' />
								</Button>
							</Badge>
						))}
					</PopoverContent>
				</Popover>
			</div>
		);
	}
);

InputTags.displayName = 'InputTags';

export { InputTags };
