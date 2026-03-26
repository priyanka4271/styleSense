# StyleSense

StyleSense is an AI-powered dress recommendation and shopping app with a React + Tailwind frontend, a FastAPI backend, and a scikit-learn content-based recommendation engine trained on a synthetic Indian fashion catalog.

## Project Structure

```text
stylesense/
├── frontend/
├── backend/
└── README.md
```

## Features

- Multi-step style quiz with personal info, skin tone, occasion, and preferences
- TensorFlow.js assisted skin tone analysis on the client
- FastAPI endpoints for quiz submission, recommendations, colors, and skin tone detection
- Content-based recommender using TF-IDF, MinMax scaling, and cosine similarity
- Top 10 dress recommendations with explanations and shopping links
- Color guide with best colors, avoid colors, and swatches

## Backend Setup

```bash
cd stylesense/backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python ml/train_model.py
uvicorn main:app --reload
```

Set `DATABASE_URL` for PostgreSQL in production. Without it, the app uses local SQLite at `backend/stylesense.db`.

## Frontend Setup

```bash
cd stylesense/frontend
npm install
npm run dev
```

Optional environment variable:

```bash
VITE_API_URL=http://localhost:8000
```

## Notes

- `backend/data/dress_catalog.csv` contains 540 synthetic records spanning Indian and western categories.
- The current image-based skin tone classifier uses a lightweight heuristic so the app works locally without a heavy pretrained model.
