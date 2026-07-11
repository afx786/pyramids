from sqlalchemy.orm import Session

from app.models.user import User
from app.models.connection import Connection
from app.models.connection_request import ConnectionRequest

from app.services.notification_service import (
    create_notification
)


def send_request(
    db: Session,
    sender_id: int,
    receiver_id: int
):

    if sender_id == receiver_id:
        return "self_request"

    receiver = (
        db.query(User)
        .filter(
            User.id == receiver_id
        )
        .first()
    )

    if not receiver:
        return "user_not_found"

    existing_connection = (
        db.query(Connection)
        .filter(
            (
                (Connection.user_one_id == sender_id)
                &
                (Connection.user_two_id == receiver_id)
            )
            |
            (
                (Connection.user_one_id == receiver_id)
                &
                (Connection.user_two_id == sender_id)
            )
        )
        .first()
    )

    if existing_connection:
        return "already_connected"

    existing_request = (
        db.query(ConnectionRequest)
        .filter(
            (
                ConnectionRequest.sender_id == sender_id
            )
            &
            (
                ConnectionRequest.receiver_id == receiver_id
            )
            &
            (
                ConnectionRequest.status == "pending"
            )
        )
        .first()
    )

    if existing_request:
        return "request_exists"

    request = ConnectionRequest(

        sender_id=sender_id,

        receiver_id=receiver_id,

        status="pending"

    )

    db.add(request)

    db.commit()

    db.refresh(request)

    create_notification(

        db=db,

        user_id=receiver_id,

        title="Connection Request",

        message="You received a new connection request.",

        notification_type="connection"

    )

    return request