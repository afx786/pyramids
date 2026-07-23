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


class Team(Base):
    __tablename__ = "teams"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    public_id = Column(
        String(20),
        unique=True,
        nullable=False,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    description = Column(
        String
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    purpose = Column(
        String,
        nullable=True
    )

    hackathon_id = Column(
        Integer,
        ForeignKey("hackathons.id"),
        nullable=True
    )

    research_project_id = Column(
        Integer,
        ForeignKey("research_projects.id"),
        nullable=True
    )

    # -----------------------------
    # Team Owner
    # -----------------------------
    owner = relationship(
        "User",
        back_populates="owned_teams"
    )

    # -----------------------------
    # Team Members
    # -----------------------------
    members = relationship(
        "TeamMember",
        back_populates="team",
        cascade="all, delete-orphan"
    )

    hackathon = relationship(
        "Hackathon",
        backref="related_teams"
    )

    research_project = relationship(
        "ResearchProject",
        backref="related_teams"
    )