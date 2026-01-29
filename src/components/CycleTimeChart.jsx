import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}d
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CycleTimeChart({ data }) {
  return (
    <div className="glass rounded-xl p-5 animate-in delay-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">Cycle Time</h3>
          <p className="text-sm text-zinc-500 font-light">Последние 8 недель (дни)</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-500"></div>
            <span className="text-zinc-400">P90</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-zinc-400">Медиана</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-zinc-400">Среднее</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorP90" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis 
            dataKey="week" 
            tick={{ fill: '#71717a', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            tick={{ fill: '#71717a', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
            domain={[0, 8]} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="p90" 
            stroke="#a855f7" 
            fill="url(#colorP90)" 
            strokeWidth={2}
            name="P90"
          />
          <Line 
            type="monotone" 
            dataKey="median" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
            name="Медиана"
          />
          <Line 
            type="monotone" 
            dataKey="avg" 
            stroke="#10b981" 
            strokeWidth={2} 
            dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
            name="Среднее"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
