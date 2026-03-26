const occasions = ["Party", "Wedding", "Office", "Casual", "Festive", "Date Night"];

export default function Step3Occasion({ value, onChange }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {occasions.map((occasion) => (
        <button
          key={occasion}
          type="button"
          className={`rounded-[24px] border p-5 text-left transition ${
            value === occasion
              ? "border-pink-400 bg-gradient-to-br from-fuchsia-500/25 to-rose-500/20"
              : "border-white/10 bg-white/5 hover:bg-white/10"
          }`}
          onClick={() => onChange(occasion)}
        >
          <p className="text-lg font-semibold text-white">{occasion}</p>
          <p className="mt-2 text-sm text-slate-300">
            {occasion === "Wedding" && "Dress up in statement silhouettes and rich festive colors."}
            {occasion === "Party" && "Pick an eye-catching look with movement and shine."}
            {occasion === "Office" && "Balance polish, comfort, and all-day elegance."}
            {occasion === "Casual" && "Stay breezy, versatile, and easy to style."}
            {occasion === "Festive" && "Celebrate with color, texture, and occasion sparkle."}
            {occasion === "Date Night" && "Lean into flattering cuts and confident color stories."}
          </p>
        </button>
      ))}
    </div>
  );
}
