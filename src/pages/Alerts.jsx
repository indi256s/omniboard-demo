import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { teams, summaryData, velocityData, cycleTimeData, teamMetrics } from '../data/mockData';

// Generate alerts based on team data
const generateAlerts = () => {
  const alerts = [];
  
  teams.forEach(team => {
    const teamData = teamMetrics[team.key];
    const summary = summaryData.find(s => s.team === team.name);
    
    if (!teamData || !summary) return;
    
    const velocityHistory = teamData.velocity;
    const cycleTimeHistory = teamData.cycleTime;
    
    // 1. Velocity < 60% (2+ sprints in a row)
    const lastTwoSprints = velocityHistory.slice(-2);
    const lowVelocityStreak = lastTwoSprints.every(s => s.pct < 60);
    if (lowVelocityStreak) {
      alerts.push({
        id: `${team.key}-vel-low`,
        team: team.name,
        teamKey: team.key,
        platform: team.platform,
        type: 'velocity',
        severity: 'critical',
        title: 'Velocity < 60% (2+ спринта)',
        description: `Последние 2 спринта: ${lastTwoSprints.map(s => s.pct + '%').join(', ')}`,
        value: lastTwoSprints[lastTwoSprints.length - 1].pct,
        metric: 'velocity'
      });
    }
    
    // 2. Velocity dropped >20% vs previous sprint
    const currentVel = velocityHistory[velocityHistory.length - 1]?.pct || 0;
    const prevVel = velocityHistory[velocityHistory.length - 2]?.pct || 0;
    const velDrop = prevVel > 0 ? ((prevVel - currentVel) / prevVel) * 100 : 0;
    if (velDrop > 20 && !lowVelocityStreak) {
      alerts.push({
        id: `${team.key}-vel-drop`,
        team: team.name,
        teamKey: team.key,
        platform: team.platform,
        type: 'velocity',
        severity: 'warning',
        title: 'Velocity резко упал',
        description: `Падение ${velDrop.toFixed(0)}%: ${prevVel}% → ${currentVel}%`,
        value: velDrop,
        metric: 'velocity'
      });
    }
    
    // 3. Velocity unstable (variance >25%)
    const velValues = velocityHistory.map(s => s.pct);
    const velAvg = velValues.reduce((a, b) => a + b, 0) / velValues.length;
    const velVariance = Math.sqrt(velValues.reduce((sum, v) => sum + Math.pow(v - velAvg, 2), 0) / velValues.length);
    const velCV = (velVariance / velAvg) * 100;
    if (velCV > 25 && !lowVelocityStreak) {
      alerts.push({
        id: `${team.key}-vel-unstable`,
        team: team.name,
        teamKey: team.key,
        platform: team.platform,
        type: 'velocity',
        severity: 'warning',
        title: 'Velocity нестабильный',
        description: `Разброс ${velCV.toFixed(0)}% за последние 6 спринтов`,
        value: velCV,
        metric: 'velocity'
      });
    }
    
    // 4. Median Cycle Time > 14 days
    const avgMedian = cycleTimeHistory.reduce((a, b) => a + b.median, 0) / cycleTimeHistory.length;
    if (avgMedian > 14) {
      alerts.push({
        id: `${team.key}-ct-high`,
        team: team.name,
        teamKey: team.key,
        platform: team.platform,
        type: 'cycletime',
        severity: 'critical',
        title: 'Cycle Time > 14 дней',
        description: `Медиана: ${avgMedian.toFixed(1)} дней`,
        value: avgMedian,
        metric: 'cycletime'
      });
    }
    
    // 5. P90 > 30 days (long tail)
    const avgP90 = cycleTimeHistory.reduce((a, b) => a + b.p90, 0) / cycleTimeHistory.length;
    if (avgP90 > 30) {
      alerts.push({
        id: `${team.key}-ct-p90`,
        team: team.name,
        teamKey: team.key,
        platform: team.platform,
        type: 'cycletime',
        severity: 'warning',
        title: 'P90 > 30 дней',
        description: `Длинный хвост: P90 = ${avgP90.toFixed(1)} дней`,
        value: avgP90,
        metric: 'cycletime'
      });
    }
    
    // 6. Cycle Time increased >30% vs previous period
    const recentCT = cycleTimeHistory.slice(-4).reduce((a, b) => a + b.avg, 0) / 4;
    const olderCT = cycleTimeHistory.slice(0, 4).reduce((a, b) => a + b.avg, 0) / 4;
    const ctIncrease = olderCT > 0 ? ((recentCT - olderCT) / olderCT) * 100 : 0;
    if (ctIncrease > 30) {
      alerts.push({
        id: `${team.key}-ct-increase`,
        team: team.name,
        teamKey: team.key,
        platform: team.platform,
        type: 'cycletime',
        severity: 'warning',
        title: 'Cycle Time вырос',
        description: `Рост ${ctIncrease.toFixed(0)}% vs прошлый период`,
        value: ctIncrease,
        metric: 'cycletime'
      });
    }
    
    // 7. Team below target 3+ sprints
    const belowTargetCount = velocityHistory.filter(s => s.pct < 60).length;
    if (belowTargetCount >= 3 && !lowVelocityStreak) {
      alerts.push({
        id: `${team.key}-health-below`,
        team: team.name,
        teamKey: team.key,
        platform: team.platform,
        type: 'health',
        severity: 'critical',
        title: 'Ниже target 3+ спринта',
        description: `${belowTargetCount} из 6 спринтов ниже 60%`,
        value: belowTargetCount,
        metric: 'health'
      });
    }
    
    // 8. High carryover rate (simulated based on low velocity)
    const estimatedCarryover = Math.max(0, 100 - summary.velocity) * 0.8;
    if (estimatedCarryover > 30) {
      alerts.push({
        id: `${team.key}-health-carryover`,
        team: team.name,
        teamKey: team.key,
        platform: team.platform,
        type: 'health',
        severity: 'warning',
        title: 'Высокий Carryover',
        description: `~${estimatedCarryover.toFixed(0)}% задач переносится`,
        value: estimatedCarryover,
        metric: 'health'
      });
    }
    
    // 9. Top performer (positive alert)
    if (summary.velocity >= 85 && velCV < 15) {
      alerts.push({
        id: `${team.key}-health-top`,
        team: team.name,
        teamKey: team.key,
        platform: team.platform,
        type: 'health',
        severity: 'success',
        title: 'Топ перформер',
        description: `Velocity ${summary.velocity}%, стабильно`,
        value: summary.velocity,
        metric: 'health'
      });
    }
  });
  
  return alerts;
};

