from __future__ import annotations

import io

import numpy as np
from PIL import Image


COLOR_GUIDE = {
    "Fair": {
        "undertone": "Cool",
        "best_colors": ["Rose Pink", "Lavender", "Emerald", "Navy", "Berry"],
        "avoid_colors": ["Neon Yellow", "Dusty Beige", "Ash Brown"],
    },
    "Wheatish": {
        "undertone": "Neutral",
        "best_colors": ["Teal", "Mustard", "Coral", "Olive", "Ivory"],
        "avoid_colors": ["Muddy Grey", "Washed Peach", "Dull Beige"],
    },
    "Dusky": {
        "undertone": "Warm",
        "best_colors": ["Royal Blue", "Emerald", "Coral", "Maroon", "Gold"],
        "avoid_colors": ["Pale Grey", "Faded Yellow", "Dusty Taupe"],
    },
    "Deep": {
        "undertone": "Warm",
        "best_colors": ["Fuchsia", "Cobalt", "Burnt Orange", "Plum", "Champagne"],
        "avoid_colors": ["Muted Olive", "Cloud Grey", "Light Beige"],
    },
}


def classify_skin_tone(image_bytes: bytes) -> dict:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((128, 128))
    pixels = np.asarray(image).reshape(-1, 3)
    mean_rgb = pixels.mean(axis=0)
    brightness = float(mean_rgb.mean())
    red, green, blue = mean_rgb

    if brightness > 190:
        skin_tone = "Fair"
    elif brightness > 155:
        skin_tone = "Wheatish"
    elif brightness > 110:
        skin_tone = "Dusky"
    else:
        skin_tone = "Deep"

    if red - blue > 20:
        undertone = "Warm"
    elif blue - red > 18:
        undertone = "Cool"
    else:
        undertone = "Neutral"

    guide = COLOR_GUIDE[skin_tone]
    return {
        "skin_tone": skin_tone,
        "undertone": undertone if undertone else guide["undertone"],
        "confidence": round(min(0.94, 0.62 + abs(red - blue) / 255), 2),
        "best_colors": guide["best_colors"],
        "avoid_colors": guide["avoid_colors"],
    }
