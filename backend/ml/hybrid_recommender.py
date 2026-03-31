# ============================================================
# FILE: backend/ml/hybrid_recommender.py   (naya file)
#
# Kya karta hai:
#   1. Content-based  — dress features (TF-IDF + cosine)
#   2. Collaborative  — similar users ki pasand (SVD/matrix)
#   3. Dono combine   — weighted hybrid score
#   4. Feedback loop  — 👍👎 se weights update hote hain
#
# Install: pip install scikit-learn scipy pandas numpy
# ============================================================

import os
import pickle
import numpy as np
import pandas as pd
from pathlib import Path
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import svds
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

MODEL_DIR = Path(__file__).parent / "models"
MODEL_DIR.mkdir(exist_ok=True)

# ─── Weight config ────────────────────────────────────────────
# Jab koi feedback nahi → sirf content use karo
# Jab feedback aa jaaye → collaborative zyada important hoga
CONTENT_WEIGHT      = 0.60
COLLAB_WEIGHT       = 0.40
MIN_FEEDBACK_FOR_CF = 5    # itne feedback ke baad collaborative ON hoga


# ════════════════════════════════════════════════════════════
# PART 1 — CONTENT-BASED ENGINE
# ════════════════════════════════════════════════════════════

class ContentEngine:
    """
    TF-IDF + cosine similarity se dress features match karta hai
    Ye hamesha kaam karta hai — feedback ki zaroorat nahi
    """

    def __init__(self):
        self.tfidf      = None
        self.scaler     = None
        self.catalog    = None
        self.tfidf_mat  = None   # sparse matrix

    def build_text_features(self, df: pd.DataFrame) -> pd.Series:
        """Har dress ke liye ek rich text description banao"""
        def row_to_text(row):
            parts = [
                str(row.get('type', '')),
                str(row.get('color', '')),
                str(row.get('color_family', '')),
                str(row.get('fabric', '')),
                str(row.get('occasion', '')).replace('|', ' '),
                str(row.get('style_category', '')),
                str(row.get('suitable_skin_tones', '')).replace('|', ' '),
                str(row.get('pattern', '')),
                str(row.get('season', '')).replace('|', ' '),
                str(row.get('brand', '')),
                str(row.get('tags', '')).replace('|', ' '),
            ]
            return ' '.join(p for p in parts if p and p.lower() != 'nan')

        return df.apply(row_to_text, axis=1)

    def fit(self, df: pd.DataFrame):
        """Catalog se TF-IDF model train karo"""
        self.catalog = df.reset_index(drop=True)

        # Text features
        text_features = self.build_text_features(df)

        self.tfidf = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            stop_words='english',
            min_df=2,
            sublinear_tf=True,   # log(tf) — better for fashion
        )
        self.tfidf_mat = self.tfidf.fit_transform(text_features)

        # Numeric features
        num_cols = ['price', 'rating', 'discount_pct', 'rating_count']
        avail    = [c for c in num_cols if c in df.columns]
        self.scaler = MinMaxScaler()
        self._num_mat = self.scaler.fit_transform(
            df[avail].fillna(0)
        )
        self._avail_num_cols = avail
        print(f"  ✅ Content engine ready — {len(df)} items, vocab={self.tfidf_mat.shape[1]}")

    def get_scores(self,
                   skin_tone: str,
                   occasion: str,
                   preferred_colors: list,
                   budget_min: int = 0,
                   budget_max: int = 99999,
                   category: str = None) -> np.ndarray:
        """
        Quiz answers ke basis pe har dress ka content score nikalo
        Returns: numpy array of shape (n_items,)
        """
        df = self.catalog

        # ── Build query text ──────────────────────────────────
        query_parts = [
            skin_tone,
            occasion,
            ' '.join(preferred_colors),
            category or '',
        ]
        query_text = ' '.join(p for p in query_parts if p)
        query_vec  = self.tfidf.transform([query_text])

        # Cosine similarity with full catalog
        content_scores = cosine_similarity(query_vec, self.tfidf_mat).flatten()

        # ── Skin tone bonus ───────────────────────────────────
        SKIN_COLOR_MAP = {
            "fair"     : ["pink", "red", "coral", "lavender", "sky blue", "white"],
            "wheatish" : ["orange", "gold", "teal", "emerald", "rust", "coral"],
            "dusky"    : ["yellow", "orange", "gold", "white", "fuchsia", "cobalt"],
            "deep"     : ["yellow", "gold", "white", "electric blue", "lime", "silver"],
        }
        good_colors = SKIN_COLOR_MAP.get(skin_tone.lower(), [])
        skin_bonus  = df['color'].str.lower().apply(
            lambda c: 0.08 if any(g in c for g in good_colors) else 0.0
        ).values

        # ── Occasion bonus ────────────────────────────────────
        occ_bonus = df['occasion'].str.lower().apply(
            lambda o: 0.10 if occasion.lower() in o else 0.0
        ).values

        # ── Color preference bonus ────────────────────────────
        pref_colors_lower = [c.lower() for c in preferred_colors]
        color_bonus = df['color'].str.lower().apply(
            lambda c: 0.08 if c in pref_colors_lower else 0.0
        ).values

        # ── Price filter (hard) ───────────────────────────────
        if 'price' in df.columns:
            price_mask = (
                (df['price'] >= budget_min) &
                (df['price'] <= budget_max)
            ).values.astype(float)
        else:
            price_mask = np.ones(len(df))

        # ── Category filter ───────────────────────────────────
        if category and 'type' in df.columns:
            cat_mask = df['type'].str.lower().apply(
                lambda t: 1.0 if category.lower() in t.lower() else 0.6
            ).values
        else:
            cat_mask = np.ones(len(df))

        # ── Rating quality boost ──────────────────────────────
        if 'rating' in df.columns:
            rating_boost = ((df['rating'].fillna(3.5) - 3.0) / 4.0 * 0.05).values
        else:
            rating_boost = np.zeros(len(df))

        # ── Combine ───────────────────────────────────────────
        final = (
            content_scores
            + skin_bonus
            + occ_bonus
            + color_bonus
            + rating_boost
        ) * price_mask * cat_mask

        return final

    def save(self):
        with open(MODEL_DIR / "content_tfidf.pkl",  "wb") as f: pickle.dump(self.tfidf,   f)
        with open(MODEL_DIR / "content_scaler.pkl", "wb") as f: pickle.dump(self.scaler,  f)
        with open(MODEL_DIR / "content_catalog.pkl","wb") as f: pickle.dump(self.catalog, f)
        with open(MODEL_DIR / "tfidf_matrix.pkl",   "wb") as f: pickle.dump(self.tfidf_mat, f)
        print("  ✅ Content engine saved")

    def load(self):
        with open(MODEL_DIR / "content_tfidf.pkl",  "rb") as f: self.tfidf    = pickle.load(f)
        with open(MODEL_DIR / "content_scaler.pkl", "rb") as f: self.scaler   = pickle.load(f)
        with open(MODEL_DIR / "content_catalog.pkl","rb") as f: self.catalog  = pickle.load(f)
        with open(MODEL_DIR / "tfidf_matrix.pkl",   "rb") as f: self.tfidf_mat = pickle.load(f)
        print(f"  ✅ Content engine loaded — {len(self.catalog)} items")


