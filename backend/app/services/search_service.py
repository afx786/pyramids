from sqlalchemy.orm import Session

from app.models.user import User
from app.models.skill import Skill

from app.services.rank_service import get_user_rank
from app.models.project import Project
from app.models.team import Team
from app.models.research_project import ResearchProject
from app.models.hackathon import Hackathon

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

def unified_search(
    db: Session,
    query: str
):
    query = query.strip()

    users = (
        db.query(User)
        .filter(
            User.name.ilike(f"%{query}%")
        )
        .all()
    )

    projects = (
        db.query(Project)
        .filter(
            (Project.title.ilike(f"%{query}%")) |
            (Project.description.ilike(f"%{query}%"))
        )
        .all()
    )

    teams = (
        db.query(Team)
        .filter(
            (Team.name.ilike(f"%{query}%")) |
            (Team.description.ilike(f"%{query}%"))
        )
        .all()
    )

    research = (
        db.query(ResearchProject)
        .filter(
            (ResearchProject.title.ilike(f"%{query}%")) |
            (ResearchProject.description.ilike(f"%{query}%")) |
            (ResearchProject.domain.ilike(f"%{query}%"))
        )
        .all()
    )

    hackathons = (
        db.query(Hackathon)
        .filter(
            (Hackathon.title.ilike(f"%{query}%")) |
            (Hackathon.description.ilike(f"%{query}%"))
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
