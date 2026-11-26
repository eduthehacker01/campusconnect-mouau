export function SafetyBanner({ icon = "🛡️", title, message }) {
  return (
    <div
      role="note"
      className="rounded-2xl border border-gold-400/45 bg-gold-500/10 p-4 text-xs sm:text-sm text-gold-300"
    >
      <span aria-hidden="true" className="mr-1.5">
        {icon}
      </span>
      <strong className="font-extrabold text-gold-300">{title}:</strong>{" "}
      <span className="text-amber-100/90">{message}</span>
    </div>
  );
}
