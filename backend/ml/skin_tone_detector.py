# ============================================================
# FILE: backend/ml/skin_tone_detector.py
# Purani file KO REPLACE karo isse
#
# Kya karta hai:
#   - MediaPipe se face detect karta hai
#   - Sirf gaal + maatha ke pixels leta hai
#   - LAB colorspace mein ITA score calculate karta hai
#   - Indian skin tones accurately classify karta hai
#
# Install: pip install mediapipe opencv-python-headless numpy
# ============================================================

import cv2
import numpy as np
import base64
import io
from PIL import Image

# MediaPipe — try karo, nahi mila toh fallback
try:
    import mediapipe as mp
    MEDIAPIPE_AVAILABLE = True
except ImportError:
    MEDIAPIPE_AVAILABLE = False
    print("⚠️  mediapipe nahi mila — fallback mode chalega")
    print("   Install karo: pip install mediapipe")


# ─── Fitzpatrick Scale → StyleSense Labels ───────────────────
# ITA (Individual Typology Angle) se skin tone map
# ITA > 55     → Fair
# ITA 41-55    → Wheatish  
# ITA 28-41    → Medium / Dusky
# ITA 10-28    → Dusky
# ITA < 10     → Deep

ITA_TO_TONE = [
    (55,  float('inf'), "Fair"),
    (41,  55,           "Wheatish"),
    (28,  41,           "Dusky"),
    (10,  28,           "Dusky"),
    (-30, 10,           "Deep"),
]

# Indian skin tone → color recommendations
TONE_COLOR_MAP = {
    "Fair": {
        "best_colors"  : ["Pink", "Red", "Coral", "Lavender", "Sky Blue",
                          "Peach", "Mint", "White", "Baby Pink"],
        "avoid_colors" : ["Pale Yellow", "Beige", "Nude"],
        "description"  : "Tumhari Fair skin pe bright aur cool colors bahut achhe lagte hain",
        "fitzpatrick"  : "Type I-II",
    },
    "Wheatish": {
        "best_colors"  : ["Orange", "Coral", "Gold", "Teal", "Emerald",
                          "Terracotta", "Rust", "Warm Red", "Fuchsia"],
        "avoid_colors" : ["Neon Yellow", "Pale Pink"],
        "description"  : "Tumhari Wheatish skin pe warm aur earthy tones khoob khilte hain",
        "fitzpatrick"  : "Type III",
    },
    "Dusky": {
        "best_colors"  : ["Yellow", "Orange", "Gold", "White", "Red",
                          "Fuchsia", "Turquoise", "Bright Green", "Cobalt"],
        "avoid_colors" : ["Dark Brown", "Dark Navy"],
        "description"  : "Tumhari Dusky skin pe vibrant aur bold colors zabardast dikhte hain",
        "fitzpatrick"  : "Type IV",
    },
    "Deep": {
        "best_colors"  : ["Yellow", "Orange", "Gold", "White", "Electric Blue",
                          "Fuchsia", "Lime Green", "Hot Pink", "Silver"],
        "avoid_colors" : ["Dark Maroon", "Black"],
        "description"  : "Tumhari Deep skin pe jewel tones aur bright colors stunning lagte hain",
        "fitzpatrick"  : "Type V-VI",
    },
}

# Face mesh landmark indices jo gaal/maatha represent karte hain
# Ye MediaPipe ke 468 landmarks mein se specific points hain
CHEEK_LEFT_LANDMARKS  = [234, 93, 132, 58, 172, 136, 150, 149, 176, 148]
CHEEK_RIGHT_LANDMARKS = [454, 323, 361, 288, 397, 365, 379, 378, 400, 377]
FOREHEAD_LANDMARKS    = [10, 338, 297, 332, 284, 251, 389, 356, 454,
                          103, 67, 109, 10]


def _ita_to_skin_tone(ita_score: float) -> str:
    """ITA score se skin tone label nikalo"""
    for lo, hi, label in ITA_TO_TONE:
        if lo <= ita_score < hi:
            return label
    return "Wheatish"   # safe default


