from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.deps import get_db

from app.core.auth import (
    get_current_user
)

from app.schemas.connection import (
    ConnectionRequestCreate,
    ConnectionRequestResponse
)

from app.services.connection_service import (
    send_request
)

router = APIRouter(

    prefix="/connections",

    tags=["Connections"]

)


@router.post(

    "/request",

    response_model=ConnectionRequestResponse

)
def create_connection_request(

    data: ConnectionRequestCreate,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    result = send_request(

        db=db,

        sender_id=current_user.id,

        receiver_id=data.receiver_id

    )

    if result == "self_request":
        raise HTTPException(
            status_code=400,
            detail="Cannot send request to yourself."
        )

    if result == "user_not_found":
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if result == "already_connected":
        raise HTTPException(
            status_code=400,
            detail="Already connected."
        )

    if result == "request_exists":
        raise HTTPException(
            status_code=400,
            detail="Connection request already exists."
        )

    return result