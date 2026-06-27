from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.base import Base


class ResearchMember(Base):
    __tablename__ = "research_members"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    research_id = Column(
        Integer,
        ForeignKey("research_projects.id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    joined_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # ----------------------------------
    # Research Project
    # ----------------------------------

    research = relationship(
        "ResearchProject",
        back_populates="members"
    )

    # ----------------------------------
    # User
    # ----------------------------------

    user = relationship(
        "User",
        back_populates="research_memberships"
    )