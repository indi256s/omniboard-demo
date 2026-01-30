import { solutionTypes } from '../data/disruptData';

export default function SolutionsList({ solutions }) {
  return (
    <div className="space-y-3">
      {solutions.map((solution, idx) => {
        const typeConfig = solutionTypes[solution.type] || { 
          label: solution.type, 
          color: '#a855f7', 
          icon: '🔧' 
        };
        
        return (
          <div 
            key={idx}
            className="flex items-start gap-4 p-4 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
          >
            {/* Icon */}
            <div className="text-2xl">{typeConfig.icon}</div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-400 text-sm">⛔</span>
                <span className="text-zinc-400 text-sm">{solution.constraint}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-sm">→</span>
                <span className="text-white">{solution.solution}</span>
              </div>
            </div>
            
            {/* Type badge */}
            <div className="flex flex-col items-end gap-2">
              <span 
                className="px-2 py-1 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: `${typeConfig.color}20`,
                  color: typeConfig.color,
                  border: `1px solid ${typeConfig.color}40`
                }}
              >
                {typeConfig.label}
              </span>
              {solution.impact && (
                <span className="text-xs text-zinc-500">
                  {solution.impact}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
