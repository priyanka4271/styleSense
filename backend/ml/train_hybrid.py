# ============================================================
# FILE: backend/ml/train_hybrid.py
# Ek baar chalao — poora hybrid model train ho jaayega
#
# Command:
#   cd stylesense
#   python backend/ml/train_hybrid.py
#
# Ya custom path ke saath:
#   python backend/ml/train_hybrid.py backend/data/dress_catalog_enhanced.csv
# ============================================================

import sys
import os
import time

# Path setup
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from ml.hybrid_recommender import HybridRecommender

def main():
    print("\n" + "="*55)
    print("  STYLESENSE — HYBRID RECOMMENDER TRAINING")
    print("="*55)

    # Catalog path
    if len(sys.argv) > 1:
        catalog_path = sys.argv[1]
    else:
        catalog_path = os.path.join(
            os.path.dirname(__file__), '..', 'data', 'dress_catalog_enhanced.csv'
        )

    # File exist check
    if not os.path.exists(catalog_path):
        print(f"\n❌ Catalog file nahi mili: {catalog_path}")
        print("   Pehle step2_prepare_myntra_data.py chalao")
        print("   Ya sahi path diye: python train_hybrid.py <path>")
        sys.exit(1)

    print(f"\n📂 Catalog: {catalog_path}")

    # Train
    start = time.time()
    rec   = HybridRecommender()
    rec.train(catalog_path)
    elapsed = time.time() - start

    print(f"⏱️  Training time: {elapsed:.1f} seconds")

    # Quick test
    print("\n🧪 Quick test chal raha hai...")
    results = rec.recommend(
        session_id       = "test_123",
        skin_tone        = "Wheatish",
        occasion         = "Wedding",
        preferred_colors = ["Red", "Gold"],
        budget_min       = 1000,
        budget_max       = 8000,
        top_n            = 3,
    )

    print(f"\n   Top 3 results for Wheatish + Wedding:")
    for i, r in enumerate(results):
        print(f"   {i+1}. {r['name'][:45]}")
        print(f"      ₹{r['price']} | {r['color']} | {r['rating']}⭐")
        print(f"      Reason: {r['reason'][:60]}")

    print("\n" + "="*55)
    print("  ✅ Sab ready hai! Ab server start karo:")
    print()
    print("  cd stylesense/backend")
    print("  uvicorn main:app --reload")
    print("="*55 + "\n")

if __name__ == "__main__":
    main()
