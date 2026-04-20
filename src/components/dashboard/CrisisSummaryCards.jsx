import Card from "../ui/Card.jsx";
import { timeAgo } from "../../lib/formatters.js";
import { countCrises } from "../../lib/analytics.js";

export default function CrisisSummaryCards({ events }) {
  const lastEvent = events[0];
  const week  = countCrises(events, 7);
  const month = countCrises(events, 30);

  const cols = [
    {
      label: "Última Crisis",
      value: lastEvent ? timeAgo(lastEvent.timestamp || lastEvent.start_timestamp) : "Sin datos",
      sub: null,
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      accent: "text-brand-400",
      bgIcon: "bg-brand-500/15",
    },
    {
      label: "Última Semana",
      value: week.count,
      sub: week.prolongadas > 0 ? `${week.prolongadas} prolongada${week.prolongadas > 1 ? "s" : ""}` : null,
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      accent: "text-warning",
      bgIcon: "bg-warning/15",
    },
    {
      label: "Último Mes",
      value: month.count,
      sub: month.prolongadas > 0 ? `${month.prolongadas} prolongada${month.prolongadas > 1 ? "s" : ""}` : null,
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      accent: "text-danger",
      bgIcon: "bg-danger/15",
    },
  ];

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-brand-300/70 light:text-gray-500 uppercase tracking-wider flex items-center gap-2">
        <svg className="h-4 w-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
        Resumen de Crisis Convulsivas
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cols.map((c) => (
          <Card key={c.label}>
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-brand-300/70 light:text-gray-500 uppercase tracking-wider">{c.label}</span>
              <div className={`rounded-lg p-1.5 ${c.bgIcon}`}>
                <svg className={`h-4 w-4 ${c.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-white light:text-gray-900 tabular-nums">{c.value}</p>
            {c.sub && <p className="mt-1 text-xs font-medium text-danger">{c.sub}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
