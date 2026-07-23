"""Scrape hackathon listings from multiple sources and write to frontend/public/data/hackathons.json"""

import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from typing import Any

import requests
from bs4 import BeautifulSoup

SOURCES = [
    "https://devpost.com/api/hackathons?status=open&page=1",
    "https://www.hackerearth.com/challenges/hackathon/",
    "https://mlh.io/seasons/2026/events",
]

FRONTEND_DATA_DIR = os.path.join(
    os.path.dirname(__file__),
    "..",
    "frontend",
    "public",
    "data",
)
OUTPUT_PATH = os.path.join(FRONTEND_DATA_DIR, "hackathons.json")


def fetch_devpost() -> list[dict[str, Any]]:
    try:
        resp = requests.get(SOURCES[0], timeout=15)
        resp.raise_for_status()
        data = resp.json()
        results: list[dict[str, Any]] = []
        for raw in data.get("hackathons", []):
            results.append(
                {
                    "title": raw.get("title"),
                    "description": raw.get("description", ""),
                    "organizer": "Devpost",
                    "mode": "Online",
                    "type": "hackathon",
                    "start_date": raw.get("submission_period_dates"),
                    "end_date": raw.get("end_date"),
                    "registration_link": raw.get("url"),
                    "official_website": raw.get("url"),
                    "domains": [],
                    "technologies": raw.get("technologies", "").split(", ") if raw.get("technologies") else [],
                    "prize_pool": raw.get("prize_amount"),
                    "status": raw.get("status", "open"),
                    "id": raw.get("id"),
                }
            )
        return results
    except Exception as exc:
        print(f"[devpost] error: {exc}", file=sys.stderr)
        return []


def extract_hackerearth() -> list[dict[str, Any]]:
    try:
        resp = requests.get(SOURCES[1], timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        results: list[dict[str, Any]] = []
        cards = soup.select(".challenge-card")
        for card in cards[:30]:
            title_el = card.select_one(".challenge-card__title")
            desc_el = card.select_one(".challenge-card__description")
            url_el = card.select_one("a")
            results.append(
                {
                    "title": title_el.get_text(strip=True) if title_el else "Untitled",
                    "description": desc_el.get_text(strip=True) if desc_el else "",
                    "organizer": "HackerEarth",
                    "mode": "Online",
                    "type": "hackathon",
                    "start_date": None,
                    "end_date": None,
                    "registration_link": f"https://www.hackerearth.com{url_el['href']}" if url_el and url_el.get("href") else None,
                    "official_website": None,
                    "domains": [],
                    "technologies": [],
                    "prize_pool": None,
                    "status": "open",
                }
            )
        return results
    except Exception as exc:
        print(f"[hackerearth] error: {exc}", file=sys.stderr)
        return []


def extract_mlh() -> list[dict[str, Any]]:
    try:
        resp = requests.get(SOURCES[2], timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        results: list[dict[str, Any]] = []
        for event in soup.select(".event"):
            title_el = event.select_one("h3")
            date_el = event.select_one("p")
            url_el = event.select_one("a")
            results.append(
                {
                    "title": title_el.get_text(strip=True) if title_el else "Untitled",
                    "description": "",
                    "organizer": "MLH",
                    "mode": "In-Person",
                    "type": "hackathon",
                    "start_date": date_el.get_text(strip=True) if date_el else None,
                    "end_date": None,
                    "registration_link": url_el["href"] if url_el and url_el.get("href") else None,
                    "official_website": None,
                    "domains": [],
                    "technologies": [],
                    "prize_pool": None,
                    "status": "open",
                }
            )
        return results
    except Exception as exc:
        print(f"[mlh] error: {exc}", file=sys.stderr)
        return []


def deduplicate(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen: set[str] = set()
    unique: list[dict[str, Any]] = []
    for item in items:
        key = item["title"].lower().strip() if item["title"] else ""
        if key and key not in seen:
            seen.add(key)
            unique.append(item)
    return unique


def assign_ids(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    for idx, item in enumerate(items, start=1):
        item["id"] = idx
    return items


def load_existing() -> list[dict[str, Any]]:
    if os.path.isfile(OUTPUT_PATH):
        with open(OUTPUT_PATH, encoding="utf-8") as f:
            return json.load(f)
    return []


def should_update(new_items: list[dict[str, Any]]) -> bool:
    old = load_existing()
    return json.dumps(new_items, sort_keys=True, default=str) != json.dumps(
        old, sort_keys=True, default=str
    )


def main() -> None:
    os.makedirs(FRONTEND_DATA_DIR, exist_ok=True)

    print("Fetching hackathons…", file=sys.stderr)
    all_items: list[dict[str, Any]] = []
    all_items.extend(fetch_devpost())
    all_items.extend(extract_hackerearth())
    all_items.extend(extract_mlh())

    all_items = deduplicate(all_items)
    all_items = assign_ids(all_items)

    if not should_update(all_items):
        print("No changes — skipping commit.", file=sys.stderr)
        return

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(all_items, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(all_items)} hackathons to {OUTPUT_PATH}", file=sys.stderr)

    try:
        subprocess.run(
            ["git", "add", OUTPUT_PATH],
            check=True,
            capture_output=True,
        )
        subprocess.run(
            [
                "git",
                "commit",
                "-m",
                f"auto: update hackathons dataset ({datetime.now(timezone.utc).strftime('%Y-%m-%d')})",
                "--no-verify",
            ],
            check=True,
            capture_output=True,
        )
        subprocess.run(["git", "push"], check=True, capture_output=True)
        print("Committed and pushed updated dataset.", file=sys.stderr)
    except subprocess.CalledProcessError as exc:
        stderr = exc.stderr.decode() if exc.stderr else ""
        print(f"git: {stderr}", file=sys.stderr)


if __name__ == "__main__":
    main()
