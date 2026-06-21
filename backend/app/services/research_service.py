from sqlalchemy.orm import Session

from app.models.research_project import ResearchProject


def create_research_project(
    db: Session,
    data,
    owner_id: int
):
    research = ResearchProject(
        title=data.title,
        description=data.description,

        domain=data.domain,

        research_type=data.research_type,

        skills_needed=data.skills_needed,

        team_size=data.team_size,

        owner_id=owner_id
    )

    db.add(research)

    db.commit()

    db.refresh(research)

    return research


def get_all_research_projects(
    db: Session
):
    return (
        db.query(ResearchProject)
        .all()
    )


def get_research_project(
    db: Session,
    research_id: int
):
    return (
        db.query(ResearchProject)
        .filter(
            ResearchProject.id == research_id
        )
        .first()
    )