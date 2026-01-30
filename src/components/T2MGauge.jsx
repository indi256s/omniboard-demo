import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function T2MGauge({ current, target, max = 30 }) {
  // Calculate percentage for the gauge (inverted - lower is better)
  const percentage = Math.min((current / max) * 100, 100);
  const targetPct = (target / max) * 100;
  
  // Determine color based on performance
  const getColor = () => {
    if (current <= target) return '#10b981'; // Green - on/under target
    if (current <= target * 1.25) return '#eab308'; // Yellow - slightly over
    return '#ef4444'; // Red - significantly over
  };
  
  const data = [
    { value: percentage },
    { value: 100 - percentage }
  ];
  
  return (
    <div className="relative w-48 h-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Background arc */}
          <Pie
            data={[{ value: 100 }]}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            stroke="none"
          >
            <Cell fill="rgba(255,255,255,0.05)" />
          </Pie>
          
          {/* Target marker */}
          <Pie
            data={[
              { value: targetPct },
              { value: 100 - targetPct }
            ]}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={55}
            outerRadius={58}
            dataKey="value"
            stroke="none"
          >
            <Cell fill="rgba(255,255,255,0.2)" />
            <Cell fill="transparent" />
          </Pie>
          
          {/* Value arc */}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={getColor()} />
            <Cell fill="transparent" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
        <span className="text-3xl font-bold mono">{current}</span>
        <span className="text-sm text-zinc-500">days</span>
      </div>
      
      {/* Labels */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-zinc-600">
        <span>0</span>
        <span className="text-zinc-500">Target: {target}d</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
