import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { InputTags } from './ui/tag';
import { useState } from 'react';
import Editor from './Editor';
import axios from 'axios';
import { toast } from './ui/use-toast';

const formSchema = z.object({
	to: z.array(z.string().email()).min(1, 'Add at least one email address'),
	from: z.string().email(),
	subject: z.string().min(1, 'Subject is too short').max(256),
	text: z.string().min(1, 'Email is too short'),
	html: z.string().min(1, 'Email is too short'),
});

type EmailFormInput = z.TypeOf<typeof formSchema>;

export default function EmailForm() {
	const form = useForm<EmailFormInput>({
		resolver: zodResolver(formSchema),
		mode: 'onChange',
		defaultValues: { from: '', html: '', text: '', subject: '', to: [] },
	});
	const [loading, setLoading] = useState(false);

	async function onSubmit(data: EmailFormInput) {
		setLoading(true);
		try {
			const res = await axios.post('http://localhost:3000/send', data);
			console.log(res.data);
			toast({ title: 'Success' });
			form.reset();
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='w-full h-full space-y-4 rounded-lg p-8 shadow-lg'>
				<FormField
					control={form.control}
					name='to'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<InputTags
									placeholder='To'
									{...field}
									value={form.getValues('to')}
									onChange={(c) => {
										const emails = c.map((v) => z.string().email().parse(v));
										form.setValue('to', Array.from(new Set(emails)));
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='from'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder='From' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='subject'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder='Subject' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='html'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Editor
									{...field}
									onChange={({ html, text }) => {
										form.setValue('html', html);
										form.setValue('text', text);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					disabled={loading || !form.formState.isValid}
					className='w-full'
					type='submit'>
					{loading ? 'Loading...' : 'Submit'}
				</Button>
			</form>
		</Form>
	);
}
