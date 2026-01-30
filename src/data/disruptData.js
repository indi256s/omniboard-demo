// Disrupt Team Metrics - Demo Dataset
export const disruptMetrics = {
  team: 'DISRUPT',
  teamName: 'Disrupt',
  period: 'MEDIAN 26-06',
  
  // T2M - Time to Market (days from dev start to release)
  t2m: {
    current: 14,           // days
    previous: 18,          // last sprint
    target: 12,            // team goal
    trend: [22, 19, 18, 16, 18, 14], // last 6 sprints
    breakdown: {
      development: 8,      // days coding
      review: 2,           // days in PR review
      qa: 3,               // days in QA
      release: 1           // days deploy pipeline
    }
  },
  
  // Wait Time Ratio (% of time blocked by dependencies)
  waitTime: {
    ratio: 18,             // 18% of dev time waiting
    previous: 24,          // last sprint
    target: 15,            // goal
    trend: [32, 28, 25, 22, 24, 18],
    bySource: [
      { team: 'Backend', pct: 8, hours: 24, color: '#ef4444' },
      { team: 'Design', pct: 5, hours: 15, color: '#f97316' },
      { team: 'DevOps', pct: 3, hours: 9, color: '#eab308' },
      { team: 'Legal', pct: 2, hours: 6, color: '#8b5cf6' }
    ]
  },
  
  // Solution Ownership Rate (% finding alternatives)
  ownership: {
    rate: 87,              // 87% found alternatives
    baseline: 80,          // company standard
    delta: 7,              // +7% above baseline
    trend: [75, 78, 82, 80, 84, 87],
    examples: [
      { 
        constraint: 'Backend API delayed 5 days', 
        solution: 'Client-side caching + optimistic UI', 
        type: 'cache',
        impact: 'Shipped on time'
      },
      { 
        constraint: 'Design specs not finalized', 
        solution: 'Placeholder UI + feature flag', 
        type: 'flag',
        impact: 'Unblocked 3 devs'
      },
      { 
        constraint: 'Third-party API rate limit', 
        solution: 'Request batching + local queue', 
        type: 'optimization',
        impact: 'Reduced calls 80%'
      },
      { 
        constraint: 'Legacy service migration blocked', 
        solution: 'Graceful degradation path', 
        type: 'degradation',
        impact: 'Zero downtime'
      }
    ]
  },
  
  // Historical data for charts
  sprints: [
    { name: 'MEDIAN 26-01', t2m: 22, waitRatio: 32, ownership: 75 },
    { name: 'MEDIAN 26-02', t2m: 19, waitRatio: 28, ownership: 78 },
    { name: 'MEDIAN 26-03', t2m: 18, waitRatio: 25, ownership: 82 },
    { name: 'MEDIAN 26-04', t2m: 16, waitRatio: 22, ownership: 80 },
    { name: 'MEDIAN 26-05', t2m: 18, waitRatio: 24, ownership: 84 },
    { name: 'MEDIAN 26-06', t2m: 14, waitRatio: 18, ownership: 87 }
  ]
};

// Solution type badges config
export const solutionTypes = {
  cache: { label: 'Caching', color: '#06b6d4', icon: '💾' },
  flag: { label: 'Feature Flag', color: '#8b5cf6', icon: '🚩' },
  optimization: { label: 'Optimization', color: '#10b981', icon: '⚡' },
  degradation: { label: 'Degradation', color: '#f59e0b', icon: '📉' },
  prerender: { label: 'Pre-render', color: '#3b82f6', icon: '🖼️' }
};
