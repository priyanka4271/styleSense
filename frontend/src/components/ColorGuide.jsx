const swatchMap = {
  "Rose Pink": "#f472b6",
  Lavender: "#c084fc",
  Emerald: "#10b981",
  Navy: "#1e3a8a",
  Berry: "#9d174d",
  Teal: "#0f766e",
  Mustard: "#ca8a04",
  Coral: "#fb7185",
  Olive: "#4d7c0f",
  Ivory: "#f8fafc",
  "Royal Blue": "#2563eb",
  Maroon: "#7f1d1d",
  Gold: "#f59e0b",
  Fuchsia: "#d946ef",
  Cobalt: "#1d4ed8",
  "Burnt Orange": "#ea580c",
  Plum: "#7e22ce",
  Champagne: "#f1e3b4",
};

export default function ColorGuide({ guide }) {
  return (
    <section className="glass-panel p-6 md:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pink-200">Skin Tone Guide</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">
            Best colors for {guide.skin_tone} skin
          </h2>
          <p className="mt-2 text-slate-300">Undertone: {guide.undertone}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">Best Colors To Wear</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {guide.best_colors.map((color) => (
              <div key={color} className="rounded-3xl border border-white/10 bg-white/5 p-3">
                <div className="h-16 rounded-2xl" style={{ backgroundColor: swatchMap[color] || "#ffffff" }} />
                <p className="mt-3 text-sm font-medium text-white">{color}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-rose-200">Colors To Avoid</p>
          <div className="space-y-3">
            {guide.avoid_colors.map((color) => (
              <div key={color} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {color}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
