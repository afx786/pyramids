from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime
)

from sqlalchemy.sql import func

from app.database.base import Base


class Connection(Base):

    __tablename__ = "connections"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_one_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    user_two_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )