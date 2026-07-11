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
    accept_request,
    send_request,
    reject_request,
    get_connections,
    get_incoming_requests,
    get_outgoing_requests,
    remove_connection,
    cancel_request
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
@router.post(
    "/{request_id}/reject"
)
def reject_connection_request(

    request_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    result = reject_request(

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
            detail="You cannot reject this request."
        )

    if result == "already_processed":
        raise HTTPException(
            status_code=400,
            detail="Request already processed."
        )

    return {
        "message": "Connection request rejected."
    }
@router.get(

    "",

    response_model=list[ConnectionResponse]

)
def list_connections(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    return get_connections(

        db,

        current_user.id

    )
@router.get(

    "/requests/incoming",

    response_model=list[ConnectionRequestResponse]

)
def incoming_requests(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    return get_incoming_requests(

        db,

        current_user.id

    )
@router.get(

    "/requests/outgoing",

    response_model=list[ConnectionRequestResponse]

)
def outgoing_requests(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    return get_outgoing_requests(

        db,

        current_user.id

    )
@router.delete(
    "/requests/{request_id}"
)
def cancel_connection_request(

    request_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    result = cancel_request(

        db,

        request_id,

        current_user.id

    )

    if result == "request_not_found":
        raise HTTPException(
            status_code=404,
            detail="Connection request not found."
        )

    if result == "not_sender":
        raise HTTPException(
            status_code=403,
            detail="Only the sender can cancel this request."
        )

    if result == "already_processed":
        raise HTTPException(
            status_code=400,
            detail="Request has already been processed."
        )

    return {
        "message": "Connection request cancelled."
    }
@router.delete(
    "/{connection_id}"
)
def delete_connection(

    connection_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    result = remove_connection(

        db,

        connection_id,

        current_user.id

    )

    if result == "connection_not_found":
        raise HTTPException(
            status_code=404,
            detail="Connection not found."
        )

    if result == "forbidden":
        raise HTTPException(
            status_code=403,
            detail="You are not part of this connection."
        )

    return {
        "message": "Connection removed successfully."
    }