import type { MetaFunction } from '@remix-run/node';
import EmailForm from '../components/EmailForm';

export const meta: MetaFunction = () => {
	return [
		{ title: 'OutReachKenya' },
		{
			name: 'description',
			content:
				'ReachOutKenya aims to assist Kenyans affected by the violence that occurred during the peaceful protests in Kenya air their grievances to National and International Organisations',
		},
	];
};

export default function Index() {
	return (
		<main className='font-sans p-4 md:p-8 h-full md:h-screen w-full flex flex-col-reverse md:flex-row gap-8'>
			<div className='w-full md:w-1/2 border rounded-md h-full mt-4 md:mt-0 flex flex-col items-center justify-center'>
				<EmailForm />
			</div>
			<div className='w-full md:w-1/2 rounded-md justify-start md:justify-end flex mt-12'>
				<div className='w-full h-full flex flex-col md:w-3/4 md:text-end'>
					<p>
						Search through public email addresses and reach out for help and to
						report injustice
					</p>
					<p className='italic mt-8 md:mt-24'>
						{'"'}All sovereign power belongs to{' '}
						<strong className='underline text-lg'>THE PEOPLE</strong> of Kenya
						and <strong className='underline text-lg'>SHALL</strong> be
						exercised only in accordance with this Constitution{'"'}
					</p>
				</div>
			</div>
		</main>
	);
}
