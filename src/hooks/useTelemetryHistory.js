import { useEffect, useRef, useState } from "react";

const MAX_POINTS = 120; // ~2 min a 1 lectura/s

/**
 * Acumula un buffer rolling de las últimas MAX_POINTS lecturas
 * a partir del documento `latest/current` que llega por onSnapshot.
 */
export function useTelemetryHistory(telemetry) {
  const bufRef = useRef([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!telemetry?.timestamp) return;

    const ts = telemetry.timestamp;
    // Evitar duplicados (mismo timestamp)
    const last = bufRef.current[bufRef.current.length - 1];
    if (last?.ts === ts) return;

    const point = {
      ts,
      label: new Date(ts).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      hr:       telemetry.max30102?.hr      ?? null,
      spo2:     telemetry.max30102?.spo2    ?? null,
      acc_mag:  telemetry.imu?.acc_mag      ?? null,
      gyro_mag: telemetry.imu?.gyro_mag     ?? null,
    };

    const next = [...bufRef.current, point];
    if (next.length > MAX_POINTS) next.shift();
    bufRef.current = next;
    setHistory([...next]);
  }, [telemetry]);

  return history;
}
