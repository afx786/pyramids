from sqlalchemy.orm import Session
from datetime import datetime
from app.models.conversation import Conversation
from app.models.conversation_participant import ConversationParticipant
from app.models.user import User
from app.models.message import Message
from app.services.notification_service import create_notification


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
    participants = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.conversation_id == conversation_id
    )
    .all()
    )

    for participant in participants:

        if participant.user_id != sender_id:

            participant.is_deleted = False
            participant.deleted_at = None

    db.commit()

    db.refresh(message)

    participants = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.conversation_id == conversation_id
        )
        .all()
    )

    for participant in participants:

        if participant.user_id != sender_id:

           create_notification(
              db=db,
              user_id=participant.user_id,
              title="New Message",
              message="You have received a new message.",
              notification_type="message"
            )

    return message

def get_messages(
    db: Session,
    conversation_id: int,
    current_user_id: int
):
    participant = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id == current_user_id
        )
        .first()
    )

    if not participant:
        return "not_participant"

    unread_messages = (
        db.query(Message)
        .filter(
            Message.conversation_id == conversation_id,
            Message.sender_id != current_user_id,
            Message.is_read == False
        )
        .all()
    )

    for message in unread_messages:
        message.is_read = True

    db.commit()

    messages = (
    db.query(Message)
    .filter(
        Message.conversation_id == conversation_id
    )
    .order_by(
        Message.created_at.asc()
    )
    .all()
    )

    visible = []

    for message in messages:

        if (
            message.sender_id == current_user_id
            and message.deleted_for_sender
        ):
            continue

        if (
            message.sender_id != current_user_id
            and message.deleted_for_receiver
        ):
            continue

        visible.append(message)

    return visible

def get_user_conversations(
    db: Session,
    user_id: int
):
    participations = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.user_id == user_id,
            ConversationParticipant.is_deleted == False
    )
    .all()
)

    conversations = []

    for participation in participations:

        conversation_id = participation.conversation_id

        participants = (
            db.query(ConversationParticipant)
            .filter(
                ConversationParticipant.conversation_id == conversation_id
            )
            .all()
        )

        other_user = None

        for participant in participants:

            if participant.user_id != user_id:

                other_user = (
                    db.query(User)
                    .filter(
                        User.id == participant.user_id
                    )
                    .first()
                )

                break

        last_message = (
            db.query(Message)
            .filter(
                Message.conversation_id == conversation_id
            )
            .order_by(
                Message.created_at.desc()
            )
            .first()
        )

        unread_count = (
            db.query(Message)
            .filter(
                Message.conversation_id == conversation_id,
                Message.sender_id != user_id,
                Message.is_read == False
            )
            .count()
        )

        conversations.append({

            "conversation_id": conversation_id,

            "other_user": {

                "id": other_user.id,

                "name": other_user.name

            },

            "last_message": (
                last_message.content
                if last_message
                else None
            ),

            "last_message_time": (
                last_message.created_at
                if last_message
                else None
            ),

            "unread_count": unread_count

        })

    conversations.sort(
        key=lambda x: (
            x["last_message_time"]
            or 0
        ),
        reverse=True
    )

    return conversations

def delete_message(
    db: Session,
    message_id: int,
    user_id: int
):
    message = (
        db.query(Message)
        .filter(
            Message.id == message_id
        )
        .first()
    )

    if not message:
        return "not_found"

    if message.sender_id == user_id:
        message.deleted_for_sender = True
    else:
        message.deleted_for_receiver = True

    db.commit()

    return "success"


def delete_conversation(
    db: Session,
    conversation_id: int,
    user_id: int
):
    participant = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id == user_id
        )
        .first()
    )

    if not participant:
        return "not_found"

    participant.is_deleted = True
    participant.deleted_at = datetime.utcnow()

    db.commit()

    return "success"