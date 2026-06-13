from sqlalchemy.orm import Session

from app.models.skill import Skill


def search_projects_by_skill(
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

    projects = []

    seen = set()

    for project_skill in skill.project_skills:

        project = project_skill.project

        if project.id in seen:
            continue

        seen.add(project.id)

        projects.append({
            "id": project.id,
            "title": project.title,
            "domain": project.domain,
            "status": project.status,

            "owner": {
                "id": project.owner.id,
                "name": project.owner.name
            },

            "skills": [
                ps.skill.name
                for ps in project.skills
            ]
        })

    return projects