import re
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.skill import Skill

from app.services.rank_service import get_user_rank
from app.models.project import Project
from app.models.team import Team
from app.models.research_project import ResearchProject
from app.models.hackathon import Hackathon
from app.models.organization import Organization

def search_users_by_skill(
    db: Session,
    skill_name: str
):
    skill = (
        db.query(Skill)
        .filter(
            Skill.slug == skill_name.lower()
        )
        .first()
    )

    if not skill:
        return []

    users = set()

    for project_skill in skill.project_skills:

        project = project_skill.project

        users.add(project.owner)

    results = []

    for user in users:

        rank_data = get_user_rank(
            db,
            user.id
        )

        results.append({
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "profile_picture": user.profile_picture,
            "headline": user.headline,
            "branch": getattr(user, "branch", None),
            "domain": getattr(user, "domain", None),
            "rank": rank_data["rank"],
            "points": rank_data["points"]
        })

    return results

def search_users_by_name(
    db: Session,
    name: str
):
    users = (
        db.query(User)
        .filter(
            User.name.ilike(f"%{name}%")
        )
        .all()
    )

    results = []

    for user in users:

        rank_data = get_user_rank(
            db,
            user.id
        )

        results.append({
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "profile_picture": user.profile_picture,
            "headline": user.headline,
            "branch": getattr(user, "branch", None),
            "domain": getattr(user, "domain", None),
            "rank": rank_data["rank"],
            "points": rank_data["points"]
        })

    return results

def search_users_by_rank(
    db: Session,
    rank: str
):
    users = db.query(User).all()

    results = []

    for user in users:

        rank_data = get_user_rank(
            db,
            user.id
        )

        if rank_data["rank"].lower() != rank.lower():
            continue

        results.append({
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "profile_picture": user.profile_picture,
            "headline": user.headline,
            "branch": getattr(user, "branch", None),
            "domain": getattr(user, "domain", None),
            "rank": rank_data["rank"],
            "points": rank_data["points"]
        })

    return results

def _is_public_id(query):
    return bool(re.match(r'^PYR-[A-Z]+-[A-Z0-9]{6}$', query.strip().upper()))

def unified_search(
    db: Session,
    query: str
):
    q = query.strip()
    is_pid = _is_public_id(q)
    pid_upper = q.upper() if is_pid else None

    if is_pid:
        user = db.query(User).filter(func.upper(User.public_id) == pid_upper).first()
        project = db.query(Project).filter(func.upper(Project.public_id) == pid_upper).first()
        team = db.query(Team).filter(func.upper(Team.public_id) == pid_upper).first()
        research = db.query(ResearchProject).filter(func.upper(ResearchProject.public_id) == pid_upper).first()
        hackathon = db.query(Hackathon).filter(func.upper(Hackathon.public_id) == pid_upper).first()
        org = db.query(Organization).filter(func.upper(Organization.public_id) == pid_upper).first()

        return {
            "users": [{"id": user.id, "name": user.name, "public_id": user.public_id}] if user else [],
            "projects": [{"id": project.id, "title": project.title, "public_id": project.public_id}] if project else [],
            "teams": [{"id": team.id, "name": team.name, "public_id": team.public_id}] if team else [],
            "research": [{"id": research.id, "title": research.title, "public_id": research.public_id}] if research else [],
            "hackathons": [{"id": hackathon.id, "title": hackathon.title, "public_id": hackathon.public_id}] if hackathon else [],
            "organizations": [{"id": org.id, "name": org.name, "public_id": org.public_id}] if org else [],
        }

    users = (
        db.query(User)
        .filter(
            User.name.ilike(f"%{q}%")
        )
        .all()
    )

    projects = (
        db.query(Project)
        .filter(
            (Project.title.ilike(f"%{q}%")) |
            (Project.description.ilike(f"%{q}%"))
        )
        .all()
    )

    teams = (
        db.query(Team)
        .filter(
            (Team.name.ilike(f"%{q}%")) |
            (Team.description.ilike(f"%{q}%"))
        )
        .all()
    )

    research = (
        db.query(ResearchProject)
        .filter(
            (ResearchProject.title.ilike(f"%{q}%")) |
            (ResearchProject.description.ilike(f"%{q}%")) |
            (ResearchProject.domain.ilike(f"%{q}%"))
        )
        .all()
    )

    hackathons = (
        db.query(Hackathon)
        .filter(
            (Hackathon.title.ilike(f"%{q}%")) |
            (Hackathon.description.ilike(f"%{q}%"))
        )
        .all()
    )

    organizations = (
        db.query(Organization)
        .filter(
            (Organization.name.ilike(f"%{q}%")) |
            (Organization.description.ilike(f"%{q}%"))
        )
        .all()
    )

    return {
        "users": [
            {
                "id": user.id,
                "name": user.name
            }
            for user in users
        ],

        "projects": [
            {
                "id": project.id,
                "title": project.title,
                "description": project.description
            }
            for project in projects
        ],

        "teams": [
            {
                "id": team.id,
                "name": team.name,
                "description": team.description
            }
            for team in teams
        ],

        "research": [
            {
                "id": research_project.id,
                "title": research_project.title,
                "domain": research_project.domain,
                "description": research_project.description
            }
            for research_project in research
        ],

        "hackathons": [
            {
                "id": hackathon.id,
                "title": hackathon.title,
                "description": hackathon.description
            }
            for hackathon in hackathons
        ],

        "organizations": [
            {
                "id": org.id,
                "name": org.name,
                "description": org.description
            }
            for org in organizations
        ]
    }
def search_users_by_branch(
    db: Session,
    branch: str
):

    if not hasattr(User, "branch"):
        return []

    users = (
        db.query(User)
        .filter(
            User.branch.ilike(branch)
        )
        .all()
    )

    results = []

    for user in users:

        rank_data = get_user_rank(
            db,
            user.id
        )

        results.append({

            "id": user.id,

            "name": user.name,

            "username": user.username,

            "profile_picture": user.profile_picture,

            "headline": user.headline,

            "branch": getattr(user, "branch", None),

            "domain": getattr(user, "domain", None),

            "rank": rank_data["rank"],

            "points": rank_data["points"]

        })

    return results
def search_users_by_domain(
    db: Session,
    domain: str
):

    if not hasattr(User, "domain"):
        return []

    users = (
        db.query(User)
        .filter(
            User.domain.ilike(domain)
        )
        .all()
    )

    results = []

    for user in users:

        rank_data = get_user_rank(
            db,
            user.id
        )

        results.append({

            "id": user.id,

            "name": user.name,

            "username": user.username,

            "profile_picture": user.profile_picture,

            "headline": user.headline,

            "branch": getattr(user, "branch", None),

            "domain": getattr(user, "domain", None),

            "rank": rank_data["rank"],

            "points": rank_data["points"]

        })

    return results
