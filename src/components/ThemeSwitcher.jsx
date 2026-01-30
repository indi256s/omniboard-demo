import { useTheme } from '../context/ThemeContext';

export default function ThemeSwitcher({ collapsed = false }) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
        text-zinc-400 hover:text-white hover:bg-zinc-800/50
        dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/50
        ${collapsed ? 'justify-center w-10 h-10 px-0' : 'w-full'}`}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </svg>
          {!collapsed && <span>Light mode</span>}
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            />
          </svg>
          {!collapsed && <span>Dark mode</span>}
        </>
      )}
    </button>
  );
}
