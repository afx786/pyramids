from sqlalchemy import (
    Column,
    Integer,
    DateTime
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.base import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # -----------------------------
    # Messages
    # -----------------------------

    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan"
    )

    # -----------------------------
    # Participants
    # -----------------------------

    participants = relationship(
        "ConversationParticipant",
        cascade="all, delete-orphan"
    )