# ════════════════════════════════════════════════════════════
# PART 2 — COLLABORATIVE FILTERING ENGINE
# ════════════════════════════════════════════════════════════

class CollaborativeEngine:
    """
    User feedback (👍/👎) se seekhta hai
    Similar users ki pasand ko recommend karta hai
    SVD (Singular Value Decomposition) use karta hai
    """

    def __init__(self):
        self.user_item_matrix = None   # user × item feedback matrix
        self.user_factors     = None   # SVD se nikale user vectors
        self.item_factors     = None   # SVD se nikale item vectors
        self.user_index       = {}     # session_id → row index
        self.item_index       = {}     # dress_id → col index
        self.feedback_log     = []     # raw feedback records

    def add_feedback(self, session_id: str, dress_id: str, liked: bool):
        """
        Ek feedback record add karo
        liked=True → +1, liked=False → -1
        """
        score = 1.0 if liked else -0.5   # negative feedback ko thoda less weight
        self.feedback_log.append({
            'session_id': session_id,
            'dress_id'  : dress_id,
            'score'     : score,
        })

    def has_enough_data(self) -> bool:
        return len(self.feedback_log) >= MIN_FEEDBACK_FOR_CF

    def fit(self):
        """
        Feedback log se SVD model train karo
        Jab bhi naya feedback aaye, yahi call karo
        """
        if not self.has_enough_data():
            print(f"  ⚠️  Sirf {len(self.feedback_log)} feedback hain — "
                  f"{MIN_FEEDBACK_FOR_CF} chahiye")
            return False

        df = pd.DataFrame(self.feedback_log)

        # Unique users aur items
        users = df['session_id'].unique().tolist()
        items = df['dress_id'].unique().tolist()
        self.user_index = {u: i for i, u in enumerate(users)}
        self.item_index = {d: j for j, d in enumerate(items)}

        # User × Item matrix banao
        n_users = len(users)
        n_items = len(items)
        data = np.zeros((n_users, n_items))

        for _, row in df.iterrows():
            u = self.user_index[row['session_id']]
            i = self.item_index[row['dress_id']]
            data[u, i] = row['score']

        self.user_item_matrix = data

        # SVD — k factors (latent dimensions)
        k = min(20, min(n_users, n_items) - 1)
        if k < 1:
            return False

        U, sigma, Vt = svds(csr_matrix(data), k=k)
        self.user_factors = U * sigma   # (n_users × k)
        self.item_factors = Vt.T        # (n_items × k)

        print(f"  ✅ Collaborative engine fitted — "
              f"{n_users} users, {n_items} items, k={k}")
        return True

    def get_scores_for_session(self,
                                session_id: str,
                                all_dress_ids: list) -> np.ndarray:
        """
        Ek user ke liye sab dresses ka collaborative score nikalo
        Returns: numpy array, unknown items = 0
        """
        scores = np.zeros(len(all_dress_ids))

        if (self.user_factors is None or
                session_id not in self.user_index):
            return scores   # naya user — koi collab score nahi

        u_idx    = self.user_index[session_id]
        u_vector = self.user_factors[u_idx]   # (k,)

        for j, dress_id in enumerate(all_dress_ids):
            if dress_id in self.item_index:
                i_idx = self.item_index[dress_id]
                scores[j] = float(np.dot(u_vector, self.item_factors[i_idx]))

        # Normalize to [0, 1]
        if scores.max() > scores.min():
            scores = (scores - scores.min()) / (scores.max() - scores.min())

        return scores

    def save(self):
        state = {
            'user_item_matrix': self.user_item_matrix,
            'user_factors'    : self.user_factors,
            'item_factors'    : self.item_factors,
            'user_index'      : self.user_index,
            'item_index'      : self.item_index,
            'feedback_log'    : self.feedback_log,
        }
        with open(MODEL_DIR / "collab_engine.pkl", "wb") as f:
            pickle.dump(state, f)
        print(f"  ✅ Collaborative engine saved — {len(self.feedback_log)} feedbacks")

    def load(self):
        path = MODEL_DIR / "collab_engine.pkl"
        if not path.exists():
            print("  ℹ️  Collaborative engine nahi mila — fresh start")
            return
        with open(path, "rb") as f:
            state = pickle.load(f)
        self.__dict__.update(state)
        print(f"  ✅ Collaborative engine loaded — {len(self.feedback_log)} feedbacks")


