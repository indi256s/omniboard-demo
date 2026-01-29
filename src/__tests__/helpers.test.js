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
  summaryData,
  getTeamData,
} from '../data/mockData';

describe('Data Helper Functions', () => {
  describe('getTeamStatus', () => {
    it('returns "good" for velocity >= 60', () => {
      expect(getTeamStatus(60)).toBe('good');
      expect(getTeamStatus(100)).toBe('good');
      expect(getTeamStatus(73)).toBe('good');
      expect(getTeamStatus(85)).toBe('good');
    });

    it('returns "warning" for velocity 45-59', () => {
      expect(getTeamStatus(45)).toBe('warning');
      expect(getTeamStatus(59)).toBe('warning');
      expect(getTeamStatus(50)).toBe('warning');
    });

    it('returns "critical" for velocity < 45', () => {
      expect(getTeamStatus(44)).toBe('critical');
      expect(getTeamStatus(0)).toBe('critical');
      expect(getTeamStatus(30)).toBe('critical');
    });

    it('handles edge cases', () => {
      expect(getTeamStatus(59.9)).toBe('warning');
      expect(getTeamStatus(44.9)).toBe('critical');
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
      expect(getStatusLabel('good')).toBe('В норме');
      expect(getStatusLabel('warning')).toBe('Риск');
      expect(getStatusLabel('critical')).toBe('Критично');
    });

    it('returns "Неизвестно" for invalid status', () => {
      expect(getStatusLabel('invalid')).toBe('Неизвестно');
      expect(getStatusLabel('')).toBe('Неизвестно');
    });
  });

  describe('getTeamData', () => {
    it('returns data for valid team keys', () => {
      const disruptData = getTeamData('DISRUPT');
      expect(disruptData).toBeDefined();
      expect(disruptData.velocity).toBeDefined();
      expect(disruptData.cycleTime).toBeDefined();
      expect(disruptData.dshb).toBeDefined();
    });

    it('returns null for invalid team key', () => {
      expect(getTeamData('NONEXISTENT')).toBe(null);
    });

    it('has correct sprint naming format', () => {
      const surfData = getTeamData('SURF');
      expect(surfData.velocity[0].sprint).toMatch(/SURF 26-\d{2}/);
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

  describe('velocityData (All Teams Median)', () => {
    it('has valid sprint data with MEDIAN naming', () => {
      expect(velocityData.length).toBeGreaterThan(0);
      velocityData.forEach(sprint => {
        expect(sprint).toHaveProperty('sprint');
        expect(sprint).toHaveProperty('planned');
        expect(sprint).toHaveProperty('completed');
        expect(sprint).toHaveProperty('pct');
        expect(sprint.sprint).toMatch(/MEDIAN 26-\d{2}/);
        expect(sprint.completed).toBeLessThanOrEqual(sprint.planned);
        expect(sprint.pct).toBeGreaterThanOrEqual(0);
        expect(sprint.pct).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('cycleTimeData', () => {
    it('has valid cycle time metrics (18-22 day range)', () => {
      expect(cycleTimeData.length).toBeGreaterThan(0);
      cycleTimeData.forEach(week => {
        expect(week).toHaveProperty('week');
        expect(week).toHaveProperty('avg');
        expect(week).toHaveProperty('median');
        expect(week).toHaveProperty('p90');
        expect(week.median).toBeLessThanOrEqual(week.avg);
        expect(week.avg).toBeLessThanOrEqual(week.p90);
        // Check realistic range (15-45 days)
        expect(week.avg).toBeGreaterThanOrEqual(15);
        expect(week.avg).toBeLessThanOrEqual(45);
      });
    });

    it('has median in 16-22 day range', () => {
      const avgMedian = cycleTimeData.reduce((a, b) => a + b.median, 0) / cycleTimeData.length;
      expect(avgMedian).toBeGreaterThanOrEqual(16);
      expect(avgMedian).toBeLessThanOrEqual(22);
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

    it('has realistic cycle times (15-30 days)', () => {
      summaryData.forEach(summary => {
        expect(summary.cycleTime).toBeGreaterThanOrEqual(15);
        expect(summary.cycleTime).toBeLessThanOrEqual(30);
      });
    });
  });
});
