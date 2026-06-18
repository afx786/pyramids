from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime
)

from datetime import datetime

from app.database.base import Base


class Opportunity(Base):
    __tablename__ = "opportunities"

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
        Text
    )

    type = Column(
        String,
        nullable=False
    )

    organizer = Column(
        String
    )

    external_url = Column(
        String
    )

    status = Column(
        String,
        default="active"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )