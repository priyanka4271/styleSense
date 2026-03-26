import { useEffect } from "react";
import confetti from "canvas-confetti";
import DressCard from "./DressCard";
import ColorGuide from "../ColorGuide";

export default function ResultsPage({ data, onRestart }) {
  useEffect(() => {
    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.25 },
      colors: ["#d946ef", "#f472b6", "#fb7185", "#f59e0b"],
    });
  }, []);

  return (
    <div className="space-y-8">
      <section className="glass-panel p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.34em] text-pink-200">Your Style Profile</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-white">
              Curated picks for {data.user_profile.personal_info.name}
            </h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              We matched your {data.user_profile.skin_tone.skin_tone.toLowerCase()} tone,{" "}
              {data.user_profile.occasion.toLowerCase()} plans, and {data.user_profile.preferences.style.toLowerCase()} preferences to the best outfits in our catalog.
            </p>
          </div>
          <button type="button" className="secondary-button" onClick={onRestart}>
            Retake Quiz
          </button>
        </div>
      </section>

      <ColorGuide guide={data.color_guide} />

      <section className="space-y-6">
        {data.recommendations.map((dress) => (
          <DressCard
            key={dress.dress_id}
            dress={dress}
            budget={data.user_profile.preferences.budget}
            recommendedColors={data.color_guide.best_colors}
          />
        ))}
      </section>
    </div>
  );
}
