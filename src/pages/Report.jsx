import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { teams, getTeamData, velocityData } from '../data/mockData';

// Generate month options
const MONTHS = [
  { key: '2026-01', label: 'Январь 2026' },
  { key: '2025-12', label: 'Декабрь 2025' },
  { key: '2025-11', label: 'Ноябрь 2025' },
  { key: '2025-10', label: 'Октябрь 2025' },
];

// Issue types for cycle time breakdown
const ISSUE_TYPES = ['Bug', 'Task', 'Story', 'Request'];
const STAGES = ['Dev', 'Review', 'QA', 'Done'];

// Generate insights based on data
function generateVelocityInsight(data) {
  const velocities = data.map(d => d.pct);
  const avg = velocities.reduce((a, b) => a + b, 0) / velocities.length;
  const trend = velocities[velocities.length - 1] - velocities[0];
  const belowTarget = velocities.filter(v => v < 60).length;
  
  if (belowTarget >= 2) {
    return { type: 'warning', text: `${belowTarget} из ${velocities.length} спринтов ниже target 60%. Рекомендация: пересмотреть планирование спринта.` };
  }
  if (trend > 10) {
    return { type: 'success', text: `Положительный тренд: velocity вырос на ${trend.toFixed(0)}% за период. Команда набирает темп.` };
  }
  if (trend < -10) {
    return { type: 'warning', text: `Отрицательный тренд: velocity упал на ${Math.abs(trend).toFixed(0)}%. Возможные причины: техдолг, внешние блокеры.` };
  }
  return { type: 'info', text: `Стабильный velocity ~${avg.toFixed(0)}%. Команда работает предсказуемо.` };
}

function generateCycleTimeInsight(cycleTimeByType, cycleTimeByStage) {
  const maxType = Object.entries(cycleTimeByType).reduce((a, b) => a[1] > b[1] ? a : b);
  const maxStage = Object.entries(cycleTimeByStage).reduce((a, b) => a[1] > b[1] ? a : b);
  
  if (maxStage[1] > 5) {
    return { type: 'warning', text: `Bottleneck: этап "${maxStage[0]}" занимает ${maxStage[1].toFixed(1)} дней. Рекомендация: увеличить пропускную способность.` };
  }
  if (maxType[0] === 'Bug' && maxType[1] > 3) {
    return { type: 'warning', text: `Баги решаются долго (${maxType[1].toFixed(1)}d). Возможно, требуется улучшение процесса триажа.` };
  }
  return { type: 'success', text: `Cycle time в норме. Самый долгий этап: ${maxStage[0]} (${maxStage[1].toFixed(1)}d).` };
}

