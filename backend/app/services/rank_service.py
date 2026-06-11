from sqlalchemy.orm import Session

from app.models.user import User


def get_user_rank(
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

    projects_count = len(user.projects)

    skills = set()

    for project in user.projects:
        for project_skill in project.skills:
            skills.add(
                project_skill.skill.name
            )

    skills_count = len(skills)

    points = (
        projects_count * 10
        + skills_count * 5
    )

    if points >= 400:
        rank = "Pyramidion"
    elif points >= 200:
        rank = "Architect"
    elif points >= 100:
        rank = "Creator"
    elif points >= 50:
        rank = "Builder"
    else:
        rank = "Explorer"

    return {
        "user_id": user.id,
        "points": points,
        "rank": rank,
        "projects_count": projects_count,
        "skills_count": skills_count
    }