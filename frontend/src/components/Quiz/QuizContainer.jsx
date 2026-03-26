import { useMemo, useState } from "react";
import Step1PersonalInfo from "./Step1_PersonalInfo";
import Step2SkinTone from "./Step2_SkinTone";
import Step3Occasion from "./Step3_Occasion";
import Step4Preferences from "./Step4_Preferences";
import { detectSkinTone, formatApiError, getRecommendations, submitQuiz } from "../../services/api";

const stepMeta = [
  { title: "Personal Info", subtitle: "Tell us the basics for fit-aware styling." },
  { title: "Skin Tone", subtitle: "Detect or select your complexion and undertone." },
  { title: "Occasion", subtitle: "Choose where you want to wear the outfit." },
  { title: "Preferences", subtitle: "Set your budget, style, and fabric comfort." },
];

const initialState = {
  personal_info: {
    name: "",
    age: "24",
    body_type: "Hourglass",
    height: "165",
    weight: "58",
  },
  skin_tone: {
    skin_tone: "Wheatish",
    undertone: "Neutral",
    detection_mode: "manual",
  },
  occasion: "Party",
  preferences: {
    budget: "₹1000-₹3000",
    style: "Fusion",
    fabric: "Georgette",
  },
};

export default function QuizContainer({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialState);
  const [detecting, setDetecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const progress = useMemo(() => ((step + 1) / stepMeta.length) * 100, [step]);

  const updateSection = (section, field, value) => {
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  };

  const handleUploadDetection = async (file, fallback) => {
    setDetecting(true);
    try {
      const backendResult = await detectSkinTone(file);
      updateSection("skin_tone", "skin_tone", backendResult.skin_tone || fallback.skin_tone);
      updateSection("skin_tone", "undertone", backendResult.undertone || fallback.undertone);
    } catch {
      updateSection("skin_tone", "skin_tone", fallback.skin_tone);
      updateSection("skin_tone", "undertone", fallback.undertone);
    } finally {
      setDetecting(false);
    }
  };

  const nextStep = () => setStep((current) => Math.min(current + 1, stepMeta.length - 1));
  const previousStep = () => setStep((current) => Math.max(current - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const normalizedPayload = {
        personal_info: {
          ...form.personal_info,
          age: Number(form.personal_info.age),
          height: Number(form.personal_info.height),
          weight: Number(form.personal_info.weight),
        },
        skin_tone: form.skin_tone,
        occasion: form.occasion,
        preferences: form.preferences,
      };
      const session = await submitQuiz(normalizedPayload);
      const recommendations = await getRecommendations(session.session_id);
      onComplete(recommendations);
    } catch (error) {
      setError(formatApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel overflow-hidden p-6 shadow-glow md:p-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-pink-200">Style Quiz</p>
          <p className="text-sm text-slate-300">
            Step {step + 1} of {stepMeta.length}
          </p>
        </div>
        <div className="h-3 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="step-card-enter min-h-[360px]">
        <h2 className="font-display text-3xl font-bold text-white">{stepMeta[step].title}</h2>
        <p className="mb-6 mt-2 text-slate-300">{stepMeta[step].subtitle}</p>

        {step === 0 && (
          <Step1PersonalInfo
            values={form.personal_info}
            onChange={(field, value) => updateSection("personal_info", field, value)}
          />
        )}
        {step === 1 && (
          <Step2SkinTone
            values={form.skin_tone}
            detecting={detecting}
            onChange={(field, value) => updateSection("skin_tone", field, value)}
            onUploadDetection={handleUploadDetection}
          />
        )}
        {step === 2 && (
          <Step3Occasion
            value={form.occasion}
            onChange={(occasion) => setForm((current) => ({ ...current, occasion }))}
          />
        )}
        {step === 3 && (
          <Step4Preferences
            values={form.preferences}
            onChange={(field, value) => updateSection("preferences", field, value)}
          />
        )}
      </div>

      {error && <p className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p>}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button type="button" className="secondary-button" onClick={previousStep} disabled={step === 0}>
          Back
        </button>
        {step < stepMeta.length - 1 ? (
          <button type="button" className="primary-button" onClick={nextStep}>
            Continue
          </button>
        ) : (
          <button type="button" className="primary-button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <span className="flex items-center gap-3">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Finding your styles...
              </span>
            ) : (
              "See Recommendations"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
