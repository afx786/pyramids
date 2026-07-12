# Pyramids

Pyramids is a student and builder collaboration platform: a place to showcase projects, get GitHub repositories analyzed for the technologies and skills they demonstrate, find teammates, connect with other builders, form teams, join hackathons and research groups, message each other, and climb a project and skill based rank ladder from **Explorer** up to **Pyramidion**.

The repo is a full-stack app split into two deployable pieces:

- **`backend/`** - a FastAPI + SQLAlchemy + PostgreSQL REST API deployed on Render
- **`frontend/`** - a React (Vite + Tailwind) single-page app deployed on GitHub Pages

The frontend talks to the real backend over HTTP with JWT bearer auth stored in `localStorage`.

---

## Features

- **Auth** - signup/login with hashed passwords and JWT bearer tokens
- **Projects** - create, list, update, delete, search, invite collaborators, manage project members, and verify repositories
- **Project Invitations** - project owners can invite users, invited users can accept or reject, and accepting creates project membership
- **GitHub Repository Intelligence** - point Pyramids at a public GitHub repo and it will:
  - Pull repository metadata, languages, and file tree via the GitHub API
  - Detect frameworks, libraries, databases, cloud, and DevOps tooling from file contents and manifests
  - Infer verified skills with confidence scores and cited evidence
  - Compute repository statistics such as file counts, Docker usage, and CI workflow presence
  - Compute a repository score with category scores and improvement suggestions
- **Skills & Technologies** - tagging projects with skills/tech, plus skill analytics
- **Connections** - send, accept, reject, cancel, list, and remove connections
- **Teams** - create teams, send/accept join requests, add/remove members, leave teams, transfer ownership, and manage Owner/Admin/Member roles
- **Hackathons** - list, create, submit, approve, register teams, and invite users to hackathon teams
- **Research groups** - create research projects, manage membership, and handle join requests
- **Opportunities & Feed** - opportunity postings and aggregated platform activity
- **Messaging** - 1:1 conversations with read/delete state and connected-user restrictions
- **Notifications & Bookmarks**
- **Dashboard API** - one authenticated endpoint for user summary, counts, unread messages, notifications, repository score, verified skills, and recent activity
- **Pagination & Sorting** - supported for projects, messages, notifications, and search
- **Ranks & Leaderboard** - points from projects/skills roll up into ranks
- **Admin** - admin-only endpoints for moderation and oversight
- **Stats** - platform-wide statistics

---

## Tech Stack

### Backend

| Layer | Tech |
|---|---|
| Framework | FastAPI |
| ORM | SQLAlchemy |
| Database | PostgreSQL via `psycopg` |
| Auth | JWT via `python-jose` + `passlib[bcrypt]` |
| External API | GitHub REST API via `requests` |
| Config | `python-dotenv` / environment variables |
| Hosting | Render |

### Frontend

| Layer | Tech |
|---|---|
| Framework | React 18 (Vite) |
| Routing | `react-router-dom` with `HashRouter` |
| Styling | Tailwind CSS |
| Icons | `lucide-react` |
| Hosting | GitHub Pages |

---

## Project Structure

```text
Pyramids/
  render.yaml
  .github/workflows/deploy.yml

  backend/
    requirements.txt
    .env.example
    app/
      main.py
      deps.py
      core/
      database/
      models/
      schemas/
      services/
        github/
        intelligence/
        *_service.py
      routes/

  frontend/
    .env.example
    src/
      main.jsx
      App.jsx
      context/
      layouts/
      routes/
      pages/
      components/
      services/
```

Backend architecture stays intentionally simple:

