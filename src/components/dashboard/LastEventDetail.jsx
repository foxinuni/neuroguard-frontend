import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import { timeAgo, formatDuration, severityStyle } from "../../lib/formatters.js";

export default function LastEventDetail({ event, basalHr }) {
  if (!event) {
    return (
      <Card>
        <p className="text-sm text-brand-300/70">No se han registrado eventos.</p>
      </Card>
    );
  }

  const sev = severityStyle(event.severity);
  const motor = event.motor || {};
  const phys  = event.physiological || {};

  return (
    <Card>
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/15">
              <svg className="h-5 w-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Crisis Tónico-Clónica</h2>
              <p className="text-sm text-brand-300/70">
                Duración: <strong>{formatDuration(event.duration_seconds)}</strong>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${sev.bg} ${sev.text} ${sev.ring}`}>{sev.label}</Badge>
          <span className="text-xs font-medium text-brand-300 bg-brand-500/15 rounded-full px-2.5 py-1">
            {timeAgo(event.timestamp || event.start_timestamp)}
          </span>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-danger/10 border border-danger/20 p-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-xs font-bold text-danger uppercase tracking-wider">Frecuencia Cardíaca</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-white tabular-nums">
            {Math.round(phys.hr_peak_bpm || 0)} <span className="text-sm font-medium text-brand-300/70">bpm</span>
          </p>
          <p className="mt-1 text-xs text-brand-300/70">
            Pico (Basal: {basalHr || 72} bpm)
          </p>
        </div>

        <div className="rounded-xl bg-brand-500/10 border border-brand-500/20 p-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs font-bold text-brand-400 uppercase tracking-wider">Saturación O₂</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-white tabular-nums">
            {Math.round(phys.spo2_min || 0)}<span className="text-sm font-medium text-brand-300/70">%</span>
          </p>
          <p className="mt-1 text-xs text-brand-300/70">Mínima durante evento</p>
        </div>

        <div className="rounded-xl bg-warning/10 border border-warning/20 p-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-xs font-bold text-warning uppercase tracking-wider">Actividad Motora</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-white tabular-nums">
            {(motor.acc_mag_max || 0).toFixed(1)} <span className="text-sm font-medium text-brand-300/70">g RMS</span>
          </p>
          <p className="mt-1 text-xs text-brand-300/70">
            Motor elevado: {motor.pct_elevated || 0}%
          </p>
        </div>
      </div>
    </Card>
  );
}
