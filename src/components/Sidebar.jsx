import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { platforms, teams } from '../data/mockData';

const Logo = ({ collapsed }) => (
  <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shrink-0">
      <span className="text-white font-bold text-sm">О</span>
    </div>
    {!collapsed && (
      <div className="overflow-hidden">
        <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>ОМНИБОРД</div>
        <div className="text-[10px] mono" style={{ color: 'var(--text-muted)' }}>Delivery Metrics</div>
      </div>
    )}
  </div>
);

export default function Sidebar({ 
  selectedPlatform, 
  setSelectedPlatform, 
  selectedTeam, 
  setSelectedTeam,
  collapsed,
  setCollapsed 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const isAlertsPage = location.pathname === '/alerts';
  const isReportPage = location.pathname === '/report';
  
  const filteredTeams = teams
    .filter(t => selectedPlatform === 'Все' || t.platform === selectedPlatform)
    .filter(t => 
      searchQuery === '' || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.key.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <aside 
      className={`h-screen glass fixed left-0 top-0 flex flex-col transition-all duration-300 z-50 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <Logo collapsed={collapsed} />
      
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition-colors"
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        <svg 
          className={`w-3 h-3 text-zinc-400 transition-transform ${collapsed ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* Navigation */}
      <div className={`p-4 border-b border-zinc-800/50 ${collapsed ? 'px-2' : ''}`}>
        <div className="space-y-1">
          <button
            onClick={() => navigate('/alerts')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
              isAlertsPage
                ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            } ${collapsed ? 'justify-center px-2' : ''}`}
            title="Алерты"
          >
            <span>🚨</span>
            {!collapsed && <span>Алерты</span>}
          </button>
          <button
            onClick={() => navigate('/report')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
              isReportPage
                ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            } ${collapsed ? 'justify-center px-2' : ''}`}
            title="Отчёт"
          >
            <span>📊</span>
            {!collapsed && <span>Отчёт</span>}
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Platform Filter */}
          <div className="p-4">
            <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-3">
              Платформа
            </div>
            <div className="space-y-1">
              {platforms.map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(p)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedPlatform === p 
                      ? 'bg-green-500/10 text-green-400 border-l-2 border-green-500' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          
          {/* Teams */}
          <div className="p-4 flex-1 overflow-auto">
            <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-3">
              Команды ({filteredTeams.length})
            </div>
            
            {/* Search */}
            <div className="relative mb-3">
              <input 
                type="text" 
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
              />
              <svg 
                className="absolute right-3 top-2.5 w-4 h-4 text-zinc-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Teams List */}
            <div className="space-y-1">
              {filteredTeams.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-sm">
                  Нет команд
                </div>
              ) : (
                filteredTeams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedTeam?.id === team.id 
                        ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{team.name}</span>
                      <span className="text-xs text-zinc-600 mono ml-2 shrink-0">{team.key}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
      
      {/* Collapsed State - Platform Icons */}
      {collapsed && (
        <div className="flex-1 flex flex-col items-center py-4 gap-2 overflow-auto">
          {platforms.slice(0, 5).map(p => (
            <button
              key={p}
              onClick={() => {
                setSelectedPlatform(p);
                setCollapsed(false);
              }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                selectedPlatform === p 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
              }`}
              title={p}
            >
              {p[0]}
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
