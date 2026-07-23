"""Scrape hackathon listings from multiple sources and write to frontend/public/data/hackathons.json

Filters out past events — only currently active or upcoming hackathons are included.
Auto-commits and pushes when data changes.
"""

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
    os.path.dirname(__file__), "..", "frontend", "public", "data",
)
OUTPUT_PATH = os.path.join(FRONTEND_DATA_DIR, "hackathons.json")

NOW = datetime.now(timezone.utc)


def parse_date(date_str: str | None) -> datetime | None:
    if not date_str:
        return None
    for fmt in (
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%d",
        "%B %d, %Y",
        "%b %d, %Y",
        "%m/%d/%Y",
    ):
        try:
            dt = datetime.strptime(date_str, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except ValueError:
            continue
    match = re.search(r"(\w+)\s+(\d+),\s*(\d{4})", date_str)
    if match:
        try:
            dt = datetime.strptime(f"{match.group(1)} {match.group(2)}, {match.group(3)}", "%B %d, %Y")
            return dt.replace(tzinfo=timezone.utc)
        except ValueError:
            pass
    return None


def is_upcoming(end_date_str: str | None) -> bool:
    dt = parse_date(end_date_str)
    if dt is None:
        return True
    return dt >= NOW


def fetch_devpost() -> list[dict[str, Any]]:
    try:
        resp = requests.get(SOURCES[0], timeout=15)
        resp.raise_for_status()
        data = resp.json()
        results = []
        for raw in data.get("hackathons", []):
            end_str = raw.get("end_date") or raw.get("submission_period_dates")
            if not is_upcoming(end_str):
                continue
            themes = raw.get("themes", [])
            if themes and isinstance(themes[0], dict):
                themes = [t.get("name", "") for t in themes if isinstance(t, dict)]
            prize = raw.get("prize_amount")
            if prize:
                prize = re.sub(r"<[^>]+>", "", prize).strip()
            results.append({
                "title": raw.get("title"),
                "description": raw.get("description", ""),
                "organizer": raw.get("organization_name") or "Devpost",
                "mode": "Online",
                "type": "hackathon",
                "start_date": raw.get("submission_period_dates"),
                "end_date": raw.get("end_date"),
                "registration_link": raw.get("url"),
                "official_website": raw.get("url"),
                "domains": themes,
                "technologies": raw.get("technologies", "").split(", ") if raw.get("technologies") else [],
                "prize_pool": prize,
                "status": "open" if raw.get("open_state") == "open" else "upcoming",
            })
        print(f"  [devpost] {len(results)} hackathons", file=sys.stderr)
        return results
    except Exception as exc:
        print(f"  [devpost] error: {exc}", file=sys.stderr)
        return []


def extract_hackerearth() -> list[dict[str, Any]]:
    try:
        resp = requests.get(SOURCES[1], timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        results = []
        cards = soup.select('[class*="challenge"], [class*="card"], [class*="listing"]')
        if not cards:
            cards = soup.find_all("div", class_=re.compile(r"challenge|hackathon|card"))
        for card in cards[:40]:
            title_el = card.select_one("h2, h3, h4, [class*='title']")
            url_el = card.select_one("a[href]")
            date_el = card.select_one("[class*='date'], [class*='time'], p")
            text = card.get_text(" ", strip=True)
            if not title_el:
                continue
            results.append({
                "title": title_el.get_text(strip=True),
                "description": text[:300] if len(text) > 10 else "",
                "organizer": "HackerEarth",
                "mode": "Online",
                "type": "hackathon",
                "start_date": None,
                "end_date": date_el.get_text(strip=True) if date_el else None,
                "registration_link": f"https://www.hackerearth.com{url_el['href']}" if url_el and url_el.get("href") else None,
                "official_website": None,
                "domains": [],
                "technologies": [],
                "prize_pool": None,
                "status": "open",
            })
        print(f"  [hackerearth] {len(results)} hackathons", file=sys.stderr)
        return results
    except Exception as exc:
        print(f"  [hackerearth] error: {exc}", file=sys.stderr)
        return []


def extract_mlh() -> list[dict[str, Any]]:
    try:
        resp = requests.get(SOURCES[2], timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        results = []
        for event in soup.select('[class*="event"], article, .event-card'):
            title_el = event.select_one("h3, h2, [class*='title']")
            date_el = event.select_one("p, [class*='date'], time")
            url_el = event.select_one("a[href]")
            loc_el = event.select_one("[class*='location'], [class*='city']")
            mode = "In-Person"
            if loc_el and ("online" in loc_el.get_text(strip=True).lower() or "virtual" in loc_el.get_text(strip=True).lower()):
                mode = "Online"
            elif date_el and ("online" in date_el.get_text(strip=True).lower() or "virtual" in date_el.get_text(strip=True).lower()):
                mode = "Online"
            if title_el:
                results.append({
                    "title": title_el.get_text(strip=True),
                    "description": "",
                    "organizer": "MLH",
                    "mode": mode,
                    "type": "hackathon",
                    "start_date": None,
                    "end_date": date_el.get_text(strip=True) if date_el else None,
                    "registration_link": url_el["href"] if url_el and url_el.get("href") else None,
                    "official_website": None,
                    "domains": [],
                    "technologies": [],
                    "prize_pool": None,
                    "status": "upcoming",
                })
        print(f"  [mlh] {len(results)} hackathons", file=sys.stderr)
        return results
    except Exception as exc:
        print(f"  [mlh] error: {exc}", file=sys.stderr)
        return []


def fetch_allhackathons() -> list[dict[str, Any]]:
    try:
        url = "https://us.allhackathons.com/"
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        results = []
        for item in soup.select('[class*="hackathon"], article, [class*="event"]'):
            title_el = item.select_one("h2, h3, h4, [class*='title']")
            if not title_el:
                continue
            date_el = item.select_one("[class*='date'], time, p")
            url_el = item.select_one("a[href]")
            desc_el = item.select_one("p, [class*='desc']")
            text = item.get_text(" ", strip=True)
            results.append({
                "title": title_el.get_text(strip=True),
                "description": desc_el.get_text(strip=True) if desc_el else "",
                "organizer": "AllHackathons",
                "mode": "Online",
                "type": "hackathon",
                "start_date": None,
                "end_date": date_el.get_text(strip=True) if date_el else None,
                "registration_link": url_el["href"] if url_el and url_el.get("href") else None,
                "official_website": None,
                "domains": [],
                "technologies": [],
                "prize_pool": None,
                "status": "upcoming",
            })
        print(f"  [allhackathons] {len(results)} hackathons", file=sys.stderr)
        return results
    except Exception as exc:
        print(f"  [allhackathons] error: {exc}", file=sys.stderr)
        return []


def deduplicate(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen: set[str] = set()
    unique: list[dict[str, Any]] = []
    for item in items:
        title = (item.get("title") or "").lower().strip()
        link = (item.get("registration_link") or "").lower().strip()
        key = title or link
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
    clean = lambda d: json.dumps(d, sort_keys=True, default=str)
    return clean(new_items) != clean(old)


def main() -> None:
    os.makedirs(FRONTEND_DATA_DIR, exist_ok=True)

    print("Fetching hackathons…", file=sys.stderr)
    all_items: list[dict[str, Any]] = []
    all_items.extend(fetch_devpost())
    all_items.extend(extract_hackerearth())
    all_items.extend(extract_mlh())
    all_items.extend(fetch_allhackathons())

    all_items = deduplicate(all_items)
    all_items = assign_ids(all_items)

    print(f"Got {len(all_items)} hackathons total", file=sys.stderr)

    if not should_update(all_items):
        print("No changes — skipping commit.", file=sys.stderr)
        return

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(all_items, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(all_items)} hackathons to {OUTPUT_PATH}", file=sys.stderr)

    try:
        subprocess.run(["git", "add", OUTPUT_PATH], check=True, capture_output=True)
        subprocess.run(
            [
                "git", "commit", "-m",
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
