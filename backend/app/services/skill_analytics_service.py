from sqlalchemy.orm import Session

from app.models.skill import Skill


def get_top_skills(
    db: Session
):
    skills = db.query(Skill).all()

    results = []

    for skill in skills:

        results.append({
            "skill": skill.name,
            "projects": len(skill.project_skills)
        })

    results.sort(
        key=lambda x: x["projects"],
        reverse=True
    )

    return results