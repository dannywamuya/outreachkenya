import type { MetaFunction } from '@remix-run/node';
import EmailForm from '../components/EmailForm';

export const meta: MetaFunction = () => {
	return [
		{ title: 'OutReachKenya' },
		{
			name: 'description',
			content:
				'ReachOut Kenya aims to assist Kenyans affected by the violence that occurred during the #RejectFinanceBill2024 and #RutoMustGo protests air their grievances to National and International Organisations',
		},
	];
};

export default function Index() {
	return (
		<main className='font-sans p-8 h-full md:h-screen w-full flex flex-col-reverse md:flex-row gap-8'>
			<div className='w-full lg:w-1/2 border rounded-md h-full mt-4 md:mt-0 flex flex-col items-center justify-center'>
				<EmailForm />
			</div>
			<div className='w-full md:w-1/2 rounded-md justify-start md:justify-end flex mt-12'>
				<div className='w-full md:w-3/4 text-end'>
					<p>
						Search through public email addresses and reach out for help and to
						report injustice
					</p>
				</div>
			</div>
		</main>
	);
}
