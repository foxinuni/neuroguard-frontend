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

export default function EventPhaseChart({ readings }) {
  const { dark } = useTheme();
  const data = useMemo(() => {
    if (!readings?.length) return [];
    const t0 = new Date(readings[0].timestamp).getTime();
    return readings.map((r) => ({
      t:        ((new Date(r.timestamp).getTime() - t0) / 1000).toFixed(0),
      acc_mag:  r.imu?.acc_mag  ?? 0,
      gyro_mag: r.imu?.gyro_mag ?? 0,
      phase:    r.crisis_phase,
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
        <svg className="h-4 w-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        Actividad Motora por Fase
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
          <YAxis tick={{ fontSize: 10, fill: tickFill }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 12, border: `1px solid ${tooltipBorder}`, boxShadow: "0 4px 24px rgba(0,0,0,0.5)", background: tooltipBg, color: tooltipColor }}
            formatter={(v, name) => [Number(v).toFixed(2), name === "acc_mag" ? "Acc (g)" : "Gyro (°/s)"]}
            labelFormatter={(v) => `${v}s`}
          />
          <Line type="monotone" dataKey="acc_mag"  stroke="#F59E0B" dot={false} strokeWidth={2} name="acc_mag" />
          <Line type="monotone" dataKey="gyro_mag" stroke="#8B5CF6" dot={false} strokeWidth={2} name="gyro_mag" opacity={0.7} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
