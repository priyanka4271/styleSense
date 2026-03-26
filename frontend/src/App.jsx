import { useState } from "react";
import QuizContainer from "./components/Quiz/QuizContainer";
import ResultsPage from "./components/Results/ResultsPage";

export default function App() {
  const [results, setResults] = useState(null);

  return (
    <main className="relative overflow-hidden">
      <div className="absolute left-10 top-10 h-48 w-48 animate-pulseSlow rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-64 w-64 animate-float rounded-full bg-rose-400/20 blur-3xl" />

      <div className="relative mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <section className="mb-10 grid gap-8 lg:grid-cols-[1fr,0.88fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.45em] text-pink-200">StyleSense</p>
            <h1 className="mt-5 font-display text-5xl font-bold leading-tight text-white md:text-6xl">
              AI dress recommendations that actually feel personal.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Take a guided style quiz, detect your skin tone, and instantly get dress recommendations with smart shopping links for Myntra, Flipkart, and Meesho.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">540 synthetic catalog items</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Content-based ML engine</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Skin tone color guide</span>
            </div>
          </div>

          <div className="glass-panel p-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Top Match", value: "95%" },
                { label: "Skin Tone", value: results?.color_guide?.skin_tone || "Detected" },
                { label: "Occasion Ready", value: results?.user_profile?.occasion || "6 modes" },
                { label: "Shopping Links", value: "3 stores" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-300">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {results ? (
          <ResultsPage data={results} onRestart={() => setResults(null)} />
        ) : (
          <QuizContainer onComplete={setResults} />
        )}
      </div>
    </main>
  );
}
