from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.skill import Skill
from app.models.project_skill import ProjectSkill


def create_project(
    db: Session,
    title: str,
    description: str,
    domain: str,
    visibility: str,
    status: str,
    owner_id: int,
    tech_stack: list[str]
):
    project = Project(
        title=title,
        description=description,
        domain=domain,
        visibility=visibility,
        status=status,
        owner_id=owner_id
    )

    db.add(project)
    db.flush()

    for skill_name in tech_stack:

        normalized_name = skill_name.strip()
        slug = normalized_name.lower()

        skill = (
            db.query(Skill)
            .filter(Skill.slug == slug)
            .first()
        )

        if not skill:
            skill = Skill(
                name=normalized_name,
                slug=slug
            )

            db.add(skill)
            db.flush()

        project_skill = ProjectSkill(
            project_id=project.id,
            skill_id=skill.id
        )

        db.add(project_skill)

    db.commit()
    db.refresh(project)

    return project


def get_project(db: Session, project_id: int):
    return db.query(Project).filter(
        Project.id == project_id
    ).first()
    

def get_all_projects(db: Session):
    return db.query(Project).all()
    
def serialize_project(project):
    return {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "domain": project.domain,
        "visibility": project.visibility,
        "status": project.status,
        "owner_id": project.owner_id,
        "created_at": project.created_at,
        "tech_stack": [
            ps.skill.name
            for ps in project.skills
        ]
    }

def update_project(
    db: Session,
    project_id: int,
    current_user_id: int,
    title: str,
    description: str,
    domain: str,
    visibility: str,
    status: str
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        return None

    if project.owner_id != current_user_id:
        return "forbidden"

    project.title = title
    project.description = description
    project.domain = domain
    project.visibility = visibility
    project.status = status

    db.commit()
    db.refresh(project)

    return project    
    
def delete_project(
    db: Session,
    project_id: int,
    current_user_id: int
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        return None

    if project.owner_id != current_user_id:
        return "forbidden"

    db.delete(project)
    db.commit()

    return True