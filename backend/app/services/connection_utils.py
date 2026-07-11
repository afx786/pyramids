from sqlalchemy.orm import Session

from app.models.connection import Connection


def are_connected(
    db: Session,
    user_one: int,
    user_two: int
):

    connection = (

        db.query(Connection)

        .filter(

            (
                (Connection.user_one_id == user_one)
                &
                (Connection.user_two_id == user_two)
            )

            |

            (
                (Connection.user_one_id == user_two)
                &
                (Connection.user_two_id == user_one)
            )

        )

        .first()

    )

    return connection is not None