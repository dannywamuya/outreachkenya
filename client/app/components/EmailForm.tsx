import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { InputTags } from './ui/tag';
import Editor from './Editor';
import axios from 'axios';
import { toast } from './ui/use-toast';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from './ui/drawer';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

const formSchema = z.object({
	to: z.array(z.string().email()).min(1, 'Add at least one email address'),
	from: z.string().email(),
	subject: z.string().min(1, 'Subject is too short').max(256),
	text: z.string().min(1, 'Email is too short'),
	html: z.string().min(1, 'Email is too short'),
	otp: z.string().optional(),
});

type EmailFormInput = z.TypeOf<typeof formSchema>;

const defaultValues = {
	from: '',
	html: '',
	otp: '',
	subject: '',
	text: '',
	to: [],
};

export default function EmailForm() {
	const form = useForm<EmailFormInput>({
		resolver: zodResolver(formSchema),
		mode: 'onChange',
		defaultValues,
	});

	const [loading, setLoading] = useState(false);
	const [otpSent, setOtpSent] = useState(false);
	const [key, setKey] = useState(0);

	async function sendOtp(email: string) {
		setLoading(true);
		try {
			const res = await axios.post('http://localhost:3000/create_otp', {
				email,
			});
			console.log(res.data);
			toast({ title: res.data.message });
			setOtpSent(true);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.log(error);
			toast({
				title:
					error.response.data.message ?? 'Error sending OTP. Please try again',
			});
		}
		setLoading(false);
	}

	async function verifyOtpAndSendEmail(data: EmailFormInput) {
		setLoading(true);
		try {
			const res = await axios.post('http://localhost:3000/send', data);
			console.log(res.data);
			toast({ title: res.data.message });
			form.reset(defaultValues);
			localStorage.setItem('emailForm', JSON.stringify(defaultValues));
			setKey(key + 1);
			setOtpSent(false);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast({
				title:
					error.response.data.message ??
					'Error sending email. Please try again',
			});
		}
		setLoading(false);
	}

	async function onSubmit(data: EmailFormInput) {
		if (!otpSent) {
			await sendOtp(data.from);
		} else {
			await verifyOtpAndSendEmail(data);
		}
	}

	return (
		<>
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
										key={key}
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
					{otpSent ? (
						<>
							<Dialog>
								<DialogTrigger asChild className='hidden md:block'>
									<Button
										disabled={loading}
										className='mt-auto w-full bottom-0'
										type='button'>
										{loading ? 'Loading...' : 'Verify Email'}
									</Button>
								</DialogTrigger>
								<DialogContent className='hidden md:block space-y-4'>
									<DialogHeader>
										<DialogTitle>Enter OTP</DialogTitle>
										<DialogDescription>
											Please enter the OTP sent to your email.
										</DialogDescription>
									</DialogHeader>
									<FormField
										control={form.control}
										name='otp'
										render={({ field }) => (
											<FormItem className='w-full'>
												<FormControl>
													<InputOTP className='w-full' {...field} maxLength={6}>
														<InputOTPGroup className='w-full'>
															<InputOTPSlot index={0} />
															<InputOTPSlot index={1} />
															<InputOTPSlot index={2} />
															<InputOTPSlot index={3} />
															<InputOTPSlot index={4} />
															<InputOTPSlot index={5} />
														</InputOTPGroup>
													</InputOTP>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										type='button'
										onClick={() => verifyOtpAndSendEmail(form.getValues())}
										disabled={loading || !form.getValues('otp')}>
										{loading ? 'Loading...' : 'Verify & Send'}
									</Button>
								</DialogContent>
							</Dialog>

							<Drawer>
								<DrawerTrigger asChild className='block md:hidden'>
									<Button
										disabled={loading}
										className='mt-auto w-full bottom-0'
										type='button'>
										{loading ? 'Loading...' : 'Verify Email'}
									</Button>
								</DrawerTrigger>
								<DrawerContent className='md:hidden block'>
									<DrawerHeader>
										<DrawerTitle>Enter OTP</DrawerTitle>
										<DrawerDescription>
											Please enter the OTP sent to your email.
										</DrawerDescription>
									</DrawerHeader>
									<DrawerFooter>
										<FormField
											control={form.control}
											name='otp'
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input placeholder='Enter OTP' {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button
											type='button'
											onClick={() => verifyOtpAndSendEmail(form.getValues())}
											disabled={loading || !form.getValues('otp')}>
											{loading ? 'Loading...' : 'Verify & Send'}
										</Button>
										<DrawerClose>
											<Button variant='outline' className='w-full'>
												Cancel
											</Button>
										</DrawerClose>
									</DrawerFooter>
								</DrawerContent>
							</Drawer>
						</>
					) : (
						<Button
							disabled={loading}
							className='mt-auto w-full bottom-0'
							type='submit'>
							{loading ? 'Loading...' : 'Send'}
						</Button>
					)}
				</form>
			</Form>
		</>
	);
}
