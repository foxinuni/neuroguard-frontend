import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function timeAgo(isoString) {
  if (!isoString) return "—";
  return formatDistanceToNow(parseISO(isoString), { addSuffix: true, locale: es });
}

export function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} seg`;
  return `${m} min ${s} seg`;
}

export function formatBpm(v) {
  if (v == null) return "—";
  return `${Math.round(v)}`;
}

export function formatSpo2(v) {
  if (v == null) return "—";
  return `${Math.round(v)}%`;
}

export function formatG(v) {
  if (v == null) return "—";
  return v.toFixed(1);
}

const SEVERITY_MAP = {
  low:    { label: "Baja",   bg: "bg-warning-light", text: "text-warning",  ring: "ring-warning" },
  medium: { label: "Media",  bg: "bg-amber-100",     text: "text-amber-700", ring: "ring-amber-400" },
  high:   { label: "Alta",   bg: "bg-danger-light",  text: "text-danger",   ring: "ring-danger" },
};
export function severityStyle(sev) {
  return SEVERITY_MAP[sev] || SEVERITY_MAP.medium;
}
