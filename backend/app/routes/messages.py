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
    ConversationListResponse
)

from app.services.message_service import (
    create_conversation,
    send_message,
    get_messages,
    get_user_conversations
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
    "/conversations/{conversation_id}",
    response_model=list[MessageResponse]
)
def conversation_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
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

    return result

@router.get(
    "/conversations",
    response_model=list[ConversationListResponse]
)
def list_conversations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_user_conversations(
        db,
        current_user.id
    )
@router.get(
    "/conversations",
    response_model=list[ConversationListResponse]
)
def my_conversations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_user_conversations(
        db=db,
        user_id=current_user.id
    )