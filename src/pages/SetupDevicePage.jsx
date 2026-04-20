import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { createUserProfile } from "../lib/userService.js";
import Spinner from "../components/ui/Spinner.jsx";
import logo from "../assets/logo.png";

export default function SetupDevicePage() {
  const { user, patientId, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [deviceId, setDeviceId] = useState("");
  const [error, setError]       = useState("");
  const [saving, setSaving]     = useState(false);

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (patientId) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const trimmed = deviceId.trim();
    if (!trimmed) { setError("Ingresa el ID del dispositivo"); return; }

    setSaving(true);
    try {
      await createUserProfile(user.uid, {
        displayName: user.displayName || "",
        deviceId: trimmed,
      });
      await refreshProfile();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Error al configurar el dispositivo");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-900 light:bg-gradient-to-br light:from-brand-50 light:to-white px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <img src={logo} alt="NeuroGuard" className="mx-auto mb-4 h-16 w-16 object-contain" />
          <h1 className="text-2xl font-bold text-white light:text-brand-800">Configura tu dispositivo</h1>
          <p className="mt-2 text-sm text-brand-300 light:text-gray-500">
            Para completar tu registro, ingresa el ID del dispositivo NeuroGuard que se te asignó.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-brand-700/40 bg-brand-800/50 light:border-surface-border light:bg-white/80 backdrop-blur p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-danger-light border border-danger/20 px-4 py-3 text-sm text-danger">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-200 light:text-gray-700">
                ID del dispositivo
              </label>
              <input
                type="text"
                required
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="w-full rounded-xl border border-brand-700/50 bg-brand-800/60 px-4 py-3 text-sm text-white
                  placeholder:text-brand-400/50
                  light:border-surface-border light:bg-white light:text-gray-900 light:placeholder:text-gray-400
                  focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10
                  transition-all duration-200"
                placeholder="esp32_001"
              />
              <p className="mt-1.5 text-xs text-brand-400/60 light:text-gray-400">
                Este ID se encuentra en la etiqueta de tu dispositivo NeuroGuard.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3 text-sm font-semibold text-white
                shadow-lg shadow-brand-500/25
                hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-105
                active:scale-[0.98]
                disabled:opacity-50 disabled:shadow-none
                transition-all duration-200"
            >
              {saving ? "Configurando…" : "Continuar al Dashboard"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-brand-400/60 light:text-gray-400">
          NeuroGuard © 2026 — Monitoreo Epiléptico
        </p>
      </div>
    </div>
  );
}
