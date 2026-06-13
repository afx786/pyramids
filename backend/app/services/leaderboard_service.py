from sqlalchemy.orm import Session

from app.models.user import User
from app.services.rank_service import get_user_rank


def get_leaderboard(
    db: Session
):
    users = db.query(User).all()

    leaderboard = []

    for user in users:

        rank_data = get_user_rank(
            db,
            user.id
        )

        leaderboard.append({
            "id": user.id,
            "name": user.name,
            "points": rank_data["points"],
            "rank": rank_data["rank"]
        })

    leaderboard.sort(
        key=lambda x: x["points"],
        reverse=True
    )

    return leaderboard