from datetime import datetime, timezone

from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.contact_request import ContactRequest
from app.models.connection import Connection
from app.services.notification_service import create_notification
from app.models.user import User


def send_contact_request(
    db: Session,
    requester_id: int,
    target_id: int
):

    if requester_id == target_id:
        return "self_request"

    target = (
        db.query(User)
        .filter(User.id == target_id)
        .first()
    )

    if not target:
        return "target_not_found"

    connection = (
        db.query(Connection)
        .filter(
            or_(
                (
                    (Connection.user_one_id == requester_id)
                    &
                    (Connection.user_two_id == target_id)
                ),
                (
                    (Connection.user_one_id == target_id)
                    &
                    (Connection.user_two_id == requester_id)
                )
            )
        )
        .first()
    )

    if not connection:
        return "not_connected"

    existing = (
        db.query(ContactRequest)
        .filter(
            ContactRequest.requester_id == requester_id,
            ContactRequest.target_id == target_id,
            ContactRequest.status == "pending"
        )
        .first()
    )

    if existing:
        return "request_exists"

    approved = (
        db.query(ContactRequest)
        .filter(
            ContactRequest.requester_id == requester_id,
            ContactRequest.target_id == target_id,
            ContactRequest.status == "approved"
        )
        .first()
    )

    if approved:
        return "already_approved"

    request = ContactRequest(
        requester_id=requester_id,
        target_id=target_id,
        status="pending"
    )

    db.add(request)
    db.commit()
    db.refresh(request)

    requester_name = requester.name or "A builder"

    create_notification(
        db=db,
        user_id=target_id,
        title="Contact Request",
        message=f"{requester_name} has requested your contact information.",
        notification_type="CONTACT_REQUEST",
        data={"requester_id": requester_id, "requester_name": requester_name}
    )

    return request


def approve_contact_request(
    db: Session,
    request_id: int,
    current_user_id: int
):

    req = (
        db.query(ContactRequest)
        .filter(ContactRequest.id == request_id)
        .first()
    )

    if not req:
        return "request_not_found"

    if req.target_id != current_user_id:
        return "not_target"

    if req.status != "pending":
        return "already_processed"

    req.status = "approved"
    req.approved_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(req)

    target = (
        db.query(User)
        .filter(User.id == req.target_id)
        .first()
    )

    target_name = target.name or "A builder"

    create_notification(
        db=db,
        user_id=req.requester_id,
        title="Contact Information Shared",
        message=f"{target_name} has shared their contact details with you.",
        notification_type="CONTACT_APPROVED",
        data={"target_id": req.target_id, "target_name": target_name}
    )

    return {
        "status": "approved",
        "contact_email": target.contact_email,
        "phone_number": target.phone_number
    }


def decline_contact_request(
    db: Session,
    request_id: int,
    current_user_id: int
):

    req = (
        db.query(ContactRequest)
        .filter(ContactRequest.id == request_id)
        .first()
    )

    if not req:
        return "request_not_found"

    if req.target_id != current_user_id:
        return "not_target"

    if req.status != "pending":
        return "already_processed"

    req.status = "declined"
    db.commit()
    db.refresh(req)

    target = (
        db.query(User)
        .filter(User.id == req.target_id)
        .first()
    )

    target_name = target.name or "A builder"

    create_notification(
        db=db,
        user_id=req.requester_id,
        title="Contact Request Declined",
        message=f"{target_name} declined your request for contact information.",
        notification_type="CONTACT_DECLINED",
        data={"target_id": req.target_id, "target_name": target_name}
    )

    return req


def withdraw_contact_request(
    db: Session,
    request_id: int,
    current_user_id: int
):

    req = (
        db.query(ContactRequest)
        .filter(ContactRequest.id == request_id)
        .first()
    )

    if not req:
        return "request_not_found"

    if req.requester_id != current_user_id:
        return "not_requester"

    if req.status != "pending":
        return "already_processed"

    db.delete(req)
    db.commit()

    return {"message": "Request withdrawn."}


def get_contact_request_status(
    db: Session,
    requester_id: int,
    target_id: int
):

    req = (
        db.query(ContactRequest)
        .filter(
            ContactRequest.requester_id == requester_id,
            ContactRequest.target_id == target_id
        )
        .order_by(ContactRequest.created_at.desc())
        .first()
    )

    if not req:
        return {"status": "none"}

    result = {
        "status": req.status,
        "request_id": req.id,
        "approved_at": req.approved_at.isoformat() if req.approved_at else None
    }

    if req.status == "approved":
        target = (
            db.query(User)
            .filter(User.id == req.target_id)
            .first()
        )
        result["contact_email"] = target.contact_email
        result["phone_number"] = target.phone_number

    return result


def get_received_requests(
    db: Session,
    user_id: int
):

    return (
        db.query(ContactRequest)
        .filter(
            ContactRequest.target_id == user_id,
            ContactRequest.status == "pending"
        )
        .order_by(ContactRequest.created_at.desc())
        .all()
    )


def get_my_contact_info(
    db: Session,
    user_id: int
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    return {
        "contact_email": user.contact_email,
        "phone_number": user.phone_number
    }


def update_contact_info(
    db: Session,
    user_id: int,
    contact_email: str | None,
    phone_number: str | None
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if contact_email is not None:
        user.contact_email = contact_email or None

    if phone_number is not None:
        user.phone_number = phone_number or None

    db.commit()
    db.refresh(user)

    return {
        "contact_email": user.contact_email,
        "phone_number": user.phone_number
    }
