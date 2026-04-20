import Card from "../ui/Card.jsx";

const ICONS = {
  hr:   "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  spo2: "M12 2c0 0-7 8.5-7 12a7 7 0 0014 0c0-3.5-7-12-7-12z",
  acc:  "M13 10V3L4 14h7v7l9-11h-7z",
  gyro: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
};

export default function VitalsRealtime({ telemetry }) {
  if (!telemetry) return null;

  const hr       = telemetry.max30102?.hr;
  const spo2     = telemetry.max30102?.spo2;
  const accMag   = telemetry.imu?.acc_mag;
  const gyroMag  = telemetry.imu?.gyro_mag;
  const finger   = telemetry.max30102?.finger;

  const items = [
    {
      label: "Frecuencia Cardíaca",
      value: hr != null ? Math.round(hr) : "—",
      unit:  "bpm",
      alert: hr > 120,
      warn:  !finger,
      sub:   !finger ? "Sin contacto" : null,
      icon:  ICONS.hr,
      color: "text-danger",
      bgIcon: "bg-danger/15",
    },
    {
      label: "SpO₂",
      value: spo2 != null ? Math.round(spo2) : "—",
      unit:  "%",
      alert: spo2 < 90,
      warn:  !finger,
      sub:   !finger ? "Sin contacto" : null,
      icon:  ICONS.spo2,
      color: "text-brand-400",
      bgIcon: "bg-brand-500/15",
    },
    {
      label: "Acelerómetro",
      value: accMag != null ? accMag.toFixed(2) : "—",
      unit:  "g",
      alert: accMag > 2.0,
      icon:  ICONS.acc,
      color: "text-warning",
      bgIcon: "bg-warning/15",
    },
    {
      label: "Giroscopio",
      value: gyroMag != null ? gyroMag.toFixed(1) : "—",
      unit:  "°/s",
      alert: gyroMag > 150,
      icon:  ICONS.gyro,
      color: "text-purple-400",
      bgIcon: "bg-purple-500/15",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((it) => (
        <Card key={it.label} className={it.alert ? "!border-danger/30 !bg-danger/10 ring-1 ring-danger/20" : ""}>
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold text-brand-300/70 light:text-gray-500 uppercase tracking-wider">{it.label}</p>
            <div className={`rounded-lg p-1.5 ${it.alert ? "bg-danger/15" : it.bgIcon}`}>
              <svg className={`h-4 w-4 ${it.alert ? "text-danger" : it.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={it.icon} />
              </svg>
            </div>
          </div>
          <p className={`mt-2 text-3xl font-bold tabular-nums ${it.alert ? "text-danger" : "text-white light:text-gray-900"}`}>
            {it.value}
            <span className="ml-1 text-sm font-medium text-brand-400 light:text-brand-600">{it.unit}</span>
          </p>
          {it.sub && <p className="mt-1 text-xs font-medium text-warning">{it.sub}</p>}
        </Card>
      ))}
    </div>
  );
}
