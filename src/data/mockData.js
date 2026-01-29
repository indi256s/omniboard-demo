export const teams = [
  { id: 1, name: 'Surf', platform: 'iOS', key: 'SURF' },
  { id: 2, name: 'Web Production', platform: 'Web', key: 'WPROD' },
  { id: 3, name: 'Disrupt', platform: 'Web', key: 'DISRUPT' },
  { id: 4, name: 'Radiocat', platform: 'Android', key: 'RADIOCAT' },
  { id: 5, name: 'Zvuk Client', platform: 'Backend', key: 'ZCL' },
  { id: 6, name: 'Acquisition', platform: 'Web', key: 'ACQ' },
  { id: 7, name: 'Discovery', platform: 'Backend', key: 'DISC' },
  { id: 8, name: 'Wave', platform: 'iOS', key: 'WAVE' },
  { id: 9, name: 'Social Intelligence', platform: 'DS', key: 'SOCINT' },
  { id: 10, name: 'Web Platform', platform: 'Web', key: 'WPLT' },
  { id: 11, name: 'Zvuk iOS', platform: 'iOS', key: 'ZIOS' },
  { id: 12, name: 'Zvuk Android', platform: 'Android', key: 'ZAND' },
  { id: 13, name: 'New Zealand', platform: 'Backend', key: 'NZ' },
  { id: 14, name: 'Internal Tools', platform: 'Web', key: 'INTR' },
  { id: 15, name: 'Integrations', platform: 'Backend', key: 'INTG' },
  { id: 16, name: 'Content & Growth', platform: 'DE', key: 'CNG' },
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
  { team: 'Surf', velocity: 88, cycleTime: 2.0, dshb: -18, trend: 'up', status: 'good' },
  { team: 'Web Production', velocity: 81, cycleTime: 2.3, dshb: -15, trend: 'up', status: 'good' },
  { team: 'Disrupt', velocity: 85, cycleTime: 2.1, dshb: -18, trend: 'up', status: 'good' },
  { team: 'Radiocat', velocity: 76, cycleTime: 2.8, dshb: -12, trend: 'up', status: 'good' },
  { team: 'Zvuk Client', velocity: 74, cycleTime: 3.1, dshb: -10, trend: 'stable', status: 'good' },
  { team: 'Acquisition', velocity: 78, cycleTime: 2.6, dshb: -14, trend: 'up', status: 'good' },
  { team: 'Discovery', velocity: 72, cycleTime: 3.3, dshb: -9, trend: 'stable', status: 'warning' },
  { team: 'Wave', velocity: 83, cycleTime: 2.2, dshb: -16, trend: 'up', status: 'good' },
  { team: 'Social Intelligence', velocity: 69, cycleTime: 3.8, dshb: -7, trend: 'stable', status: 'warning' },
  { team: 'Web Platform', velocity: 79, cycleTime: 2.5, dshb: -13, trend: 'up', status: 'good' },
  { team: 'Zvuk iOS', velocity: 70, cycleTime: 3.5, dshb: -8, trend: 'stable', status: 'warning' },
  { team: 'Zvuk Android', velocity: 73, cycleTime: 3.0, dshb: -11, trend: 'up', status: 'good' },
  { team: 'New Zealand', velocity: 66, cycleTime: 4.2, dshb: -6, trend: 'down', status: 'warning' },
  { team: 'Internal Tools', velocity: 75, cycleTime: 2.9, dshb: -10, trend: 'stable', status: 'good' },
  { team: 'Integrations', velocity: 71, cycleTime: 3.4, dshb: -8, trend: 'stable', status: 'warning' },
  { team: 'Content & Growth', velocity: 65, cycleTime: 4.5, dshb: -5, trend: 'down', status: 'critical' },
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
