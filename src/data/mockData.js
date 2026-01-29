export const teams = [
  { id: 1, name: 'Web Production', platform: 'Web', key: 'WPROD' },
  { id: 2, name: 'Disrupt', platform: 'Web', key: 'DISRUPT' },
  { id: 3, name: 'Zvuk Client', platform: 'Backend', key: 'ZCL' },
  { id: 4, name: 'Zvuk iOS', platform: 'iOS', key: 'ZIOS' },
];

export const platforms = ['Все', 'iOS', 'Android', 'Backend', 'Web', 'DE', 'DS'];

export const velocityData = [
  { sprint: 'S45', planned: 42, completed: 22, pct: 52 },
  { sprint: 'S46', planned: 38, completed: 26, pct: 68 },
  { sprint: 'S47', planned: 40, completed: 34, pct: 85 },
  { sprint: 'S48', planned: 45, completed: 32, pct: 72 },
  { sprint: 'S49', planned: 41, completed: 32, pct: 78 },
  { sprint: 'S50', planned: 43, completed: 35, pct: 81 },
];

export const cycleTimeData = [
  { week: 'W1', avg: 2.8, median: 2.1, p90: 5.2 },
  { week: 'W2', avg: 3.1, median: 2.4, p90: 6.1 },
  { week: 'W3', avg: 2.5, median: 1.9, p90: 4.8 },
  { week: 'W4', avg: 3.4, median: 2.8, p90: 6.8 },
  { week: 'W5', avg: 2.9, median: 2.2, p90: 5.5 },
  { week: 'W6', avg: 2.6, median: 2.0, p90: 4.9 },
  { week: 'W7', avg: 2.4, median: 1.8, p90: 4.5 },
  { week: 'W8', avg: 2.2, median: 1.7, p90: 4.2 },
];

export const dshbData = {
  baseline: 150,
  target: 135,
  current: 142,
  progressPct: 53.3,
  quarter: 'Q1 2025'
};

export const summaryData = [
  { team: 'Web Production', velocity: 81, cycleTime: 3.2, dshb: -12, trend: 'up', status: 'good' },
  { team: 'Disrupt', velocity: 85, cycleTime: 2.1, dshb: -18, trend: 'up', status: 'good' },
  { team: 'Zvuk Client', velocity: 72, cycleTime: 3.8, dshb: -8, trend: 'stable', status: 'warning' },
  { team: 'Zvuk iOS', velocity: 68, cycleTime: 4.1, dshb: -5, trend: 'down', status: 'critical' },
];

// Helper functions
export const getTeamStatus = (velocity) => {
  if (velocity >= 75) return 'good';
  if (velocity >= 60) return 'warning';
  return 'critical';
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'good': return 'text-green-400 bg-green-500/10 border-green-500/20';
    case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
    default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'good': return 'On Track';
    case 'warning': return 'At Risk';
    case 'critical': return 'Critical';
    default: return 'Unknown';
  }
};
