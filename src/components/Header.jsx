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
    <header className="mb-8">
      {/* Stacked Layout */}
      <div className="space-y-3">
        {/* Row 1: Breadcrumb */}
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
