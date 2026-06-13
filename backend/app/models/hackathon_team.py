from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.base import Base


class HackathonTeam(Base):
    __tablename__ = "hackathon_teams"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    hackathon_id = Column(
        Integer,
        ForeignKey("hackathons.id")
    )

    team_id = Column(
        Integer,
        ForeignKey("teams.id")
    )

    registered_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    hackathon = relationship(
        "Hackathon"
    )

    team = relationship(
        "Team"
    )