import {
	Drawer,
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
import { Link } from '@remix-run/react';
import { Checkbox } from './ui/checkbox';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';
import { Button } from './ui/button';
import { EmailFormInput } from '../lib/schema';
import { UseFormReturn } from 'react-hook-form';
import Spinner from './Spinner';

interface OTPFormProps {
	resendOtp: () => Promise<void>;
	loading: boolean;
	form: UseFormReturn<EmailFormInput>;
	countdown: number;
	verifyOtpAndSendEmail: (args: EmailFormInput) => Promise<void>;
}

export default function OTPForm({
	resendOtp,
	loading,
	form,
	countdown,
	verifyOtpAndSendEmail,
}: OTPFormProps) {
	return (
		<>
			<Dialog>
				<DialogTrigger asChild className='hidden md:block'>
					<Button
						variant={'shine'}
						disabled={loading}
						className='mt-auto w-full bottom-0'
						type='button'>
						Verify Email
					</Button>
				</DialogTrigger>
				<DialogContent className='hidden md:block space-y-6'>
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
									<InputOTP className='w-ful' {...field} maxLength={6}>
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
					<FormField
						control={form.control}
						name='agreedToTerms'
						render={({ field }) => (
							<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className='space-y-1 leading-none'>
									<FormLabel>Accept terms and conditions</FormLabel>
									<FormDescription>
										You agree to our{' '}
										<Link
											target='_blank'
											to={'https://github.com/dannywamuya/outreachkenya'}
											rel='noreferrer'
											className='text-blue-500 underline underline-offset-2'>
											Terms of Service.
										</Link>
									</FormDescription>
								</div>
							</FormItem>
						)}
					/>
					<div className='w-full flex justify-between'>
						<Button
							variant={'outline'}
							type='button'
							onClick={resendOtp}
							disabled={loading || countdown > 0}>
							{countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
						</Button>
						<Button
							variant={'shine'}
							type='button'
							onClick={() => verifyOtpAndSendEmail(form.getValues())}
							disabled={loading || !form.getValues('otp')}>
							{loading ? <Spinner /> : 'Verify & Send'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<Drawer>
				<DrawerTrigger asChild className='block md:hidden'>
					<Button
						variant={'shine'}
						disabled={loading}
						className='mt-auto w-full bottom-0'
						type='button'>
						Verify Email
					</Button>
				</DrawerTrigger>
				<DrawerContent className='md:hidden block'>
					<DrawerHeader>
						<DrawerTitle>Enter OTP</DrawerTitle>
						<DrawerDescription>
							Please enter the OTP sent to your email.
						</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter className='space-y-6'>
						<FormField
							control={form.control}
							name='otp'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<InputOTP className='w-full' {...field} maxLength={6}>
											<InputOTPGroup>
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
						<FormField
							control={form.control}
							name='agreedToTerms'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className='space-y-1 leading-none'>
										<FormLabel>Accept terms and conditions</FormLabel>
										<FormDescription>
											You agree to our{' '}
											<Link
												target='_blank'
												to={'https://github.com/dannywamuya/outreachkenya'}
												rel='noreferrer'
												className='text-blue-500 underline underline-offset-2'>
												Terms of Service.
											</Link>
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
						<div className='w-full flex justify-between'>
							<Button
								variant={'outline'}
								type='button'
								onClick={resendOtp}
								disabled={loading || countdown > 0}>
								{countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
							</Button>
							<Button
								variant={'shine'}
								type='button'
								onClick={() => verifyOtpAndSendEmail(form.getValues())}
								disabled={loading || !form.getValues('otp')}>
								{loading ? <Spinner /> : 'Verify & Send'}
							</Button>
						</div>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
}
