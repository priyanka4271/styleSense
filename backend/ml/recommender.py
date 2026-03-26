from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import pandas as pd
from scipy.sparse import csr_matrix, hstack
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler


ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "data" / "dress_catalog.csv"

PRICE_BUCKETS = {
    "₹500-₹1000": 1,
    "₹1000-₹3000": 2,
    "₹3000-₹8000": 3,
    "₹8000+": 4,
}

SIZE_LABELS = {
    "XS": 1,
    "S": 2,
    "M": 3,
    "L": 4,
    "XL": 5,
    "XXL": 6,
}


def estimate_size(height_cm: float, weight_kg: float) -> str:
    bmi = weight_kg / ((height_cm / 100) ** 2) if height_cm and weight_kg else 22
    if bmi < 18.5:
        return "S"
    if bmi < 22:
        return "M"
    if bmi < 26:
        return "L"
    if bmi < 31:
        return "XL"
    return "XXL"


@dataclass
class UserProfile:
    name: str
    age: int
    body_type: str
    height: float
    weight: float
    skin_tone: str
    undertone: str
    occasion: str
    budget: str
    style: str
    fabric: str


class DressRecommender:
    def __init__(self, catalog_path: Path | None = None) -> None:
        self.catalog_path = catalog_path or CATALOG_PATH
        self.catalog = pd.read_csv(self.catalog_path)
        self.catalog.fillna("", inplace=True)
        self.catalog["price_value"] = self.catalog["price_range"].map(PRICE_BUCKETS).fillna(2)
        self.catalog["fit_score"] = self.catalog["suitable_body_types"].apply(lambda value: len(str(value).split("|")))
        self.catalog["search_blob"] = self.catalog.apply(self._build_text_blob, axis=1)

        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
        self.text_matrix = self.vectorizer.fit_transform(self.catalog["search_blob"])

        numeric_frame = self.catalog[["price_value", "fit_score"]]
        self.scaler = MinMaxScaler()
        self.numeric_matrix = csr_matrix(self.scaler.fit_transform(numeric_frame))
        self.feature_matrix = hstack([self.text_matrix, self.numeric_matrix])

    @staticmethod
    def _build_text_blob(row: pd.Series) -> str:
        return " ".join(
            [
                str(row["name"]),
                str(row["type"]),
                str(row["color"]),
                str(row["color_family"]),
                str(row["style_category"]),
                str(row["fabric"]),
                str(row["description"]),
                str(row["suitable_skin_tones"]).replace("|", " "),
                str(row["suitable_body_types"]).replace("|", " "),
                str(row["occasion"]).replace("|", " "),
            ]
        )

    def _user_to_vector(self, profile: UserProfile) -> csr_matrix:
        size_label = estimate_size(profile.height, profile.weight)
        user_blob = " ".join(
            [
                profile.skin_tone,
                profile.undertone,
                profile.occasion,
                profile.body_type,
                profile.style,
                profile.fabric,
                profile.budget,
                size_label,
            ]
        )
        text_vector = self.vectorizer.transform([user_blob])
        numeric_vector = csr_matrix(
            self.scaler.transform(
                [[PRICE_BUCKETS.get(profile.budget, 2), SIZE_LABELS.get(size_label, 3)]]
            )
        )
        return hstack([text_vector, numeric_vector])

    def _build_explanation(self, row: pd.Series, profile: UserProfile) -> str:
        reasons = []
        if profile.skin_tone in str(row["suitable_skin_tones"]).split("|"):
            reasons.append(f"its {row['color'].lower()} tone complements your {profile.skin_tone.lower()} complexion")
        if profile.body_type in str(row["suitable_body_types"]).split("|"):
            reasons.append(f"the silhouette works well for a {profile.body_type.lower()} body shape")
        if profile.occasion in str(row["occasion"]).split("|"):
            reasons.append(f"it fits your {profile.occasion.lower()} plans")
        if profile.fabric == row["fabric"] or profile.fabric == "No preference":
            reasons.append(f"the {row['fabric'].lower()} fabric matches your comfort preference")
        if not reasons:
            reasons.append("its overall profile closely matches your style quiz answers")
        return "This dress suits you because " + ", ".join(reasons[:3]) + "."

    def recommend(self, profile: UserProfile, top_k: int = 10) -> list[dict]:
        user_vector = self._user_to_vector(profile)
        similarities = cosine_similarity(user_vector, self.feature_matrix).flatten()
        top_indices = similarities.argsort()[::-1][:top_k]
        results = []

        for rank, index in enumerate(top_indices, start=1):
            row = self.catalog.iloc[index]
            score = float(similarities[index])
            match_percentage = max(62, min(99, int(round(score * 100))))
            results.append(
                {
                    "rank": rank,
                    "dress_id": row["dress_id"],
                    "name": row["name"],
                    "type": row["type"],
                    "color": row["color"],
                    "color_family": row["color_family"],
                    "style_category": row["style_category"],
                    "fabric": row["fabric"],
                    "price_range": row["price_range"],
                    "image_url": row["image_url"],
                    "description": row["description"],
                    "match_percentage": match_percentage,
                    "why_this_suits_you": self._build_explanation(row, profile),
                    "shopping_links": {
                        "myntra": row["myntra_url"],
                        "flipkart": row["flipkart_url"],
                        "meesho": row["meesho_url"],
                    },
                }
            )

        return results


recommender = DressRecommender()
