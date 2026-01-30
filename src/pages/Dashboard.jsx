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
  getTeamData,
} from '../data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { teamKey } = useParams();
  
  const [selectedPlatform, setSelectedPlatform] = useState(
    localStorage.getItem('selectedPlatform') || 'Все'
  );
  const [selectedTeam, setSelectedTeam] = useState(() => {
    if (teamKey) {
      return teams.find(t => t.key === teamKey) || null;
    }
    const savedTeamId = localStorage.getItem('selectedTeamId');
    if (savedTeamId) {
      return teams.find(t => t.id === Number(savedTeamId)) || null;
    }
    return null; // No team selected = All teams view
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
    } else {
      localStorage.removeItem('selectedTeamId');
      navigate('/team/ALL', { replace: true });
    }
  }, [selectedTeam, navigate]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed);
  }, [collapsed]);

  // Get team-specific data or default (all teams)
  const teamData = selectedTeam ? getTeamData(selectedTeam.key) : null;
  
  const activeVelocityData = teamData?.velocity || velocityData;
  const activeCycleTimeData = teamData?.cycleTime || cycleTimeData;
  const activeDshbData = teamData?.dshb || dshbData;

  // Calculate metrics
  const avgVelocity = teamData?.avgVelocity || Math.round(
    activeVelocityData.reduce((a, b) => a + b.pct, 0) / activeVelocityData.length
  );
  const avgCycleTime = teamData?.avgCycleTime || Number(
    (activeCycleTimeData.reduce((a, b) => a + b.avg, 0) / activeCycleTimeData.length).toFixed(1)
  );
  const medianCycleTime = Number(
    (activeCycleTimeData.reduce((a, b) => a + b.median, 0) / activeCycleTimeData.length).toFixed(1)
  );
  
  const currentVelocity = activeVelocityData[activeVelocityData.length - 1]?.pct || 0;
  const prevVelocity = activeVelocityData[activeVelocityData.length - 2]?.pct || 0;
  const velocityTrend = currentVelocity - prevVelocity;
  
  const currentCycleTime = activeCycleTimeData[activeCycleTimeData.length - 1]?.avg || 0;
  const prevCycleTime = activeCycleTimeData[activeCycleTimeData.length - 2]?.avg || 0;
  const cycleTimeTrend = -Math.round(((currentCycleTime - prevCycleTime) / prevCycleTime) * 100);

  const velocityStatus = getTeamStatus(avgVelocity);

  // Filter summary data by platform if needed
  const filteredSummaryData = selectedPlatform === 'Все' 
    ? summaryData 
    : summaryData.filter(s => {
        const team = teams.find(t => t.name === s.team);
        return team?.platform === selectedPlatform;
      });

  const displayTitle = selectedTeam ? selectedTeam.name : 'All Teams (Median)';

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
            title={`Average Velocity${selectedTeam ? '' : ' (Median)'}`}
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
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            title="Avg Cycle Time"
            value={`${avgCycleTime}d`}
            subtitle={`Median: ${medianCycleTime}d`}
            trend={cycleTimeTrend}
            color="blue"
          />
          <StatCard
            title="ДШБ Progress"
            value={`${activeDshbData.progressPct}%`}
            subtitle={`${activeDshbData.current} / ${activeDshbData.target} багов`}
            color="purple"
          />
        </div>

        {/* Velocity Chart - Full Width */}
        <div className="mb-6">
          <VelocityChart data={activeVelocityData} />
        </div>

        {/* Cycle Time Chart - Full Width */}
        <div className="mb-6">
          <CycleTimeChart data={activeCycleTimeData} />
        </div>

        {/* ДШБ Widget - Full Width */}
        <div className="mb-6">
          <DshbWidget data={activeDshbData} />
        </div>

        {/* Summary Table - Full Width */}
        <div className="mb-6">
          <SummaryTable data={filteredSummaryData} />
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
