from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from datetime import datetime

from app.database.base import Base


class ResearchJoinRequest(Base):
    __tablename__ = "research_join_requests"

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

    status = Column(
        String,
        default="pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )