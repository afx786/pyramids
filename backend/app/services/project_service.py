from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.skill import Skill
from app.models.project_skill import ProjectSkill
from app.models.project_member import ProjectMember
from app.models.technology import Technology
from app.models.project_technology import ProjectTechnology
from datetime import datetime

from app.services.notification_service import create_notification
from app.services.github_service import extract_repo
from app.services.intelligence.orchestrator import analyze_repository

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
        owner_id=owner_id,
        github_url=getattr(data, 'github_url', None)
    )

    db.add(project)
    db.flush()

    db.add(
        ProjectMember(
            project_id=project.id,
            user_id=owner_id,
            role="Owner"
        )
    )

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


def get_projects_query(db: Session):
    return db.query(Project)
    
def serialize_project(project):

    return {

        "id": project.id,

        "title": project.title,

        "description": project.description,

        "domain": project.domain,

        "visibility": project.visibility,

        "status": project.status,

        "owner_id": project.owner_id,

        "owner_name": project.owner.name if project.owner else None,

        "created_at": project.created_at,
        
        "verification_status": project.verification_status,
        
        "verified_at": project.verified_at,
        
        "verification_notes": project.verification_notes,

        "github_url": project.github_url,

        "repository_score": project.repository_score,

        "verified_skills": project.verified_skills,

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

        ],

        "member_count": len(project.members)

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
def verify_project(
    db: Session,
    project_id: int,
    admin_id: int,
    status: str,
    notes: str | None
):
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id
        )
        .first()
    )

    if not project:
        return "not_found"

    project.verification_status = status

    project.verified_by = admin_id

    project.verified_at = datetime.utcnow()

    project.verification_notes = notes

    db.commit()

    db.refresh(project)

    if status == "verified":
        message = "Your project has been verified."

    elif status == "rejected":
        message = "Your project verification was rejected."

    else:
        message = "Your project verification is pending."
        
    create_notification(
        db=db,
        user_id=project.owner_id,
        title="Project Verification",
        message=message,
        notification_type="project"
    )

    return project


def trigger_project_verification(
    db: Session,
    project_id: int,
    current_user_id: int,
    github_url: str
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        return "not_found"

    if project.owner_id != current_user_id:
        return "forbidden"

    repo = extract_repo(
        github_url
    )

    if repo is None:
        return "invalid_github_url"

    owner, repository = repo

    result = analyze_repository(
        owner,
        repository
    )

    if result in [
        "rate_limit",
        "repository_not_found",
        "github_error"
    ]:
        return result

    score_data = result.get(
        "repository_score",
        {}
    )

    project.verification_status = "verified"
    project.verified_at = datetime.utcnow()
    project.verification_notes = (
        f"Repository score: {score_data.get('overall_score', 0)}"
    )
    project.github_url = github_url
    project.repository_score = score_data.get(
        "overall_score",
        0
    )
    project.repository_analysis = result
    project.verified_skills = [
        item.get("skill")
        for item in result.get("verified_skills", [])
    ]

    db.commit()
    db.refresh(project)

    return {
        "project": project,
        "analysis": result
    }
