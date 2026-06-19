from sqlalchemy.orm import Session

from app.models.hackathon import Hackathon
from app.models.opportunity import Opportunity


def get_feed(
    db: Session
):
    items = []

    hackathons = (
        db.query(Hackathon)
        .filter(Hackathon.status == "approved")
        .all()
    )

    for hackathon in hackathons:
        items.append({
            "type": "hackathon",
            "id": hackathon.id,
            "title": hackathon.title,
            "organizer": hackathon.organizer
        })

    opportunities = (
        db.query(Opportunity)
        .filter(Opportunity.status == "active")
        .all()
    )

    for opportunity in opportunities:
        items.append({
            "type": "research",
            "id": opportunity.id,
            "title": opportunity.title,
            "organizer": opportunity.organizer
        })

    return items