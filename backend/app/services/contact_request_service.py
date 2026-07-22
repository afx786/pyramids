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

    requester = (
        db.query(User)
        .filter(User.id == requester_id)
        .first()
    )

    if not requester.contact_email and not requester.whatsapp_number:
        return "requester_no_contact"

    request = ContactRequest(
        requester_id=requester_id,
        target_id=target_id,
        status="pending"
    )

    db.add(request)
    db.commit()
    db.refresh(request)

    create_notification(
        db=db,
        user_id=target_id,
        title="Contact Request",
        message="A builder has requested your contact information.",
        notification_type="CONTACT_REQUEST"
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
    db.commit()
    db.refresh(req)

    target = (
        db.query(User)
        .filter(User.id == req.target_id)
        .first()
    )

    create_notification(
        db=db,
        user_id=req.requester_id,
        title="Contact Information Shared",
        message="The builder has shared their contact details with you.",
        notification_type="CONTACT_APPROVED"
    )

    return {
        "status": "approved",
        "contact_email": target.contact_email,
        "whatsapp_number": target.whatsapp_number
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

    create_notification(
        db=db,
        user_id=req.requester_id,
        title="Contact Request Declined",
        message="Your request for contact information was declined.",
        notification_type="CONTACT_DECLINED"
    )

    return req


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
        "request_id": req.id
    }

    if req.status == "approved":
        target = (
            db.query(User)
            .filter(User.id == req.target_id)
            .first()
        )
        result["contact_email"] = target.contact_email
        result["whatsapp_number"] = target.whatsapp_number

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
        "whatsapp_number": user.whatsapp_number
    }


def update_contact_info(
    db: Session,
    user_id: int,
    contact_email: str | None,
    whatsapp_number: str | None
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if contact_email is not None:
        user.contact_email = contact_email or None

    if whatsapp_number is not None:
        user.whatsapp_number = whatsapp_number or None

    db.commit()
    db.refresh(user)

    return {
        "contact_email": user.contact_email,
        "whatsapp_number": user.whatsapp_number
    }
