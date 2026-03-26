import { useRef, useState } from "react";

const manualTones = ["Fair", "Wheatish", "Dusky", "Deep"];

const detectWithTensor = async (file) => {
  const tf = await import("@tensorflow/tfjs");
  const imageBitmap = await createImageBitmap(file);
  const tensor = tf.browser.fromPixels(imageBitmap).resizeNearestNeighbor([128, 128]);
  const channels = await tf.mean(tensor, [0, 1]).array();
  tensor.dispose();

  const [r, g, b] = channels;
  const brightness = (r + g + b) / 3;
  let skinTone = "Wheatish";
  if (brightness > 190) skinTone = "Fair";
  else if (brightness > 150) skinTone = "Wheatish";
  else if (brightness > 110) skinTone = "Dusky";
  else skinTone = "Deep";

  let undertone = "Neutral";
  if (r - b > 18) undertone = "Warm";
  if (b - r > 18) undertone = "Cool";

  return { skin_tone: skinTone, undertone };
};

export default function Step2SkinTone({
  values,
  onChange,
  onUploadDetection,
  detecting,
}) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleUpload = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const localResult = await detectWithTensor(file);
    onChange("detection_mode", "upload");
    onChange("skin_tone", localResult.skin_tone);
    onChange("undertone", localResult.undertone);
    await onUploadDetection(file, localResult);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
          <div className="mb-3">
            <p className="text-lg font-semibold text-white">Option A: Upload Selfie</p>
            <p className="text-sm text-slate-300">
              TensorFlow.js runs a quick on-device color analysis, then the backend confirms the tone.
            </p>
          </div>
          <button className="secondary-button" onClick={() => fileRef.current?.click()} type="button">
            Upload Photo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleUpload(event.target.files?.[0])}
          />
          {detecting && <p className="mt-3 text-sm text-pink-200">Analyzing your selfie...</p>}
          {preview && (
            <img
              src={preview}
              alt="Skin tone preview"
              className="mt-4 h-52 w-full rounded-3xl object-cover"
            />
          )}
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
          <p className="text-lg font-semibold text-white">Option B: Manual Selection</p>
          <p className="mb-4 text-sm text-slate-300">
            Pick the closest match if you prefer not to upload a photo.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {manualTones.map((tone) => (
              <button
                key={tone}
                type="button"
                className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                  values.skin_tone === tone
                    ? "border-pink-400 bg-pink-500/20 text-white"
                    : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
                onClick={() => {
                  onChange("detection_mode", "manual");
                  onChange("skin_tone", tone);
                  onChange(
                    "undertone",
                    tone === "Fair" ? "Cool" : tone === "Wheatish" ? "Neutral" : "Warm"
                  );
                }}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-300">Detected skin tone</p>
          <p className="mt-1 text-2xl font-semibold text-white">{values.skin_tone}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-300">Undertone classification</p>
          <p className="mt-1 text-2xl font-semibold text-white">{values.undertone}</p>
        </div>
      </div>
    </div>
  );
}
