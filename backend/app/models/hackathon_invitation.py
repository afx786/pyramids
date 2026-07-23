from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from datetime import datetime

from sqlalchemy.orm import relationship

from app.database.base import Base


class HackathonInvitation(Base):
    __tablename__ = "hackathon_invitations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    hackathon_id = Column(
        Integer,
        ForeignKey("hackathons.id"),
        nullable=False
    )

    team_id = Column(
        Integer,
        ForeignKey("teams.id"),
        nullable=False
    )

    invited_user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    invited_by_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    status = Column(
        String,
        default="pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    responded_at = Column(
        DateTime,
        nullable=True
    )

    hackathon = relationship(
        "Hackathon"
    )

    team = relationship(
        "Team"
    )

    invited_user = relationship(
        "User",
        foreign_keys=[invited_user_id]
    )

    invited_by = relationship(
        "User",
        foreign_keys=[invited_by_id]
    )
