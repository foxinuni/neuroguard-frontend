import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { usePatientProfile } from "../hooks/usePatientProfile.js";
import { useLatestTelemetry } from "../hooks/useLatestTelemetry.js";
import { useTelemetryHistory } from "../hooks/useTelemetryHistory.js";
import { useEvents } from "../hooks/useEvents.js";
import { useEventReadings } from "../hooks/useEventReadings.js";
import { useDeviceStatus } from "../hooks/useDeviceStatus.js";

import Layout from "../components/Layout.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import PatientHeader from "../components/dashboard/PatientHeader.jsx";
import VitalsRealtime from "../components/dashboard/VitalsRealtime.jsx";
import RealtimeCharts from "../components/dashboard/RealtimeCharts.jsx";
import CrisisSummaryCards from "../components/dashboard/CrisisSummaryCards.jsx";
import LastEventDetail from "../components/dashboard/LastEventDetail.jsx";
import EventPhaseChart from "../components/dashboard/EventPhaseChart.jsx";
import HrSpo2PhaseChart from "../components/dashboard/HrSpo2PhaseChart.jsx";
import CrisisTrendBar from "../components/dashboard/CrisisTrendBar.jsx";
import CrisisDistributionPie from "../components/dashboard/CrisisDistributionPie.jsx";

const DEVICE_ID = "esp32_001";

export default function DashboardPage() {
  const { patientId } = useAuth();
  const profile   = usePatientProfile(patientId);
  const telemetry = useLatestTelemetry(patientId, DEVICE_ID);
  const history   = useTelemetryHistory(telemetry);
  const events       = useEvents(patientId, 100);
  const device       = useDeviceStatus(DEVICE_ID);

  // Separar eventos reales (no suprimidos) de los descartados por actividad
  const realEvents     = events.filter((e) => !e.suppressed);
  const suppressed     = events.filter((e) => e.suppressed);
  const lastEvent      = realEvents.length > 0 ? realEvents[0] : null;

  const [selectedEventId, setSelectedEventId] = useState(null);
  const activeEventId = selectedEventId ?? lastEvent?.id ?? null;
  const [showSuppressed, setShowSuppressed] = useState(false);

  const readings = useEventReadings(patientId, DEVICE_ID, activeEventId);

  if (!profile) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Banner: abrir app móvil en Chrome */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand-500/20 bg-brand-900/40 light:bg-brand-50 light:border-brand-200 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 shrink-0 text-brand-400 light:text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3m-3 3.75h3" />
            </svg>
            <span className="text-sm text-brand-200 light:text-brand-800">
              También puedes monitorear desde la <span className="font-semibold">app móvil</span> directamente en el navegador
            </span>
          </div>
          <a
            href="https://neuroguard-b6b84.web.app"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Abrir App Móvil
          </a>
        </div>

        {/* Encabezado paciente */}
        <PatientHeader profile={profile} device={device} />

        {/* Signos vitales en tiempo real */}
        <VitalsRealtime telemetry={telemetry} />

        {/* Gráficas de monitoreo en tiempo real */}
        <RealtimeCharts history={history} />

        {/* Resumen de crisis — solo eventos reales (no suprimidos) */}
        <CrisisSummaryCards events={realEvents} lastEvent={lastEvent} />

        {/* Selector de evento + detalle */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-white light:text-gray-900 flex items-center gap-2">
              <svg className="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Detalle de Crisis
            </h2>
            {realEvents.length > 1 && (
              <select
                className="text-sm border border-brand-500/20 bg-brand-800/60 text-brand-200 light:bg-white light:border-brand-500/30 light:text-gray-900 backdrop-blur rounded-xl px-3 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition"
                value={activeEventId ?? ""}
                onChange={(e) => setSelectedEventId(e.target.value)}
              >
                {realEvents.map((ev, i) => (
                  <option key={ev.id} value={ev.id}>
                    {i === 0 ? "Última crisis" : `Crisis #${realEvents.length - i}`}
                    {" — "}
                    {new Date(ev.timestamp || ev.start_timestamp).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </option>
                ))}
              </select>
            )}
          </div>

          {lastEvent && <LastEventDetail event={realEvents.find((e) => e.id === activeEventId) ?? lastEvent} />}

          {/* Gráficas de fase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EventPhaseChart readings={readings} />
            <HrSpo2PhaseChart readings={readings} />
          </div>
        </div>

        {/* Tendencias */}
        <div>
          <h2 className="text-lg font-bold text-white light:text-gray-900 mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Tendencias
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CrisisTrendBar events={realEvents} />
            <CrisisDistributionPie events={realEvents} />
          </div>
        </div>

        {/* Sección de eventos descartados por actividad */}
        {suppressed.length > 0 && (
          <div>
            <button
              className="flex items-center gap-2 text-sm font-semibold text-yellow-400 light:text-yellow-600 hover:underline mb-3"
              onClick={() => setShowSuppressed((v) => !v)}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {suppressed.length} alerta{suppressed.length !== 1 ? "s" : ""} descartada{suppressed.length !== 1 ? "s" : ""} por actividad del paciente
              <span className="text-brand-400">{showSuppressed ? "▲ Ocultar" : "▼ Ver"}</span>
            </button>
            {showSuppressed && (
              <div className="space-y-2">
                {suppressed.slice(0, 10).map((ev) => (
                  <div key={ev.id} className="flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-200 light:text-yellow-800">
                    <span className="text-base">📌</span>
                    <span className="font-semibold">{ev.activity_context?.label ?? "Actividad"}</span>
                    <span className="ml-auto text-xs text-yellow-400 light:text-yellow-600">
                      {new Date(ev.timestamp).toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
