import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { HiMoon, HiSun } from 'react-icons/hi';

const ThemeToggler = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return (
        <button
            className="w-8 h-8 bg-blue-100 rounded-lg dark:bg-orange-100 flex items-center justify-center hover:ring-2 ring-blue-400 transition-all duration-300 focus:outline-none"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle Dark Mode"
        >
            {theme === 'light' ? (
                <HiMoon className="text-blue-500 w-5 h-5" />
            ) : (
                <HiSun className="text-orange-400 w-5 h-5" />
            )}
        </button>
    );
};

export default ThemeToggler;