from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.models.conversation_participant import ConversationParticipant
from app.models.user import User

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