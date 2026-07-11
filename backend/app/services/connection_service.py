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
def accept_request(
    db: Session,
    request_id: int,
    current_user_id: int
):

    request = (
        db.query(ConnectionRequest)
        .filter(
            ConnectionRequest.id == request_id
        )
        .first()
    )

    if not request:
        return "request_not_found"

    if request.receiver_id != current_user_id:
        return "not_receiver"

    if request.status != "pending":
        return "already_processed"

    request.status = "accepted"

    connection = Connection(

        user_one_id=request.sender_id,

        user_two_id=request.receiver_id

    )

    db.add(connection)

    create_notification(

        db=db,

        user_id=request.sender_id,

        title="Connection Accepted",

        message="Your connection request has been accepted.",

        notification_type="connection"

    )

    db.commit()

    db.refresh(connection)

    return connection