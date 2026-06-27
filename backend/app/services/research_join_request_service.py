from sqlalchemy.orm import Session

from app.models.research_project import ResearchProject
from app.models.research_member import ResearchMember
from app.models.research_join_request import ResearchJoinRequest

from app.services.notification_service import create_notification


def create_research_join_request(
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
        return "research_not_found"

    if research.owner_id == user_id:
        return "owner"

    existing_member = (
        db.query(ResearchMember)
        .filter(
            ResearchMember.research_id == research_id,
            ResearchMember.user_id == user_id
        )
        .first()
    )

    if existing_member:
        return "already_member"

    existing_request = (
        db.query(ResearchJoinRequest)
        .filter(
            ResearchJoinRequest.research_id == research_id,
            ResearchJoinRequest.user_id == user_id,
            ResearchJoinRequest.status == "pending"
        )
        .first()
    )

    if existing_request:
        return "already_requested"

    request = ResearchJoinRequest(
        research_id=research_id,
        user_id=user_id
    )

    db.add(request)

    db.commit()

    db.refresh(request)

    create_notification(
        db=db,
        user_id=research.owner_id,
        title="New Collaboration Request",
        message="Someone wants to collaborate on your research.",
        notification_type="research_request"
    )

    return request


def get_research_requests(
    db: Session,
    research_id: int,
    current_user_id: int
):
    research = (
        db.query(ResearchProject)
        .filter(
            ResearchProject.id == research_id
        )
        .first()
    )

    if not research:
        return "research_not_found"

    if research.owner_id != current_user_id:
        return "forbidden"

    return (
        db.query(ResearchJoinRequest)
        .filter(
            ResearchJoinRequest.research_id == research_id,
            ResearchJoinRequest.status == "pending"
        )
        .all()
    )


def approve_research_request(
    db: Session,
    request_id: int,
    current_user_id: int
):
    request = (
        db.query(ResearchJoinRequest)
        .filter(
            ResearchJoinRequest.id == request_id
        )
        .first()
    )

    if not request:
        return "not_found"

    if request.status != "pending":
        return "already_processed"

    research = (
        db.query(ResearchProject)
        .filter(
            ResearchProject.id == request.research_id
        )
        .first()
    )

    if research.owner_id != current_user_id:
        return "forbidden"

    member = ResearchMember(
        research_id=request.research_id,
        user_id=request.user_id
    )

    db.add(member)

    request.status = "approved"

    db.commit()

    db.refresh(request)

    create_notification(
        db=db,
        user_id=request.user_id,
        title="Collaboration Approved",
        message=f"You've been accepted into '{research.title}'.",
        notification_type="research"
    )

    return request


def reject_research_request(
    db: Session,
    request_id: int,
    current_user_id: int
):
    request = (
        db.query(ResearchJoinRequest)
        .filter(
            ResearchJoinRequest.id == request_id
        )
        .first()
    )

    if not request:
        return "not_found"

    if request.status != "pending":
        return "already_processed"

    research = (
        db.query(ResearchProject)
        .filter(
            ResearchProject.id == request.research_id
        )
        .first()
    )

    if research.owner_id != current_user_id:
        return "forbidden"

    request.status = "rejected"

    db.commit()

    db.refresh(request)

    create_notification(
        db=db,
        user_id=request.user_id,
        title="Collaboration Request Rejected",
        message=f"Your request to collaborate on '{research.title}' was rejected.",
        notification_type="research"
    )

    return request