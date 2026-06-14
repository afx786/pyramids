from sqlalchemy.orm import Session

from app.models.hackathon import Hackathon
from app.models.hackathon_team import HackathonTeam
from app.models.team import Team
from app.models.hackathon_team import HackathonTeam

def create_hackathon(
    db: Session,
    data
):
    hackathon = Hackathon(
        title=data.title,
        description=data.description,
        organizer=data.organizer,
        mode=data.mode,
        start_date=data.start_date,
        end_date=data.end_date,
        registration_deadline=data.registration_deadline
    )

    db.add(hackathon)

    db.commit()

    db.refresh(hackathon)

    return hackathon


def get_all_hackathons(
    db: Session
):
    return db.query(Hackathon).all()


def get_hackathon(
    db: Session,
    hackathon_id: int
):
    return (
        db.query(Hackathon)
        .filter(
            Hackathon.id == hackathon_id
        )
        .first()
    )

def register_team_for_hackathon(
    db: Session,
    hackathon_id: int,
    team_id: int,
    current_user_id: int
):
    hackathon = (
        db.query(Hackathon)
        .filter(
            Hackathon.id == hackathon_id
        )
        .first()
    )

    if not hackathon:
        return None

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

    existing = (
        db.query(HackathonTeam)
        .filter(
            HackathonTeam.hackathon_id == hackathon_id,
            HackathonTeam.team_id == team_id
        )
        .first()
    )

    if existing:
        return "already_registered"

    registration = HackathonTeam(
        hackathon_id=hackathon_id,
        team_id=team_id
    )

    db.add(registration)

    db.commit()

    return registration

def get_hackathon_teams(
    db: Session,
    hackathon_id: int
):
    registrations = (
        db.query(HackathonTeam)
        .filter(
            HackathonTeam.hackathon_id == hackathon_id
        )
        .all()
    )

    results = []

    for registration in registrations:

        team = registration.team

        results.append({
            "id": team.id,
            "name": team.name,
            "owner_id": team.owner_id
        })

    return results