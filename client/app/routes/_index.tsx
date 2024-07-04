import type { MetaFunction } from '@remix-run/node';
import EmailForm from '../components/EmailForm';

export const meta: MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' },
	];
};

export default function Index() {
	return (
		<main className='font-sans p-8 h-full md:h-screen w-full flex flex-col-reverse md:flex-row gap-8'>
			<div className='w-full lg:w-1/2 border rounded-md h-full flex flex-col items-center justify-center'>
				<EmailForm />
			</div>
			<div className='w-full md:w-1/2 rounded-md'></div>
		</main>
	);
}