# ════════════════════════════════════════════════════════════
# PART 3 — HYBRID ENGINE (Main Class)
# ════════════════════════════════════════════════════════════

class HybridRecommender:
    """
    Content + Collaborative dono combine karta hai
    Ye class directly FastAPI se call karo
    """

    def __init__(self):
        self.content  = ContentEngine()
        self.collab   = CollaborativeEngine()
        self._loaded  = False

    def train(self, catalog_path: str):
        """Poora model train karo — deploy se pehle ek baar"""
        print("\n🚀 Hybrid Recommender training shuru...")
        df = pd.read_csv(catalog_path)
        print(f"  📦 Catalog: {len(df)} items")
        self.content.fit(df)
        self.content.save()
        self.collab.save()   # empty state save karo
        self._loaded = True
        print("✅ Training complete!\n")

    def load(self):
        """Server start pe models load karo"""
        if self._loaded:
            return
        print("📦 Hybrid recommender load ho raha hai...")
        self.content.load()
        self.collab.load()
        self._loaded = True
        print("✅ Ready!\n")

    def recommend(self,
                  session_id: str,
                  skin_tone: str,
                  occasion: str,
                  preferred_colors: list,
                  budget_min: int = 0,
                  budget_max: int = 99999,
                  category: str = None,
                  top_n: int = 10) -> list:
        """
        Main recommendation function
        Call karo quiz submit hone ke baad
        """
        if not self._loaded:
            self.load()

        catalog = self.content.catalog
        dress_ids = catalog['dress_id'].tolist() if 'dress_id' in catalog.columns \
                    else catalog.index.astype(str).tolist()

        # ── Content scores ────────────────────────────────────
        content_scores = self.content.get_scores(
            skin_tone       = skin_tone,
            occasion        = occasion,
            preferred_colors= preferred_colors,
            budget_min      = budget_min,
            budget_max      = budget_max,
            category        = category,
        )

        # ── Collaborative scores ──────────────────────────────
        if self.collab.has_enough_data() and self.collab.user_factors is not None:
            collab_scores = self.collab.get_scores_for_session(session_id, dress_ids)
            # Normalize content scores to [0,1] before combining
            if content_scores.max() > 0:
                norm_content = content_scores / content_scores.max()
            else:
                norm_content = content_scores

            final_scores = (
                CONTENT_WEIGHT * norm_content +
                COLLAB_WEIGHT  * collab_scores
            )
            method_used = "hybrid"
        else:
            final_scores = content_scores
            method_used  = "content_only"

        # ── Top N results ─────────────────────────────────────
        top_indices = final_scores.argsort()[-top_n * 3:][::-1]

        results = []
        seen_types = {}   # diversity: har type se max 4 items

        for idx in top_indices:
            if len(results) >= top_n:
                break

            row       = catalog.iloc[idx]
            item_type = row.get('type', 'Unknown')

            # Diversity check
            if seen_types.get(item_type, 0) >= 4:
                continue
            seen_types[item_type] = seen_types.get(item_type, 0) + 1

            score = float(final_scores[idx])

            # ── Human-readable reason ─────────────────────────
            reasons = []
            if occasion.lower() in str(row.get('occasion','')).lower():
                reasons.append(f"{occasion} ke liye perfect")
            if any(c.lower() in str(row.get('color','')).lower()
                   for c in preferred_colors):
                reasons.append(f"tumhari pasand ka color")
            if skin_tone.lower() in str(row.get('suitable_skin_tones','')).lower():
                reasons.append(f"{skin_tone} skin pe suits karta hai")
            if float(row.get('discount_pct', 0)) > 20:
                reasons.append(f"{int(row.get('discount_pct',0))}% off chal raha hai")
            if float(row.get('rating', 0)) >= 4.2:
                reasons.append(f"{row.get('rating')}⭐ highly rated")
            if method_used == "hybrid":
                reasons.append("tumhare jaise users ne pasand kiya")

            reason_text = " • ".join(reasons) if reasons \
                         else "Tumhari style se match karta hai"

            results.append({
                "dress_id"    : str(row.get('dress_id', idx)),
                "name"        : str(row.get('name', '')),
                "type"        : str(row.get('type', '')),
                "color"       : str(row.get('color', '')),
                "fabric"      : str(row.get('fabric', '')),
                "occasion"    : str(row.get('occasion', '')),
                "style"       : str(row.get('style_category', '')),
                "price"       : int(row.get('price', 0)),
                "mrp"         : int(row.get('mrp', row.get('price', 0))),
                "discount_pct": float(row.get('discount_pct', 0)),
                "rating"      : float(row.get('rating', 0)),
                "rating_count": int(row.get('rating_count', 0)),
                "brand"       : str(row.get('brand', '')),
                "image_url"   : str(row.get('image_url', '')),
                "myntra_url"  : str(row.get('myntra_url', '')),
                "flipkart_url": str(row.get('flipkart_url', '')),
                "meesho_url"  : str(row.get('meesho_url', '')),
                "match_score" : round(score, 3),
                "reason"      : reason_text,
                "method"      : method_used,
            })

        return results

    def record_feedback(self,
                        session_id: str,
                        dress_id: str,
                        liked: bool):
        """
        User ka 👍/👎 record karo
        Enough feedback hone pe collaborative model retrain hoga
        """
        self.collab.add_feedback(session_id, dress_id, liked)

        # Har 10 feedbacks pe retrain karo
        if len(self.collab.feedback_log) % 10 == 0:
            print("🔄 Collaborative model retrain ho raha hai...")
            self.collab.fit()
            self.collab.save()

        # Save latest feedback
        self.collab.save()


