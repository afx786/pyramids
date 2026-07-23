from sqlalchemy.orm import Session

from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.user import User
from app.services.notification_service import create_notification
from app.services.id_service import generate_public_id

def create_team(
    db: Session,
    name: str,
    description: str,
    owner_id: int
):
    team = Team(
        public_id=generate_public_id('TEAM', db=db, model=Team),
        name=name,
        description=description,
        owner_id=owner_id
    )

    db.add(team)
    db.flush()

    leader = TeamMember(
        team_id=team.id,
        user_id=owner_id,
        role="Owner"
    )

    db.add(leader)

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
        create_notification(
            db=db,
            user_id=team.owner_id,
            title="New Team Member",
            message=f"A new member joined your team '{team.name}'.",
            notification_type="team"
       )

    return member


def get_all_teams(
    db: Session
):
    teams = db.query(Team).all()

    results = []

    for team in teams:
        results.append({
            "id": team.id,
            "public_id": team.public_id,
            "name": team.name,
            "description": team.description,
            "owner": {
                "id": team.owner.id,
                "name": team.owner.name
            },
            "members": [
                {
                    "id": member.user.id,
                    "name": member.user.name,
                    "role": member.role
                }
                for member in team.members
            ]
        })

    return results


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

    return {
        "id": team.id,
        "public_id": team.public_id,
        "name": team.name,
        "description": team.description,
        "owner": {
            "id": team.owner.id,
            "name": team.owner.name
        },
        "members": [
            {
                "id": member.user.id,
                "name": member.user.name,
                "role": member.role
            }
            for member in team.members
        ]
    }


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

    db.delete(membership)

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
    db.commit()
    db.refresh(member)

    create_notification(
        db=db,
        user_id=user_id,
        title="Team Invitation",
        message=f"You have been added to team '{team.name}'.",
        notification_type="team"
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

    db.delete(membership)
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
