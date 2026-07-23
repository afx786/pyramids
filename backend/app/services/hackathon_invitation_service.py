from datetime import datetime

from sqlalchemy.orm import Session

from app.models.hackathon import Hackathon
from app.models.hackathon_invitation import HackathonInvitation
from app.models.hackathon_team import HackathonTeam
from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.user import User
from app.services.notification_service import create_notification


def invite_hackathon_member(
    db: Session,
    hackathon_id: int,
    team_id: int,
    invited_user_id: int,
    current_user_id: int
):
    hackathon = (
        db.query(Hackathon)
        .filter(Hackathon.id == hackathon_id)
        .first()
    )

    if not hackathon:
        return "hackathon_not_found"

    team = (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )

    if not team:
        return "team_not_found"

    inviter = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user_id
        )
        .first()
    )

    if not inviter or inviter.role not in ["Owner", "Admin", "Leader"]:
        return "forbidden"

    user = (
        db.query(User)
        .filter(User.id == invited_user_id)
        .first()
    )

    if not user:
        return "user_not_found"

    existing_member = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == invited_user_id
        )
        .first()
    )

    if existing_member:
        return "already_member"

    existing_invitation = (
        db.query(HackathonInvitation)
        .filter(
            HackathonInvitation.hackathon_id == hackathon_id,
            HackathonInvitation.team_id == team_id,
            HackathonInvitation.invited_user_id == invited_user_id,
            HackathonInvitation.status == "pending"
        )
        .first()
    )

    if existing_invitation:
        return "already_invited"

    registration = (
        db.query(HackathonTeam)
        .filter(
            HackathonTeam.hackathon_id == hackathon_id,
            HackathonTeam.team_id == team_id
        )
        .first()
    )

    if not registration:
        registration = HackathonTeam(
            hackathon_id=hackathon_id,
            team_id=team_id
        )
        db.add(registration)
        db.flush()

    invitation = HackathonInvitation(
        hackathon_id=hackathon_id,
        team_id=team_id,
        invited_user_id=invited_user_id,
        invited_by_id=current_user_id
    )

    db.add(invitation)
    db.commit()
    db.refresh(invitation)

    create_notification(
        db=db,
        user_id=invited_user_id,
        title="Hackathon Invitation",
        message=f"You have been invited to join team '{team.name}' for '{hackathon.title}'.",
        notification_type="hackathon_invitation"
    )

    return invitation


def list_my_hackathon_invitations(
    db: Session,
    user_id: int
):
    return (
        db.query(HackathonInvitation)
        .filter(
            HackathonInvitation.invited_user_id == user_id,
            HackathonInvitation.status == "pending"
        )
        .order_by(HackathonInvitation.created_at.desc())
        .all()
    )


def accept_hackathon_invitation(
    db: Session,
    invitation_id: int,
    current_user_id: int
):
    invitation = (
        db.query(HackathonInvitation)
        .filter(HackathonInvitation.id == invitation_id)
        .first()
    )

    if not invitation:
        return "not_found"

    if invitation.invited_user_id != current_user_id:
        return "forbidden"

    if invitation.status != "pending":
        return "already_processed"

    existing_member = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == invitation.team_id,
            TeamMember.user_id == current_user_id
        )
        .first()
    )

    if not existing_member:
        db.add(
            TeamMember(
                team_id=invitation.team_id,
                user_id=current_user_id,
                role="Member"
            )
        )

    invitation.status = "accepted"
    invitation.responded_at = datetime.utcnow()

    db.commit()
    db.refresh(invitation)

    create_notification(
        db=db,
        user_id=invitation.invited_by_id,
        title="Hackathon Invitation Accepted",
        message=f"{invitation.invited_user.name} joined team '{invitation.team.name}'.",
        notification_type="hackathon_invitation"
    )

    return invitation


def reject_hackathon_invitation(
    db: Session,
    invitation_id: int,
    current_user_id: int
):
    invitation = (
        db.query(HackathonInvitation)
        .filter(HackathonInvitation.id == invitation_id)
        .first()
    )

    if not invitation:
        return "not_found"

    if invitation.invited_user_id != current_user_id:
        return "forbidden"

    if invitation.status != "pending":
        return "already_processed"

    invitation.status = "rejected"
    invitation.responded_at = datetime.utcnow()

    db.commit()
    db.refresh(invitation)

    create_notification(
        db=db,
        user_id=invitation.invited_by_id,
        title="Hackathon Invitation Rejected",
        message=f"{invitation.invited_user.name} declined team '{invitation.team.name}'.",
        notification_type="hackathon_invitation"
    )

    return invitation
