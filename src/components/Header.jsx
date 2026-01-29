import { Link } from 'react-router-dom';

export default function Header({ selectedTeam }) {
  const now = new Date();
  const formattedDate = now.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        {selectedTeam ? (
          <>
            <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
              <button className="hover:text-white transition-colors">
                ← Dashboard
              </button>
            </div>
            <h1 className="text-2xl font-bold">{selectedTeam.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-zinc-500 mono">{selectedTeam.key}</span>
              <span className="px-2 py-0.5 bg-zinc-800/50 border border-zinc-700/50 rounded text-xs text-zinc-400">
                {selectedTeam.platform}
              </span>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-zinc-500 font-light">Обзор всех команд</p>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Link 
          to="/report" 
          className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg text-sm text-zinc-300 hover:text-white transition-all flex items-center gap-2"
        >
          <span>📊</span>
          Monthly Report
        </Link>
        <div className="text-right">
          <div className="text-xs text-zinc-500 font-light">Последнее обновление</div>
          <div className="text-sm mono text-zinc-400">{formattedDate}</div>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>
    </header>
  );
}
