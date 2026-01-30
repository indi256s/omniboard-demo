import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}{entry.name === 'T2M' ? ' days' : '%'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DisruptTrendChart({ sprints }) {
  // Transform data for dual Y-axis chart
  const chartData = sprints.map(s => ({
    sprint: s.name.replace('MEDIAN ', ''),
    t2m: s.t2m,
    waitRatio: s.waitRatio,
    ownership: s.ownership
  }));
  
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis 
          dataKey="sprint" 
          tick={{ fill: '#71717a', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          yAxisId="left"
          tick={{ fill: '#71717a', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          label={{ value: 'Days', angle: -90, position: 'insideLeft', fill: '#71717a', fontSize: 11 }}
          domain={[0, 'auto']}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          tick={{ fill: '#71717a', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          label={{ value: '%', angle: 90, position: 'insideRight', fill: '#71717a', fontSize: 11 }}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: '10px' }}
          formatter={(value) => <span className="text-zinc-400 text-sm">{value}</span>}
        />
        
        {/* T2M as bars */}
        <Bar 
          yAxisId="left"
          dataKey="t2m" 
          name="T2M"
          fill="#f59e0b"
          radius={[4, 4, 0, 0]}
          barSize={24}
        />
        
        {/* Wait Ratio as line */}
        <Line 
          yAxisId="right"
          type="monotone"
          dataKey="waitRatio"
          name="Wait Ratio"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ fill: '#ef4444', r: 4 }}
        />
        
        {/* Ownership as line */}
        <Line 
          yAxisId="right"
          type="monotone"
          dataKey="ownership"
          name="Ownership"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
