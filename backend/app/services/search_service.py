from sqlalchemy.orm import Session

from app.models.user import User
from app.models.skill import Skill

from app.services.rank_service import get_user_rank


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
            "rank": rank_data["rank"],
            "points": rank_data["points"]
        })

    return results