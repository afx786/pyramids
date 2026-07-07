from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Boolean
)

from sqlalchemy.orm import relationship
from sqlalchemy import DateTime
from datetime import datetime
from app.database.base import Base


class ConversationParticipant(Base):
    __tablename__ = "conversation_participants"

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

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    conversation = relationship(
        "Conversation",
        back_populates="participants"
    )

    user = relationship(
        "User"
    )
    is_deleted = Column(
        Boolean,
     default=False
    )

    deleted_at = Column(
        DateTime,
        nullable=True
    )