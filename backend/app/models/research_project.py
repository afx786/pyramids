from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.base import Base


class ResearchProject(Base):
    __tablename__ = "research_projects"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    domain = Column(
        String,
        nullable=False
    )

    research_type = Column(
        String,
        nullable=False
    )

    skills_needed = Column(
        Text
    )

    team_size = Column(
        Integer,
        default=1
    )

    status = Column(
        String,
        default="open"
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

    # ----------------------------------
    # Owner
    # ----------------------------------

    owner = relationship(
        "User",
        back_populates="research_projects"
    )

    # ----------------------------------
    # Members
    # ----------------------------------

    members = relationship(
        "ResearchMember",
        back_populates="research",
        cascade="all, delete-orphan"
    )

    # ----------------------------------
    # Collaboration Requests
    # ----------------------------------

    join_requests = relationship(
        "ResearchJoinRequest",
        cascade="all, delete-orphan"
    )