# Омниборд v2.0 — Delivery Metrics Dashboard

**Production-ready React dashboard for tracking engineering delivery metrics.**

![Version](https://img.shields.io/badge/version-2.0-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Vite](https://img.shields.io/badge/Vite-5-646cff)

---

## 🚀 What's New in v2.0

### ✅ P0 Fixes (Must-Have)
- **Collapsible Sidebar** — Reclaim 30% viewport width. Toggle between 256px → 64px
- **Functional Search** — Filter teams by name or key in real-time
- **Empty States** — Graceful handling when filters return no results
- **Hero Metric Layout** — Velocity takes center stage, not buried in equal cards
- **Status Indicators** — Red/Yellow/Green badges on every metric card
- **Persistent State** — Team selection survives refresh (localStorage + URL routing)

### ✅ P1 Improvements (High Impact)
- **Proper Build System** — Migrated from CDN-based React to Vite
- **URL Routing** — Direct links to teams: `/team/DISRUPT`
- **Responsive Design** — Works on mobile, tablet, desktop
- **Real Data Layer** — Extracted mock data to `src/data/mockData.js` (ready for API)

### ✅ P2 Polish
- **Softer Visual Design** — Reduced gradient mesh opacity, lighter borders
- **Typography Hierarchy** — Light labels (400), medium headers (500), bold values (700)
- **Improved Glassmorphism** — Subtle `rgba(255,255,255,0.06)` borders instead of zinc grays
- **Loading States** — Charts show tooltips, empty states, error handling

---

## 📦 Tech Stack

- **React 18** — Modern hooks, strict mode
- **Vite 5** — Lightning-fast dev server, HMR
- **Tailwind CSS 3** — Utility-first styling
- **Recharts 2** — Data visualization
- **React Router 6** — Client-side routing

---

## 🛠 Installation

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
omniboard-v2/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Collapsible navigation
│   │   ├── Header.jsx            # Page header with live timestamp
│   │   ├── StatCard.jsx          # Metric cards with status badges
│   │   ├── VelocityChart.jsx     # Sprint velocity bar chart
│   │   ├── CycleTimeChart.jsx    # Cycle time area chart
│   │   ├── DshbWidget.jsx        # Bug reduction progress widget
│   │   └── SummaryTable.jsx      # Team comparison table
│   ├── pages/
│   │   └── Dashboard.jsx         # Main dashboard page
│   ├── data/
│   │   └── mockData.js           # Mock data + helpers
│   ├── App.jsx                   # Router setup
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles + Tailwind
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎨 Design System

### Colors
```css
--bg-primary: #0a0a0b       /* Main background */
--bg-secondary: #111113     /* Cards, sidebar */
--bg-tertiary: #18181b      /* Hover states */
--border: rgba(255,255,255,0.06)  /* Subtle borders */

--accent-green: #10b981     /* Success, good metrics */
--accent-red: #ef4444       /* Critical, alerts */
--accent-yellow: #eab308    /* Warnings */
--accent-blue: #3b82f6      /* Info, data viz */
--accent-purple: #a855f7    /* Secondary data viz */
```

### Typography
- **Body:** Inter (300/400/500/600/700)
- **Data/Code:** JetBrains Mono (400/500/600/700)

### Spacing
- Base unit: **4px** (Tailwind default)
- Cards: **20px** padding (`p-5`)
- Gaps: **16px** (`gap-4`), **24px** (`gap-6`)

---

## 🔌 Data Integration

Currently uses mock data from `src/data/mockData.js`.

**To connect real API:**

1. Replace mock data with fetch calls:
```jsx
// src/hooks/useTeams.js
import { useEffect, useState } from 'react';

export function useTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/teams')
      .then(res => res.json())
      .then(setTeams)
      .finally(() => setLoading(false));
  }, []);
  
  return { teams, loading };
}
```

2. Update components to use hooks instead of imports.

3. Add error boundaries and loading skeletons.

**Recommended:** Use [React Query](https://tanstack.com/query) or [SWR](https://swr.vercel.app/) for data fetching.

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm i -g serve
CMD ["serve", "-s", "dist", "-p", "3000"]
```

### Static Hosting (Netlify, Cloudflare Pages, etc.)
```bash
npm run build
# Upload /dist folder
```

---

## 📱 Responsive Breakpoints

- **Desktop:** > 1024px — Full sidebar + 3-column layout
- **Tablet:** 768px - 1024px — Collapsible sidebar + 2-column layout
- **Mobile:** < 768px — Hidden sidebar + 1-column layout

---

## 🎯 Key Features

### 1. **Collapsible Sidebar**
- **Default:** 256px wide
- **Collapsed:** 64px icon bar
- **Persists:** Remembers state in localStorage
- **Mobile:** Auto-collapses on narrow screens

### 2. **Status System**
- **Good:** Velocity ≥ 75% (green)
- **Warning:** Velocity 60-74% (yellow)
- **Critical:** Velocity < 60% (red)

### 3. **URL Routing**
- `/` → Redirects to `/team/DISRUPT`
- `/team/:teamKey` → Direct link to team dashboard
- **Bookmarkable** — Share links to specific teams

### 4. **Persistent State**
```js
localStorage.setItem('selectedPlatform', 'Web');
localStorage.setItem('selectedTeamId', 2);
localStorage.setItem('sidebarCollapsed', true);
```

---

## 🐛 Known Issues & Roadmap

### Known Issues
- [ ] No dark/light mode toggle (dark-only for now)
- [ ] Charts don't support RTL languages
- [ ] No keyboard shortcuts for navigation

### Roadmap
- [ ] Add real-time WebSocket updates
- [ ] Export charts as PNG/PDF
- [ ] Team comparison mode (side-by-side)
- [ ] Custom date range selector
- [ ] Notification system for threshold breaches
- [ ] Mobile app (React Native)

---

## 🧪 Testing

```bash
# Run unit tests (TODO: Add Vitest)
npm run test

# Run E2E tests (TODO: Add Playwright)
npm run test:e2e

# Lint
npm run lint
```

---

## 📄 License

MIT

---

## 🙏 Credits

**Built by:** Serj's team  
**Design Review:** Claude Code + interface-design skill  
**Framework:** React + Vite  
**Charts:** Recharts  

---

## 📞 Support

Questions? Issues? Improvements?

- **GitHub Issues:** (coming soon)
- **Slack:** #omniboard-support
- **Email:** team@example.com

---

**v2.0** — Shipped 2026-01-29 🚀
# Trigger rebuild

