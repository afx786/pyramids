from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.base import Base


class TeamMember(Base):
    __tablename__ = "team_members"

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
        nullable=False
    )

    role = Column(
        String,
        default="Member"
    )

    joined_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # -----------------------------
    # Team Relationship
    # -----------------------------
    team = relationship(
        "Team",
        back_populates="members"
    )

    # -----------------------------
    # User Relationship
    # -----------------------------
    user = relationship(
        "User",
        back_populates="team_memberships"
    )