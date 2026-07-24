import json
from sqlalchemy.orm import Session

from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.hackathon_team import HackathonTeam
from app.models.team_activity import TeamActivity
from app.models.user import User
from app.services.notification_service import create_notification
from app.services.id_service import generate_public_id


def create_team_activity(
    db: Session,
    team_id: int,
    action: str,
    description: str,
    user_id: int | None = None,
    metadata_json: dict | None = None
):
    activity = TeamActivity(
        team_id=team_id,
        user_id=user_id,
        action=action,
        description=description,
        metadata_json=json.dumps(metadata_json) if metadata_json else None
    )
    db.add(activity)

def create_team(
    db: Session,
    name: str,
    description: str,
    owner_id: int,
    purpose: str | None = None,
    hackathon_id: int | None = None,
    research_project_id: int | None = None,
    visibility: str = "public",
    looking_for: list[str] | None = None
):
    if purpose == "hackathon" and hackathon_id:
        from app.models.hackathon import Hackathon
        hackathon = db.query(Hackathon).filter(Hackathon.id == hackathon_id).first()
        if not hackathon:
            return "hackathon_not_found"
        current_count = db.query(TeamMember).join(Team).filter(
            Team.hackathon_id == hackathon_id,
            TeamMember.role != "Pending Invite"
        ).count()
        if hackathon.team_size_max and current_count >= hackathon.team_size_max:
            return "team_full"

    team = Team(
        public_id=generate_public_id('TEAM', db=db, model=Team),
        name=name,
        description=description,
        owner_id=owner_id,
        purpose=purpose,
        hackathon_id=hackathon_id,
        research_project_id=research_project_id,
        visibility=visibility,
        looking_for=json.dumps(looking_for) if looking_for else None,
    )

    db.add(team)
    db.flush()

    leader = TeamMember(
        team_id=team.id,
        user_id=owner_id,
        role="Owner"
    )

    db.add(leader)

    create_team_activity(
        db=db,
        team_id=team.id,
        action="team_created",
        description=f"{team.name} was created",
        user_id=owner_id,
    )

    db.commit()
    db.refresh(team)

    return team


def join_team(
    db: Session,
    team_id: int,
    user_id: int
):
    team = (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )

    if not team:
        return None

    existing_member = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == user_id
        )
        .first()
    )

    if existing_member:
        return "already_joined"

    member = TeamMember(
        team_id=team_id,
        user_id=user_id,
        role="Member"
    )

    db.add(member)

    db.commit()

    db.refresh(member)

    if team.owner_id != user_id:
        new_member = db.query(User).filter(User.id == user_id).first()
        create_notification(
            db=db,
            user_id=team.owner_id,
            title="New Team Member",
            message=f"{new_member.name if new_member else 'A member'} joined your team.",
            notification_type="TEAM_MEMBER_JOINED",
            data={"team_id": team.public_id, "team_name": team.name, "member_name": new_member.name if new_member else None}
       )

    return member


def _serialize_team(team: Team) -> dict:
    hackathon_data = None
    if team.hackathon:
        hackathon_data = {
            "id": team.hackathon.id,
            "title": team.hackathon.title,
            "banner_url": team.hackathon.banner_url,
            "mode": team.hackathon.mode,
            "prize_pool": team.hackathon.prize_pool,
            "start_date": str(team.hackathon.start_date) if team.hackathon.start_date else None,
            "end_date": str(team.hackathon.end_date) if team.hackathon.end_date else None,
            "team_size_min": team.hackathon.team_size_min,
            "team_size_max": team.hackathon.team_size_max,
        }
    research_data = None
    if team.research_project:
        research_data = {
            "id": team.research_project.id,
            "title": team.research_project.title,
            "domain": team.research_project.domain,
            "supervisor": team.research_project.supervisor,
        }
    looking_for_list = json.loads(team.looking_for) if team.looking_for else None

    return {
        "id": team.id,
        "public_id": team.public_id,
        "name": team.name,
        "description": team.description,
        "purpose": team.purpose,
        "hackathon_id": team.hackathon_id,
        "research_project_id": team.research_project_id,
        "visibility": team.visibility,
        "looking_for": looking_for_list,
        "hackathon": hackathon_data,
        "research_project": research_data,
        "owner": {
            "id": team.owner.id,
            "name": team.owner.name,
            "builder_id": team.owner.builder_id,
        },
        "members": [
            {
                "id": member.user.id,
                "name": member.user.name,
                "role": member.role,
                "builder_id": member.user.builder_id,
                "avatar": getattr(member.user, 'avatar', None) or getattr(member.user, 'profile_picture', None),
            }
            for member in team.members
        ],
        "activities": [
            {
                "id": a.id,
                "action": a.action,
                "description": a.description,
                "user_id": a.user_id,
                "created_at": a.created_at.isoformat(),
            }
            for a in team.activities
        ] if team.activities else []
    }


