from sqlalchemy.orm import Session
from sqlalchemy import or_
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
                (
                    (ConnectionRequest.sender_id == sender_id)
                    &
                    (ConnectionRequest.receiver_id == receiver_id)
                )
                |
                (
                    (ConnectionRequest.sender_id == receiver_id)
                    &
                    (ConnectionRequest.receiver_id == sender_id)
                )
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

    sender = db.query(User).filter(User.id == sender_id).first()

    db.add(request)

    db.commit()

    db.refresh(request)

    create_notification(

        db=db,

        user_id=receiver_id,

        title="Connection Request",

        message=f"{sender.name} sent you a connection request.",

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

    accepter = db.query(User).filter(User.id == current_user_id).first()

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

        message=f"Your connection request has been accepted by {accepter.name}.",

        notification_type="connection"

    )

    db.commit()

    db.refresh(connection)

    return connection

def reject_request(
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

    request.status = "rejected"

    create_notification(

        db=db,

        user_id=request.sender_id,

        title="Connection Request Rejected",

        message="Your connection request was rejected.",

        notification_type="connection"

    )

    db.commit()

    return True
def get_connections(
    db: Session,
    current_user_id: int
):

    connections = (
        db.query(Connection)
        .filter(
            or_(
                Connection.user_one_id == current_user_id,
                Connection.user_two_id == current_user_id
            )
        )
        .all()
    )

    results = []

    for connection in connections:

        other_user_id = (
            connection.user_two_id
            if connection.user_one_id == current_user_id
            else connection.user_one_id
        )

        user = (
            db.query(User)
            .filter(User.id == other_user_id)
            .first()
        )

        if user:

            results.append({

                "id": connection.id,

                "user": {
                    "id": user.id,
                    "name": user.name,
                    "headline": getattr(user, "headline", None),
                    "profile_picture": getattr(user, "profile_picture", None),
                },

                "connected_at": connection.created_at

            })

    return results
def get_incoming_requests(
    db: Session,
    current_user_id: int
):

    requests = (

        db.query(ConnectionRequest)

        .filter(

            ConnectionRequest.receiver_id == current_user_id,

            ConnectionRequest.status == "pending"

        )

        .all()

    )

    return requests
def get_outgoing_requests(
    db: Session,
    current_user_id: int
):

    requests = (

        db.query(ConnectionRequest)

        .filter(

            ConnectionRequest.sender_id == current_user_id,

            ConnectionRequest.status == "pending"

        )

        .all()

    )

    return requests
def cancel_request(
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

    if request.sender_id != current_user_id:
        return "not_sender"

    if request.status != "pending":
        return "already_processed"

    db.delete(request)

    db.commit()

    return True
def remove_connection(
    db: Session,
    connection_id: int,
    current_user_id: int
):

    connection = (
        db.query(Connection)
        .filter(
            Connection.id == connection_id
        )
        .first()
    )

    if not connection:
        return "connection_not_found"

    if (
        connection.user_one_id != current_user_id
        and
        connection.user_two_id != current_user_id
    ):
        return "forbidden"

    db.delete(connection)

    db.commit()

    return True