const severityConfig = {
  critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    icon: '🔴',
    label: 'Критично'
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    icon: '🟡',
    label: 'Внимание'
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    icon: '🟢',
    label: 'Отлично'
  }
};

const typeLabels = {
  velocity: 'Velocity',
  cycletime: 'Cycle Time',
  health: 'Team Health'
};

export default function Alerts() {
  const [selectedPlatform, setSelectedPlatform] = useState('Все');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const allAlerts = generateAlerts();
  
  // Apply filters
  const filteredAlerts = allAlerts.filter(alert => {
    if (filterType !== 'all' && alert.type !== filterType) return false;
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (selectedPlatform !== 'Все') {
      const team = teams.find(t => t.key === alert.teamKey);
      if (team?.platform !== selectedPlatform) return false;
    }
    return true;
  });

  // Group by severity
  const criticalAlerts = filteredAlerts.filter(a => a.severity === 'critical');
  const warningAlerts = filteredAlerts.filter(a => a.severity === 'warning');
  const successAlerts = filteredAlerts.filter(a => a.severity === 'success');

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
                ← Дашборд
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-white">Алерты</h1>
            <p className="text-zinc-500">Метрики, требующие внимания</p>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
            >
              <option value="all">Все типы</option>
              <option value="velocity">Velocity</option>
              <option value="cycletime">Cycle Time</option>
              <option value="health">Team Health</option>
            </select>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
            >
              <option value="all">Все уровни</option>
              <option value="critical">Критично</option>
              <option value="warning">Внимание</option>
              <option value="success">Отлично</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-3xl font-bold mono text-white">{allAlerts.length}</div>
            <div className="text-xs text-zinc-500">Всего алертов</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-3xl font-bold mono text-red-400">{criticalAlerts.length}</div>
            <div className="text-xs text-zinc-500">Критично</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-3xl font-bold mono text-yellow-400">{warningAlerts.length}</div>
            <div className="text-xs text-zinc-500">Внимание</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-3xl font-bold mono text-green-400">{successAlerts.length}</div>
            <div className="text-xs text-zinc-500">Отлично</div>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔴</span>
              <h2 className="text-lg font-semibold text-red-400">Критично</h2>
              <span className="text-sm text-zinc-500">({criticalAlerts.length})</span>
            </div>
            <div className="space-y-3">
              {criticalAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        )}

        {/* Warning Alerts */}
        {warningAlerts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🟡</span>
              <h2 className="text-lg font-semibold text-yellow-400">Внимание</h2>
              <span className="text-sm text-zinc-500">({warningAlerts.length})</span>
            </div>
            <div className="space-y-3">
              {warningAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        )}

        {/* Success Alerts */}
        {successAlerts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🟢</span>
              <h2 className="text-lg font-semibold text-green-400">Отлично</h2>
              <span className="text-sm text-zinc-500">({successAlerts.length})</span>
            </div>
            <div className="space-y-3">
              {successAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <div className="glass rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-white mb-2">Нет алертов</h3>
            <p className="text-zinc-500">Все метрики в норме</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-zinc-800/50 text-center text-xs text-zinc-600">
          <span className="mono">ОМНИБОРД v2.0</span> • Алерты •
          <span className="text-green-500 ml-1">● Live</span>
        </footer>
      </main>
    </div>
  );
}

function AlertCard({ alert }) {
  const config = severityConfig[alert.severity];
  
  return (
    <Link 
      to={`/team/${alert.teamKey}`}
      className={`block glass rounded-xl p-4 border ${config.border} hover:bg-zinc-800/30 transition-all`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xl">{config.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{alert.team}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                {alert.platform}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${config.bg} ${config.text}`}>
                {typeLabels[alert.type]}
              </span>
            </div>
            <div className={`text-sm ${config.text} font-medium mt-1`}>{alert.title}</div>
            <div className="text-sm text-zinc-500">{alert.description}</div>
          </div>
        </div>
        <div className="text-zinc-500 text-xl">→</div>
      </div>
    </Link>
  );
}
