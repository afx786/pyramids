from sqlalchemy.orm import Session

from app.models.user import User
from app.services.rank_service import get_user_rank


def get_user_stats(
    db: Session,
    user_id: int
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        return None

    skills = set()

    for project in user.projects:

        for project_skill in project.skills:

            skills.add(
                project_skill.skill.name
            )

    rank_data = get_user_rank(
        db,
        user_id
    )

    return {
        "user_id": user.id,
        "projects_count": len(user.projects),
        "skills_count": len(skills),
        "points": rank_data["points"],
        "rank": rank_data["rank"]
    }