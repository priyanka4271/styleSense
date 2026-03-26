from __future__ import annotations

import json
import os
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, String, Text, create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from ml.recommender import UserProfile, estimate_size, recommender
from ml.skin_tone_classifier import COLOR_GUIDE, classify_skin_tone


ROOT = Path(__file__).resolve().parent
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{ROOT / 'stylesense.db'}")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class QuizSession(Base):
    __tablename__ = "quiz_sessions"

    session_id = Column(String, primary_key=True, index=True)
    answers_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


Base.metadata.create_all(bind=engine)

app = FastAPI(title="StyleSense API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PersonalInfo(BaseModel):
    name: str
    age: int
    body_type: str
    height: float
    weight: float


class SkinToneInfo(BaseModel):
    skin_tone: str
    undertone: str
    detection_mode: str


class Preferences(BaseModel):
    budget: str
    style: str
    fabric: str


class QuizSubmission(BaseModel):
    personal_info: PersonalInfo
    skin_tone: SkinToneInfo
    occasion: str
    preferences: Preferences


class RecommendationRequest(BaseModel):
    session_id: str


def get_db() -> Session:
    return SessionLocal()


def serialize_submission(payload: QuizSubmission) -> dict:
    data = payload.model_dump()
    data["personal_info"]["recommended_size"] = estimate_size(
        data["personal_info"]["height"],
        data["personal_info"]["weight"],
    )
    return data


@app.get("/api/health")
def health_check() -> dict:
    return {"status": "ok"}


@app.post("/api/quiz/submit")
def submit_quiz(payload: QuizSubmission) -> dict:
    db = get_db()
    session_id = str(uuid.uuid4())
    session_data = serialize_submission(payload)
    record = QuizSession(session_id=session_id, answers_json=json.dumps(session_data))
    db.add(record)
    db.commit()
    db.close()
    return {"session_id": session_id, "summary": session_data}


@app.post("/api/recommend")
def recommend_dresses(payload: RecommendationRequest) -> dict:
    db = get_db()
    record = db.get(QuizSession, payload.session_id)
    db.close()
    if not record:
        raise HTTPException(status_code=404, detail="Session not found")

    answers = json.loads(record.answers_json)
    profile = UserProfile(
        name=answers["personal_info"]["name"],
        age=answers["personal_info"]["age"],
        body_type=answers["personal_info"]["body_type"],
        height=answers["personal_info"]["height"],
        weight=answers["personal_info"]["weight"],
        skin_tone=answers["skin_tone"]["skin_tone"],
        undertone=answers["skin_tone"]["undertone"],
        occasion=answers["occasion"],
        budget=answers["preferences"]["budget"],
        style=answers["preferences"]["style"],
        fabric=answers["preferences"]["fabric"],
    )
    recommendations = recommender.recommend(profile)
    color_guide = COLOR_GUIDE.get(profile.skin_tone, COLOR_GUIDE["Wheatish"])
    return {
        "session_id": payload.session_id,
        "user_profile": answers,
        "recommendations": recommendations,
        "color_guide": {
            "skin_tone": profile.skin_tone,
            "undertone": profile.undertone,
            "best_colors": color_guide["best_colors"],
            "avoid_colors": color_guide["avoid_colors"],
        },
    }


@app.get("/api/colors/{skin_tone}")
def get_color_palette(skin_tone: str) -> dict:
    normalized = skin_tone.strip().title()
    guide = COLOR_GUIDE.get(normalized)
    if not guide:
        raise HTTPException(status_code=404, detail="Skin tone not found")
    return {"skin_tone": normalized, **guide}


@app.post("/api/skin-tone/detect")
async def detect_skin_tone(file: UploadFile = File(...)) -> dict:
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty image upload")
    return classify_skin_tone(contents)
