const budgets = ["₹500-₹1000", "₹1000-₹3000", "₹3000-₹8000", "₹8000+"];
const styles = ["Traditional", "Western", "Fusion", "Indo-Western"];
const fabrics = ["Cotton", "Silk", "Georgette", "Net", "No preference"];

const PillGroup = ({ title, items, value, onChange }) => (
  <div>
    <p className="mb-3 text-sm font-medium text-pink-100">{title}</p>
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
            value === item
              ? "border-pink-400 bg-pink-500/20 text-white"
              : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
          }`}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  </div>
);

export default function Step4Preferences({ values, onChange }) {
  return (
    <div className="space-y-6">
      <PillGroup
        title="Budget Range"
        items={budgets}
        value={values.budget}
        onChange={(budget) => onChange("budget", budget)}
      />
      <PillGroup
        title="Preferred Style"
        items={styles}
        value={values.style}
        onChange={(style) => onChange("style", style)}
      />
      <PillGroup
        title="Fabric Preference"
        items={fabrics}
        value={values.fabric}
        onChange={(fabric) => onChange("fabric", fabric)}
      />
    </div>
  );
}
