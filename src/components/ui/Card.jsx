export default function Card({ children, className = "", glow = false }) {
  return (
    <div className={`
      relative rounded-2xl bg-brand-800/40 backdrop-blur
      border border-brand-500/10
      shadow-[0_1px_3px_rgba(0,0,0,0.3),0_6px_24px_rgba(0,0,0,0.2)]
      hover:border-brand-500/25 hover:bg-brand-800/60
      light:bg-white light:border-slate-200 light:shadow-sm
      light:hover:border-brand-500/30 light:hover:bg-slate-50
      transition-all duration-300 p-5
      ${glow ? 'ring-1 ring-brand-500/30' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}
