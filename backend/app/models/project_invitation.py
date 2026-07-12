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


class ProjectInvitation(Base):
    __tablename__ = "project_invitations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
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

    project = relationship(
        "Project",
        back_populates="invitations"
    )

    invited_user = relationship(
        "User",
        foreign_keys=[invited_user_id]
    )

    invited_by = relationship(
        "User",
        foreign_keys=[invited_by_id]
    )
