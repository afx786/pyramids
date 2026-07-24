from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.base import Base


class TeamActivity(Base):
    __tablename__ = "team_activities"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    team_id = Column(
        Integer,
        ForeignKey("teams.id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    action = Column(
        String,
        nullable=False
    )

    description = Column(
        String,
        nullable=False
    )

    metadata_json = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    team = relationship(
        "Team",
        backref="activities"
    )

    user = relationship(
        "User",
        backref="team_activities"
    )
