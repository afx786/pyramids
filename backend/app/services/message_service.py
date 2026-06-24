from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.models.conversation_participant import ConversationParticipant
from app.models.user import User
from app.models.message import Message

def create_conversation(
    db: Session,
    current_user_id: int,
    other_user_id: int
):
    other_user = (
        db.query(User)
        .filter(
            User.id == other_user_id
        )
        .first()
    )

    if not other_user:
        return "user_not_found"

    existing = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.user_id == current_user_id
        )
        .all()
    )

    for participant in existing:
        conversation_id = participant.conversation_id

        participants = (
            db.query(ConversationParticipant)
            .filter(
                ConversationParticipant.conversation_id == conversation_id
            )
            .all()
        )

        participant_ids = [
            p.user_id
            for p in participants
        ]

        if (
            current_user_id in participant_ids
            and other_user_id in participant_ids
            and len(participant_ids) == 2
        ):
            return (
                db.query(Conversation)
                .filter(
                    Conversation.id == conversation_id
                )
                .first()
            )

    conversation = Conversation()

    db.add(conversation)

    db.flush()

    db.add(
        ConversationParticipant(
            conversation_id=conversation.id,
            user_id=current_user_id
        )
    )

    db.add(
        ConversationParticipant(
            conversation_id=conversation.id,
            user_id=other_user_id
        )
    )

    db.commit()

    db.refresh(conversation)

    return conversation

def send_message(
    db: Session,
    conversation_id: int,
    sender_id: int,
    content: str
):
    participant = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id == sender_id
        )
        .first()
    )

    if not participant:
        return "not_participant"

    message = Message(
        conversation_id=conversation_id,
        sender_id=sender_id,
        content=content
    )

    db.add(message)

    db.commit()

    db.refresh(message)

    return message

def get_messages(
    db: Session,
    conversation_id: int
):
    return (
        db.query(Message)
        .filter(
            Message.conversation_id == conversation_id
        )
        .order_by(Message.id)
        .all()
    )

def get_user_conversations(
    db: Session,
    user_id: int
):
    participations = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.user_id == user_id
        )
        .all()
    )

    results = []

    for participation in participations:
        participants = (
            db.query(ConversationParticipant)
            .filter(
                ConversationParticipant.conversation_id
                == participation.conversation_id
            )
            .all()
        )

        results.append({
            "conversation_id": participation.conversation_id,
            "participant_ids": [
                p.user_id
                for p in participants
            ]
        })

    return results