from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.user import User
from app.models.research_project import ResearchProject
from app.models.research_member import ResearchMember
from app.models.research_milestone import ResearchMilestone
from app.models.research_update import ResearchUpdate
from app.services.notification_service import create_notification
from app.services.id_service import generate_public_id


def get_user_research_projects(db: Session, user_id: int):
    return db.query(ResearchProject).filter(
        ResearchProject.owner_id == user_id
    ).order_by(ResearchProject.created_at.desc()).all()


def create_research_project(db: Session, data, owner_id: int):
    project = ResearchProject(
        public_id=generate_public_id('RES', db=db, model=ResearchProject),
        title=data.title,
        abstract=data.abstract,
        problem_statement=data.problem_statement,
        description=data.description,
        research_type=data.research_type,
        domain=data.domain,
        research_domain=data.research_domain,
        skills_needed=data.skills_needed,
        required_roles=data.required_roles or [],
        expected_outcomes=data.expected_outcomes,
        methodology=data.methodology,
        datasets=data.datasets,
        resources=data.resources,
        repository_url=data.repository_url,
        paper_link=data.paper_link,
        funding=data.funding,
        supervisor=data.supervisor,
        institution=data.institution,
        publication_goal=data.publication_goal,
        duration=data.duration,
        mode=data.mode or "remote",
        open_positions=data.open_positions or 1,
        difficulty=data.difficulty,
        application_deadline=data.application_deadline,
        team_size=data.team_size or 1,
        status="draft",
        owner_id=owner_id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    member = ResearchMember(research_id=project.id, user_id=owner_id, role="owner")
    db.add(member)
    db.commit()
    return project


def get_research_project(db: Session, research_id: int):
    return db.query(ResearchProject).filter(ResearchProject.id == research_id).first()


def get_all_research_projects(db: Session, status: str | None = None):
    q = db.query(ResearchProject)
    if status:
        q = q.filter(ResearchProject.status == status)
    return q.order_by(desc(ResearchProject.created_at)).all()


def get_my_research_projects(db: Session, user_id: int):
    member_of = db.query(ResearchMember.research_id).filter(
        ResearchMember.user_id == user_id
    ).subquery()
    return db.query(ResearchProject).filter(ResearchProject.id.in_(member_of)).all()


def update_research(db: Session, research_id: int, user_id: int, data):
    project = get_research_project(db, research_id)
    if not project:
        return "not_found"
    if project.owner_id != user_id:
        return "forbidden"

    for field in ("title", "abstract", "problem_statement", "description",
                  "research_type", "domain", "research_domain", "skills_needed",
                  "required_roles", "expected_outcomes", "methodology",
                  "datasets", "resources", "repository_url", "paper_link",
                  "funding", "supervisor", "institution", "publication_goal",
                  "duration", "mode", "open_positions", "difficulty",
                  "application_deadline", "team_size", "status"):
        val = getattr(data, field, None)
        if val is not None:
            setattr(project, field, val)

    db.commit()
    db.refresh(project)
    return project


def delete_research(db: Session, research_id: int, user_id: int):
    project = get_research_project(db, research_id)
    if not project:
        return "not_found"
    if project.owner_id != user_id:
        return "forbidden"
    db.delete(project)
    db.commit()
    return "deleted"


def get_research_members(db: Session, research_id: int):
    return db.query(ResearchMember).filter(
        ResearchMember.research_id == research_id
    ).all()


def add_milestone(db: Session, research_id: int, user_id: int, data):
    project = get_research_project(db, research_id)
    if not project:
        return "not_found"
    if project.owner_id != user_id:
        return "forbidden"

    milestone = ResearchMilestone(
        research_id=research_id,
        title=data.title,
        description=data.description,
        due_date=data.due_date,
    )
    db.add(milestone)
    db.commit()
    db.refresh(milestone)
    return milestone


def get_milestones(db: Session, research_id: int):
    return db.query(ResearchMilestone).filter(
        ResearchMilestone.research_id == research_id
    ).order_by(ResearchMilestone.created_at).all()


def complete_milestone(db: Session, milestone_id: int, user_id: int):
    milestone = db.query(ResearchMilestone).filter(ResearchMilestone.id == milestone_id).first()
    if not milestone:
        return "not_found"

    project = get_research_project(db, milestone.research_id)
    if project.owner_id != user_id:
        return "forbidden"

    milestone.is_completed = True
    from datetime import datetime
    milestone.completed_at = datetime.utcnow()
    db.commit()
    return milestone


def create_update(db: Session, research_id: int, user_id: int, content: str):
    project = get_research_project(db, research_id)
    if not project:
        return "not_found"

    is_member = db.query(ResearchMember).filter(
        ResearchMember.research_id == research_id,
        ResearchMember.user_id == user_id
    ).first()
    if not is_member:
        return "forbidden"

    update = ResearchUpdate(research_id=research_id, author_id=user_id, content=content)
    db.add(update)
    db.commit()
    db.refresh(update)
    return update


def get_updates(db: Session, research_id: int):
    return db.query(ResearchUpdate).filter(
        ResearchUpdate.research_id == research_id
    ).order_by(desc(ResearchUpdate.created_at)).all()


def get_research_requests(db: Session, research_id: int, current_user_id: int):
    project = get_research_project(db, research_id)
    if not project:
        return "research_not_found"
    if project.owner_id != current_user_id:
        return "forbidden"
    from app.models.research_join_request import ResearchJoinRequest
    return db.query(ResearchJoinRequest).filter(
        ResearchJoinRequest.research_id == research_id
    ).all()
