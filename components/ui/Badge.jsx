const VARIANTS = {
  brand: "bg-brand-600 text-white",
  subtle: "bg-brand-950/90 border border-brand-800/70 text-brand-200",
  gold: "bg-gold-500 text-forest-950 font-black",
  goldSubtle: "bg-gold-500/15 border border-gold-400/40 text-gold-300",
  verified: "bg-emerald-500/20 border border-emerald-400/40 text-emerald-300",
  danger: "bg-rose-600 text-white",
  dangerSubtle: "bg-rose-500/20 border border-rose-400/40 text-rose-300",
};

export function Badge({ children, variant = "subtle", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
        VARIANTS[variant] || VARIANTS.subtle
      } ${className}`}
    >
      {children}
    </span>
  );
}
