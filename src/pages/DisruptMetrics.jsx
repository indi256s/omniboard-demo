import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import T2MGauge from '../components/T2MGauge';
import WaitTimeChart from '../components/WaitTimeChart';
import OwnershipRing from '../components/OwnershipRing';
import DisruptTrendChart from '../components/DisruptTrendChart';
import SolutionsList from '../components/SolutionsList';
import { disruptMetrics } from '../data/disruptData';

export default function DisruptMetrics() {
  const navigate = useNavigate();
  const data = disruptMetrics;
  
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );
  const [selectedPlatform, setSelectedPlatform] = useState(
    localStorage.getItem('selectedPlatform') || 'Все'
  );
  
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed);
  }, [collapsed]);
  
  const t2mDelta = data.t2m.previous - data.t2m.current;
  const waitDelta = data.waitTime.previous - data.waitTime.ratio;
  
  return (
    <div className="flex min-h-screen gradient-mesh">
      <Sidebar 
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        selectedTeam={null}
        setSelectedTeam={() => navigate('/team/ALL')}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      
      <main className={`flex-1 p-8 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={() => navigate('/team/ALL')}
              className="hover:text-white transition-colors"
            >
              <span className="text-zinc-500">Dashboard</span>
            </button>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-300">Disrupt Metrics</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="text-orange-400">⚡</span> Disrupt Metrics
              </h1>
              <p className="text-zinc-500 mt-1">
                Speed • Autonomy • Flexibility — {data.period}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Team</span>
              <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 text-sm font-medium border border-orange-500/20">
                {data.teamName}
              </span>
            </div>
          </div>
        </header>
        
        {/* Hero: T2M Gauge */}
        <div className="glass rounded-xl p-6 mb-6 animate-in">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-amber-400">🎯</span>
            <h2 className="text-lg font-semibold">Time to Market</h2>
            <span className="text-xs text-zinc-500 ml-2">Speed metric</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <T2MGauge 
                current={data.t2m.current}
                target={data.t2m.target}
                max={30}
              />
            </div>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="glass rounded-lg p-4">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Current</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold mono">{data.t2m.current}</span>
                    <span className="text-zinc-500">days</span>
                    {t2mDelta > 0 && (
                      <span className="text-green-400 text-sm">↓{t2mDelta}d vs prev</span>
                    )}
                  </div>
                </div>
                <div className="glass rounded-lg p-4">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Target</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold mono text-zinc-400">{data.t2m.target}</span>
                    <span className="text-zinc-500">days</span>
                    <span className="text-zinc-600 text-sm">
                      {data.t2m.current <= data.t2m.target ? '✓ On track' : `${data.t2m.current - data.t2m.target}d over`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="glass rounded-lg p-4">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Breakdown</div>
                <div className="flex gap-2">
                  {Object.entries(data.t2m.breakdown).map(([stage, days]) => (
                    <div 
                      key={stage}
                      className="flex-1 text-center p-2 rounded bg-zinc-800/50"
                    >
                      <div className="text-lg font-bold mono">{days}d</div>
                      <div className="text-xs text-zinc-500 capitalize">{stage}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Two columns: Wait Time + Ownership */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Wait Time Ratio */}
          <div className="glass rounded-xl p-6 animate-in delay-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-cyan-400">🔗</span>
              <h2 className="text-lg font-semibold">Wait Time Ratio</h2>
              <span className="text-xs text-zinc-500 ml-2">Autonomy metric</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold mono">{data.waitTime.ratio}%</span>
              <span className="text-zinc-500">blocked</span>
              {waitDelta > 0 && (
                <span className="text-green-400 text-sm">↓{waitDelta}% vs prev</span>
              )}
            </div>
            <WaitTimeChart 
              ratio={data.waitTime.ratio}
              bySource={data.waitTime.bySource}
              target={data.waitTime.target}
            />
          </div>
          
          {/* Solution Ownership */}
          <div className="glass rounded-xl p-6 animate-in delay-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-400">🛠</span>
              <h2 className="text-lg font-semibold">Solution Ownership Rate</h2>
              <span className="text-xs text-zinc-500 ml-2">Flexibility metric</span>
            </div>
            <div className="flex items-center gap-6">
              <OwnershipRing 
                rate={data.ownership.rate}
                baseline={data.ownership.baseline}
              />
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold mono">{data.ownership.rate}%</span>
                  <span className={`text-sm ${data.ownership.delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.ownership.delta >= 0 ? '+' : ''}{data.ownership.delta}% vs baseline
                  </span>
                </div>
                <div className="text-sm text-zinc-500">
                  Baseline: {data.ownership.baseline}% (company standard)
                </div>
                <div className="text-xs text-zinc-600 mt-2">
                  % of constraints where team found technical alternatives
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trend Chart */}
        <div className="glass rounded-xl p-6 mb-6 animate-in delay-3">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-400">📈</span>
            <h2 className="text-lg font-semibold">6-Sprint Trend</h2>
          </div>
          <DisruptTrendChart sprints={data.sprints} />
        </div>
        
        {/* Solutions List */}
        <div className="glass rounded-xl p-6 animate-in delay-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-orange-400">💡</span>
            <h2 className="text-lg font-semibold">Recent Solutions</h2>
            <span className="text-xs text-zinc-500 ml-2">Ownership examples this sprint</span>
          </div>
          <SolutionsList solutions={data.ownership.examples} />
        </div>
        
        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-zinc-800/50 text-center text-xs text-zinc-600">
          <span className="mono">PMO Омниборд v2.0</span> • Disrupt Metrics •
          <span className="text-orange-500 ml-1">● Live</span>
        </footer>
      </main>
    </div>
  );
}
