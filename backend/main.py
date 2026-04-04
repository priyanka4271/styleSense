from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os, sys

# Add ml directory to path
sys.path.append(os.path.dirname(__file__))

app = FastAPI(title="StyleSense API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Try to import ML modules ──────────────────────────────────────────────────
try:
    from ml.hybrid_recommender import UserProfile, recommender, estimate_size
    ML_READY = True
    print("✅ ML recommender loaded")
except Exception as e:
    ML_READY = False
    print(f"⚠️  ML recommender not loaded: {e} — using mock data")

try:
    from ml.skin_tone_classifier import COLOR_GUIDE, classify_skin_tone
    SKIN_READY = True
    print("✅ Skin tone classifier loaded")
except Exception as e:
    SKIN_READY = False
    print(f"⚠️  Skin classifier not loaded: {e} — using mock detection")

# ── Schemas ───────────────────────────────────────────────────────────────────
class RecommendRequest(BaseModel):
    name:      Optional[str] = ""
    age:       Optional[str] = ""
    gender:    Optional[str] = "Women"
    skinTone:  Optional[str] = "wheatish"
    occasions: Optional[List[str]] = ["casual"]
    vibes:     Optional[List[str]] = ["Traditional"]
    budget:    Optional[str] = "mid"

# ── Mock data (fallback) ──────────────────────────────────────────────────────
MOCK_ITEMS = [
    {"name": "Contemporary Gold Saree",  "price": "₹1,007", "color": "Gold",    "category": "Sarees",  "rating": "4.4", "reason": "Perfect for your occasion, flatters your skin tone",        "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80"},
    {"name": "Luxe Gold Co-ord Set",     "price": "₹4,755", "color": "Gold",    "category": "Co-ords", "rating": "3.9", "reason": "Festive favourite, premium fabric quality",                  "image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80"},
    {"name": "Contemporary Gold Kurti",  "price": "₹1,090", "color": "Gold",    "category": "Kurtis",  "rating": "4.6", "reason": "40% off today — great for casual outings",                  "image": "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80"},
    {"name": "Elegant Rust Anarkali",    "price": "₹2,399", "color": "Rust",    "category": "Dresses", "rating": "4.2", "reason": "Rust complements your skin tone beautifully",               "image": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80"},
    {"name": "Coral Wrap Dress",         "price": "₹1,850", "color": "Coral",   "category": "Dresses", "rating": "4.5", "reason": "Trending style, perfect fit for your preferences",          "image": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80"},
    {"name": "Olive Green Palazzo Set",  "price": "₹1,299", "color": "Olive",   "category": "Co-ords", "rating": "4.3", "reason": "Comfortable and elegant for your selected occasions",        "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80"},
]

BUDGET_FILTERS = {
    "budget":  (0,    1000),
    "mid":     (1000, 5000),
    "premium": (5000, 15000),
    "luxury":  (15000, 99999),
}

def parse_price(price_str: str) -> int:
    try:
        return int("".join(c for c in str(price_str) if c.isdigit()))
    except:
        return 0

def filter_by_budget(items, budget_key):
    if budget_key not in BUDGET_FILTERS:
        return items
    low, high = BUDGET_FILTERS[budget_key]
    filtered = [i for i in items if low <= parse_price(i.get("price", "0")) <= high]
    return filtered if filtered else items  # fallback to all if nothing matches

# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "ml_ready": ML_READY, "skin_ready": SKIN_READY}

@app.get("/")
def root():
    return {"message": "StyleSense API is running 🌸"}

@app.post("/recommendations")
def get_recommendations(req: RecommendRequest):
    results = []

    if ML_READY:
        try:
            profile = UserProfile(
                skin_tone=req.skinTone or "wheatish",
                occasion=req.occasions[0] if req.occasions else "casual",
                preferred_colors=[],
                budget_range=req.budget or "mid",
            )
            raw = recommender(profile, top_n=9)

            for item in raw:
                results.append({
                    "name":     item.get("name", ""),
                    "price":    f"₹{item.get('price', 0):,.0f}" if isinstance(item.get("price"), (int, float)) else str(item.get("price", "")),
                    "color":    item.get("color", ""),
                    "category": item.get("category", ""),
                    "rating":   str(item.get("rating", "")),
                    "reason":   item.get("reason", "Recommended for you"),
                    "image":    item.get("image", ""),
                })
        except Exception as e:
            print(f"Recommender error: {e}")
            results = []

    if not results:
        results = MOCK_ITEMS.copy()

    # Apply budget filter
    results = filter_by_budget(results, req.budget or "mid")

    return results

@app.post("/detect-skin-tone")
async def detect_skin_tone(file: UploadFile = File(...)):
    if SKIN_READY:
        try:
            contents = await file.read()
            result   = classify_skin_tone(contents)
            return {
                "skinTone":   result.get("skin_tone", "wheatish"),
                "confidence": result.get("confidence", 0.85),
            }
        except Exception as e:
            print(f"Skin detection error: {e}")

    # Mock detection fallback
    import random
    tones = ["fair", "wheatish", "medium", "dusky", "dark"]
    return {
        "skinTone":   random.choice(tones),
        "confidence": round(random.uniform(0.75, 0.95), 2),
    }
