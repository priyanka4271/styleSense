from __future__ import annotations

import csv
import random
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
CSV_PATH = DATA_DIR / "dress_catalog.csv"

random.seed(42)

DRESS_TYPES = [
    "Saree",
    "Lehenga",
    "Salwar Suit",
    "Kurti",
    "Gown",
    "Western Dress",
    "Co-ord Set",
    "Maxi Dress",
]

COLOR_FAMILIES = {
    "Red": ["Crimson", "Ruby", "Wine", "Maroon", "Coral"],
    "Blue": ["Royal Blue", "Navy", "Powder Blue", "Teal", "Turquoise"],
    "Green": ["Emerald", "Olive", "Mint", "Sage", "Bottle Green"],
    "Pink": ["Blush Pink", "Rose Pink", "Fuchsia", "Mauve", "Rani Pink"],
    "Yellow": ["Mustard", "Lemon", "Gold", "Sunflower", "Amber"],
    "Neutral": ["Beige", "Ivory", "Taupe", "Cream", "Champagne"],
    "Purple": ["Lavender", "Plum", "Lilac", "Amethyst", "Violet"],
    "Orange": ["Peach", "Terracotta", "Rust", "Tangerine", "Burnt Orange"],
    "Black": ["Jet Black", "Charcoal", "Onyx", "Smoky Black", "Graphite"],
}

SKIN_TONES = ["Fair", "Wheatish", "Dusky", "Deep"]
BODY_TYPES = ["Hourglass", "Pear", "Apple", "Rectangle", "Inverted Triangle"]
OCCASIONS = ["Party", "Wedding", "Office", "Casual", "Festive", "Date Night"]
STYLES = ["Traditional", "Western", "Fusion", "Indo-Western"]
FABRICS = ["Cotton", "Silk", "Georgette", "Net", "No preference"]
PRICE_BUCKETS = ["₹500-₹1000", "₹1000-₹3000", "₹3000-₹8000", "₹8000+"]

TYPE_CONFIG = {
    "Saree": {
        "styles": ["Traditional", "Fusion", "Indo-Western"],
        "fabrics": ["Silk", "Georgette", "Cotton", "Net"],
        "occasions": ["Wedding", "Festive", "Party", "Date Night"],
        "prices": ["₹1000-₹3000", "₹3000-₹8000", "₹8000+"],
    },
    "Lehenga": {
        "styles": ["Traditional", "Fusion", "Indo-Western"],
        "fabrics": ["Silk", "Net", "Georgette"],
        "occasions": ["Wedding", "Festive", "Party"],
        "prices": ["₹3000-₹8000", "₹8000+"],
    },
    "Salwar Suit": {
        "styles": ["Traditional", "Fusion", "Indo-Western"],
        "fabrics": ["Cotton", "Silk", "Georgette"],
        "occasions": ["Office", "Casual", "Festive", "Wedding"],
        "prices": ["₹500-₹1000", "₹1000-₹3000", "₹3000-₹8000"],
    },
    "Kurti": {
        "styles": ["Traditional", "Fusion", "Indo-Western"],
        "fabrics": ["Cotton", "Silk", "Georgette"],
        "occasions": ["Office", "Casual", "Festive", "Date Night"],
        "prices": ["₹500-₹1000", "₹1000-₹3000"],
    },
    "Gown": {
        "styles": ["Western", "Fusion", "Indo-Western"],
        "fabrics": ["Net", "Georgette", "Silk"],
        "occasions": ["Party", "Wedding", "Date Night"],
        "prices": ["₹1000-₹3000", "₹3000-₹8000", "₹8000+"],
    },
    "Western Dress": {
        "styles": ["Western", "Fusion"],
        "fabrics": ["Cotton", "Georgette", "Net"],
        "occasions": ["Party", "Casual", "Date Night", "Office"],
        "prices": ["₹500-₹1000", "₹1000-₹3000", "₹3000-₹8000"],
    },
    "Co-ord Set": {
        "styles": ["Western", "Fusion", "Indo-Western"],
        "fabrics": ["Cotton", "Georgette", "Silk"],
        "occasions": ["Casual", "Office", "Party", "Date Night"],
        "prices": ["₹1000-₹3000", "₹3000-₹8000"],
    },
    "Maxi Dress": {
        "styles": ["Western", "Fusion"],
        "fabrics": ["Cotton", "Georgette", "Net"],
        "occasions": ["Casual", "Party", "Date Night", "Festive"],
        "prices": ["₹1000-₹3000", "₹3000-₹8000"],
    },
}

