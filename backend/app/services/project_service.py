from sqlalchemy.orm import Session

from app.models.project import Project


def create_project(
    db: Session,
    title: str,
    description: str,
    domain: str,
    visibility: str,
    status: str,
    owner_id: int
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
    db.commit()
    db.refresh(project)

    return project


def get_project(db: Session, project_id: int):
    return db.query(Project).filter(
        Project.id == project_id
    ).first()


def get_all_projects(db: Session):
    return db.query(Project).all()