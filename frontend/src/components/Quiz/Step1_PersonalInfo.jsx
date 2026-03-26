const bodyTypes = ["Hourglass", "Pear", "Apple", "Rectangle", "Inverted Triangle"];

export default function Step1PersonalInfo({ values, onChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium text-pink-100">Name</label>
        <input
          className="field"
          value={values.name}
          onChange={(event) => onChange("name", event.target.value)}
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-pink-100">Age</label>
        <input
          className="field"
          type="number"
          min="16"
          value={values.age}
          onChange={(event) => onChange("age", event.target.value)}
          placeholder="24"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-pink-100">Body Type</label>
        <select
          className="field"
          value={values.body_type}
          onChange={(event) => onChange("body_type", event.target.value)}
        >
          {bodyTypes.map((type) => (
            <option key={type} value={type} className="bg-slate-900">
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-pink-100">Height (cm)</label>
        <input
          className="field"
          type="number"
          min="120"
          value={values.height}
          onChange={(event) => onChange("height", event.target.value)}
          placeholder="165"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-pink-100">Weight (kg)</label>
        <input
          className="field"
          type="number"
          min="35"
          value={values.weight}
          onChange={(event) => onChange("weight", event.target.value)}
          placeholder="58"
        />
      </div>
    </div>
  );
}
