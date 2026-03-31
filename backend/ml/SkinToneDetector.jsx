// ============================================================
// FILE: frontend/src/components/SkinToneDetector.jsx
// Purana skin tone component KO REPLACE karo isse
//
// Features:
//   - Webcam se live photo le sakta hai
//   - File upload bhi karta hai
//   - Real-time result + color swatches dikhata hai
//   - Manual select ka option bhi hai
// ============================================================

import { useState, useRef, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Skin tone colors for UI display
const TONE_UI = {
  Fair    : { bg: "#FDDBB4", label: "Fair",     emoji: "🌸" },
  Wheatish: { bg: "#D4956A", label: "Wheatish", emoji: "🌾" },
  Dusky   : { bg: "#A0694A", label: "Dusky",    emoji: "🌻" },
  Deep    : { bg: "#6B3A2A", label: "Deep",     emoji: "✨" },
};

// Color → hex mapping for swatches
const COLOR_HEX = {
  "Pink"         : "#FF69B4", "Red"          : "#DC143C",
  "Coral"        : "#FF6B6B", "Lavender"     : "#967BB6",
  "Sky Blue"     : "#87CEEB", "Peach"        : "#FFCBA4",
  "Mint"         : "#98FF98", "White"        : "#F5F5F5",
  "Baby Pink"    : "#F4C2C2", "Orange"       : "#FF8C00",
  "Gold"         : "#FFD700", "Teal"         : "#008080",
  "Emerald"      : "#50C878", "Terracotta"   : "#E2725B",
  "Rust"         : "#B7410E", "Warm Red"     : "#C0392B",
  "Fuchsia"      : "#FF00FF", "Yellow"       : "#FFD700",
  "Turquoise"    : "#40E0D0", "Bright Green" : "#66FF00",
  "Cobalt"       : "#0047AB", "Electric Blue": "#7DF9FF",
  "Lime Green"   : "#32CD32", "Hot Pink"     : "#FF69B4",
  "Silver"       : "#C0C0C0", "Nude"         : "#E3BC9A",
  "Beige"        : "#F5F5DC", "Pale Yellow"  : "#FFFF99",
};

export default function SkinToneDetector({ onDetected }) {
  const [mode, setMode]           = useState("choice"); // choice|upload|webcam|manual|result
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [preview, setPreview]     = useState(null);
  const [error, setError]         = useState(null);
  const [webcamOn, setWebcamOn]   = useState(false);

  const fileInputRef  = useRef(null);
  const videoRef      = useRef(null);
  const canvasRef     = useRef(null);
  const streamRef     = useRef(null);

  // ── File upload handler ─────────────────────────────────────
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Sirf image files upload karo (JPG, PNG, etc.)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      detectSkinTone(ev.target.result);
    };
    reader.readAsDataURL(file);
  }, []);

  // ── Webcam start ────────────────────────────────────────────
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      streamRef.current       = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setWebcamOn(true);
      setMode("webcam");
    } catch (err) {
      setError("Camera access nahi mila — permission do ya file upload karo");
    }
  }, []);

  // ── Webcam capture ──────────────────────────────────────────
  const capturePhoto = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setPreview(dataUrl);
    stopWebcam();
    detectSkinTone(dataUrl);
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setWebcamOn(false);
  }, []);

  // ── API call ────────────────────────────────────────────────
  const detectSkinTone = async (imageDataUrl) => {
    setLoading(true);
    setError(null);
    setMode("result");

    try {
      const res = await fetch(`${API_URL}/api/detect-skin-tone`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ image_base64: imageDataUrl }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
      onDetected?.(data);   // parent component ko batao
    } catch (err) {
      setError("Detection fail ho gayi. Dobara try karo ya manually select karo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Manual select ───────────────────────────────────────────
  const handleManualSelect = async (tone) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/skin-tone-colors`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ skin_tone: tone }),
      });
      const data = await res.json();
      setResult({ ...data, method: "manual_selection", confidence: 1.0 });
      onDetected?.({ ...data, method: "manual_selection" });
      setMode("result");
    } catch (err) {
      setError("Error aa gayi. Refresh karo.");
    } finally {
      setLoading(false);
    }
  };

  // ── Reset ───────────────────────────────────────────────────
  const reset = () => {
    setMode("choice");
    setResult(null);
    setPreview(null);
    setError(null);
    stopWebcam();
  };

  // ════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════
  return (
    <div className="max-w-lg mx-auto p-4">

      {/* ── Error ── */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          ⚠️ {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* ── CHOICE SCREEN ── */}
      {mode === "choice" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            Apna Skin Tone Detect Karo 📸
          </h2>
          <p className="text-center text-gray-500 text-sm">
            Photo se automatic detect hoga ya manually select karo
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 px-6 bg-purple-600 text-white rounded-2xl font-medium hover:bg-purple-700 transition flex items-center justify-center gap-3"
          >
            📁 Photo Upload Karo
          </button>
          <input
            ref={fileInputRef} type="file" accept="image/*"
            className="hidden" onChange={handleFileUpload}
          />

          <button
            onClick={startWebcam}
            className="w-full py-4 px-6 bg-pink-500 text-white rounded-2xl font-medium hover:bg-pink-600 transition flex items-center justify-center gap-3"
          >
            📷 Camera Se Photo Lo
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-400">ya</span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mb-2">
            Manually apna skin tone select karo
          </p>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(TONE_UI).map(([tone, ui]) => (
              <button
                key={tone}
                onClick={() => handleManualSelect(tone)}
                className="py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition flex items-center gap-3"
              >
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: ui.bg }}
                />
                <span className="font-medium text-gray-700">{ui.label}</span>
                <span>{ui.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── WEBCAM SCREEN ── */}
      {mode === "webcam" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center">
            Apna chehra frame mein rako 📷
          </h2>
          <div className="relative rounded-2xl overflow-hidden bg-black">
            <video ref={videoRef} className="w-full" autoPlay muted playsInline />
            {/* Face guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-60 border-4 border-white border-dashed rounded-full opacity-70" />
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-3">
            <button
              onClick={capturePhoto}
              className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700"
            >
              📸 Photo Lo
            </button>
            <button
              onClick={reset}
              className="py-3 px-6 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── LOADING ── */}
      {mode === "result" && loading && (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Skin tone detect ho raha hai...</p>
          {preview && (
            <img src={preview} alt="Preview" className="w-32 h-32 rounded-full mx-auto object-cover" />
          )}
        </div>
      )}

      {/* ── RESULT SCREEN ── */}
      {mode === "result" && !loading && result && (
        <div className="space-y-5">
          {/* Header */}
          <div className="text-center">
            <div
              className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg mb-3"
              style={{ backgroundColor: TONE_UI[result.skin_tone]?.bg || "#D4956A" }}
            />
            <h2 className="text-2xl font-bold text-gray-800">
              {TONE_UI[result.skin_tone]?.emoji} {result.skin_tone} Skin Tone
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {result.fitzpatrick} •{" "}
              {result.method === "manual_selection"
                ? "Manually selected"
                : `${Math.round(result.confidence * 100)}% confident`}
            </p>
            <p className="text-sm text-gray-600 mt-2 italic">{result.description}</p>
          </div>

          {/* Best Colors */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              ✅ Tumhare Best Colors
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.best_colors.map((color) => (
                <div key={color} className="flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-1.5 border">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: COLOR_HEX[color] || "#ccc" }}
                  />
                  <span className="text-sm text-gray-700">{color}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Avoid Colors */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              ❌ Avoid Karo
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.avoid_colors.map((color) => (
                <div key={color} className="flex items-center gap-1.5 bg-red-50 rounded-full px-3 py-1.5 border border-red-100">
                  <div
                    className="w-4 h-4 rounded-full border border-red-200"
                    style={{ backgroundColor: COLOR_HEX[color] || "#ccc" }}
                  />
                  <span className="text-sm text-red-600">{color}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={reset}
              className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50"
            >
              🔄 Dobara Try Karo
            </button>
            <button
              onClick={() => onDetected?.(result)}
              className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700"
            >
              Recommendations Dekho →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