def _pixels_to_ita(pixels_rgb: np.ndarray) -> float:
    """
    RGB pixels → ITA (Individual Typology Angle) score

    Formula: ITA = arctan((L* - 50) / b*) × (180/π)
    L* = lightness, b* = yellow-blue axis (LAB colorspace)
    """
    if len(pixels_rgb) == 0:
        return 30.0   # default wheatish

    # RGB → LAB
    pixels_uint8 = pixels_rgb.astype(np.uint8).reshape(-1, 1, 3)
    pixels_bgr   = cv2.cvtColor(pixels_uint8, cv2.COLOR_RGB2BGR)
    pixels_lab   = cv2.cvtColor(pixels_bgr,   cv2.COLOR_BGR2LAB)

    # Average L* aur b* nikalo
    avg_L = float(np.mean(pixels_lab[:, 0, 0]))
    avg_b = float(np.mean(pixels_lab[:, 0, 2]))

    # LAB values normalize karo OpenCV scale se
    # OpenCV: L*=[0,255] → [0,100], b*=[0,255] → [-128,127]
    L_norm = (avg_L / 255.0) * 100.0
    b_norm = (avg_b - 128.0)

    # ITA formula
    if b_norm == 0:
        b_norm = 0.001  # divide by zero avoid karo
    ita = np.degrees(np.arctan((L_norm - 50.0) / b_norm))
    return float(ita)


def _sample_landmark_pixels(image_rgb: np.ndarray,
                             landmarks,
                             landmark_indices: list,
                             h: int, w: int,
                             radius: int = 5) -> np.ndarray:
    """
    Specific landmark points ke aaspaas ke pixels collect karo
    radius = kitne pixels around the point sample karein
    """
    all_pixels = []
    for idx in landmark_indices:
        lm = landmarks.landmark[idx]
        cx = int(lm.x * w)
        cy = int(lm.y * h)

        # Boundary check
        x1 = max(0, cx - radius)
        x2 = min(w, cx + radius)
        y1 = max(0, cy - radius)
        y2 = min(h, cy + radius)

        patch = image_rgb[y1:y2, x1:x2]
        if patch.size > 0:
            all_pixels.extend(patch.reshape(-1, 3).tolist())

    return np.array(all_pixels) if all_pixels else np.array([])


