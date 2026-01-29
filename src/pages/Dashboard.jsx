import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import VelocityChart from '../components/VelocityChart';
import CycleTimeChart from '../components/CycleTimeChart';
import DshbWidget from '../components/DshbWidget';
import SummaryTable from '../components/SummaryTable';
import {
  teams,
  velocityData,
  cycleTimeData,
  dshbData,
  summaryData,
  getTeamStatus,
} from '../data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { teamKey } = useParams();
  
  const [selectedPlatform, setSelectedPlatform] = useState(
    localStorage.getItem('selectedPlatform') || 'Все'
  );
  const [selectedTeam, setSelectedTeam] = useState(() => {
    if (teamKey) {
      return teams.find(t => t.key === teamKey) || teams[1];
    }
    const savedTeamId = localStorage.getItem('selectedTeamId');
    return teams.find(t => t.id === Number(savedTeamId)) || teams[1];
  });
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );

  // Persist selections
  useEffect(() => {
    localStorage.setItem('selectedPlatform', selectedPlatform);
  }, [selectedPlatform]);

  useEffect(() => {
    if (selectedTeam) {
      localStorage.setItem('selectedTeamId', selectedTeam.id);
      navigate(`/team/${selectedTeam.key}`, { replace: true });
    }
  }, [selectedTeam, navigate]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed);
  }, [collapsed]);

  // Calculate metrics
  const avgVelocity = Math.round(
    velocityData.reduce((a, b) => a + b.pct, 0) / velocityData.length
  );
  const avgCycleTime = (
    cycleTimeData.reduce((a, b) => a + b.avg, 0) / cycleTimeData.length
  ).toFixed(1);
  
  const currentVelocity = velocityData[velocityData.length - 1]?.pct || 0;
  const prevVelocity = velocityData[velocityData.length - 2]?.pct || 0;
  const velocityTrend = currentVelocity - prevVelocity;
  
  const currentCycleTime = cycleTimeData[cycleTimeData.length - 1]?.avg || 0;
  const prevCycleTime = cycleTimeData[cycleTimeData.length - 2]?.avg || 0;
  const cycleTimeTrend = -Math.round(((currentCycleTime - prevCycleTime) / prevCycleTime) * 100);

  const velocityStatus = getTeamStatus(avgVelocity);

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

      <main
        className={`flex-1 p-8 transition-all duration-300 ${
          collapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Header selectedTeam={selectedTeam} />

        {/* Hero Stat */}
        <div className="mb-6">
          <StatCard
            title="Average Velocity"
            value={`${avgVelocity}%`}
            subtitle={`Target: 60% • Last Sprint: ${currentVelocity}%`}
            trend={velocityTrend}
            status={velocityStatus}
            alert={
              avgVelocity < 60
                ? 'Velocity below target. Review sprint planning.'
                : undefined
            }
            color="green"
            size="hero"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Avg Cycle Time"
            value={`${avgCycleTime}d`}
            subtitle="Median: 2.0d"
            trend={cycleTimeTrend}
            color="blue"
          />
          <StatCard
            title="ДШБ Progress"
            value={`${dshbData.progressPct}%`}
            subtitle={`${dshbData.current} / ${dshbData.target} багов`}
            color="purple"
          />
          <StatCard
            title="Active Teams"
            value={teams.length}
            subtitle="активных"
            color="blue"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <VelocityChart data={velocityData} />
          <CycleTimeChart data={cycleTimeData} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-3 gap-6">
          <DshbWidget data={dshbData} />
          <div className="col-span-2">
            <SummaryTable data={summaryData} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-zinc-800/50 text-center text-xs text-zinc-600">
          <span className="mono">ОМНИБОРД v2.0</span> • Delivery Metrics Dashboard •
          <span className="text-green-500 ml-1">● Live</span>
        </footer>
      </main>
    </div>
  );
}
