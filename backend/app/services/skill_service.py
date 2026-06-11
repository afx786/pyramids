from sqlalchemy.orm import Session

from app.models.user import User


def get_user_skills(
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

    return {
        "user_id": user.id,
        "skills": sorted(list(skills))
    }