## Objective
- Replace backend-dependent Hackathon system with fully automated discovery pipeline: scraper → JSON dataset → frontend consumption, removing all database storage

## Important Details
- Hackathons must NEVER be stored in PostgreSQL; they are external opportunities rendered from static JSON
- Scraper runs via GitHub Action every 24 hours, commits `hackathons.json` to repo only when data changes
- Frontend (explorer, detail page) loads directly from `/data/hackathons.json` — no backend API calls
- All backend hackathon code: 5 models, 4 schemas, 2 services, 1 route file — deleted
- Netlify deploy: netlify.toml configured to branch `main`, base `frontend`. User must ensure Netlify dashboard settings match.

## Work State
### Completed (this PR)
- Backend: removed all hackathon model imports, routes, schemas, services (main.py, admin.py/imports/routes, admin_service.py full, profile_service.py, feed_service.py, search_service.py, bookmark_service.py, team_service.py, stats.py, schemas/admin.py, schemas/profile.py, backfill_public_ids.py, test_pagination.py, models/__init__.py)
- Frontend: deleted hackathonService.js, AdminHackathonReview.jsx, HackathonCreate.jsx, HostDashboard.jsx; removed hackathon refs from discoveryService.js, notificationService.js, Sidebar.jsx, Search.jsx, Updates.jsx, App.jsx
- Rewrote Hackathons.jsx to fetch from `/data/hackathons.json` with card grid + links
- Rewrote HackathonDetail.jsx to load single hackathon from JSON by ID
- Created `scripts/scrape_hackathons.py` — multi-source crawler (Devpost, HackerEarth, MLH) + dedup + auto commit/push on changes
- Created `.github/workflows/hackathon-discovery.yml` — runs daily at 0600 UTC + manual trigger
- Created `frontend/public/data/hackathons.json` — initial seed dataset with schema-compliant example
- Both builds pass: backend 132 routes, frontend 0 errors/warnings (~313 kB gzip 93 kB)

### Blocked
- (none)

## Next Move
- PR is ready to commit and push. Run `git add -A && git commit -m "feat: implement automated hackathon discovery pipeline" && git push`

## Relevant Files
- `scripts/scrape_hackathons.py` — scraper entry point (Devpost, HackerEarth, MLH)
- `.github/workflows/hackathon-discovery.yml` — daily cron + manual trigger
- `frontend/public/data/hackathons.json` — static dataset consumed by frontend
- `frontend/src/pages/hackathons/Hackathons.jsx` — JSON-backed explorer with card grid
- `frontend/src/pages/hackathons/HackathonDetail.jsx` — JSON-backed detail page
- `backend/app/main.py` — removed all hackathon router/model imports
- `backend/app/routes/admin.py` — removed hackathon review endpoints
- `backend/app/services/admin_service.py` — removed all hackathon aggregation queries
