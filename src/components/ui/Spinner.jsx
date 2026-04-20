export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-12">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-brand-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 animate-spin" />
      </div>
      <span className="text-sm text-gray-400 animate-pulse">Cargando…</span>
    </div>
  );
}
