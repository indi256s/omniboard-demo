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

// Default data (All Teams - MEDIAN values)
export const velocityData = [
  { sprint: 'MEDIAN 26-01', planned: 42, completed: 27, pct: 64 },
  { sprint: 'MEDIAN 26-02', planned: 38, completed: 26, pct: 68 },
  { sprint: 'MEDIAN 26-03', planned: 40, completed: 30, pct: 75 },
  { sprint: 'MEDIAN 26-04', planned: 45, completed: 32, pct: 71 },
  { sprint: 'MEDIAN 26-05', planned: 41, completed: 30, pct: 73 },
  { sprint: 'MEDIAN 26-06', planned: 43, completed: 32, pct: 74 },
];

export const cycleTimeData = [
  { week: 'W1', avg: 22.5, median: 19.2, p90: 38.5 },
  { week: 'W2', avg: 21.8, median: 18.5, p90: 36.2 },
  { week: 'W3', avg: 20.2, median: 17.8, p90: 34.8 },
  { week: 'W4', avg: 23.1, median: 20.4, p90: 40.2 },
  { week: 'W5', avg: 19.8, median: 17.2, p90: 33.5 },
  { week: 'W6', avg: 18.9, median: 16.8, p90: 31.2 },
  { week: 'W7', avg: 19.5, median: 17.5, p90: 32.8 },
  { week: 'W8', avg: 18.2, median: 16.4, p90: 30.5 },
];

export const dshbData = {
  baseline: 150,
  target: 135,
  current: 142,
  progressPct: 53.3,
  quarter: 'Q1 2026'
};

export const summaryData = [
  { team: 'Surf', velocity: 88, cycleTime: 16.2, dshb: -18, trend: 'up', status: 'good' },
  { team: 'Web Production', velocity: 81, cycleTime: 17.8, dshb: -15, trend: 'up', status: 'good' },
  { team: 'Disrupt', velocity: 85, cycleTime: 15.5, dshb: -18, trend: 'up', status: 'good' },
  { team: 'Radiocat', velocity: 76, cycleTime: 19.2, dshb: -12, trend: 'up', status: 'good' },
  { team: 'Zvuk Client', velocity: 74, cycleTime: 20.5, dshb: -10, trend: 'stable', status: 'good' },
  { team: 'Acquisition', velocity: 78, cycleTime: 18.4, dshb: -14, trend: 'up', status: 'good' },
  { team: 'Discovery', velocity: 62, cycleTime: 22.8, dshb: -9, trend: 'stable', status: 'good' },
  { team: 'Wave', velocity: 83, cycleTime: 16.8, dshb: -16, trend: 'up', status: 'good' },
  { team: 'Social Intelligence', velocity: 58, cycleTime: 24.5, dshb: -7, trend: 'stable', status: 'warning' },
  { team: 'Web Platform', velocity: 79, cycleTime: 17.5, dshb: -13, trend: 'up', status: 'good' },
  { team: 'Zvuk iOS', velocity: 70, cycleTime: 21.2, dshb: -8, trend: 'stable', status: 'good' },
  { team: 'Zvuk Android', velocity: 73, cycleTime: 19.8, dshb: -11, trend: 'up', status: 'good' },
  { team: 'New Zealand', velocity: 55, cycleTime: 26.5, dshb: -6, trend: 'down', status: 'warning' },
  { team: 'Internal Tools', velocity: 75, cycleTime: 18.9, dshb: -10, trend: 'stable', status: 'good' },
  { team: 'Integrations', velocity: 61, cycleTime: 23.2, dshb: -8, trend: 'stable', status: 'good' },
  { team: 'Content & Growth', velocity: 48, cycleTime: 28.5, dshb: -5, trend: 'down', status: 'critical' },
];

