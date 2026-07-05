from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Text,
    DateTime
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.base import Base
from sqlalchemy import Boolean

class Message(Base):
    __tablename__ = "messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    conversation_id = Column(
        Integer,
        ForeignKey("conversations.id"),
        nullable=False
    )

    sender_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    content = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # ----------------------------------
    # Sender
    # ----------------------------------

    sender = relationship(
        "User",
        back_populates="messages"
    )

    # ----------------------------------
    # Conversation
    # ----------------------------------

    conversation = relationship(
        "Conversation",
        back_populates="messages"
    )
    is_read = Column(
    Boolean,
    default=False
)

deleted_for_sender = Column(
    Boolean,
    default=False
)

deleted_for_receiver = Column(
    Boolean,
    default=False
)