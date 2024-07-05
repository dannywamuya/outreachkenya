import { useEffect, useState } from 'react';

const THEME_KEY = 'theme';

export function useTheme() {
	const [theme, setTheme] = useState<'light' | 'dark'>((): 'light' | 'dark' => {
		// Get theme from local storage or default to 'light'
		if (typeof window !== 'undefined') {
			const savedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark';
			return savedTheme ? savedTheme : 'light';
		}
		return 'light';
	});

	useEffect(() => {
		// Save theme to local storage
		localStorage.setItem(THEME_KEY, theme);
		// Update the class on the body element
		document.documentElement.className = theme;
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
	};

	return { theme, toggleTheme };
}