export default function Report() {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState('Все');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [reportTeam, setReportTeam] = useState('all');

  // Get data for selected team
  const reportData = useMemo(() => {
    if (reportTeam === 'all') {
      return {
        velocity: velocityData.slice(-3),
        avgVelocity: Math.round(velocityData.slice(-3).reduce((a, b) => a + b.pct, 0) / 3),
      };
    }
    const team = teams.find(t => t.key === reportTeam);
    const data = getTeamData(reportTeam);
    return {
      velocity: data?.velocity?.slice(-3) || velocityData.slice(-3),
      avgVelocity: data?.avgVelocity || 71,
      teamName: team?.name,
    };
  }, [reportTeam]);

  // Calculate totals
  const totalPlanned = reportData.velocity.reduce((a, b) => a + b.planned, 0);
  const totalCompleted = reportData.velocity.reduce((a, b) => a + b.completed, 0);
  const velocityTrend = reportData.velocity[reportData.velocity.length - 1]?.pct - reportData.velocity[0]?.pct;

  // Cycle time by issue type (mock data)
  const cycleTimeByType = useMemo(() => ({
    Bug: 2.5 + Math.random() * 2,
    Task: 3.2 + Math.random() * 2,
    Story: 5.8 + Math.random() * 3,
    Request: 4.1 + Math.random() * 2,
  }), [reportTeam, selectedMonth]);

  // Cycle time by stage (mock data)
  const cycleTimeByStage = useMemo(() => ({
    Dev: 4.2 + Math.random() * 3,
    Review: 1.8 + Math.random() * 2,
    QA: 2.5 + Math.random() * 2,
    Done: 0.5 + Math.random(),
  }), [reportTeam, selectedMonth]);

  const totalCycleTime = Object.values(cycleTimeByStage).reduce((a, b) => a + b, 0);
  const bottleneck = Object.entries(cycleTimeByStage).reduce((a, b) => a[1] > b[1] ? a : b);

  const velocityInsight = generateVelocityInsight(reportData.velocity);
  const cycleTimeInsight = generateCycleTimeInsight(cycleTimeByType, cycleTimeByStage);

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
        <header className="mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <button onClick={() => navigate('/team/ALL')} className="hover:text-white transition-colors">
                Dashboard
              </button>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-300">Report</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">📊 Отчёт</h1>
          </div>
        </header>

        {/* Period Header */}
        <div className="glass rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Период</div>
              <div className="flex gap-2">
                {MONTHS.map(m => (
                  <button
                    key={m.key}
                    onClick={() => setSelectedMonth(m.key)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      selectedMonth === m.key
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:border-zinc-600'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Команда</div>
              <select
                value={reportTeam}
                onChange={(e) => setReportTeam(e.target.value)}
                className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-600"
              >
                <option value="all">Все команды</option>
                {teams.map(t => (
                  <option key={t.key} value={t.key}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Velocity Analysis */}
        <div className="glass rounded-xl p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Velocity Analysis
          </h2>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
              <div className="text-xs text-zinc-500 mb-1">Спринтов</div>
              <div className="text-2xl font-bold mono">{reportData.velocity.length}</div>
            </div>
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
              <div className="text-xs text-zinc-500 mb-1">Commitment</div>
              <div className="text-2xl font-bold mono text-zinc-400">{totalPlanned} SP</div>
            </div>
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
              <div className="text-xs text-zinc-500 mb-1">Delivered</div>
              <div className="text-2xl font-bold mono text-green-400">{totalCompleted} SP</div>
            </div>
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
              <div className="text-xs text-zinc-500 mb-1">Avg Velocity</div>
              <div className="text-2xl font-bold mono">
                <span className={reportData.avgVelocity >= 60 ? 'text-green-400' : 'text-red-400'}>
                  {reportData.avgVelocity}%
                </span>
              </div>
            </div>
          </div>

          {/* Sprint breakdown */}
          <div className="mb-6">
            <div className="text-sm text-zinc-500 mb-3">По спринтам</div>
            <div className="space-y-2">
              {reportData.velocity.map((sprint, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-28 text-sm text-zinc-400 mono">{sprint.sprint}</div>
                  <div className="flex-1 h-8 bg-zinc-800/50 rounded-lg overflow-hidden relative">
                    <div 
                      className="h-full bg-zinc-700 absolute"
                      style={{ width: `${(sprint.planned / 60) * 100}%` }}
                    ></div>
                    <div 
                      className={`h-full absolute ${sprint.pct >= 60 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${(sprint.completed / 60) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-24 text-right">
                    <span className="text-sm text-zinc-400">{sprint.completed}/{sprint.planned}</span>
                    <span className={`ml-2 text-sm font-medium ${sprint.pct >= 60 ? 'text-green-400' : 'text-red-400'}`}>
                      {sprint.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Velocity Trend */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-zinc-500">Trend:</span>
            <span className={`text-sm font-medium ${velocityTrend > 0 ? 'text-green-400' : velocityTrend < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
              {velocityTrend > 0 ? '↑' : velocityTrend < 0 ? '↓' : '→'} {velocityTrend > 0 ? '+' : ''}{velocityTrend}%
            </span>
          </div>

          {/* Insight */}
          <div className={`p-4 rounded-lg border ${
            velocityInsight.type === 'success' ? 'bg-green-500/10 border-green-500/20' :
            velocityInsight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
            'bg-blue-500/10 border-blue-500/20'
          }`}>
            <div className="flex items-start gap-2">
              <span>🔍</span>
              <p className="text-sm text-zinc-300">{velocityInsight.text}</p>
            </div>
          </div>
        </div>

        {/* Cycle Time Breakdown */}
        <div className="glass rounded-xl p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Cycle Time Breakdown
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {/* By Issue Type */}
            <div>
              <div className="text-sm text-zinc-500 mb-3">По типу задачи</div>
              <div className="space-y-3">
                {ISSUE_TYPES.map(type => {
                  const value = cycleTimeByType[type];
                  const pct = (value / 10) * 100;
                  return (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-400">{type}</span>
                        <span className="mono text-zinc-300">{value.toFixed(1)}d</span>
                      </div>
                      <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* By Stage */}
            <div>
              <div className="text-sm text-zinc-500 mb-3">По этапу</div>
              <div className="space-y-3">
                {STAGES.map(stage => {
                  const value = cycleTimeByStage[stage];
                  const pct = (value / totalCycleTime) * 100;
                  const isBottleneck = stage === bottleneck[0];
                  return (
                    <div key={stage}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={`${isBottleneck ? 'text-yellow-400' : 'text-zinc-400'}`}>
                          {stage} {isBottleneck && '⚠️'}
                        </span>
                        <span className="mono text-zinc-300">{value.toFixed(1)}d ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isBottleneck ? 'bg-yellow-500' : 'bg-purple-500'}`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-800/50">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Total Cycle Time</span>
                  <span className="mono text-white font-medium">{totalCycleTime.toFixed(1)} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottleneck Highlight */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400">⚠️</span>
              <span className="text-sm font-medium text-yellow-400">Bottleneck: {bottleneck[0]}</span>
            </div>
            <p className="text-sm text-zinc-400">
              Этап "{bottleneck[0]}" занимает {bottleneck[1].toFixed(1)} дней ({((bottleneck[1] / totalCycleTime) * 100).toFixed(0)}% от общего времени)
            </p>
          </div>

          {/* Insight */}
          <div className={`mt-4 p-4 rounded-lg border ${
            cycleTimeInsight.type === 'success' ? 'bg-green-500/10 border-green-500/20' :
            cycleTimeInsight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
            'bg-blue-500/10 border-blue-500/20'
          }`}>
            <div className="flex items-start gap-2">
              <span>🔍</span>
              <p className="text-sm text-zinc-300">{cycleTimeInsight.text}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-zinc-800/50 text-center text-xs text-zinc-600">
          <span className="mono">PMO Омниборд v2.0</span> • Report •
          <span className="text-green-500 ml-1">● Live</span>
        </footer>
      </main>
    </div>
  );
}
