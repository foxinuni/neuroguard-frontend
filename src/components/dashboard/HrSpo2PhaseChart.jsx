import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceArea,
} from "recharts";
import Card from "../ui/Card.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx";

const PHASE_COLORS = {
  pre:    { fill: "rgba(37, 99, 235, 0.12)",  label: "Pre-ictal" },
  tonic:  { fill: "rgba(239, 68, 68, 0.15)",  label: "Tónica" },
  clonic: { fill: "rgba(239, 68, 68, 0.22)",  label: "Clónica" },
  post:   { fill: "rgba(16, 185, 129, 0.12)", label: "Post-ictal" },
};

export default function HrSpo2PhaseChart({ readings }) {
  const { dark } = useTheme();
  const data = useMemo(() => {
    if (!readings?.length) return [];
    const t0 = new Date(readings[0].timestamp).getTime();
    return readings.map((r) => ({
      t:    ((new Date(r.timestamp).getTime() - t0) / 1000).toFixed(0),
      hr:   r.max30102?.hr   ?? r.heart_rate ?? null,
      spo2: r.max30102?.spo2 ?? r.spo2       ?? null,
      phase: r.crisis_phase,
    }));
  }, [readings]);

  const regions = useMemo(() => {
    if (!data.length) return [];
    const out = [];
    let cur = null;
    for (const d of data) {
      if (d.phase !== cur) {
        if (out.length) out[out.length - 1].x2 = d.t;
        out.push({ phase: d.phase, x1: d.t, x2: d.t });
        cur = d.phase;
      }
    }
    if (out.length) out[out.length - 1].x2 = data[data.length - 1].t;
    return out;
  }, [data]);

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
        <svg className="h-4 w-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        HR &amp; SpO₂ por Fase
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          {regions.map((r, i) => {
            const cfg = PHASE_COLORS[r.phase];
            if (!cfg) return null;
            return (
              <ReferenceArea
                key={i}
                x1={r.x1} x2={r.x2}
                fill={cfg.fill} fillOpacity={1}
                label={cfg.label ? { value: cfg.label, position: "top", fontSize: 10, fill: tickFill } : undefined}
              />
            );
          })}
          <XAxis dataKey="t" tick={{ fontSize: 10, fill: tickFill }} axisLine={{ stroke: axisStroke }} tickLine={false} label={{ value: "(s)", position: "insideBottomRight", offset: -5, fontSize: 10, fill: tickFill }} />
          <YAxis yAxisId="hr" domain={[40, 180]} tick={{ fontSize: 10, fill: tickFill }} axisLine={false} tickLine={false} label={{ value: "bpm", angle: -90, position: "insideLeft", fontSize: 10, fill: tickFill }} />
          <YAxis yAxisId="spo2" orientation="right" domain={[70, 100]} tick={{ fontSize: 10, fill: tickFill }} axisLine={false} tickLine={false} label={{ value: "%", angle: 90, position: "insideRight", fontSize: 10, fill: tickFill }} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 12, border: `1px solid ${tooltipBorder}`, boxShadow: "0 4px 24px rgba(0,0,0,0.5)", background: tooltipBg, color: tooltipColor }}
            formatter={(v, name) => [v != null ? Number(v).toFixed(0) : "—", name === "hr" ? "HR (bpm)" : "SpO₂ (%)"]}
            labelFormatter={(v) => `${v}s`}
          />
          <Line yAxisId="hr" type="monotone" dataKey="hr" stroke="#EF4444" dot={false} strokeWidth={2} name="hr" connectNulls />
          <Line yAxisId="spo2" type="monotone" dataKey="spo2" stroke="#3B82F6" dot={false} strokeWidth={2} name="spo2" connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
