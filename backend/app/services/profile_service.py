from sqlalchemy.orm import Session

from app.models.user import User
from app.services.rank_service import get_user_rank


def get_user_profile(
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

    projects = []

    for project in user.projects:
        projects.append({
            "id": project.id,
            "title": project.title,
            "domain": project.domain,
            "status": project.status
        })

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        },

        "rank": {
            "rank": rank_data["rank"],
            "points": rank_data["points"]
        },

        "skills": sorted(list(skills)),

        "projects": projects
    }