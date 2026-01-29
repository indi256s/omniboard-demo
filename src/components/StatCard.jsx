import { getStatusColor, getStatusLabel } from '../data/mockData';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  status,
  alert,
  color = 'green',
  size = 'normal'
}) {
  const colorClasses = {
    green: 'before:via-green-500',
    blue: 'before:via-blue-500',
    purple: 'before:via-purple-500',
  };
  
  const isHero = size === 'hero';
  
  return (
    <div className={`stat-card glass rounded-xl relative overflow-hidden ${
      isHero ? 'p-8' : 'p-5'
    }`}>
      {/* Top gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${colorClasses[color]} to-transparent opacity-50`}></div>
      
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          {title}
        </div>
        {status && (
          <span className={`px-2 py-1 rounded text-[10px] font-medium border ${getStatusColor(status)}`}>
            {getStatusLabel(status)}
          </span>
        )}
      </div>
      
      <div className="flex items-end gap-3 mb-2">
        <span className={`font-bold mono ${isHero ? 'text-5xl' : 'text-3xl'}`}>
          {value}
        </span>
        {trend !== undefined && (
          <span className={`text-sm font-medium mb-1 ${
            trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-zinc-500'
          }`}>
            {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      
      {subtitle && (
        <div className="text-sm text-zinc-500 font-light">
          {subtitle}
        </div>
      )}
      
      {alert && (
        <div className="mt-3 p-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg text-xs text-yellow-400">
          ⚠️ {alert}
        </div>
      )}
    </div>
  );
}