# ════════════════════════════════════════════════════════════
# Singleton — server pe ek hi instance hoga
# ════════════════════════════════════════════════════════════
_recommender_instance = None

def get_recommender() -> HybridRecommender:
    global _recommender_instance
    if _recommender_instance is None:
        _recommender_instance = HybridRecommender()
        _recommender_instance.load()
    return _recommender_instance


# ─── Quick Test ──────────────────────────────────────────────
if __name__ == "__main__":
    import sys

    catalog_path = sys.argv[1] if len(sys.argv) > 1 \
                   else "backend/data/dress_catalog_enhanced.csv"

    rec = HybridRecommender()
    rec.train(catalog_path)

    print("\n🧪 Test recommendation:")
    results = rec.recommend(
        session_id       = "test_user_001",
        skin_tone        = "Wheatish",
        occasion         = "Wedding",
        preferred_colors = ["Red", "Gold", "Maroon"],
        budget_min       = 2000,
        budget_max       = 10000,
        top_n            = 5,
    )

    print(f"\nTop {len(results)} results:\n")
    for i, r in enumerate(results):
        print(f"{i+1}. {r['name'][:50]}")
        print(f"   ₹{r['price']} | {r['color']} | {r['rating']}⭐ | {r['brand']}")
        print(f"   Reason : {r['reason']}")
        print(f"   Method : {r['method']}")
        print(f"   Score  : {r['match_score']}")
        print()

    # Feedback simulate karo
    print("🧪 Feedback test:")
    rec.record_feedback("test_user_001", results[0]['dress_id'], liked=True)
    rec.record_feedback("test_user_001", results[1]['dress_id'], liked=False)
    print("   Feedback recorded!")
