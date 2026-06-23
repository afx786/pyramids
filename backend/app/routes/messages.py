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
    ConversationResponse
)

from app.services.message_service import (
    create_conversation
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