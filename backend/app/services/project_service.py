from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.skill import Skill
from app.models.project_skill import ProjectSkill
from app.models.technology import Technology
from app.models.project_technology import ProjectTechnology

def create_project(
    db: Session,
    data,
    owner_id: int
):
    project = Project(
        title=data.title,
        description=data.description,
        domain=data.domain,
        visibility=data.visibility,
        status=data.status,
        owner_id=owner_id
    )

    db.add(project)
    db.flush()

    # ----------------------------------
    # Skills
    # ----------------------------------

    for skill_name in data.skills:

        normalized = skill_name.strip()

        slug = normalized.lower()

        skill = (
            db.query(Skill)
            .filter(
                Skill.slug == slug
            )
            .first()
        )

        if not skill:

            skill = Skill(
                name=normalized,
                slug=slug
            )

            db.add(skill)
            db.flush()

        db.add(

            ProjectSkill(

                project_id=project.id,

                skill_id=skill.id

            )

        )

    # ----------------------------------
    # Technologies
    # ----------------------------------

    for tech in data.technologies:

        slug = (
            tech.name
            .strip()
            .lower()
            .replace(" ", "-")
        )

        technology = (
            db.query(Technology)
            .filter(
                Technology.slug == slug
            )
            .first()
        )

        if not technology:

            technology = Technology(

                name=tech.name.strip(),

                slug=slug,

                category=tech.category,

                icon=tech.icon,

                website=tech.website

            )

            db.add(technology)
            db.flush()

        db.add(

            ProjectTechnology(

                project_id=project.id,

                technology_id=technology.id

            )

        )

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

        "skills": [

            ps.skill.name

            for ps in project.skills

        ],

        "technologies": [

            {

                "id": pt.technology.id,

                "name": pt.technology.name,

                "category": pt.technology.category

            }

            for pt in project.technologies

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