ADJECTIVES = [
    "Embroidered",
    "Floral",
    "Regal",
    "Minimal",
    "Statement",
    "Classic",
    "Contemporary",
    "Handcrafted",
    "Graceful",
    "Luxe",
]

DETAILS = [
    "mirror work",
    "zari border",
    "sequin highlights",
    "thread embroidery",
    "ombre dyeing",
    "printed motifs",
    "pearl accents",
    "ruffled drape",
    "structured silhouette",
    "flowy hemline",
]


def choose_many(options: list[str], minimum: int = 1, maximum: int | None = None) -> list[str]:
    maximum = maximum or len(options)
    count = random.randint(minimum, min(maximum, len(options)))
    return random.sample(options, count)


def build_record(index: int) -> dict[str, str]:
    dress_type = random.choice(DRESS_TYPES)
    config = TYPE_CONFIG[dress_type]
    color_family = random.choice(list(COLOR_FAMILIES))
    color = random.choice(COLOR_FAMILIES[color_family])
    style = random.choice(config["styles"])
    fabric = random.choice(config["fabrics"])
    price_range = random.choice(config["prices"])
    occasions = choose_many(config["occasions"], 1, 3)
    body_types = choose_many(BODY_TYPES, 2, 4)
    skin_tones = choose_many(SKIN_TONES, 2, 4)
    adjective = random.choice(ADJECTIVES)
    detail = random.choice(DETAILS)
    name = f"{adjective} {color} {dress_type}"
    description = (
        f"A {style.lower()} {dress_type.lower()} in {color.lower()} with {detail}, "
        f"crafted in {fabric.lower()} for {', '.join(occasions).lower()} moments."
    )
    dress_slug = dress_type.lower().replace(" ", "-")
    color_slug = color.lower().replace(" ", "-")
    search_name = f"{name} {' '.join(occasions)}".replace(" ", "+")
    image_seed = f"{dress_slug}-{index}"

    return {
        "dress_id": f"DRS{index:04d}",
        "name": name,
        "type": dress_type,
        "color": color,
        "color_family": color_family,
        "suitable_skin_tones": "|".join(sorted(skin_tones)),
        "suitable_body_types": "|".join(sorted(body_types)),
        "occasion": "|".join(sorted(occasions)),
        "style_category": style,
        "fabric": fabric,
        "price_range": price_range,
        "image_url": f"https://picsum.photos/seed/{image_seed}/600/800",
        "description": description,
        "myntra_url": f"https://www.myntra.com/{dress_slug}-{color_slug}?rawQuery={search_name}",
        "flipkart_url": f"https://www.flipkart.com/search?q={search_name}",
        "meesho_url": f"https://meesho.com/search?q={dress_slug}+{color_slug}",
    }


def generate_catalog(rows: int = 540) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "dress_id",
        "name",
        "type",
        "color",
        "color_family",
        "suitable_skin_tones",
        "suitable_body_types",
        "occasion",
        "style_category",
        "fabric",
        "price_range",
        "image_url",
        "description",
        "myntra_url",
        "flipkart_url",
        "meesho_url",
    ]

    with CSV_PATH.open("w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        for index in range(1, rows + 1):
            writer.writerow(build_record(index))

    print(f"Generated {rows} dress records at {CSV_PATH}")


if __name__ == "__main__":
    generate_catalog()
