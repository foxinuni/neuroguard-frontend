import { parseISO, startOfWeek, subWeeks, isAfter, isBefore, addWeeks } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Computa crisis por semana para las últimas N semanas.
 * Retorna array de { label, total, prolongadas } ordenado cronológicamente.
 */
export function computeWeeklyCounts(events, weeks = 4) {
  const now = new Date();
  const buckets = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1, locale: es });
    const weekEnd   = addWeeks(weekStart, 1);
    buckets.push({ start: weekStart, end: weekEnd, total: 0, prolongadas: 0 });
  }

  for (const ev of events) {
    const dt = parseISO(ev.timestamp || ev.start_timestamp);
    for (const b of buckets) {
      if ((isAfter(dt, b.start) || dt.getTime() === b.start.getTime()) && isBefore(dt, b.end)) {
        b.total++;
        if ((ev.duration_seconds || 0) > 120) b.prolongadas++;
        break;
      }
    }
  }

  return buckets.map((b, i) => ({
    label: `Sem ${i + 1}`,
    total: b.total,
    prolongadas: b.prolongadas,
  }));
}

/**
 * Distribución nocturnas vs diurnas.
 */
export function nightDayDistribution(events) {
  let nocturnas = 0;
  let diurnas   = 0;
  for (const ev of events) {
    if (ev.is_nocturnal) nocturnas++;
    else diurnas++;
  }
  const total = nocturnas + diurnas || 1;
  return {
    nocturnas,
    diurnas,
    pctNocturnas: Math.round((nocturnas / total) * 100),
    pctDiurnas:   Math.round((diurnas   / total) * 100),
  };
}

/**
 * Cuenta crisis en los últimos N días.
 * Retorna { count, prolongadas }.
 */
export function countCrises(events, days) {
  const cutoff = new Date(Date.now() - days * 86_400_000);
  let count = 0;
  let prolongadas = 0;
  for (const ev of events) {
    const dt = parseISO(ev.timestamp || ev.start_timestamp);
    if (isAfter(dt, cutoff)) {
      count++;
      if ((ev.duration_seconds || 0) > 120) prolongadas++;
    }
  }
  return { count, prolongadas };
}
