import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import logo from "../assets/logo.png";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";

/* ─── tiny reusable pieces ─── */
function NavBar() {
  const { user } = useAuth();
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-brand-900/80 backdrop-blur-xl light:bg-white/90 light:border-slate-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="NeuroGuard" className="h-9 w-9 object-contain" />
          <span className="text-lg font-bold text-white tracking-tight light:text-gray-900">NeuroGuard</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-brand-300 light:text-gray-600">
          <a href="#features" className="hover:text-white light:hover:text-gray-900 transition-colors">Características</a>
          <a href="#how" className="hover:text-white light:hover:text-gray-900 transition-colors">Cómo funciona</a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link to="/dashboard"
              className="rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-400 transition-colors">
              Ir al Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login"
                className="hidden sm:inline-flex rounded-xl border border-brand-500/30 px-5 py-2 text-sm font-medium text-brand-300 hover:bg-brand-800 transition-colors light:border-brand-500/40 light:text-brand-600 light:hover:bg-brand-50">
                Iniciar sesión
              </Link>
              <Link to="/register"
                className="rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-400 transition-colors">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group rounded-2xl border border-brand-500/10 bg-brand-800/40 p-6 backdrop-blur
      hover:border-brand-500/30 hover:bg-brand-800/60 transition-all duration-300
      light:bg-white light:border-slate-200 light:hover:border-brand-500/30 light:hover:bg-slate-50">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400
        group-hover:bg-brand-500/20 transition-colors light:bg-brand-50">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-white light:text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-brand-300/80 light:text-gray-500">{desc}</p>
    </div>
  );
}

function StepCard({ num, icon, title, desc }) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/25">
        {icon}
      </div>
      <span className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400">
        {num}
      </span>
      <h4 className="mb-1 text-base font-bold text-white">{title}</h4>
      <p className="text-sm text-brand-300/80 max-w-xs">{desc}</p>
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-sm text-brand-300/80">{label}</p>
    </div>
  );
}

