"use client";

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
      <div
        role="status"
        aria-live="polite"
        className="toast-in flex items-center gap-2.5 rounded-xl border border-brand-500/50 bg-forest-900/95 px-4 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur"
      >
        <span className="text-brand-400" aria-hidden="true">
          ✔
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
}
