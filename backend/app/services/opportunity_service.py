from sqlalchemy.orm import Session

from app.models.opportunity import Opportunity


def create_opportunity(
    db: Session,
    data
):
    opportunity = Opportunity(
        title=data.title,
        description=data.description,

        type=data.type,

        organizer=data.organizer,
        external_url=data.external_url
    )

    db.add(opportunity)

    db.commit()

    db.refresh(opportunity)

    return opportunity


def get_all_opportunities(
    db: Session
):
    return (
        db.query(Opportunity)
        .filter(
            Opportunity.status == "active"
        )
        .all()
    )