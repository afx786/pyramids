from sqlalchemy.orm import Session

from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.team_join_request import TeamJoinRequest

from app.services.notification_service import create_notification


def create_join_request(
    db: Session,
    team_id: int,
    user_id: int
):
    team = (
        db.query(Team)
        .filter(
            Team.id == team_id
        )
        .first()
    )

    if not team:
        return "team_not_found"

    if team.owner_id == user_id:
        return "owner"

    existing_member = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == user_id
        )
        .first()
    )

    if existing_member:
        return "already_member"

    existing_request = (
        db.query(TeamJoinRequest)
        .filter(
            TeamJoinRequest.team_id == team_id,
            TeamJoinRequest.user_id == user_id,
            TeamJoinRequest.status == "pending"
        )
        .first()
    )

    if existing_request:
        return "already_requested"

    request = TeamJoinRequest(
        team_id=team_id,
        user_id=user_id
    )

    db.add(request)

    db.commit()

    db.refresh(request)

    create_notification(
        db=db,
        user_id=team.owner_id,
        title="New Team Join Request",
        message="Someone requested to join your team.",
        notification_type="team_request"
    )

    return request


def get_team_requests(
    db: Session,
    team_id: int,
    current_user_id: int
):
    team = (
        db.query(Team)
        .filter(
            Team.id == team_id
        )
        .first()
    )

    if not team:
        return "team_not_found"

    if team.owner_id != current_user_id:
        return "forbidden"

    return (
        db.query(TeamJoinRequest)
        .filter(
            TeamJoinRequest.team_id == team_id,
            TeamJoinRequest.status == "pending"
        )
        .all()
    )


def approve_join_request(
    db: Session,
    request_id: int,
    current_user_id: int
):
    request = (
        db.query(TeamJoinRequest)
        .filter(
            TeamJoinRequest.id == request_id
        )
        .first()
    )

    if not request:
        return "not_found"

    if request.status != "pending":
        return "already_processed"

    team = (
        db.query(Team)
        .filter(
            Team.id == request.team_id
        )
        .first()
    )

    if team.owner_id != current_user_id:
        return "forbidden"

    request.status = "approved"

    member = TeamMember(
        team_id=request.team_id,
        user_id=request.user_id,
        role="Member"
    )

    db.add(member)

    db.commit()

    db.refresh(request)

    create_notification(
        db=db,
        user_id=request.user_id,
        title="Team Request Approved",
        message=f"You have been added to team '{team.name}'.",
        notification_type="team"
    )

    return request


def reject_join_request(
    db: Session,
    request_id: int,
    current_user_id: int
):
    request = (
        db.query(TeamJoinRequest)
        .filter(
            TeamJoinRequest.id == request_id
        )
        .first()
    )

    if not request:
        return "not_found"

    if request.status != "pending":
        return "already_processed"

    team = (
        db.query(Team)
        .filter(
            Team.id == request.team_id
        )
        .first()
    )

    if team.owner_id != current_user_id:
        return "forbidden"

    request.status = "rejected"

    db.commit()

    db.refresh(request)

    create_notification(
        db=db,
        user_id=request.user_id,
        title="Team Request Rejected",
        message=f"Your request to join '{team.name}' was rejected.",
        notification_type="team"
    )

    return request