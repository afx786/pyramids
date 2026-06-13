from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime
)

from datetime import datetime

from app.database.base import Base


class Hackathon(Base):
    __tablename__ = "hackathons"

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
        String
    )

    organizer = Column(
        String,
        nullable=False
    )

    mode = Column(
        String
    )

    start_date = Column(
        DateTime
    )

    end_date = Column(
        DateTime
    )

    registration_deadline = Column(
        DateTime
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )