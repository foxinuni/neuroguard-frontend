import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "../ui/Card.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx";

const CHARTS = [
  { key: "hr",       label: "Frecuencia Cardíaca", unit: "bpm", stroke: "#EF4444", fill: "#FEE2E2", domain: [40, 180] },
  { key: "spo2",     label: "SpO₂",                unit: "%",   stroke: "#3B82F6", fill: "#DBEAFE", domain: [70, 100] },
  { key: "acc_mag",  label: "Acelerómetro",         unit: "g",   stroke: "#F59E0B", fill: "#FEF3C7", domain: [0, 6] },
  { key: "gyro_mag", label: "Giroscopio",           unit: "°/s", stroke: "#8B5CF6", fill: "#EDE9FE", domain: [0, 400] },
];

export default function RealtimeCharts({ history }) {
  const { dark } = useTheme();
  if (!history.length) return null;

  const gridStroke    = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)";
  const tickFill      = dark ? "#93C5FD" : "#64748B";
  const axisStroke    = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";
  const tooltipBg     = dark ? "#0F172A" : "#FFFFFF";
  const tooltipColor  = dark ? "#E2E8F0" : "#1E293B";
  const tooltipBorder = dark ? "rgba(96,165,250,0.2)" : "rgba(0,0,0,0.12)";

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-brand-300/70 light:text-gray-500 uppercase tracking-wider flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
        </span>
        Monitoreo en Tiempo Real
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {CHARTS.map((cfg) => (
          <Card key={cfg.key}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-brand-200 light:text-gray-700">
                {cfg.label}
              </h3>
              <span className="rounded-full bg-brand-700/50 light:bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-brand-400 light:text-slate-600">{cfg.unit}</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={history} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id={`grad-${cfg.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={cfg.stroke} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={cfg.stroke} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: tickFill }}
                  axisLine={{ stroke: axisStroke }}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />
                <YAxis
                  domain={cfg.domain}
                  tick={{ fontSize: 10, fill: tickFill }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 12, border: `1px solid ${tooltipBorder}`, boxShadow: "0 4px 24px rgba(0,0,0,0.5)", background: tooltipBg, color: tooltipColor }}
                  formatter={(v) => [v != null ? Number(v).toFixed(2) : "—", cfg.label]}
                  labelFormatter={(l) => l}
                />
                <Area
                  type="monotone"
                  dataKey={cfg.key}
                  stroke={cfg.stroke}
                  fill={`url(#grad-${cfg.key})`}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        ))}
      </div>
    </div>
  );
}
