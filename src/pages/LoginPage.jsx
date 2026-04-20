import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import logo from "../assets/logo.png";

export default function LoginPage() {
  const { user, patientId, loading: authLoading, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  if (!authLoading && user && patientId) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const map = {
        "auth/invalid-credential":  "Credenciales inválidas",
        "auth/user-not-found":      "Usuario no encontrado",
        "auth/wrong-password":      "Contraseña incorrecta",
        "auth/too-many-requests":   "Demasiados intentos. Intenta más tarde.",
        "auth/invalid-email":       "Email inválido",
      };
      setError(map[err.code] || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      await loginWithGoogle();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Error con Google. Intenta de nuevo.");
      }
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 items-center justify-center overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-brand-400/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full border border-brand-400/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full border border-brand-400/10" />

        <div className="relative z-10 text-center px-12">
          <img src={logo} alt="NeuroGuard" className="mx-auto mb-6 h-20 w-20 object-contain drop-shadow-2xl" />
          <h1 className="text-4xl font-bold text-white tracking-tight">NeuroGuard</h1>
          <p className="mt-3 text-lg text-brand-300">Sistema de monitoreo epiléptico en tiempo real</p>
          <div className="mt-8 flex justify-center gap-6 text-brand-300/80 text-sm">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              IoT en tiempo real
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Detección automática
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-center justify-center bg-brand-900 px-6 lg:w-1/2 light:bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <img src={logo} alt="NeuroGuard" className="mx-auto mb-3 h-16 w-16 object-contain" />
            <h1 className="text-2xl font-bold text-white light:text-brand-800">NeuroGuard</h1>
          </div>

          <div className="mb-6 lg:mb-8">
            <h2 className="text-2xl font-bold text-white light:text-gray-900">Bienvenido</h2>
            <p className="mt-1 text-sm text-brand-300 light:text-gray-500">Ingresa con tus credenciales para acceder al dashboard</p>
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-brand-700/50 bg-brand-800/60 px-4 py-3 text-sm font-medium text-brand-200
              hover:bg-brand-700/60 hover:shadow-sm active:scale-[0.98]
              light:border-surface-border light:bg-white light:text-gray-700 light:hover:bg-gray-50
              transition-all duration-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar con Google
          </button>

          {/* Separator */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-brand-700/60 light:bg-surface-border" />
            <span className="text-xs text-brand-400/70 light:text-gray-400">o ingresa con email</span>
            <div className="h-px flex-1 bg-brand-700/60 light:bg-surface-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-danger-light border border-danger/20 px-4 py-3 text-sm text-danger">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-200 light:text-gray-700">Correo electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-brand-700/50 bg-brand-800/60 px-4 py-3 text-sm text-white
                  placeholder:text-brand-400/50
                  focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/20
                  light:border-surface-border light:bg-white light:text-gray-900 light:placeholder:text-gray-400 light:focus:ring-brand-500/10
                  transition-all duration-200"
                placeholder="paciente001@neuroguard.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-200 light:text-gray-700">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-brand-700/50 bg-brand-800/60 px-4 py-3 text-sm text-white
                  placeholder:text-brand-400/50
                  focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/20
                  light:border-surface-border light:bg-white light:text-gray-900 light:placeholder:text-gray-400 light:focus:ring-brand-500/10
                  transition-all duration-200"
                placeholder="••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3 text-sm font-semibold text-white
                shadow-lg shadow-brand-500/25
                hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-105
                active:scale-[0.98]
                disabled:opacity-50 disabled:shadow-none
                transition-all duration-200"
            >
              {loading ? "Ingresando…" : "Ingresar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-300 light:text-gray-500">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300 light:text-brand-600 light:hover:text-brand-700 transition-colors">
              Regístrate
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-brand-400/60 light:text-gray-400">
            NeuroGuard © 2026 — Monitoreo Epiléptico IoT
          </p>
        </div>
      </div>
    </div>
  );
}
