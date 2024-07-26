import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { InputTags } from './ui/tag';
import Editor from './Editor';
import { toast } from './ui/use-toast';
import { Send } from 'lucide-react';
import OTPForm from './OTPForm';
import { EmailFormInput, formSchema } from '../lib/schema';
import Spinner from './Spinner';
import { request } from '../lib/axios';

const defaultValues: EmailFormInput = {
	from: '',
	html: '',
	otp: '',
	subject: '',
	text: '',
	to: [],
	attachments: [],
	agreedToTerms: true,
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
	const [countdown, setCountdown] = useState(0);

	useEffect(() => {
		console.log(import.meta.env.VITE_BASE_URL);
		const savedFormState = localStorage.getItem('emailForm');
		if (savedFormState) {
			form.reset(JSON.parse(savedFormState));
		}

		form.watch((values) =>
			localStorage.setItem('emailForm', JSON.stringify(values))
		);
	}, [form]);

	useEffect(() => {
		if (countdown > 0) {
			const timer = setInterval(() => {
				setCountdown((prev) => {
					const newCountdown = prev - 1;
					return newCountdown;
				});
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [countdown]);

	async function sendOtp(email: string) {
		setLoading(true);
		try {
			const res = await request.post('create_otp', {
				email,
			});
			toast({ title: res.data.message });
			setOtpSent(true);
			setCountdown(60);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast({
				title: 'Error sending OTP. Please try again',
				description: error.response.data.message ?? error.message,
			});
		}
		setLoading(false);
	}

	async function resendOtp() {
		const email = form.getValues('from');
		if (email) {
			await sendOtp(email);
		}
	}

	async function verifyOtpAndSendEmail(data: EmailFormInput) {
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append('html', data.html);
			formData.append('text', data.text);
			formData.append('from', data.from);
			formData.append('subject', data.subject);
			formData.append('agreedToTerms', data.agreedToTerms.toString());

			data.to.forEach((recipient, index) => {
				formData.append(`to[${index}]`, recipient);
			});

			data.attachments.forEach((file, index) => {
				formData.append(`files[${index}]`, file);
			});

			if (data.otp) {
				formData.append('otp', data.otp);
			}

			const res = await request.postForm('send', formData);

			toast({ title: res.data.message });
			setKey(key + 1);
			setOtpSent(false);
			setCountdown(0);
			form.reset(defaultValues);
			localStorage.setItem('emailForm', JSON.stringify(defaultValues));
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			if (error.response.status === 429) {
				toast({
					title: 'Error sending email. Please try again',
					description: error.response.data,
				});
			}

			toast({
				title: 'Error sending email. Please try again',
				description: error.response.data.message ?? error.message,
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
					className='w-full h-full space-y-4 rounded-lg p-4 md:p-8 shadow-lg fade-in'>
					<FormField
						control={form.control}
						name='to'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<InputTags
										autoComplete='off'
										placeholder='Search Email Addresses'
										className='!bg-background'
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
										form={form}
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
					{otpSent || countdown > 0 ? (
						<OTPForm
							form={form}
							verifyOtpAndSendEmail={verifyOtpAndSendEmail}
							resendOtp={resendOtp}
							loading={loading}
							countdown={countdown}
						/>
					) : (
						<Button
							variant={'expandIcon'}
							iconPlacement='right'
							Icon={() => <Send className='h-4 w-4' />}
							disabled={loading}
							className='mt-auto w-full bottom-0 shine'
							type='submit'>
							{loading ? <Spinner /> : 'Proceed'}
						</Button>
					)}
				</form>
			</Form>
		</>
	);
}
