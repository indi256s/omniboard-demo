import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function OwnershipRing({ rate, baseline }) {
  const data = [
    { value: rate },
    { value: 100 - rate }
  ];
  
  // Color based on performance vs baseline
  const getColor = () => {
    if (rate >= baseline + 5) return '#10b981'; // Green - significantly above
    if (rate >= baseline) return '#06b6d4'; // Cyan - at or above baseline
    if (rate >= baseline - 5) return '#eab308'; // Yellow - slightly below
    return '#ef4444'; // Red - significantly below
  };
  
  return (
    <div className="relative w-32 h-32">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Background */}
          <Pie
            data={[{ value: 100 }]}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={55}
            dataKey="value"
            stroke="none"
          >
            <Cell fill="rgba(255,255,255,0.05)" />
          </Pie>
          
          {/* Baseline marker (dashed effect via multiple thin segments) */}
          <Pie
            data={[
              { value: baseline },
              { value: 100 - baseline }
            ]}
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={60}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill="rgba(255,255,255,0.3)" />
            <Cell fill="transparent" />
          </Pie>
          
          {/* Value ring */}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={55}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={getColor()} />
            <Cell fill="transparent" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold mono">{rate}%</span>
      </div>
    </div>
  );
}
