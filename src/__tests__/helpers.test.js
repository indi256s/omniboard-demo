import { describe, it, expect } from 'vitest';
import { 
  getTeamStatus, 
  getStatusColor, 
  getStatusLabel,
  teams,
  platforms,
  velocityData,
  cycleTimeData,
  dshbData,
  summaryData
} from '../data/mockData';

describe('Data Helper Functions', () => {
  describe('getTeamStatus', () => {
    it('returns "good" for velocity >= 75', () => {
      expect(getTeamStatus(75)).toBe('good');
      expect(getTeamStatus(100)).toBe('good');
      expect(getTeamStatus(85)).toBe('good');
    });

    it('returns "warning" for velocity 60-74', () => {
      expect(getTeamStatus(60)).toBe('warning');
      expect(getTeamStatus(74)).toBe('warning');
      expect(getTeamStatus(67)).toBe('warning');
    });

    it('returns "critical" for velocity < 60', () => {
      expect(getTeamStatus(59)).toBe('critical');
      expect(getTeamStatus(0)).toBe('critical');
      expect(getTeamStatus(30)).toBe('critical');
    });

    it('handles edge cases', () => {
      expect(getTeamStatus(74.9)).toBe('warning');
      expect(getTeamStatus(59.9)).toBe('critical');
    });
  });

  describe('getStatusColor', () => {
    it('returns correct colors for each status', () => {
      expect(getStatusColor('good')).toContain('green');
      expect(getStatusColor('warning')).toContain('yellow');
      expect(getStatusColor('critical')).toContain('red');
    });

    it('returns zinc for unknown status', () => {
      expect(getStatusColor('unknown')).toContain('zinc');
      expect(getStatusColor('')).toContain('zinc');
    });
  });

  describe('getStatusLabel', () => {
    it('returns correct labels', () => {
      expect(getStatusLabel('good')).toBe('On Track');
      expect(getStatusLabel('warning')).toBe('At Risk');
      expect(getStatusLabel('critical')).toBe('Critical');
    });

    it('returns "Unknown" for invalid status', () => {
      expect(getStatusLabel('invalid')).toBe('Unknown');
      expect(getStatusLabel('')).toBe('Unknown');
    });
  });
});

describe('Mock Data Integrity', () => {
  describe('teams', () => {
    it('has correct structure', () => {
      expect(teams.length).toBeGreaterThan(0);
      teams.forEach(team => {
        expect(team).toHaveProperty('id');
        expect(team).toHaveProperty('name');
        expect(team).toHaveProperty('platform');
        expect(team).toHaveProperty('key');
      });
    });

    it('has unique ids and keys', () => {
      const ids = teams.map(t => t.id);
      const keys = teams.map(t => t.key);
      expect(new Set(ids).size).toBe(ids.length);
      expect(new Set(keys).size).toBe(keys.length);
    });

    it('all platforms are valid', () => {
      const validPlatforms = platforms.filter(p => p !== 'Все');
      teams.forEach(team => {
        expect(validPlatforms).toContain(team.platform);
      });
    });
  });

  describe('velocityData', () => {
    it('has valid sprint data', () => {
      expect(velocityData.length).toBeGreaterThan(0);
      velocityData.forEach(sprint => {
        expect(sprint).toHaveProperty('sprint');
        expect(sprint).toHaveProperty('planned');
        expect(sprint).toHaveProperty('completed');
        expect(sprint).toHaveProperty('pct');
        expect(sprint.completed).toBeLessThanOrEqual(sprint.planned);
        expect(sprint.pct).toBeGreaterThanOrEqual(0);
        expect(sprint.pct).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('cycleTimeData', () => {
    it('has valid cycle time metrics', () => {
      expect(cycleTimeData.length).toBeGreaterThan(0);
      cycleTimeData.forEach(week => {
        expect(week).toHaveProperty('week');
        expect(week).toHaveProperty('avg');
        expect(week).toHaveProperty('median');
        expect(week).toHaveProperty('p90');
        expect(week.median).toBeLessThanOrEqual(week.avg);
        expect(week.avg).toBeLessThanOrEqual(week.p90);
      });
    });
  });

  describe('dshbData', () => {
    it('has valid DSHB structure', () => {
      expect(dshbData).toHaveProperty('baseline');
      expect(dshbData).toHaveProperty('target');
      expect(dshbData).toHaveProperty('current');
      expect(dshbData).toHaveProperty('progressPct');
      expect(dshbData).toHaveProperty('quarter');
      expect(dshbData.target).toBeLessThanOrEqual(dshbData.baseline);
    });
  });

  describe('summaryData', () => {
    it('has valid team summaries', () => {
      expect(summaryData.length).toBe(teams.length);
      summaryData.forEach(summary => {
        expect(summary).toHaveProperty('team');
        expect(summary).toHaveProperty('velocity');
        expect(summary).toHaveProperty('cycleTime');
        expect(summary).toHaveProperty('dshb');
        expect(summary).toHaveProperty('trend');
        expect(summary).toHaveProperty('status');
        expect(['up', 'down', 'stable']).toContain(summary.trend);
        expect(['good', 'warning', 'critical']).toContain(summary.status);
      });
    });
  });
});
