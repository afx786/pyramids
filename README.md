# Pyramids

Pyramids is a student/builder collaboration platform — a place to showcase projects, get your GitHub repos automatically analyzed for the tech and skills they demonstrate, find teammates, connect with other builders, form teams, join hackathons and research groups, message each other, and climb a project/skill-based rank ladder (from **Explorer** up to **Pyramidion**).

The repo is a full-stack app split into two deployable pieces:

- **`backend/`** — a FastAPI + SQLAlchemy + PostgreSQL REST API (deployed on Render)
- **`frontend/`** — a React (Vite + Tailwind) single-page app (deployed on GitHub Pages)

The frontend now talks to the real backend over HTTP (JWT bearer auth stored in `localStorage`) rather than the mock/in-memory data layer used in earlier versions of this project.

---

## Features

- **Auth** — signup/login with hashed passwords (bcrypt) and JWT bearer tokens
- **Projects** — create, list, update, and search projects by domain/skills/tech; admin verification workflow
- **GitHub Repository Intelligence** 🧠 — point Pyramids at a public GitHub repo and it will:
  - Pull repository metadata, languages, and file tree via the GitHub API
  - Detect frameworks, libraries, databases, cloud, and DevOps tooling from file contents and manifests
  - Infer **verified skills** with a confidence score and cited evidence for each one
  - Compute repo statistics (file counts by language, Docker usage, CI workflow presence, etc.)
- **Skills & Technologies** — tagging projects with skills/tech, plus skill analytics
- **Connections** — send/accept/reject/cancel connection requests, list connections, remove a connection
- **Teams** — create teams, send/accept join requests, manage members
- **Hackathons** — list/create hackathons, register teams
- **Research groups** — create research projects, manage membership and join requests
- **Opportunities & Feed** — a feed of opportunities/updates across the platform
- **Messaging** — 1:1 conversations with read/delete state
- **Notifications & Bookmarks**
- **Ranks & Leaderboard** — points from projects/skills roll up into a rank (Explorer → Builder → Creator → Architect → Pyramidion)
- **Admin** — an admin-only set of endpoints for moderation/oversight
- **Stats** — platform-wide statistics

---

## Tech Stack