- `models/` define SQLAlchemy database schema
- `schemas/` define Pydantic request/response contracts
- `services/` contain business logic
- `routes/` contain thin FastAPI route handlers
- Repository intelligence lives under `services/github/` and `services/intelligence/`

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
pip install -r requirements.txt
```

Copy the example env file and fill it in:

```bash
cp .env.example .env
```

```env
DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/pyramids_db
SECRET_KEY=your-very-secret-key-here
ALLOWED_ORIGINS=http://localhost:5173,https://afx786.github.io
```

Run the API:

```bash
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`, with interactive docs at `/docs` and `/redoc`.

Tables are auto-created on startup via `Base.metadata.create_all`. The current backend also includes a small compatibility helper for the latest project verification columns.

The GitHub-backed endpoints (`/github/analyze`, `/intelligence/analyze`, and project repository verification) call the public GitHub REST API unauthenticated, so they are subject to GitHub anonymous rate limits and only work against public repositories.

### Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

Build / preview / deploy:

```bash
npm run build
npm run preview
npm run deploy
```

---

## Deployment

- **Frontend** - `.github/workflows/deploy.yml` builds the Vite app on every push to `main` using the `VITE_API_URL` repo variable and publishes `frontend/dist` to GitHub Pages.
- **Backend** - `render.yaml` defines the Render web service (`pyramids-api`) and managed Postgres instance (`pyramids-db`).

---

## API Overview

All routes are mounted from `backend/app/main.py`. The live API docs at `/docs` and `/redoc` are the source of truth once the server is running.

| Prefix | Purpose |
|---|---|
| `/auth` | Signup and login |
| `/users` | Current user and user lookup |
| `/projects` | CRUD, project invitations, project members, admin verification, repository verification |
| `/project-search` | Search/filter projects |
| `/skills`, `/technologies` | Reference data and skill analytics |
| `/connections` | Connection requests, accept/reject/cancel, list, remove |
| `/teams` | Team CRUD, join requests, membership, roles, ownership transfer |
| `/ranks`, `/leaderboard` | Rank calculation and leaderboard |
| `/hackathons` | Hackathon listings, submissions, approval, team registration, invitations |
| `/opportunities` | Opportunity postings |
| `/feed` | Aggregated activity feed |
| `/research` | Research groups, membership, join requests |
| `/messages` | Conversations and messages |
| `/notifications` | User notifications |
| `/bookmarks` | Saved items |
| `/profile` | Profile view/update |
| `/dashboard` | Authenticated dashboard summary endpoint |
| `/search` | Global and user search |
| `/stats` | Platform statistics |
| `/github` | Basic public GitHub repository analysis |
| `/intelligence` | Full repository analysis, verified skills, repository score |
| `/admin` | Admin-only moderation endpoints |

### MVP Backend Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/projects/{project_id}/invitations` | Owner invites a user to a project |
| `GET` | `/projects/{project_id}/invitations` | Owner lists project invitations |
| `GET` | `/projects/invitations/my` | Current user lists pending project invitations |
| `POST` | `/projects/invitations/{invitation_id}/accept` | Accept project invitation and create membership |
| `POST` | `/projects/invitations/{invitation_id}/reject` | Reject project invitation |
| `GET` | `/projects/{project_id}/members` | List project members |
| `POST` | `/projects/{project_id}/verify` | Run repository intelligence and save verification results |
| `POST` | `/hackathons/{hackathon_id}/invitations` | Invite a user to a hackathon team |
| `GET` | `/hackathons/invitations/my` | Current user lists pending hackathon invitations |
| `POST` | `/hackathons/invitations/{invitation_id}/accept` | Accept hackathon invitation and join team |
| `POST` | `/hackathons/invitations/{invitation_id}/reject` | Reject hackathon invitation |
| `POST` | `/teams/{team_id}/members` | Owner/admin adds a team member |
| `DELETE` | `/teams/{team_id}/members/{user_id}` | Owner/admin removes a member |
| `PATCH` | `/teams/{team_id}/members/{user_id}/role` | Owner changes a member role |
| `GET` | `/dashboard` | Current user's dashboard data |

Pagination can be requested with `limit`, `offset`, and `sort` query parameters on supported endpoints. Existing list endpoints keep their old list response when `limit` is omitted.

---

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

All authenticated routes are gated by `ProtectedRoute` and rendered inside `MainLayout`.

---

## Repository Intelligence Pipeline

`POST /intelligence/analyze` accepts a `github_url` and runs:

1. `services/github/` fetches repository metadata, language breakdown, README, contents, and file tree.
2. `intelligence/repository_parser.py` fetches relevant file contents while skipping ignored paths.
3. `intelligence/technology_detector.py` and `technology_patterns.py` detect languages, frameworks, libraries, databases, cloud providers, and DevOps tooling.
4. `intelligence/evidence_collector.py`, `evidence_engine.py`, and `confidence.py` attach evidence and confidence scores.
5. `intelligence/skill_inference.py` and `skill_mappings.py` map detected technologies to verified skills.
6. `intelligence/repository_score.py` computes a 0-100 repository score from README, documentation, tests, CI/CD, project structure, framework usage, dependency management, Docker support, GitHub Actions, and repository organization.
7. `intelligence/orchestrator.py` assembles the final response.

`POST /projects/{project_id}/verify` reuses this intelligence pipeline for project-owned repositories. It stores the GitHub URL, repository score, full analysis payload, verified skills, and verification metadata on the project record.

---

## Rank System

A user's rank is derived from their project count and distinct skills used across their projects:

```text
points = projects * 10 + skills * 5
```

| Points | Rank |
|---|---|
| 0-49 | Explorer |
| 50-99 | Builder |
| 100-199 | Creator |
| 200-399 | Architect |
| 400+ | Pyramidion |

---

## Known Gaps / Next Steps

- `backend/app/routes/verification.py` and `backend/app/schemas/verification.py` still exist as empty scaffolding. Admin project verification currently lives in `routes/projects.py`.
- GitHub/intelligence endpoints call the GitHub API unauthenticated. Adding `GITHUB_TOKEN` would raise the rate limit and can support private repositories later.
- The app still uses `Base.metadata.create_all` on startup. A real Alembic migration setup should replace this before production growth.
- `frontend/src/services/mockApi.js` and `frontend/src/data/mockData.js` are unused leftovers from the pre-integration mock layer and can be removed.
- Add automated tests for both backend and frontend.
