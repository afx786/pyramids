from sqlalchemy.orm import Session

from app.models.team import Team
from app.models.team_member import TeamMember

from app.models.team import Team
def create_team(
    db: Session,
    name: str,
    description: str,
    owner_id: int
):
    team = Team(
        name=name,
        description=description,
        owner_id=owner_id
    )

    db.add(team)
    db.flush()

    leader = TeamMember(
        team_id=team.id,
        user_id=owner_id,
        role="Leader"
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

    return member

def get_all_teams(
    db: Session
):
    teams = db.query(Team).all()

    results = []

    for team in teams:

        results.append({
            "id": team.id,
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