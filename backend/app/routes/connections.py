from app.models.user import User
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
    ConnectionRequestResponse,
    ConnectionResponse
)

from app.services.connection_service import (
    send_request
)
from app.services.connection_service import (
    accept_request
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
@router.post(
    "/{request_id}/accept",
    response_model=ConnectionResponse
)
def accept_connection_request(

    request_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    result = accept_request(

        db=db,

        request_id=request_id,

        current_user_id=current_user.id

    )

    if result == "request_not_found":
        raise HTTPException(
            status_code=404,
            detail="Connection request not found."
        )

    if result == "not_receiver":
        raise HTTPException(
            status_code=403,
            detail="You cannot accept this request."
        )

    if result == "already_processed":
        raise HTTPException(
            status_code=400,
            detail="Request already processed."
        )

    other_user = (
        db.query(User)
        .filter(
            User.id == result.user_one_id
        )
        .first()
    )

    return {

        "id": result.id,

        "user": other_user,

        "connected_at": result.created_at

    }