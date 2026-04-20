import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../ui/Card.jsx";
import { nightDayDistribution } from "../../lib/analytics.js";
import { useTheme } from "../../contexts/ThemeContext.jsx";

const COLORS = ["#6366F1", "#FBBF24"];

export default function CrisisDistributionPie({ events }) {
  const { dark } = useTheme();
  const dist = useMemo(() => nightDayDistribution(events), [events]);
  const data = useMemo(() => [
    { name: "Nocturnas", value: dist.nocturnas },
    { name: "Diurnas",   value: dist.diurnas },
  ], [dist]);

  const total = dist.nocturnas + dist.diurnas;
  if (total === 0) return null;

  const tooltipBg     = dark ? "#0F172A" : "#FFFFFF";
  const tooltipColor  = dark ? "#E2E8F0" : "#1E293B";
  const tooltipBorder = dark ? "rgba(96,165,250,0.2)" : "rgba(0,0,0,0.12)";

  return (
    <Card>
      <h3 className="mb-3 text-sm font-bold text-brand-200 light:text-gray-700 flex items-center gap-2">
        <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        Distribución Nocturna / Diurna
      </h3>
      <div className="flex items-center">
        <ResponsiveContainer width="55%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={55} outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 12, border: `1px solid ${tooltipBorder}`, boxShadow: "0 4px 24px rgba(0,0,0,0.5)", background: tooltipBg, color: tooltipColor }}
              formatter={(v) => [v, "Crisis"]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-3 pl-2">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-indigo-500" />
            <div>
              <p className="text-sm font-bold text-white light:text-gray-900">{dist.pctNocturnas}%</p>
              <p className="text-xs text-brand-300/70 light:text-gray-500">Nocturnas ({dist.nocturnas})</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <div>
              <p className="text-sm font-bold text-white light:text-gray-900">{dist.pctDiurnas}%</p>
              <p className="text-xs text-brand-300/70 light:text-gray-500">Diurnas ({dist.diurnas})</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
