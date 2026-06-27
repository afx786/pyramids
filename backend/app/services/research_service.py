from sqlalchemy.orm import Session

from app.models.research_project import ResearchProject

from app.models.research_member import ResearchMember
from app.models.user import User
from app.services.notification_service import create_notification
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
    
def join_research_project(
    db: Session,
    research_id: int,
    user_id: int
):
    research = (
        db.query(ResearchProject)
        .filter(
            ResearchProject.id == research_id
        )
        .first()
    )

    if not research:
        return None

    existing = (
        db.query(ResearchMember)
        .filter(
            ResearchMember.research_id == research_id,
            ResearchMember.user_id == user_id
        )
        .first()
    )

    if existing:
        return "already_joined"

    member = ResearchMember(
        research_id=research_id,
        user_id=user_id
    )

    db.add(member)

    db.commit()

    db.refresh(member)

    if research.owner_id != user_id:
        create_notification(
            db=db,
            user_id=research.owner_id,
            title="New Research Collaborator",
            message="Someone joined your research project.",
            notification_type="research"
        )

    return member
def get_research_members(
    db: Session,
    research_id: int
):
    members = (
        db.query(ResearchMember)
        .filter(
            ResearchMember.research_id == research_id
        )
        .all()
    )

    results = []

    for member in members:
        user = (
            db.query(User)
            .filter(
                User.id == member.user_id
            )
            .first()
        )

        results.append({
            "id": user.id,
            "name": user.name
        })

    return results

def get_user_research_projects(
    db: Session,
    user_id: int
):
    projects = (
        db.query(ResearchProject)
        .filter(
            ResearchProject.owner_id == user_id
        )
        .all()
    )

    return [
        {
            "id": project.id,
            "title": project.title,
            "domain": project.domain,
            "status": project.status
        }
        for project in projects
    ]
    
def update_research(
    db: Session,
    research_id: int,
    user_id: int,
    data
):
    research = (
        db.query(ResearchProject)
        .filter(
            ResearchProject.id == research_id
        )
        .first()
    )

    if not research:
        return "not_found"

    if research.owner_id != user_id:
        return "forbidden"

    research.title = data.title
    research.description = data.description
    research.domain = data.domain
    research.status = data.status

    db.commit()

    db.refresh(research)

    return research

def delete_research(
    db: Session,
    research_id: int,
    user_id: int
):
    research = (
        db.query(ResearchProject)
        .filter(
            ResearchProject.id == research_id
        )
        .first()
    )

    if not research:
        return "not_found"

    if research.owner_id != user_id:
        return "forbidden"

    members = (
        db.query(ResearchMember)
        .filter(
            ResearchMember.research_id == research_id
        )
        .all()
    )

    for member in members:
        db.delete(member)

    db.delete(research)

    db.commit()

    return "success"

def leave_research(
    db: Session,
    research_id: int,
    user_id: int
):
    research = (
        db.query(ResearchProject)
        .filter(
            ResearchProject.id == research_id
        )
        .first()
    )

    if not research:
        return "not_found"

    if research.owner_id == user_id:
        return "owner_cannot_leave"

    membership = (
        db.query(ResearchMember)
        .filter(
            ResearchMember.research_id == research_id,
            ResearchMember.user_id == user_id
        )
        .first()
    )

    if not membership:
        return "not_member"

    db.delete(membership)

    db.commit()

    return "success"