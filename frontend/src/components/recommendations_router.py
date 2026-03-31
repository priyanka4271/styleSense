# ============================================================
# FILE: backend/routers/recommendations.py   (naya file)
# Ya apni main.py mein ye routes add karo
# ============================================================

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional
from ml.hybrid_recommender import get_recommender

router = APIRouter(prefix="/api", tags=["recommendations"])


# ── Request / Response Models ─────────────────────────────────

class RecommendRequest(BaseModel):
    session_id       : str
    skin_tone        : str                    # "Fair"|"Wheatish"|"Dusky"|"Deep"
    occasion         : str                    # "Wedding"|"Casual"|"Party"|"Office"
    preferred_colors : list[str] = []
    category         : Optional[str] = None  # "Lehenga"|"Kurti" etc (optional)
    budget_min       : int = Field(default=0,     ge=0)
    budget_max       : int = Field(default=50000, le=200000)
    top_n            : int = Field(default=10,    ge=1, le=20)


class FeedbackRequest(BaseModel):
    session_id : str
    dress_id   : str
    liked      : bool   # True = 👍, False = 👎


# ── Routes ───────────────────────────────────────────────────

@router.post("/recommend")
async def get_recommendations(req: RecommendRequest):
    """
    Quiz answers se personalized dress recommendations lo

    Flow:
      1. Quiz submit hoti hai
      2. Ye endpoint call hota hai
      3. Hybrid recommender scores calculate karta hai
      4. Top N results return hote hain
    """
    # Basic validation
    valid_tones = ["Fair", "Wheatish", "Dusky", "Deep"]
    if req.skin_tone not in valid_tones:
        raise HTTPException(
            status_code=422,
            detail=f"skin_tone must be one of: {valid_tones}"
        )

    if req.budget_min >= req.budget_max:
        raise HTTPException(
            status_code=422,
            detail="budget_min must be less than budget_max"
        )

    try:
        rec     = get_recommender()
        results = rec.recommend(
            session_id       = req.session_id,
            skin_tone        = req.skin_tone,
            occasion         = req.occasion,
            preferred_colors = req.preferred_colors,
            budget_min       = req.budget_min,
            budget_max       = req.budget_max,
            category         = req.category,
            top_n            = req.top_n,
        )

        return {
            "success"        : True,
            "count"          : len(results),
            "recommendations": results,
            "method_used"    : results[0]["method"] if results else "none",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/feedback")
async def submit_feedback(req: FeedbackRequest,
                          background: BackgroundTasks):
    """
    User ka 👍/👎 submit karo

    Ye feedback:
      - DB mein save hota hai
      - Collaborative model improve karta hai
      - Agle recommendations better banata hai

    Background task mein hota hai — user ko wait nahi karna
    """
    try:
        rec = get_recommender()
        # Background mein run karo — response fast milega
        background.add_task(
            rec.record_feedback,
            req.session_id,
            req.dress_id,
            req.liked,
        )

        return {
            "success": True,
            "message": "Shukriya! Tumhara feedback record ho gaya 🙏",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/recommend/stats")
async def get_recommender_stats():
    """Debug endpoint — recommender ki current state dekho"""
    rec    = get_recommender()
    collab = rec.collab

    return {
        "total_feedbacks"    : len(collab.feedback_log),
        "collaborative_ready": collab.has_enough_data(),
        "unique_users"       : len(collab.user_index),
        "unique_items_rated" : len(collab.item_index),
        "catalog_size"       : len(rec.content.catalog),
        "min_feedback_needed": 5,
    }
