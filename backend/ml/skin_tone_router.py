# ============================================================
# FILE: backend/routers/skin_tone.py   (naya file banao)
# Ya phir apni main.py mein ye routes add karo
#
# FastAPI endpoint — frontend se image aati hai,
# skin tone result return hota hai
# ============================================================

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ml.skin_tone_detector import (
    detect_from_base64,
    TONE_COLOR_MAP,
)

router = APIRouter(prefix="/api", tags=["skin-tone"])


# ── Request / Response models ─────────────────────────────────
class SkinToneRequest(BaseModel):
    image_base64: str   # "data:image/jpeg;base64,..." ya sirf base64 string


class SkinToneResponse(BaseModel):
    skin_tone   : str
    ita_score   : float
    confidence  : float
    fitzpatrick : str
    best_colors : list[str]
    avoid_colors: list[str]
    description : str
    method      : str


class ManualSkinToneRequest(BaseModel):
    # Agar user photo nahi dena chahta — manually select kare
    skin_tone: str   # "Fair" | "Wheatish" | "Dusky" | "Deep"


# ── Routes ───────────────────────────────────────────────────
@router.post("/detect-skin-tone", response_model=SkinToneResponse)
async def detect_skin_tone(req: SkinToneRequest):
    """
    Photo se skin tone detect karo (MediaPipe + ITA method)

    Frontend se base64 image bhejo, skin tone + colors milenge
    """
    if not req.image_base64:
        raise HTTPException(status_code=400, detail="Image data missing hai")

    try:
        result = detect_from_base64(req.image_base64)
        return SkinToneResponse(**result)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Detection mein error: {str(e)}"
        )


@router.post("/skin-tone-colors")
async def get_colors_for_tone(req: ManualSkinToneRequest):
    """
    User ne manually skin tone select kiya — uske liye colors do
    (Photo nahi dena chahta user ko)
    """
    tone = req.skin_tone.strip().capitalize()
    if tone not in TONE_COLOR_MAP:
        valid = list(TONE_COLOR_MAP.keys())
        raise HTTPException(
            status_code=400,
            detail=f"Invalid skin tone. Valid options: {valid}"
        )

    info = TONE_COLOR_MAP[tone]
    return {
        "skin_tone"   : tone,
        "best_colors" : info["best_colors"],
        "avoid_colors": info["avoid_colors"],
        "description" : info["description"],
        "fitzpatrick" : info["fitzpatrick"],
    }


@router.get("/skin-tones")
async def list_skin_tones():
    """Saare available skin tones aur unki info"""
    return {
        tone: {
            "best_colors" : info["best_colors"],
            "avoid_colors": info["avoid_colors"],
            "description" : info["description"],
        }
        for tone, info in TONE_COLOR_MAP.items()
    }
