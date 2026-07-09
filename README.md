# Pyramids

Pyramids is a student/builder collaboration platform — a place to showcase projects, find teammates, form teams, join hackathons and research groups, message other builders, and climb a skill-and-project-based rank ladder (from **Explorer** up to **Pyramidion**).

The repo is a full-stack app split into two independent pieces:

- **`backend/`** — a FastAPI + SQLAlchemy + PostgreSQL REST API
- **`frontend/`** — a React (Vite + Tailwind) single-page app

> **Current state:** the frontend is fully built out against a local **mock API** (in-memory data + `localStorage`, see `frontend/src/services/mockApi.js` and `authService.js`) and is not yet wired up to the real backend. The backend is a separate, working FastAPI service with its own database and JWT auth. Connecting the two (replacing the mock services with real HTTP calls) is the main integration work left to do.

---

## Features

- **Auth** — signup/login with hashed passwords (bcrypt) and JWT bearer tokens
- **Projects** — create, list, update, verify, and search projects by domain/skills/tech
- **Skills & Technologies** — tagging projects with skills/tech, plus skill analytics
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

### Frontend
| Layer | Tech |
|---|---|
| Framework | React 18 (Vite) |
| Routing | `react-router-dom` |
| Styling | Tailwind CSS |
| Icons | `lucide-react` |

---

## Project Structure

```
Pyramids/
├── backend/
│   └── app/
│       ├── main.py                # FastAPI app, router registration
│       ├── deps.py                # DB session dependency
│       ├── core/                  # auth (JWT), security (password hashing), admin guard
│       ├── database/              # SQLAlchemy engine/session/Base
│       ├── models/                # SQLAlchemy ORM models (User, Project, Team, ...)
│       ├── schemas/                # Pydantic request/response schemas
│       ├── services/               # Business logic, one module per domain
│       └── routes/                 # FastAPI routers, one module per domain
│
└── frontend/
    └── src/
        ├── main.jsx / App.jsx      # Entry point + route table
        ├── layouts/MainLayout.jsx  # Authenticated app shell
        ├── routes/ProtectedRoute.jsx
        ├── pages/                  # One folder per route (dashboard, teams, messages, ...)
        ├── components/             # ui/, common/, layout/ building blocks
        ├── services/                # Mock API + per-domain service wrappers
        └── data/mockData.js         # Seed data used by the mock services
```

---

## Getting Started

### Prerequisites
- Python 3.13+
- Node.js 18+
- PostgreSQL running locally

### Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy psycopg[binary] python-jose[cryptography] passlib[bcrypt] python-multipart
```

Create a PostgreSQL database and set the connection string. The backend currently reads it from `app/database/session.py`; a `.env` file with the following keys is also present and should be wired up via `python-dotenv` / `pydantic-settings` if you externalize config:

```
DATABASE_URL=postgresql+psycopg://<user>:<password>@localhost:5432/pyramids_db
SECRET_KEY=<your-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> ⚠️ **Security note:** `app/core/auth.py` currently hardcodes a placeholder `SECRET_KEY = "your_secret_key"` and `session.py` hardcodes the database URL/credentials. Before deploying (or committing this repo publicly), move both into environment variables loaded from `.env` and rotate any credentials that were ever committed.

Run the API:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`. Tables are auto-created on startup via `Base.metadata.create_all`.

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at the URL Vite prints (typically `http://localhost:5173`). Since the frontend currently runs entirely on mock data, no backend connection is required to explore the UI — login/signup just set a flag in `localStorage`.

To build for production:

```bash
npm run build
npm run preview
```

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

All authenticated routes are gated by `ProtectedRoute` and rendered inside `MainLayout` (sidebar + topbar shell).

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

- Wire the frontend `services/*.js` files up to the real backend endpoints instead of `mockApi.js`.
- Move `SECRET_KEY` and the database connection string out of source code and into environment variables.
- Add a `requirements.txt` / `pyproject.toml` for the backend (dependencies currently must be inferred from imports).
- Add automated tests for both backend and frontend.
