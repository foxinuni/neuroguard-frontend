import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import Card from "../ui/Card.jsx";
import { computeWeeklyCounts } from "../../lib/analytics.js";
import { useTheme } from "../../contexts/ThemeContext.jsx";

export default function CrisisTrendBar({ events }) {
  const { dark } = useTheme();
  const data = useMemo(() => computeWeeklyCounts(events, 4), [events]);

  if (!data.length) return null;

  const gridStroke    = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)";
  const tickFill      = dark ? "#93C5FD" : "#64748B";
  const axisStroke    = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";
  const tooltipBg     = dark ? "#0F172A" : "#FFFFFF";
  const tooltipColor  = dark ? "#E2E8F0" : "#1E293B";
  const tooltipBorder = dark ? "rgba(96,165,250,0.2)" : "rgba(0,0,0,0.12)";

  return (
    <Card>
      <h3 className="mb-3 text-sm font-bold text-brand-200 light:text-gray-700 flex items-center gap-2">
        <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        Crisis por Semana
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: tickFill }} axisLine={{ stroke: axisStroke }} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: tickFill }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 12, border: `1px solid ${tooltipBorder}`, boxShadow: "0 4px 24px rgba(0,0,0,0.5)", background: tooltipBg, color: tooltipColor }}
            formatter={(v, name) => [v, name === "total" ? "Total" : "Prolongadas"]}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]} name="total">
            {data.map((_, i) => (
              <Cell key={i} fill="#3B82F6" />
            ))}
          </Bar>
          <Bar dataKey="prolongadas" radius={[6, 6, 0, 0]} name="prolongadas">
            {data.map((_, i) => (
              <Cell key={i} fill="#EF4444" opacity={0.75} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex justify-center gap-4 text-xs text-brand-300/70 light:text-gray-500">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />Total</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-danger" />Prolongadas (&gt;120s)</span>
      </div>
    </Card>
  );
}