// Team-specific datasets
export const teamMetrics = {
  SURF: {
    velocity: [
      { sprint: 'SURF 26-01', planned: 35, completed: 28, pct: 80 },
      { sprint: 'SURF 26-02', planned: 32, completed: 27, pct: 84 },
      { sprint: 'SURF 26-03', planned: 38, completed: 35, pct: 92 },
      { sprint: 'SURF 26-04', planned: 40, completed: 36, pct: 90 },
      { sprint: 'SURF 26-05', planned: 36, completed: 32, pct: 89 },
      { sprint: 'SURF 26-06', planned: 34, completed: 30, pct: 88 },
    ],
    cycleTime: [
      { week: 'W1', avg: 18.2, median: 15.5, p90: 28.5 },
      { week: 'W2', avg: 17.5, median: 14.8, p90: 27.2 },
      { week: 'W3', avg: 16.8, median: 14.2, p90: 26.5 },
      { week: 'W4', avg: 17.2, median: 15.0, p90: 27.8 },
      { week: 'W5', avg: 16.2, median: 13.8, p90: 25.5 },
      { week: 'W6', avg: 15.8, median: 13.5, p90: 24.8 },
      { week: 'W7', avg: 16.5, median: 14.2, p90: 26.2 },
      { week: 'W8', avg: 16.2, median: 13.9, p90: 25.8 },
    ],
    dshb: { baseline: 45, target: 38, current: 40, progressPct: 71.4, quarter: 'Q1 2026' },
    avgVelocity: 88,
    avgCycleTime: 16.2,
  },
  DISRUPT: {
    velocity: [
      { sprint: 'DISRUPT 26-01', planned: 42, completed: 34, pct: 81 },
      { sprint: 'DISRUPT 26-02', planned: 38, completed: 32, pct: 84 },
      { sprint: 'DISRUPT 26-03', planned: 45, completed: 40, pct: 89 },
      { sprint: 'DISRUPT 26-04', planned: 40, completed: 34, pct: 85 },
      { sprint: 'DISRUPT 26-05', planned: 43, completed: 36, pct: 84 },
      { sprint: 'DISRUPT 26-06', planned: 41, completed: 35, pct: 85 },
    ],
    cycleTime: [
      { week: 'W1', avg: 17.5, median: 14.8, p90: 27.2 },
      { week: 'W2', avg: 16.8, median: 14.2, p90: 26.5 },
      { week: 'W3', avg: 15.5, median: 13.2, p90: 24.8 },
      { week: 'W4', avg: 16.2, median: 13.8, p90: 25.5 },
      { week: 'W5', avg: 15.2, median: 12.9, p90: 24.2 },
      { week: 'W6', avg: 14.8, median: 12.5, p90: 23.5 },
      { week: 'W7', avg: 15.5, median: 13.2, p90: 24.8 },
      { week: 'W8', avg: 15.5, median: 13.0, p90: 24.5 },
    ],
    dshb: { baseline: 52, target: 42, current: 45, progressPct: 70.0, quarter: 'Q1 2026' },
    avgVelocity: 85,
    avgCycleTime: 15.5,
  },
  WPROD: {
    velocity: [
      { sprint: 'WPROD 26-01', planned: 38, completed: 30, pct: 79 },
      { sprint: 'WPROD 26-02', planned: 35, completed: 28, pct: 80 },
      { sprint: 'WPROD 26-03', planned: 40, completed: 34, pct: 85 },
      { sprint: 'WPROD 26-04', planned: 42, completed: 34, pct: 81 },
      { sprint: 'WPROD 26-05', planned: 38, completed: 31, pct: 82 },
      { sprint: 'WPROD 26-06', planned: 36, completed: 29, pct: 81 },
    ],
    cycleTime: [
      { week: 'W1', avg: 19.5, median: 16.8, p90: 30.2 },
      { week: 'W2', avg: 18.8, median: 16.2, p90: 29.5 },
      { week: 'W3', avg: 17.5, median: 15.2, p90: 28.2 },
      { week: 'W4', avg: 18.2, median: 15.8, p90: 29.0 },
      { week: 'W5', avg: 17.2, median: 14.8, p90: 27.5 },
      { week: 'W6', avg: 16.8, median: 14.5, p90: 27.0 },
      { week: 'W7', avg: 17.5, median: 15.2, p90: 28.2 },
      { week: 'W8', avg: 17.8, median: 15.4, p90: 28.5 },
    ],
    dshb: { baseline: 48, target: 40, current: 43, progressPct: 62.5, quarter: 'Q1 2026' },
    avgVelocity: 81,
    avgCycleTime: 17.8,
  },
  RADIOCAT: {
    velocity: [
      { sprint: 'RADIOCAT 26-01', planned: 30, completed: 22, pct: 73 },
      { sprint: 'RADIOCAT 26-02', planned: 28, completed: 21, pct: 75 },
      { sprint: 'RADIOCAT 26-03', planned: 32, completed: 26, pct: 81 },
      { sprint: 'RADIOCAT 26-04', planned: 35, completed: 27, pct: 77 },
      { sprint: 'RADIOCAT 26-05', planned: 30, completed: 23, pct: 77 },
      { sprint: 'RADIOCAT 26-06', planned: 28, completed: 21, pct: 75 },
    ],
    cycleTime: [
      { week: 'W1', avg: 21.2, median: 18.5, p90: 33.5 },
      { week: 'W2', avg: 20.5, median: 17.8, p90: 32.2 },
      { week: 'W3', avg: 19.2, median: 16.8, p90: 30.5 },
      { week: 'W4', avg: 20.0, median: 17.5, p90: 31.5 },
      { week: 'W5', avg: 18.8, median: 16.2, p90: 29.8 },
      { week: 'W6', avg: 18.5, median: 16.0, p90: 29.2 },
      { week: 'W7', avg: 19.2, median: 16.8, p90: 30.5 },
      { week: 'W8', avg: 19.2, median: 16.5, p90: 30.2 },
    ],
    dshb: { baseline: 38, target: 32, current: 35, progressPct: 50.0, quarter: 'Q1 2026' },
    avgVelocity: 76,
    avgCycleTime: 19.2,
  },
  WAVE: {
    velocity: [
      { sprint: 'WAVE 26-01', planned: 32, completed: 26, pct: 81 },
      { sprint: 'WAVE 26-02', planned: 30, completed: 25, pct: 83 },
      { sprint: 'WAVE 26-03', planned: 35, completed: 31, pct: 89 },
      { sprint: 'WAVE 26-04', planned: 38, completed: 32, pct: 84 },
      { sprint: 'WAVE 26-05', planned: 34, completed: 28, pct: 82 },
      { sprint: 'WAVE 26-06', planned: 32, completed: 27, pct: 84 },
    ],
    cycleTime: [
      { week: 'W1', avg: 18.5, median: 15.8, p90: 29.2 },
      { week: 'W2', avg: 17.8, median: 15.2, p90: 28.5 },
      { week: 'W3', avg: 16.5, median: 14.2, p90: 26.8 },
      { week: 'W4', avg: 17.2, median: 14.8, p90: 27.5 },
      { week: 'W5', avg: 16.2, median: 13.8, p90: 26.2 },
      { week: 'W6', avg: 15.8, median: 13.5, p90: 25.5 },
      { week: 'W7', avg: 16.5, median: 14.2, p90: 26.8 },
      { week: 'W8', avg: 16.8, median: 14.5, p90: 27.2 },
    ],
    dshb: { baseline: 42, target: 35, current: 38, progressPct: 57.1, quarter: 'Q1 2026' },
    avgVelocity: 83,
    avgCycleTime: 16.8,
  },
  CNG: {
    velocity: [
      { sprint: 'CNG 26-01', planned: 25, completed: 11, pct: 44 },
      { sprint: 'CNG 26-02', planned: 22, completed: 10, pct: 45 },
      { sprint: 'CNG 26-03', planned: 28, completed: 14, pct: 50 },
      { sprint: 'CNG 26-04', planned: 30, completed: 15, pct: 50 },
      { sprint: 'CNG 26-05', planned: 26, completed: 12, pct: 46 },
      { sprint: 'CNG 26-06', planned: 24, completed: 12, pct: 50 },
    ],
    cycleTime: [
      { week: 'W1', avg: 32.5, median: 28.5, p90: 48.5 },
      { week: 'W2', avg: 31.2, median: 27.2, p90: 46.2 },
      { week: 'W3', avg: 29.5, median: 25.8, p90: 44.5 },
      { week: 'W4', avg: 30.2, median: 26.5, p90: 45.8 },
      { week: 'W5', avg: 28.8, median: 25.2, p90: 43.8 },
      { week: 'W6', avg: 27.5, median: 24.2, p90: 42.5 },
      { week: 'W7', avg: 28.2, median: 24.8, p90: 43.2 },
      { week: 'W8', avg: 28.5, median: 25.0, p90: 43.5 },
    ],
    dshb: { baseline: 65, target: 55, current: 62, progressPct: 30.0, quarter: 'Q1 2026' },
    avgVelocity: 48,
    avgCycleTime: 28.5,
  },
};

