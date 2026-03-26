import ShoppingButtons from "./ShoppingButtons";

const swatches = {
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

export default function DressCard({ dress, budget, recommendedColors }) {
  return (
    <article className="glass-panel overflow-hidden">
      <div className="grid lg:grid-cols-[300px,1fr]">
        <img src={dress.image_url} alt={dress.name} className="h-full min-h-72 w-full object-cover" />
        <div className="p-6 md:p-7">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-200">{dress.type}</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-white">{dress.name}</h3>
            </div>
            <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-200">
              {dress.match_percentage}% Match
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/10 px-3 py-2 text-slate-100">{dress.price_range}</span>
            <span className="rounded-full bg-white/10 px-3 py-2 text-slate-100">{dress.fabric}</span>
            <span className="rounded-full bg-white/10 px-3 py-2 text-slate-100">{dress.color}</span>
          </div>

          <p className="text-slate-300">{dress.description}</p>
          <div className="mt-5 rounded-3xl border border-pink-400/20 bg-pink-500/10 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pink-200">Why this suits you</p>
            <p className="mt-2 text-sm leading-7 text-slate-100">{dress.why_this_suits_you}</p>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pink-200">
              Recommended palette
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {recommendedColors.slice(0, 4).map((color) => (
                <div key={color} className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-full border border-white/20"
                      style={{ backgroundColor: swatches[color] || "#ffffff" }}
                    />
                    <span className="text-sm text-white">{color}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <ShoppingButtons links={dress.shopping_links} budget={budget} />
          </div>
        </div>
      </div>
    </article>
  );
}
