from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import get_db

from app.schemas.leaderboard import (
    LeaderboardUser
)

from app.services.leaderboard_service import (
    get_leaderboard
)

router = APIRouter(
    prefix="/leaderboard",
    tags=["Leaderboard"]
)


@router.get(
    "",
    response_model=list[LeaderboardUser]
)
def leaderboard(
    db: Session = Depends(get_db)
):
    return get_leaderboard(db)