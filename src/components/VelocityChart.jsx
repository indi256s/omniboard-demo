import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value} SP
          </p>
        ))}
        {payload[0]?.payload?.pct && (
          <p className="text-sm text-zinc-400 mt-1">
            Completion: {payload[0].payload.pct}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function VelocityChart({ data }) {
  return (
    <div className="glass rounded-xl p-5 animate-in delay-1">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">Velocity</h3>
          <p className="text-sm text-zinc-500 font-light">Последние 6 спринтов</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-zinc-400">Completed SP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-zinc-700"></div>
            <span className="text-zinc-400">Planned SP</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis 
            dataKey="sprint" 
            tick={{ fill: '#71717a', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            tick={{ fill: '#71717a', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={73} 
            stroke="#eab308" 
            strokeDasharray="5 5" 
            label={{ 
              value: 'Target 73%', 
              fill: '#eab308', 
              fontSize: 11,
              position: 'right'
            }} 
          />
          <Bar dataKey="planned" fill="#3f3f46" radius={[4, 4, 0, 0]} name="Planned" />
          <Bar dataKey="completed" radius={[4, 4, 0, 0]} name="Completed">
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.pct >= 73 ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((d, i) => (
          <div key={i} className="text-center">
            <div className={`text-xs font-medium mono ${
              d.pct >= 73 ? 'text-green-400' : 'text-red-400'
            }`}>
              {d.pct}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
