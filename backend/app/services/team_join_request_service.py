from sqlalchemy.orm import Session

from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.team_join_request import TeamJoinRequest
from app.models.user import User

from app.services.notification_service import create_notification
from app.services.team_activity_service import create_team_activity


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
    db.flush()

    requester = db.query(User).filter(User.id == user_id).first()
    requester_name = requester.name if requester else "Someone"
    requester_bid = requester.builder_id if requester else None

    create_team_activity(
        db=db,
        team_id=team.id,
        action="join_request_sent",
        actor_id=user_id,
        target_id=team.owner_id,
        metadata={"team_name": team.name},
    )

    db.commit()

    db.refresh(request)

    create_notification(
        db=db,
        user_id=team.owner_id,
        title="New Team Join Request",
        message=f"{requester_name} wants to join your team.",
        notification_type="TEAM_JOIN_REQUEST",
        data={
            "team_id": team.public_id,
            "team_name": team.name,
            "request_id": request.id,
            "requester_id": user_id,
            "requester_name": requester_name,
            "requester_builder_id": requester_bid,
        }
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

    from sqlalchemy.orm import joinedload
    return (
        db.query(TeamJoinRequest)
        .options(joinedload(TeamJoinRequest.user))
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

    requester = db.query(User).filter(User.id == request.user_id).first()
    requester_name = requester.name if requester else "Someone"

    meta = {"team_name": team.name}
    if requester and requester.builder_id:
        meta["builder_id"] = requester.builder_id
    create_team_activity(
        db=db,
        team_id=team.id,
        action="join_request_approved",
        actor_id=team.owner_id,
        target_id=request.user_id,
        metadata=meta,
    )

    db.commit()

    db.refresh(request)

    create_notification(
        db=db,
        user_id=request.user_id,
        title="Team Request Approved",
        message=f"You have been added to team '{team.name}'.",
        notification_type="TEAM_JOIN_APPROVED",
        data={"team_id": team.public_id, "team_name": team.name}
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

    requester = db.query(User).filter(User.id == request.user_id).first()
    requester_name = requester.name if requester else "Someone"

    create_team_activity(
        db=db,
        team_id=team.id,
        action="join_request_declined",
        actor_id=team.owner_id,
        target_id=request.user_id,
        metadata={"team_name": team.name},
    )

    db.commit()

    db.refresh(request)

    create_notification(
        db=db,
        user_id=request.user_id,
        title="Team Request Declined",
        message=f"Your request to join '{team.name}' was declined.",
        notification_type="TEAM_JOIN_DECLINED",
        data={"team_id": team.public_id, "team_name": team.name}
    )

    return request