### Backend
| Layer | Tech |
|---|---|
| Framework | [FastAPI](https://fastapi.tiangolo.com/) |
| ORM | SQLAlchemy |
| Database | PostgreSQL (via `psycopg`) |
| Auth | JWT (`python-jose`) + `passlib[bcrypt]` |
| External API | GitHub REST API (via `requests`) |
| Config | `python-dotenv` / environment variables |
| Hosting | [Render](https://render.com) (see `render.yaml`) |

### Frontend
| Layer | Tech |
|---|---|
| Framework | React 18 (Vite) |
| Routing | `react-router-dom` (`HashRouter`, for GitHub Pages compatibility) |
| Styling | Tailwind CSS |
| Icons | `lucide-react` |
| Hosting | GitHub Pages (via `gh-pages` / GitHub Actions) |

---

## Project Structure

```
Pyramids/
├── render.yaml                     # Render deployment config (API + Postgres)
├── .github/workflows/deploy.yml    # CI: build frontend, deploy to GitHub Pages
│
├── backend/
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── main.py                 # FastAPI app, CORS, router registration
│       ├── deps.py                 # DB session dependency
│       ├── core/                   # JWT auth, admin guard, password hashing
│       ├── database/                # SQLAlchemy engine/session/Base
│       ├── models/                  # SQLAlchemy ORM models (User, Project, Team, Connection, ...)
│       ├── schemas/                  # Pydantic request/response schemas
│       ├── services/
│       │   ├── github/                # Thin GitHub REST API client (repo, tree, languages, contents, search, readme)
│       │   ├── intelligence/          # Repo analysis pipeline: tech detection, evidence + confidence scoring, skill inference
│       │   └── *_service.py           # Business logic, one module per domain
│       └── routes/                    # FastAPI routers, one module per domain
│
└── frontend/
    ├── .env.example
    └── src/
        ├── main.jsx / App.jsx         # Entry point + route table (wrapped in AuthProvider + HashRouter)
        ├── context/AuthContext.jsx    # Auth/session state, profile + rank loading
        ├── layouts/MainLayout.jsx     # Authenticated app shell
        ├── routes/ProtectedRoute.jsx  # Redirects to /login when not authenticated
        ├── pages/                     # One folder per route (dashboard, teams, messages, connections, ...)
        ├── components/                # ui/, common/, layout/ building blocks
        └── services/
            ├── api.js                  # Fetch wrapper: base URL, bearer token, 401 handling
            └── *Service.js              # Per-domain calls against the real API
```

---

## Getting Started

### Prerequisites
- Python 3.13+
- Node.js 18+ (20 used in CI)
- PostgreSQL running locally

### Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy the example env file and fill it in:

```bash
cp .env.example .env
```

```
DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/pyramids_db
SECRET_KEY=your-very-secret-key-here
ALLOWED_ORIGINS=http://localhost:5173,https://afx786.github.io
```

Run the API:

```bash
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`, with interactive docs at `/docs` and `/redoc`. Tables are auto-created on startup via `Base.metadata.create_all`. CORS is restricted to the origins listed in `ALLOWED_ORIGINS`.

> The GitHub-backed endpoints (`/github/analyze`, `/intelligence/analyze`) call the public GitHub REST API unauthenticated, so they're subject to GitHub's anonymous rate limits and only work against **public** repositories.

### Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

```
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

The app runs at the URL Vite prints (typically `http://localhost:5173`) and talks to the backend at `VITE_API_URL`.

Build / preview / deploy:

```bash
npm run build      # production build (base path: /pyramids/)
npm run preview
npm run deploy      # build + publish frontend/dist to the gh-pages branch
```

---

## Deployment

- **Frontend** — `.github/workflows/deploy.yml` builds the Vite app on every push to `main` (using the `VITE_API_URL` repo variable) and publishes `frontend/dist` to GitHub Pages.
- **Backend** — `render.yaml` defines a Render web service (`pyramids-api`) built from `backend/` with `pip install -r requirements.txt` / `uvicorn app.main:app`, plus a managed Postgres instance (`pyramids-db`). `SECRET_KEY` is auto-generated by Render and `DATABASE_URL` is injected from the managed database.

---

## API Overview

All routes are mounted from `backend/app/main.py`. Interactive, always-up-to-date docs are available at `/docs` (Swagger UI) and `/redoc` once the server is running.

| Prefix | Purpose |
|---|---|
| `/auth` | Signup, login |
| `/users` | Current user, user lookup |
| `/projects` | CRUD + verification/status updates for projects |
| `/project-search` | Search/filter projects |
| `/skills`, `/technologies` | Reference data + skill analytics |
| `/connections` | Connection requests, accept/reject/cancel, list, remove |
| `/teams` | Team CRUD, join requests, membership |
| `/ranks`, `/leaderboard` | Rank calculation and leaderboard |
| `/hackathons` | Hackathon listings, team registration |
| `/opportunities` | Opportunity postings |
| `/feed` | Aggregated activity feed |
| `/research` | Research groups, membership, join requests |
| `/messages` | Conversations and messages |
| `/notifications` | User notifications |
| `/bookmarks` | Saved items |
| `/profile` | Profile view/update |
| `/search` | Global search |
| `/stats` | Platform statistics |
| `/github` | Fetch/analyze a single public GitHub repo's basic metadata |
| `/intelligence` | Full repository analysis: tech stack detection + evidence-based skill inference |
| `/admin` | Admin-only moderation endpoints |

## Frontend Routes

| Path | Page |
|---|---|
| `/login`, `/signup` | Auth |
| `/dashboard` | Home/overview |
| `/domains` | Browse by domain |
| `/teams` | Teams |
| `/messages` | Messaging |
| `/connections` | Connections |
| `/requests` | Incoming/outgoing requests |
| `/updates` | Feed/updates |
| `/pyramidion` | Rank progress |
| `/profile` | Profile |
| `/projects/new` | Create a project |

All authenticated routes are gated by `ProtectedRoute` and rendered inside `MainLayout` (sidebar + topbar shell). Routing uses `HashRouter` so client-side routes work correctly when served as a static site from GitHub Pages.

---

## Repository Intelligence Pipeline

`POST /intelligence/analyze` (given a `github_url`) runs:

1. **`services/github/`** — fetches repo metadata, language breakdown, and the full file tree from the GitHub REST API
2. **`intelligence/repository_parser.py`** — pulls down relevant file contents (manifests, config files, source samples), skipping ignored paths (`ignore_engine.py` / `ignore_patterns.py`)
3. **`intelligence/technology_detector.py`** + **`technology_patterns.py`** — pattern-matches file contents/paths against known frameworks, libraries, databases, cloud providers, and DevOps tooling
4. **`intelligence/evidence_collector.py`** / **`evidence_engine.py`** + **`confidence.py`** — attaches supporting evidence and a confidence score to each detected technology
5. **`intelligence/skill_inference.py`** + **`skill_mappings.py`** — maps detected technologies to human-readable **verified skills**
6. The orchestrator (`intelligence/orchestrator.py`) assembles all of the above plus basic repo statistics into the final response

This is what powers "verified skills" on a user's profile as an alternative/complement to self-reported skills.

---

## Rank System

A user's rank is derived from their project count and the number of distinct skills used across their projects (`points = projects × 10 + skills × 5`):

| Points | Rank |
|---|---|
| 0–49 | Explorer |
| 50–99 | Builder |
| 100–199 | Creator |
| 200–399 | Architect |
| 400+ | Pyramidion |

---

## Known Gaps / Next Steps

- `backend/app/routes/verification.py` and `backend/app/schemas/verification.py` exist as empty scaffolding — the admin project-verification flow currently lives inline in `routes/projects.py` and hasn't been split out yet.
- The GitHub/intelligence endpoints call the GitHub API unauthenticated; adding a `GITHUB_TOKEN` would raise the rate limit and allow private-repo support down the line.
- `frontend/src/services/mockApi.js` and `frontend/src/data/mockData.js` are unused leftovers from the pre-integration mock layer and can be removed.
- Add automated tests for both backend and frontend.
