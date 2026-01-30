import { useState, useEffect } from 'react';

export default function Header({ selectedTeam }) {
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const now = new Date();
  const formattedDate = now.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="mb-8">
      {/* Stacked Layout */}
      <div className="space-y-3">
        {/* Row 1: Breadcrumb + Theme Toggle */}
        <div className="flex items-center justify-between">
          {selectedTeam ? (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <button className="hover:text-white transition-colors">Dashboard</button>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400">{selectedTeam.platform}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-300">{selectedTeam.key}</span>
            </div>
          ) : (
            <div className="text-sm text-zinc-500">Обзор</div>
          )}
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
            style={{
              color: 'var(--text-primary)'
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Row 2: Title */}
        <h1 className="text-3xl font-bold tracking-tight">
          {selectedTeam ? selectedTeam.name : 'All Teams'}
        </h1>

        {/* Row 3: Meta bar */}
        <div className="flex items-center gap-4 text-sm">
          {selectedTeam && (
            <span className="px-2.5 py-1 bg-zinc-800/60 border border-zinc-700/50 rounded-md text-zinc-400">
              {selectedTeam.platform}
            </span>
          )}
          <div className="flex items-center gap-2 text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span className="text-zinc-400 mono">{formattedDate}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