// Generate default metrics for teams without specific data
const generateTeamMetrics = (teamKey, baseVelocity, baseCycleTime) => ({
  velocity: [
    { sprint: `${teamKey} 26-01`, planned: 35, completed: Math.round(35 * baseVelocity / 100), pct: baseVelocity - 5 },
    { sprint: `${teamKey} 26-02`, planned: 32, completed: Math.round(32 * baseVelocity / 100), pct: baseVelocity - 3 },
    { sprint: `${teamKey} 26-03`, planned: 38, completed: Math.round(38 * (baseVelocity + 5) / 100), pct: baseVelocity + 5 },
    { sprint: `${teamKey} 26-04`, planned: 36, completed: Math.round(36 * baseVelocity / 100), pct: baseVelocity },
    { sprint: `${teamKey} 26-05`, planned: 34, completed: Math.round(34 * (baseVelocity - 2) / 100), pct: baseVelocity - 2 },
    { sprint: `${teamKey} 26-06`, planned: 35, completed: Math.round(35 * baseVelocity / 100), pct: baseVelocity },
  ],
  cycleTime: [
    { week: 'W1', avg: baseCycleTime + 2, median: baseCycleTime - 1, p90: baseCycleTime + 12 },
    { week: 'W2', avg: baseCycleTime + 1.5, median: baseCycleTime - 1.5, p90: baseCycleTime + 11 },
    { week: 'W3', avg: baseCycleTime, median: baseCycleTime - 2, p90: baseCycleTime + 10 },
    { week: 'W4', avg: baseCycleTime + 1, median: baseCycleTime - 1.2, p90: baseCycleTime + 10.5 },
    { week: 'W5', avg: baseCycleTime - 0.5, median: baseCycleTime - 2.5, p90: baseCycleTime + 9 },
    { week: 'W6', avg: baseCycleTime - 1, median: baseCycleTime - 3, p90: baseCycleTime + 8 },
    { week: 'W7', avg: baseCycleTime - 0.5, median: baseCycleTime - 2.5, p90: baseCycleTime + 9 },
    { week: 'W8', avg: baseCycleTime, median: baseCycleTime - 2, p90: baseCycleTime + 10 },
  ],
  dshb: { baseline: 50, target: 42, current: 46, progressPct: 50.0, quarter: 'Q1 2026' },
  avgVelocity: baseVelocity,
  avgCycleTime: baseCycleTime,
});

// Fill in remaining teams
const summaryMap = Object.fromEntries(summaryData.map(s => [s.team, s]));
teams.forEach(team => {
  if (!teamMetrics[team.key]) {
    const summary = summaryMap[team.name];
    if (summary) {
      teamMetrics[team.key] = generateTeamMetrics(team.key, summary.velocity, summary.cycleTime);
    }
  }
});

// Helper to get team data
export const getTeamData = (teamKey) => {
  return teamMetrics[teamKey] || null;
};

// Helper functions
export const getTeamStatus = (velocity) => {
  if (velocity >= 60) return 'good';
  if (velocity >= 45) return 'warning';
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
