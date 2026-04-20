import { useAuth } from "../contexts/AuthContext.jsx";
import logo from "../assets/logo.png";
import ThemeToggle from "./ui/ThemeToggle.jsx";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-brand-900/80 backdrop-blur-xl border-b border-white/10 light:bg-white/90 light:border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="NeuroGuard" className="h-10 w-10 object-contain" />
            <div>
              <span className="text-lg font-bold text-white tracking-tight light:text-gray-900">NeuroGuard</span>
              <span className="ml-2 hidden text-xs font-medium text-brand-400 sm:inline light:text-brand-600">Monitoreo Clínico</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-brand-800/60 border border-brand-700/50 px-3 py-1.5 sm:flex light:bg-slate-100 light:border-slate-200">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-xs font-medium text-brand-300 light:text-gray-600">{user?.email}</span>
            </div>
            <ThemeToggle />
            <button
              onClick={logout}
              className="rounded-xl px-4 py-2 text-sm font-medium text-brand-300 hover:text-white hover:bg-brand-800/60 light:text-gray-600 light:hover:text-gray-900 light:hover:bg-gray-100 transition-all duration-200"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
