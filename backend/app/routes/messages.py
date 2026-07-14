from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.deps import get_db
from app.core.auth import get_current_user

from app.schemas.message import (
    ConversationCreate,
    ConversationResponse,
    MessageCreate,
    MessageResponse,
    ConversationListResponse,
)

from app.services.message_service import (
    create_conversation,
    send_message,
    get_messages,
    get_user_conversations,
    delete_message,
    delete_conversation
)
from app.models.message import Message
from app.services.pagination import (
    paginate_query,
    paginate_list
)

router = APIRouter(
    prefix="/messages",
    tags=["Messaging"]
)


@router.post(
    "/conversations",
    response_model=ConversationResponse
)
def start_conversation(
    data: ConversationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = create_conversation(
        db=db,
        current_user_id=current_user.id,
        other_user_id=data.user_id
    )

    if result == "not_connected":
        raise HTTPException(
            status_code=403,
            detail="You can only message connected users."
        )

    if result == "user_not_found":
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return result


@router.post(
    "",
    response_model=MessageResponse
)
def create_message(
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = send_message(
        db=db,
        conversation_id=data.conversation_id,
        sender_id=current_user.id,
        content=data.content
    )

    if result == "not_participant":
        raise HTTPException(
            status_code=403,
            detail="Not part of conversation"
        )

    return result


@router.get(
    "/conversations/{conversation_id}"
)
def conversation_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    limit: int | None = None,
    offset: int = 0,
    sort: str = "oldest"
):
    result = get_messages(
        db=db,
        conversation_id=conversation_id,
        current_user_id=current_user.id
    )

    if result == "not_participant":
        raise HTTPException(
            status_code=403,
            detail="Not part of conversation"
        )

    if limit is None:
        return result

    ordered = result

    if sort == "newest":
        ordered = sorted(
            ordered,
            key=lambda message: message.created_at,
            reverse=True
        )

    else:
        ordered = sorted(
            ordered,
            key=lambda message: message.created_at
        )

    total = len(ordered)
    items = ordered[offset:offset + limit]

    return {
        "items": items,
        "meta": {
            "total": total,
            "limit": limit,
            "offset": offset,
            "sort": sort
        }
    }


@router.get(
    "/conversations"
)
def my_conversations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    limit: int | None = None,
    offset: int = 0,
    sort: str = "newest"
):
    results = get_user_conversations(
        db=db,
        user_id=current_user.id
    )

    if limit is None:
        return results

    items, meta = paginate_list(results, limit, offset)
    return {"items": items, "meta": {**meta, "sort": sort}}
@router.delete(
    "/{message_id}"
)
def remove_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = delete_message(
        db=db,
        message_id=message_id,
        user_id=current_user.id
    )

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Message not found"
        )

    return {
        "message": "Message deleted"
    }


@router.delete(
    "/conversations/{conversation_id}"
)
def remove_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = delete_conversation(
        db=db,
        conversation_id=conversation_id,
        user_id=current_user.id
    )

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    return {
        "message": "Conversation deleted"
    }
