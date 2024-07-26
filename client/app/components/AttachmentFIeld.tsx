import { useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from './ui/button';
import { Paperclip, X } from 'lucide-react';
import { FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { EmailFormInput } from '../lib/schema';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from './ui/drawer';

interface AttachmentFieldProps {
	form: UseFormReturn<EmailFormInput>;
}

const AttachmentField = ({ form }: AttachmentFieldProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [files, setFiles] = useState<File[]>([]);

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files ?? []);
		const newFiles = [...files, ...selectedFiles];
		form.setValue('attachments', newFiles);
		setFiles(newFiles);
	};

	const handleRemoveFile = (index: number) => {
		const newFiles = files.filter((_, i) => i !== index);
		form.setValue('attachments', newFiles);
		setFiles(newFiles);
	};

	return (
		<>
			<Button
				type='button'
				variant='secondary'
				onClick={handleButtonClick}
				size={'sm'}
				className='text-sm h-8 p-2 md:ml-auto'>
				<Paperclip className='h-4 w-4' />
			</Button>

			<FormField
				control={form.control}
				name='attachments'
				render={() => (
					<FormItem>
						<FormControl>
							<input
								ref={fileInputRef}
								placeholder='Attachments'
								type='file'
								multiple
								onChange={handleFileChange}
								style={{ display: 'none' }}
								accept='audio/*,video/*,image/*,application/pdf,text/*'
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className='hidden md:block'>
				<Dialog>
					<DialogTrigger asChild>
						<Button size={'sm'} className='h-8 p-2' variant={'secondary'}>
							({files.length})
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Attached Files ({files.length})</DialogTitle>
							<DialogDescription>
								{"Here are the files you've attached."}
							</DialogDescription>
						</DialogHeader>
						<ul>
							{files.map((file, index) => (
								<li
									key={index}
									className='flex mt-1 justify-between items-center'>
									{file.name}
									<Button
										className='rounded-full'
										variant='ghost'
										size='icon'
										onClick={() => handleRemoveFile(index)}>
										<X className='h-4 w-4' />
									</Button>
								</li>
							))}
						</ul>
					</DialogContent>
				</Dialog>
			</div>

			<div className='block md:hidden'>
				<Drawer>
					<DrawerTrigger asChild>
						<Button size={'sm'} variant={'secondary'} className='h-8 p-2'>
							({files.length})
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Attached Files ({files.length})</DrawerTitle>
							<DrawerDescription>
								{"Here are the files you've attached."}
							</DrawerDescription>
						</DrawerHeader>
						<ul>
							{files.map((file, index) => (
								<li key={index} className='flex justify-between items-center'>
									{file.name}
									<Button
										variant='outline'
										size='icon'
										onClick={() => handleRemoveFile(index)}>
										<X className='h-4 w-4' />
									</Button>
								</li>
							))}
						</ul>
					</DrawerContent>
				</Drawer>
			</div>
		</>
	);
};

export default AttachmentField;
