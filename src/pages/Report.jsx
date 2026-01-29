import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { teams } from '../data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

const months = [
  { value: '2026-01', label: 'January 2026' },
  { value: '2026-02', label: 'February 2026' },
  { value: '2025-12', label: 'December 2025' },
  { value: '2025-11', label: 'November 2025' },
];

// Mock data for monthly report
const getMonthlyData = (month, teamKey) => {
  const isAllTeams = !teamKey || teamKey === 'ALL';
  
  return {
    velocity: {
      sprints: [
        { sprint: isAllTeams ? 'MEDIAN 26-01' : `${teamKey} 26-01`, planned: 42, completed: 32, pct: 76 },
        { sprint: isAllTeams ? 'MEDIAN 26-02' : `${teamKey} 26-02`, planned: 38, completed: 30, pct: 79 },
        { sprint: isAllTeams ? 'MEDIAN 26-03' : `${teamKey} 26-03`, planned: 45, completed: 38, pct: 84 },
      ],
      totalPlanned: 125,
      totalCompleted: 100,
      avgVelocity: 80,
      trend: '+8%',
      insight: isAllTeams 
        ? 'Median velocity improved 8% vs previous month. 12 of 16 teams exceeded 60% target.'
        : 'Team showed consistent improvement across all 3 sprints. Strong finish at 84%.',
    },
    cycleTime: {
      byType: [
        { type: 'Bug', avg: 3.2, median: 2.5, count: 45, color: '#ef4444' },
        { type: 'Task', avg: 5.8, median: 4.2, count: 120, color: '#6366f1' },
        { type: 'Story', avg: 8.5, median: 6.8, count: 35, color: '#22c55e' },
        { type: 'Request', avg: 12.4, median: 9.2, count: 18, color: '#eab308' },
      ],
      byStage: [
        { stage: 'Development', avg: 4.2, pct: 45 },
        { stage: 'Code Review', avg: 1.8, pct: 19 },
        { stage: 'QA', avg: 2.1, pct: 22 },
        { stage: 'Release', avg: 1.3, pct: 14 },
      ],
      bottleneck: 'Development',
      overallMedian: 5.2,
      overallAvg: 7.5,
      insight: isAllTeams
        ? 'Development stage takes 45% of cycle time. Consider breaking down large stories.'
        : 'Code Review improved 0.5d vs last month. QA stage is stable.',
    },
  };
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color || entry.fill }}>
            {entry.name}: {entry.value}{entry.name?.includes('pct') || entry.dataKey === 'pct' ? '%' : entry.dataKey?.includes('avg') ? 'd' : ' SP'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Report() {
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('Все');
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );

  const teamKey = selectedTeam?.key || 'ALL';
  const data = getMonthlyData(selectedMonth, teamKey);
  const displayTitle = selectedTeam ? selectedTeam.name : 'All Teams (Median)';
  const monthLabel = months.find(m => m.value === selectedMonth)?.label || selectedMonth;

  return (
    <div className="flex min-h-screen gradient-mesh">
      <Sidebar
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main className={`flex-1 p-8 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link to="/team/ALL" className="text-zinc-500 hover:text-white transition-colors">
                ← Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-white">Monthly Report</h1>
            <p className="text-zinc-500">{displayTitle} • {monthLabel}</p>
          </div>
          
          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-zinc-500"
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Velocity Analysis */}
        <div className="glass rounded-xl p-6 mb-6 animate-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Velocity Analysis</h2>
              <p className="text-sm text-zinc-500">Sprint performance for {monthLabel}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold mono text-green-400">{data.velocity.avgVelocity}%</div>
                <div className="text-xs text-zinc-500">Avg Velocity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mono text-blue-400">{data.velocity.totalCompleted}</div>
                <div className="text-xs text-zinc-500">SP Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold mono text-green-400">{data.velocity.trend}</div>
                <div className="text-xs text-zinc-500">vs Last Month</div>
              </div>
            </div>
          </div>
          
          {/* Velocity Chart */}
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.velocity.sprints} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="sprint" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="planned" fill="#3f3f46" radius={[4, 4, 0, 0]} name="Planned SP" />
                <Bar dataKey="completed" radius={[4, 4, 0, 0]} name="Completed SP">
                  {data.velocity.sprints.map((entry, index) => (
                    <Cell key={index} fill={entry.pct >= 60 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Velocity % labels */}
          <div className="flex justify-center gap-16 mb-4">
            {data.velocity.sprints.map((d, i) => (
              <div key={i} className="text-center">
                <div className={`text-sm font-bold mono ${d.pct >= 60 ? 'text-green-400' : 'text-red-400'}`}>
                  {d.pct}%
                </div>
                <div className="text-xs text-zinc-600">velocity</div>
              </div>
            ))}
          </div>
          
          {/* Insight */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-lg">💡</span>
              <div>
                <div className="text-sm font-medium text-blue-400 mb-1">Insight</div>
                <p className="text-sm text-zinc-300">{data.velocity.insight}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cycle Time Breakdown */}
        <div className="glass rounded-xl p-6 mb-6 animate-in delay-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Cycle Time Breakdown</h2>
              <p className="text-sm text-zinc-500">Time from Development to Done</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold mono text-blue-400">{data.cycleTime.overallMedian}d</div>
                <div className="text-xs text-zinc-500">Median</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mono text-zinc-400">{data.cycleTime.overallAvg}d</div>
                <div className="text-xs text-zinc-500">Average</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* By Issue Type */}
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-3">By Issue Type</h3>
              <div className="space-y-3">
                {data.cycleTime.byType.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-zinc-300">{item.type}</div>
                    <div className="flex-1 h-6 bg-zinc-800/50 rounded overflow-hidden">
                      <div 
                        className="h-full rounded transition-all"
                        style={{ 
                          width: `${(item.avg / 15) * 100}%`,
                          backgroundColor: item.color 
                        }}
                      ></div>
                    </div>
                    <div className="w-16 text-right">
                      <span className="mono text-sm text-white">{item.avg}d</span>
                    </div>
                    <div className="w-12 text-right text-xs text-zinc-500">
                      ({item.count})
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* By Stage */}
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-3">By Stage</h3>
              <div className="space-y-3">
                {data.cycleTime.byStage.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-zinc-300">{item.stage}</div>
                    <div className="flex-1 h-6 bg-zinc-800/50 rounded overflow-hidden">
                      <div 
                        className="h-full rounded transition-all"
                        style={{ 
                          width: `${item.pct}%`,
                          backgroundColor: item.stage === data.cycleTime.bottleneck ? '#ef4444' : '#6366f1'
                        }}
                      ></div>
                    </div>
                    <div className="w-16 text-right">
                      <span className="mono text-sm text-white">{item.avg}d</span>
                    </div>
                    <div className="w-12 text-right text-xs text-zinc-500">
                      {item.pct}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-red-400">
                ⚠️ Bottleneck: {data.cycleTime.bottleneck}
              </div>
            </div>
          </div>
          
          {/* Insight */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-lg">💡</span>
              <div>
                <div className="text-sm font-medium text-yellow-400 mb-1">Insight</div>
                <p className="text-sm text-zinc-300">{data.cycleTime.insight}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-zinc-800/50 text-center text-xs text-zinc-600">
          <span className="mono">ОМНИБОРД v2.0</span> • Monthly Report •
          <span className="text-green-500 ml-1">● Live</span>
        </footer>
      </main>
    </div>
  );
}
