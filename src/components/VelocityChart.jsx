import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.filter(p => p.dataKey !== 'target').map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value} SP
          </p>
        ))}
        {payload[0]?.payload?.pct && (
          <p className="text-sm text-zinc-400 mt-1">
            Completion: {payload[0].payload.pct}%
          </p>
        )}
        {payload[0]?.payload?.target && (
          <p className="text-sm text-yellow-500 mt-1">
            Target 60%: {payload[0].payload.target} SP
          </p>
        )}
      </div>
    );
  }
  return null;
};

const CustomLabel = (props) => {
  const { x, y, width, value, index, data } = props;
  const pct = data[index]?.pct;
  
  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill={pct >= 60 ? '#10b981' : pct >= 50 ? '#eab308' : '#ef4444'}
      textAnchor="middle"
      fontSize={12}
      fontWeight={600}
      fontFamily="JetBrains Mono, monospace"
    >
      {pct}%
    </text>
  );
};

export default function VelocityChart({ data }) {
  // Add 60% target for each sprint based on its planned SP
  const dataWithTarget = data.map(d => ({
    ...d,
    target: Math.round(d.planned * 0.6)
  }));

  return (
    <div className="glass rounded-xl p-5 animate-in delay-1">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">Velocity</h3>
          <p className="text-sm text-zinc-500 font-light">Последние 6 спринтов • Цель: 60%+</p>
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
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={dataWithTarget} barGap={4}>
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
            label={{ value: 'Story Points', angle: -90, position: 'insideLeft', fill: '#71717a', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Bar dataKey="planned" fill="#3f3f46" radius={[4, 4, 0, 0]} name="Planned" />
          <Bar dataKey="completed" radius={[4, 4, 0, 0]} name="Completed">
            {dataWithTarget.map((entry, index) => (
              <Cell key={index} fill={entry.pct >= 60 ? '#10b981' : entry.pct >= 50 ? '#eab308' : '#ef4444'} />
            ))}
            <LabelList content={<CustomLabel data={dataWithTarget} />} />
          </Bar>
          
          {/* Stepped target line at 60% of each sprint's planned SP */}
          <Line 
            type="stepAfter"
            dataKey="target" 
            stroke="#eab308" 
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ fill: '#eab308', r: 4, strokeWidth: 0 }}
            name="Target 60%"
            legendType="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
