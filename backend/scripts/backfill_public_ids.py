import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database.session import SessionLocal
from app.models.user import User
from app.models.project import Project
from app.models.team import Team
from app.models.hackathon import Hackathon
from app.models.research_project import ResearchProject
from app.models.organization import Organization
from app.services.id_service import generate_public_id

MODELS = [
    (User, "USER"),
    (Project, "PROJ"),
    (Team, "TEAM"),
    (Hackathon, "HACK"),
    (ResearchProject, "RES"),
    (Organization, "ORG"),
]


def backfill():
    db = SessionLocal()
    try:
        for model_cls, prefix in MODELS:
            records = db.query(model_cls).filter(model_cls.public_id.is_(None)).all()
            for record in records:
                for attempt in range(5):
                    pid = generate_public_id(prefix)
                    existing = db.query(model_cls).filter(
                        model_cls.public_id == pid
                    ).first()
                    if not existing:
                        record.public_id = pid
                        break
            db.commit()
            print(f"Backfilled {len(records)} {model_cls.__name__} records")
    finally:
        db.close()


if __name__ == "__main__":
    backfill()
