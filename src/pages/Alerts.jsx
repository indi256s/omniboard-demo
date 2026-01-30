import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { teams, getTeamData } from '../data/mockData';

// Alert definitions
const ALERT_TYPES = {
  velocity: {
    label: 'Velocity',
    color: 'green',
  },
  cycleTime: {
    label: 'Cycle Time',
    color: 'blue',
  },
  teamHealth: {
    label: 'Team Health',
    color: 'purple',
  },
};

const SEVERITY = {
  critical: { label: 'Критический', color: 'red', icon: '🔴', order: 0 },
  warning: { label: 'Предупреждение', color: 'yellow', icon: '🟡', order: 1 },
  info: { label: 'Информация', color: 'green', icon: '🟢', order: 2 },
};

// Generate alerts based on team data
function generateAlerts(teams) {
  const alerts = [];
  
  teams.forEach(team => {
    const data = getTeamData(team.key);
    if (!data) return;
    
    const velocityData = data.velocity || [];
    const cycleTimeData = data.cycleTime || [];
    const avgVelocity = data.avgVelocity || 0;
    
    // Get last sprints for trend analysis
    const lastTwo = velocityData.slice(-2);
    const lastVelocity = lastTwo[1]?.pct || 0;
    const prevVelocity = lastTwo[0]?.pct || 0;
    const velocityChange = prevVelocity > 0 ? ((lastVelocity - prevVelocity) / prevVelocity) * 100 : 0;
    
    // Calculate velocity variance
    const velocities = velocityData.map(v => v.pct);
    const mean = velocities.reduce((a, b) => a + b, 0) / velocities.length;
    const variance = velocities.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / velocities.length;
    const stdDev = Math.sqrt(variance);
    const coeffOfVariation = (stdDev / mean) * 100;
    
    // Count sprints below target
    const sprintsBelowTarget = velocityData.filter(v => v.pct < 60).length;
    const consecutiveBelowTarget = velocityData.slice(-3).filter(v => v.pct < 60).length;
    
    // Cycle time metrics
    const avgCycleTime = data.avgCycleTime || 0;
    const lastCycleTime = cycleTimeData[cycleTimeData.length - 1];
    const p90 = lastCycleTime?.p90 || avgCycleTime * 1.5;
    
    // Carryover rate (simulated based on velocity)
    const carryoverRate = Math.max(0, 100 - avgVelocity);
    
    // 1. 🔴 Velocity < 60% (2+ sprints in a row)
    if (consecutiveBelowTarget >= 2) {
      alerts.push({
        id: `${team.key}-vel-critical`,
        team,
        type: 'velocity',
        severity: 'critical',
        title: 'Velocity ниже 60%',
        description: `${consecutiveBelowTarget} спринта подряд ниже целевого показателя`,
        value: `${lastVelocity}%`,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 2),
      });
    }
    
    // 2. 🟡 Velocity dropped >20% vs last sprint
    if (velocityChange < -20) {
      alerts.push({
        id: `${team.key}-vel-drop`,
        team,
        type: 'velocity',
        severity: 'warning',
        title: 'Резкое падение Velocity',
        description: `Снижение на ${Math.abs(velocityChange).toFixed(0)}% по сравнению с прошлым спринтом`,
        value: `${prevVelocity}% → ${lastVelocity}%`,
        timestamp: new Date(Date.now() - Math.random() * 86400000),
      });
    }
    
    // 3. 🟡 Velocity unstable (variance >25%)
    if (coeffOfVariation > 25) {
      alerts.push({
        id: `${team.key}-vel-unstable`,
        team,
        type: 'velocity',
        severity: 'warning',
        title: 'Нестабильный Velocity',
        description: `Высокая вариативность: ${coeffOfVariation.toFixed(0)}%`,
        value: `σ=${stdDev.toFixed(1)}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 3),
      });
    }
    
    // 4. 🔴 Median Cycle Time > 14 days
    if (avgCycleTime > 14) {
      alerts.push({
        id: `${team.key}-ct-high`,
        team,
        type: 'cycleTime',
        severity: 'critical',
        title: 'Cycle Time превышает норму',
        description: `Медиана ${avgCycleTime.toFixed(1)} дней (норма: <14)`,
        value: `${avgCycleTime.toFixed(1)}d`,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 2),
      });
    }
    
    // 5. 🟡 P90 > 30 days (long tail)
    if (p90 > 30) {
      alerts.push({
        id: `${team.key}-ct-p90`,
        team,
        type: 'cycleTime',
        severity: 'warning',
        title: 'Длинный хвост Cycle Time',
        description: `P90 = ${p90.toFixed(1)} дней — много задач "застревают"`,
        value: `P90: ${p90.toFixed(1)}d`,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 4),
      });
    }
    
    // 6. 🟡 Cycle Time grew >30% vs last month (simulated)
    if (avgCycleTime > 18 && Math.random() > 0.6) {
      alerts.push({
        id: `${team.key}-ct-growth`,
        team,
        type: 'cycleTime',
        severity: 'warning',
        title: 'Рост Cycle Time',
        description: 'Увеличение на 35% по сравнению с прошлым месяцем',
        value: '+35%',
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 5),
      });
    }
    
    // 7. 🔴 Team below target 3+ sprints
    if (sprintsBelowTarget >= 3) {
      alerts.push({
        id: `${team.key}-health-below`,
        team,
        type: 'teamHealth',
        severity: 'critical',
        title: 'Команда ниже target',
        description: `${sprintsBelowTarget} из 6 спринтов ниже целевого показателя`,
        value: `${sprintsBelowTarget}/6`,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 3),
      });
    }
    
    // 8. 🟡 Carryover rate > 30%
    if (carryoverRate > 30) {
      alerts.push({
        id: `${team.key}-health-carryover`,
        team,
        type: 'teamHealth',
        severity: 'warning',
        title: 'Высокий Carryover',
        description: `${carryoverRate.toFixed(0)}% задач переносится в следующий спринт`,
        value: `${carryoverRate.toFixed(0)}%`,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 2),
      });
    }
    
    // 9. 🟢 Top performer (Velocity >85%, stable)
    if (avgVelocity >= 85 && coeffOfVariation < 15) {
      alerts.push({
        id: `${team.key}-health-top`,
        team,
        type: 'teamHealth',
        severity: 'info',
        title: 'Топ перформер',
        description: `Стабильно высокий Velocity: ${avgVelocity}%`,
        value: `${avgVelocity}%`,
        timestamp: new Date(Date.now() - Math.random() * 86400000),
      });
    }
  });
  
  return alerts;
}

export default function Alerts() {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState('Все');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const alerts = useMemo(() => generateAlerts(teams), []);
  
  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(a => typeFilter === 'all' || a.type === typeFilter)
      .filter(a => severityFilter === 'all' || a.severity === severityFilter)
      .sort((a, b) => {
        // Sort by severity first, then by timestamp
        const severityDiff = SEVERITY[a.severity].order - SEVERITY[b.severity].order;
        if (severityDiff !== 0) return severityDiff;
        return b.timestamp - a.timestamp;
      });
  }, [alerts, typeFilter, severityFilter]);

  const alertsByType = useMemo(() => {
    const grouped = { velocity: [], cycleTime: [], teamHealth: [] };
    filteredAlerts.forEach(a => grouped[a.type].push(a));
    return grouped;
  }, [filteredAlerts]);

  const stats = useMemo(() => ({
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length,
  }), [alerts]);

  const handleAlertClick = (alert) => {
    navigate(`/team/${alert.team.key}`);
  };

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
              <span className="text-zinc-300">Alerts</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">🚨 Алерты</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-zinc-400">{stats.total} алертов</span>
              <span className="text-red-400">🔴 {stats.critical}</span>
              <span className="text-yellow-400">🟡 {stats.warning}</span>
              <span className="text-green-400">🟢 {stats.info}</span>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="glass rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                typeFilter === 'all' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Все типы
            </button>
            {Object.entries(ALERT_TYPES).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  typeFilter === key ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <div className="glass rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setSeverityFilter('all')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                severityFilter === 'all' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Все
            </button>
            {Object.entries(SEVERITY).map(([key, { icon }]) => (
              <button
                key={key}
                onClick={() => setSeverityFilter(key)}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  severityFilter === key ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Alert Groups */}
        <div className="space-y-6">
          {Object.entries(alertsByType).map(([type, typeAlerts]) => {
            if (typeAlerts.length === 0) return null;
            return (
              <div key={type} className="glass rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-${ALERT_TYPES[type].color}-500`}></span>
                  {ALERT_TYPES[type].label}
                  <span className="text-sm font-normal text-zinc-500">({typeAlerts.length})</span>
                </h2>
                
                <div className="space-y-3">
                  {typeAlerts.map(alert => (
                    <div
                      key={alert.id}
                      onClick={() => handleAlertClick(alert)}
                      className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50 hover:border-zinc-700 cursor-pointer transition-colors group"
                    >
                      <span className="text-xl">{SEVERITY[alert.severity].icon}</span>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">{alert.title}</span>
                          <span className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400">
                            {alert.team.name}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-500 truncate">{alert.description}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-mono text-lg font-bold text-white">{alert.value}</div>
                        <div className="text-xs text-zinc-600">
                          {alert.timestamp.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                        </div>
                      </div>
                      
                      <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">→</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="glass rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-lg font-medium text-white mb-2">Нет алертов</h3>
            <p className="text-zinc-500">Все показатели в норме</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-zinc-800/50 text-center text-xs text-zinc-600">
          <span className="mono">PMO Омниборд v2.0</span> • Alerts •
          <span className="text-green-500 ml-1">● Live</span>
        </footer>
      </main>
    </div>
  );
}
