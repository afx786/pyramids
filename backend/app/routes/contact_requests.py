from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.deps import get_db

from app.core.auth import get_current_user

from app.schemas.contact_request import (
    ContactRequestCreate,
    ContactInfoUpdate,
    ContactInfoResponse
)

from app.services.contact_request_service import (
    send_contact_request,
    approve_contact_request,
    decline_contact_request,
    withdraw_contact_request,
    get_contact_request_status,
    get_received_requests,
    get_my_contact_info,
    update_contact_info
)

router = APIRouter(
    prefix="/contacts",
    tags=["Contacts"]
)


@router.get(
    "/my-info",
    response_model=ContactInfoResponse
)
def my_contact_info(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_my_contact_info(db, current_user.id)


@router.put(
    "/my-info",
    response_model=ContactInfoResponse
)
def update_my_contact_info(
    data: ContactInfoUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return update_contact_info(
        db,
        current_user.id,
        data.contact_email,
        data.whatsapp_number
    )


@router.post("/request")
def create_contact_request(
    data: ContactRequestCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = send_contact_request(
        db,
        current_user.id,
        data.target_id
    )

    if result == "self_request":
        raise HTTPException(
            status_code=400,
            detail="Cannot request your own contact information."
        )

    if result == "target_not_found":
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if result == "not_connected":
        raise HTTPException(
            status_code=400,
            detail="You must be connected to request contact information."
        )

    if result == "request_exists":
        raise HTTPException(
            status_code=400,
            detail="A pending request already exists."
        )

    if result == "already_approved":
        raise HTTPException(
            status_code=400,
            detail="Contact information already shared."
        )

    return result


@router.post("/request/{request_id}/approve")
def approve_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = approve_contact_request(
        db,
        request_id,
        current_user.id
    )

    if result == "request_not_found":
        raise HTTPException(
            status_code=404,
            detail="Request not found."
        )

    if result == "not_target":
        raise HTTPException(
            status_code=403,
            detail="You cannot approve this request."
        )

    if result == "already_processed":
        raise HTTPException(
            status_code=400,
            detail="Request already processed."
        )

    return result


@router.post("/request/{request_id}/decline")
def decline_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = decline_contact_request(
        db,
        request_id,
        current_user.id
    )

    if result == "request_not_found":
        raise HTTPException(
            status_code=404,
            detail="Request not found."
        )

    if result == "not_target":
        raise HTTPException(
            status_code=403,
            detail="You cannot decline this request."
        )

    if result == "already_processed":
        raise HTTPException(
            status_code=400,
            detail="Request already processed."
        )

    return {"message": "Request declined."}


@router.get("/request/status/{target_id}")
def request_status(
    target_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_contact_request_status(
        db,
        current_user.id,
        target_id
    )


@router.get("/requests/received")
def received_requests(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_received_requests(
        db,
        current_user.id
    )


@router.post("/request/{request_id}/withdraw")
def withdraw_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = withdraw_contact_request(
        db,
        request_id,
        current_user.id
    )

    if result == "request_not_found":
        raise HTTPException(
            status_code=404,
            detail="Request not found."
        )

    if result == "not_requester":
        raise HTTPException(
            status_code=403,
            detail="You cannot withdraw this request."
        )

    if result == "already_processed":
        raise HTTPException(
            status_code=400,
            detail="Request already processed."
        )

    return result
