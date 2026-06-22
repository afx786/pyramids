from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime
)

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
        ForeignKey("research_projects.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    joined_at = Column(
        DateTime,
        default=datetime.utcnow
    )