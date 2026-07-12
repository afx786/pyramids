from datetime import datetime

from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.project_invitation import ProjectInvitation
from app.models.project_member import ProjectMember
from app.models.user import User
from app.services.notification_service import create_notification


def get_project_members(
    db: Session,
    project_id: int
):
    return (
        db.query(ProjectMember)
        .filter(
            ProjectMember.project_id == project_id
        )
        .all()
    )


def invite_project_member(
    db: Session,
    project_id: int,
    invited_user_id: int,
    current_user_id: int
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        return "project_not_found"

    if project.owner_id != current_user_id:
        return "forbidden"

    if invited_user_id == current_user_id:
        return "cannot_invite_self"

    user = (
        db.query(User)
        .filter(User.id == invited_user_id)
        .first()
    )

    if not user:
        return "user_not_found"

    existing_member = (
        db.query(ProjectMember)
        .filter(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == invited_user_id
        )
        .first()
    )

    if existing_member:
        return "already_member"

    existing_invitation = (
        db.query(ProjectInvitation)
        .filter(
            ProjectInvitation.project_id == project_id,
            ProjectInvitation.invited_user_id == invited_user_id,
            ProjectInvitation.status == "pending"
        )
        .first()
    )

    if existing_invitation:
        return "already_invited"

    invitation = ProjectInvitation(
        project_id=project_id,
        invited_user_id=invited_user_id,
        invited_by_id=current_user_id
    )

    db.add(invitation)
    db.commit()
    db.refresh(invitation)

    create_notification(
        db=db,
        user_id=invited_user_id,
        title="Project Invitation",
        message=f"You have been invited to join project '{project.title}'.",
        notification_type="project_invitation"
    )

    return invitation


def list_project_invitations(
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
        return "project_not_found"

    if project.owner_id != current_user_id:
        return "forbidden"

    return (
        db.query(ProjectInvitation)
        .filter(ProjectInvitation.project_id == project_id)
        .order_by(ProjectInvitation.created_at.desc())
        .all()
    )


def list_my_project_invitations(
    db: Session,
    user_id: int
):
    return (
        db.query(ProjectInvitation)
        .filter(
            ProjectInvitation.invited_user_id == user_id,
            ProjectInvitation.status == "pending"
        )
        .order_by(ProjectInvitation.created_at.desc())
        .all()
    )


def accept_project_invitation(
    db: Session,
    invitation_id: int,
    current_user_id: int
):
    invitation = (
        db.query(ProjectInvitation)
        .filter(ProjectInvitation.id == invitation_id)
        .first()
    )

    if not invitation:
        return "not_found"

    if invitation.invited_user_id != current_user_id:
        return "forbidden"

    if invitation.status != "pending":
        return "already_processed"

    existing_member = (
        db.query(ProjectMember)
        .filter(
            ProjectMember.project_id == invitation.project_id,
            ProjectMember.user_id == current_user_id
        )
        .first()
    )

    if existing_member:
        invitation.status = "accepted"
        invitation.responded_at = datetime.utcnow()
        db.commit()
        db.refresh(invitation)
        return invitation

    member = ProjectMember(
        project_id=invitation.project_id,
        user_id=current_user_id,
        role="Member"
    )

    invitation.status = "accepted"
    invitation.responded_at = datetime.utcnow()

    db.add(member)
    db.commit()
    db.refresh(invitation)

    create_notification(
        db=db,
        user_id=invitation.project.owner_id,
        title="Project Invitation Accepted",
        message=f"{invitation.invited_user.name} joined project '{invitation.project.title}'.",
        notification_type="project_invitation"
    )

    return invitation


def reject_project_invitation(
    db: Session,
    invitation_id: int,
    current_user_id: int
):
    invitation = (
        db.query(ProjectInvitation)
        .filter(ProjectInvitation.id == invitation_id)
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
        user_id=invitation.project.owner_id,
        title="Project Invitation Rejected",
        message=f"{invitation.invited_user.name} declined project '{invitation.project.title}'.",
        notification_type="project_invitation"
    )

    return invitation