def get_all_teams(
    db: Session
):
    teams = db.query(Team).all()
    return [_serialize_team(t) for t in teams]


def get_team(
    db: Session,
    team_id: int
):
    team = (
        db.query(Team)
        .filter(
            Team.id == team_id
        )
        .first()
    )

    if not team:
        return None

    return _serialize_team(team)


def leave_team(
    db: Session,
    team_id: int,
    user_id: int
):
    membership = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == user_id
        )
        .first()
    )

    if not membership:
        return "not_member"

    team = (
        db.query(Team)
        .filter(
            Team.id == team_id
        )
        .first()
    )

    if team.owner_id == user_id:
        return "owner_cannot_leave"

    user_obj = db.query(User).filter(User.id == user_id).first()

    db.delete(membership)

    create_team_activity(
        db=db,
        team_id=team.id,
        action="member_left",
        description=f"{user_obj.name or 'A member'} left the team",
        user_id=user_id,
    )

    db.commit()

    return "success"


def transfer_team_ownership(
    db: Session,
    team_id: int,
    current_user_id: int,
    new_owner_id: int
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
        return "not_owner"

    membership = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == new_owner_id
        )
        .first()
    )

    if not membership:
        return "user_not_member"

    team.owner_id = new_owner_id
    old_owner_membership = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user_id
        )
        .first()
    )

    if old_owner_membership:
        old_owner_membership.role = "Admin"

    membership.role = "Owner"

    db.commit()

    return team


def delete_team(
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
        return "not_owner"

    members = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id
        )
        .all()
    )

    for member in members:
        db.delete(member)

    hackathon_registrations = (
        db.query(HackathonTeam)
        .filter(
            HackathonTeam.team_id == team_id
        )
        .all()
    )

    for registration in hackathon_registrations:
        db.delete(registration)

    db.delete(team)

    db.commit()

    return "success"


def can_manage_team_member(
    db: Session,
    team_id: int,
    user_id: int
):
    membership = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == user_id
        )
        .first()
    )

    return (
        membership is not None
        and membership.role in ["Owner", "Admin", "Leader"]
    )


def add_team_member(
    db: Session,
    team_id: int,
    current_user_id: int,
    user_id: int,
    role: str = "Member"
):
    team = (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )

    if not team:
        return "team_not_found"

    if not can_manage_team_member(
        db,
        team_id,
        current_user_id
    ):
        return "forbidden"

    if role not in ["Admin", "Member"]:
        return "invalid_role"

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        return "user_not_found"

    existing = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == user_id
        )
        .first()
    )

    if existing:
        return "already_member"

    member = TeamMember(
        team_id=team_id,
        user_id=user_id,
        role=role
    )

    db.add(member)

    create_team_activity(
        db=db,
        team_id=team.id,
        action="member_added",
        description=f"{user.name} was invited to the team",
        user_id=user_id,
    )

    db.commit()
    db.refresh(member)

    create_notification(
        db=db,
        user_id=user_id,
        title="Team Invitation",
        message=f"You have been added to team '{team.name}'.",
        notification_type="TEAM_INVITE",
        data={"team_id": team.public_id, "team_name": team.name}
    )

    return member


def remove_team_member(
    db: Session,
    team_id: int,
    current_user_id: int,
    user_id: int
):
    team = (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )

    if not team:
        return "team_not_found"

    if not can_manage_team_member(
        db,
        team_id,
        current_user_id
    ):
        return "forbidden"

    if team.owner_id == user_id:
        return "cannot_remove_owner"

    membership = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == user_id
        )
        .first()
    )

    if not membership:
        return "not_member"

    target_user = db.query(User).filter(User.id == user_id).first()
    target_name = target_user.name if target_user else "A member"

    db.delete(membership)

    create_team_activity(
        db=db,
        team_id=team.id,
        action="member_removed",
        description=f"{target_name} was removed from the team",
        user_id=user_id,
    )

    db.commit()

    return "success"


def change_team_member_role(
    db: Session,
    team_id: int,
    current_user_id: int,
    user_id: int,
    role: str
):
    team = (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )

    if not team:
        return "team_not_found"

    if team.owner_id != current_user_id:
        return "forbidden"

    if role not in ["Admin", "Member"]:
        return "invalid_role"

    if team.owner_id == user_id:
        return "cannot_change_owner"

    membership = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == user_id
        )
        .first()
    )

    if not membership:
        return "not_member"

    membership.role = role

    db.commit()
    db.refresh(membership)

    return membership