def detect_from_image_array(image_rgb: np.ndarray) -> dict:
    """
    NumPy RGB image array se skin tone detect karo

    Returns dict with: skin_tone, ita_score, confidence,
                       best_colors, avoid_colors, description
    """
    h, w = image_rgb.shape[:2]

    # ── MediaPipe available hai? ──────────────────────────────
    if not MEDIAPIPE_AVAILABLE:
        return _fallback_detection(image_rgb)

    mp_face_mesh = mp.solutions.face_mesh

    with mp_face_mesh.FaceMesh(
        static_image_mode=True,
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.4,
    ) as face_mesh:

        results = face_mesh.process(image_rgb)

        if not results.multi_face_landmarks:
            # Face detect nahi hua — fallback use karo
            print("⚠️  Face detect nahi hua — center crop method use kar raha hoon")
            return _fallback_detection(image_rgb)

        landmarks = results.multi_face_landmarks[0]

        # ── Pixels collect karo ──────────────────────────────
        left_cheek_px  = _sample_landmark_pixels(
            image_rgb, landmarks, CHEEK_LEFT_LANDMARKS,  h, w, radius=8)
        right_cheek_px = _sample_landmark_pixels(
            image_rgb, landmarks, CHEEK_RIGHT_LANDMARKS, h, w, radius=8)
        forehead_px    = _sample_landmark_pixels(
            image_rgb, landmarks, FOREHEAD_LANDMARKS,    h, w, radius=6)

        # Combine karo (forehead ko thoda kam weight do)
        all_pixels = np.vstack([p for p in [
            left_cheek_px, right_cheek_px,
            forehead_px[:len(forehead_px)//2] if len(forehead_px) > 0 else np.array([])
        ] if len(p) > 0])

        if len(all_pixels) < 10:
            return _fallback_detection(image_rgb)

    # ── ITA → Skin Tone ──────────────────────────────────────
    ita_score  = _pixels_to_ita(all_pixels)
    skin_tone  = _ita_to_skin_tone(ita_score)
    tone_info  = TONE_COLOR_MAP[skin_tone]

    # Confidence — ITA boundaries ke paas ho toh kam confident
    boundaries  = [55, 41, 28, 10]
    min_dist    = min(abs(ita_score - b) for b in boundaries)
    confidence  = min(0.98, 0.70 + (min_dist / 30.0))

    return {
        "skin_tone"   : skin_tone,
        "ita_score"   : round(ita_score, 2),
        "confidence"  : round(confidence, 2),
        "fitzpatrick" : tone_info["fitzpatrick"],
        "best_colors" : tone_info["best_colors"],
        "avoid_colors": tone_info["avoid_colors"],
        "description" : tone_info["description"],
        "method"      : "mediapipe_facemesh",
    }


def _fallback_detection(image_rgb: np.ndarray) -> dict:
    """
    MediaPipe fail ho toh — center face region use karo
    Pure pixel average se better hai kyunki center crop karte hain
    """
    h, w = image_rgb.shape[:2]

    # Center 30% region — usually face hota hai
    y1 = int(h * 0.20)
    y2 = int(h * 0.55)
    x1 = int(w * 0.30)
    x2 = int(w * 0.70)
    center_crop = image_rgb[y1:y2, x1:x2]

    ita_score = _pixels_to_ita(center_crop.reshape(-1, 3))
    skin_tone = _ita_to_skin_tone(ita_score)
    tone_info = TONE_COLOR_MAP[skin_tone]

    return {
        "skin_tone"   : skin_tone,
        "ita_score"   : round(ita_score, 2),
        "confidence"  : 0.60,   # fallback mein confidence kam
        "fitzpatrick" : tone_info["fitzpatrick"],
        "best_colors" : tone_info["best_colors"],
        "avoid_colors": tone_info["avoid_colors"],
        "description" : tone_info["description"],
        "method"      : "center_crop_fallback",
    }


def detect_from_base64(image_b64: str) -> dict:
    """
    Base64 encoded image string se detect karo
    Frontend se aata hai ye format
    """
    # Base64 → bytes → PIL Image → numpy array
    if "," in image_b64:
        image_b64 = image_b64.split(",")[1]   # "data:image/jpeg;base64,..." strip karo

    img_bytes  = base64.b64decode(image_b64)
    pil_image  = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    # Resize karo processing speed ke liye (720p enough hai)
    max_size = 720
    if max(pil_image.size) > max_size:
        pil_image.thumbnail((max_size, max_size), Image.LANCZOS)

    image_rgb = np.array(pil_image)
    return detect_from_image_array(image_rgb)


def detect_from_file_path(file_path: str) -> dict:
    """
    Local file path se detect karo (testing ke liye)
    """
    image_bgr = cv2.imread(file_path)
    if image_bgr is None:
        raise FileNotFoundError(f"Image nahi mili: {file_path}")
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    return detect_from_image_array(image_rgb)


# ─── Quick Test ──────────────────────────────────────────────
if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        # Command line se image path do
        # Usage: python skin_tone_detector.py path/to/photo.jpg
        result = detect_from_file_path(sys.argv[1])
    else:
        # Dummy test — white-ish image
        dummy = np.ones((300, 300, 3), dtype=np.uint8) * 200
        result = detect_from_image_array(dummy)

    print("\n" + "="*45)
    print("  SKIN TONE DETECTION RESULT")
    print("="*45)
    print(f"  Skin Tone  : {result['skin_tone']}")
    print(f"  ITA Score  : {result['ita_score']}")
    print(f"  Confidence : {result['confidence']*100:.0f}%")
    print(f"  Fitzpatrick: {result['fitzpatrick']}")
    print(f"  Method     : {result['method']}")
    print(f"\n  Best Colors:")
    for c in result['best_colors'][:5]:
        print(f"    ✅ {c}")
    print(f"\n  Avoid:")
    for c in result['avoid_colors']:
        print(f"    ❌ {c}")
    print(f"\n  Tip: {result['description']}")
    print("="*45 + "\n")
