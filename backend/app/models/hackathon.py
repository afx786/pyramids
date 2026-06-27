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

    source = Column(
        String,
        default="admin"
    )

    status = Column(
        String,
        default="approved"
    )

    external_url = Column(
        String
    )

    external_id = Column(
        String
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    # ----------------------------------
    # Creator
    # ----------------------------------

    creator = relationship(
        "User",
        back_populates="created_hackathons"
    )