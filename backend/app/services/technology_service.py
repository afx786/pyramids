from sqlalchemy.orm import Session

from app.models.technology import Technology


def create_technology(
    db: Session,
    data
):
    slug = (
        data.name
        .strip()
        .lower()
        .replace(" ", "-")
    )

    existing = (
        db.query(Technology)
        .filter(
            Technology.slug == slug
        )
        .first()
    )

    if existing:
        return existing

    technology = Technology(
        name=data.name.strip(),
        slug=slug,
        category=data.category,
        
    )

    db.add(technology)

    db.commit()

    db.refresh(technology)

    return technology


def get_all_technologies(
    db: Session
):
    return (
        db.query(Technology)
        .order_by(
            Technology.category,
            Technology.name
        )
        .all()
    )


def get_technology(
    db: Session,
    technology_id: int
):
    return (
        db.query(Technology)
        .filter(
            Technology.id == technology_id
        )
        .first()
    )


def search_technologies(
    db: Session,
    query: str
):
    return (
        db.query(Technology)
        .filter(
            Technology.name.ilike(f"%{query}%")
        )
        .all()
    )


def get_technologies_by_category(
    db: Session,
    category: str
):
    return (
        db.query(Technology)
        .filter(
            Technology.category == category
        )
        .order_by(
            Technology.name
        )
        .all()
    )