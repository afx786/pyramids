from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class ContactRequest(Base):

    __tablename__ = "contact_requests"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    requester_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    target_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    status = Column(
        String,
        default="pending"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    approved_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    requester = relationship(
        "User",
        foreign_keys=[requester_id]
    )

    target = relationship(
        "User",
        foreign_keys=[target_id]
    )
