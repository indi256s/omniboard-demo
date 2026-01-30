export default function DshbWidget({ data }) {
  const progress = ((data.baseline - data.current) / (data.baseline - data.target)) * 100;
  
  return (
    <div className="glass rounded-xl p-6 animate-in delay-3">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-baseline gap-3">
          <h3 className="font-semibold text-white text-lg">ДШБ</h3>
          <p className="text-sm text-zinc-500 font-light">
            {data.quarter} • Динамическая шкала багов
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
          progress >= 50 
            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
        }`}>
          {progress >= 50 ? 'On Track' : 'At Risk'}
        </div>
      </div>
      
      {/* Stats and Progress Row */}
      <div className="grid grid-cols-[auto_1fr] gap-8 items-center">
        {/* Stats */}
        <div className="flex gap-8">
          <div>
            <div className="text-3xl font-bold mono text-zinc-400 mb-1">{data.baseline}</div>
            <div className="text-xs text-zinc-600 font-light">Baseline</div>
          </div>
          <div>
            <div className="text-3xl font-bold mono text-blue-400 mb-1">{data.current}</div>
            <div className="text-xs text-zinc-600 font-light">Current</div>
          </div>
          <div>
            <div className="text-3xl font-bold mono text-green-400 mb-1">{data.target}</div>
            <div className="text-xs text-zinc-600 font-light">Target</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-zinc-500 mb-2 font-light">
            <span>Progress</span>
            <span className="mono">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-zinc-800/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mt-2 font-light">
            <span>
              Сокращено: <span className="text-green-400 font-medium">{data.baseline - data.current}</span> багов
            </span>
            <span>
              Осталось: <span className="text-yellow-400 font-medium">{data.current - data.target}</span> багов
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