/* ─── Main HomePage ─── */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-900 text-white">
      <NavBar />

      {/* ══════════ HERO ══════════ */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-3xl" />
        <div className="absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-brand-400/5 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-32">
          {/* Left — copy */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-800/50 px-4 py-1.5 text-xs font-medium text-brand-300 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Sistema de monitoreo activo 24/7
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Monitoreo epiléptico{" "}
              <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
                inteligente
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-brand-300/90">
              NeuroGuard detecta crisis epilépticas en tiempo real mediante sensores portátiles,
              brindando tranquilidad a pacientes y a quienes los cuidan.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register"
                className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 px-8 py-3.5 text-sm font-bold text-white
                  shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-110 active:scale-[0.98]
                  transition-all duration-200">
                Comenzar ahora
              </Link>
              <a href="#features"
                className="flex items-center gap-2 rounded-xl border border-brand-500/20 px-8 py-3.5 text-sm font-medium text-brand-300
                  hover:bg-brand-800/60 transition-all duration-200">
                Conocer más
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </a>
            </div>
          </div>

          {/* Right — decorative dashboard card */}
          <div className="hidden lg:block">
            <div className="relative rounded-2xl border border-brand-500/15 bg-brand-800/40 p-6 backdrop-blur shadow-2xl">
              {/* Fake header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-xs font-medium text-brand-300">Paciente activo — Monitoreo en vivo</span>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">ESTABLE</span>
              </div>

              {/* Fake vitals */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="rounded-xl bg-brand-900/50 p-3">
                  <p className="text-[10px] text-brand-400 mb-0.5">Frecuencia cardíaca</p>
                  <p className="text-xl font-bold text-white tabular-nums">72 <span className="text-xs font-normal text-brand-400">bpm</span></p>
                </div>
                <div className="rounded-xl bg-brand-900/50 p-3">
                  <p className="text-[10px] text-brand-400 mb-0.5">Oxígeno en sangre</p>
                  <p className="text-xl font-bold text-white tabular-nums">98 <span className="text-xs font-normal text-brand-400">%</span></p>
                </div>
                <div className="rounded-xl bg-brand-900/50 p-3">
                  <p className="text-[10px] text-brand-400 mb-0.5">Movimiento</p>
                  <p className="text-xl font-bold text-emerald-400 tabular-nums">Normal</p>
                </div>
              </div>

              {/* Fake waveform SVG */}
              <div className="rounded-xl bg-brand-900/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-brand-400">Señal cardíaca en tiempo real</span>
                  <span className="text-[10px] text-brand-500 tabular-nums">12:34:56</span>
                </div>
                <svg viewBox="0 0 400 60" className="w-full h-12 text-brand-400">
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="0,30 20,30 40,30 55,30 60,28 65,10 70,50 75,5 80,55 85,30 90,30 110,30 130,30 145,30 150,28 155,10 160,50 165,5 170,55 175,30 180,30 200,30 220,30 235,30 240,28 245,10 250,50 255,5 260,55 265,30 270,30 290,30 310,30 325,30 330,28 335,10 340,50 345,5 350,55 355,30 360,30 380,30 400,30"
                  />
                </svg>
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-400/5 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" className="relative border-t border-brand-500/10 bg-brand-900/80">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="mb-14 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-400">Características</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Todo lo que necesitas para estar tranquilo</h2>
            <p className="mt-4 mx-auto max-w-2xl text-brand-300/80">
              NeuroGuard combina tecnología portátil con análisis clínico inteligente para ofrecerte un sistema de monitoreo completo.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384-3.19A1.5 1.5 0 015.25 10.7V7.3a1.5 1.5 0 01.786-1.28l5.384-3.19a1.5 1.5 0 011.56 0l5.384 3.19a1.5 1.5 0 01.786 1.28v3.4a1.5 1.5 0 01-.786 1.28l-5.384 3.19a1.5 1.5 0 01-1.56 0z" /></svg>}
              title="Detección automática"
              desc="El sistema identifica patrones de crisis epilépticas al instante, sin intervención manual. Recibe alertas antes de que sea tarde."
            />
            <FeatureCard
              icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>}
              title="Monitoreo continuo"
              desc="Frecuencia cardíaca y oxígeno en sangre monitoreados de forma permanente. Tu salud bajo vigilancia las 24 horas del día."
            />
            <FeatureCard
              icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>}
              title="Análisis por fases"
              desc="Cada evento se descompone en sus fases clínicas: pre‑ictal, tónica, clónica y post‑ictal, con métricas detalladas de cada una."
            />
            <FeatureCard
              icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>}
              title="Seguimiento nocturno"
              desc="La mayoría de las crisis ocurren durante el sueño. NeuroGuard vigila también de noche, diferenciando episodios nocturnos y diurnos."
            />
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how" className="relative border-t border-brand-500/10">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
          <div className="mb-14 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-400">Cómo funciona</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Tres pasos para tu tranquilidad</h2>
          </div>

          <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
            {/* Connector line (desktop) */}
            <div className="absolute top-8 left-[16.67%] right-[16.67%] hidden h-0.5 bg-gradient-to-r from-brand-500/40 via-brand-400/40 to-brand-500/40 md:block" />

            <StepCard
              num="1"
              icon={<svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>}
              title="Lleva el dispositivo puesto"
              desc="Un pequeño sensor portátil que se coloca en la muñeca monitorea tus signos vitales y movimiento de forma cómoda y continua."
            />
            <StepCard
              num="2"
              icon={<svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>}
              title="El sistema detecta anomalías"
              desc="Los datos se analizan automáticamente en tiempo real. Si se detecta un patrón compatible con una crisis, el sistema reacciona al instante."
            />
            <StepCard
              num="3"
              icon={<svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>}
              title="Consulta tu dashboard"
              desc="Accede al panel personalizado con toda la información: signos vitales, historial de eventos, fases de cada crisis y tendencias."
            />
          </div>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section className="border-t border-brand-500/10 bg-brand-800/30">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8 px-6 py-14">
          <StatItem value="< 1s" label="Tiempo de detección" />
          <StatItem value="24/7" label="Monitoreo continuo" />
          <StatItem value="100%" label="Datos en tiempo real" />
        </div>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section className="border-t border-brand-500/10">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Empieza a monitorear{" "}
            <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">ahora</span>
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-brand-300/80">
            Crea tu cuenta en segundos y accede al sistema de monitoreo epiléptico más completo. Tu tranquilidad comienza aquí.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/register"
              className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 px-8 py-3.5 text-sm font-bold text-white
                shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-110 active:scale-[0.98]
                transition-all duration-200">
              Crear cuenta gratis
            </Link>
            <Link to="/login"
              className="rounded-xl border border-brand-500/20 px-8 py-3.5 text-sm font-medium text-brand-300
                hover:bg-brand-800/60 transition-all duration-200">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="border-t border-brand-500/10 bg-brand-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10">
              <span className="text-xs font-bold text-brand-400">NG</span>
            </div>
            <span className="text-sm font-semibold text-brand-300">NeuroGuard</span>
          </div>
          <p className="text-xs text-brand-500">© 2026 NeuroGuard — Monitoreo Epiléptico</p>
        </div>
      </footer>
    </div>
  );
}
