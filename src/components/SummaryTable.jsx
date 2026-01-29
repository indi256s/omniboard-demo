import { getStatusColor, getStatusLabel } from '../data/mockData';

export default function SummaryTable({ data }) {
  return (
    <div className="glass rounded-xl p-5 animate-in delay-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">Сводка по командам</h3>
          <p className="text-sm text-zinc-500 font-light">Все команды</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-zinc-500 uppercase tracking-wider">
              <th className="text-left py-3 px-2 font-medium">Команда</th>
              <th className="text-right py-3 px-2 font-medium">Velocity</th>
              <th className="text-right py-3 px-2 font-medium">Cycle Time</th>
              <th className="text-right py-3 px-2 font-medium">ДШБ</th>
              <th className="text-right py-3 px-2 font-medium">Trend</th>
              <th className="text-right py-3 px-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr 
                key={i} 
                className="border-t border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
              >
                <td className="py-3 px-2 font-normal text-white">{row.team}</td>
                <td className="text-right py-3 px-2">
                  <span className={`mono ${
                    row.velocity >= 75 ? 'text-green-400' : 
                    row.velocity >= 60 ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {row.velocity}%
                  </span>
                </td>
                <td className="text-right py-3 px-2">
                  <span className="mono text-blue-400">{row.cycleTime}d</span>
                </td>
                <td className="text-right py-3 px-2">
                  <span className="mono text-green-400">{row.dshb}%</span>
                </td>
                <td className="text-right py-3 px-2">
                  <span className={`text-lg ${
                    row.trend === 'up' ? 'text-green-400' : 
                    row.trend === 'down' ? 'text-red-400' : 
                    'text-zinc-500'
                  }`}>
                    {row.trend === 'up' ? '↗' : row.trend === 'down' ? '↘' : '→'}
                  </span>
                </td>
                <td className="text-right py-3 px-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-medium border ${
                    getStatusColor(row.status)
                  }`}>
                    {getStatusLabel(row.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
