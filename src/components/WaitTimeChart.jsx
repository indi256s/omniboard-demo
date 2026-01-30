export default function WaitTimeChart({ ratio, bySource, target }) {
  const flowPct = 100 - ratio;
  
  return (
    <div>
      {/* Main bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-zinc-500 mb-1">
          <span>Flow time</span>
          <span>Blocked time</span>
        </div>
        <div className="h-8 rounded-lg overflow-hidden flex bg-zinc-800/50">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${flowPct}%` }}
          />
          <div 
            className="bg-gradient-to-r from-red-500/80 to-amber-500/80 transition-all duration-500"
            style={{ width: `${ratio}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-cyan-400">{flowPct}% flowing</span>
          <span className="text-amber-400">{ratio}% blocked</span>
        </div>
      </div>
      
      {/* Target line info */}
      <div className="text-xs text-zinc-500 mb-4">
        Target: ≤{target}% blocked
        {ratio <= target ? (
          <span className="text-green-400 ml-2">✓ On track</span>
        ) : (
          <span className="text-amber-400 ml-2">↑ {ratio - target}% over target</span>
        )}
      </div>
      
      {/* Breakdown by source */}
      <div className="space-y-2">
        <div className="text-xs text-zinc-500 uppercase tracking-wider">Blocked by team</div>
        {bySource.map((source, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-20 text-sm text-zinc-400">{source.team}</div>
            <div className="flex-1 h-2 bg-zinc-800/50 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${(source.pct / ratio) * 100}%`,
                  backgroundColor: source.color
                }}
              />
            </div>
            <div className="w-12 text-right text-sm mono">{source.pct}%</div>
            <div className="w-16 text-right text-xs text-zinc-600">{source.hours}h</div>
          </div>
        ))}
      </div>
    </div>
  );
}
