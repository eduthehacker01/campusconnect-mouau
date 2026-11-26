const ADMIN_BLOCK_IMG = "/mouau-admin-block.jpg";

export function AdminBlockWatermark({ opacity = "opacity-[0.18]" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${opacity}`}
      aria-hidden="true"
    >
      <img
        src={ADMIN_BLOCK_IMG}
        alt=""
        className="ken-burns h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-forest-950/30" />
    </div>
  );
}
