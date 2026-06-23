from sqlalchemy import (
    Column,
    Integer,
    ForeignKey
)

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
        ForeignKey("conversations.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )