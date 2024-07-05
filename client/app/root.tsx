import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react';
import './tailwind.css';
import { Toaster } from './components/ui/toaster';
import { ModeToggle } from './components/ModeToggle';
import { useTheme } from './hooks/useTheme';

export function Layout({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();
	return (
		<html lang='en' className={theme === 'dark' ? 'dark' : ''}>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<Meta />
				<Links />
			</head>
			<body>
				<div className='absolute w-full right-0 flex justify-between md:justify-end py-4 px-8 items-center gap-4'>
					<h1 className='font-bold text-2xl md:text-3xl'>
						<span className='text-primary'>Reach</span>
						<span className='text-black dark:text-white'>Out</span>
						<span className='text-destructive'>Kenya</span>
					</h1>
					<ModeToggle />
				</div>
				{children}
				<ScrollRestoration />
				<Scripts />
				<Toaster />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
