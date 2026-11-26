export function initials(name = "") {
  return (
    String(name)
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "MC"
  );
}

export function formatNaira(amount) {
  if (amount === null || amount === undefined || amount === "") {
    return "Contact for price";
  }
  const num = Number(amount);
  if (Number.isNaN(num)) return String(amount);
  return `₦${num.toLocaleString("en-NG")}`;
}

export function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDateShort(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-NG", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const INPUT_CLASS =
  "w-full rounded-xl bg-forest-950/85 border border-brand-800/70 px-4 py-2.5 text-sm text-slate-100 placeholder-brand-200/50 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40 transition";
