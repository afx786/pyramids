from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import get_db

from app.schemas.leaderboard import (
    LeaderboardUser
)

from app.services.leaderboard_service import (
    get_leaderboard
)
from app.services.pagination import paginate_list

router = APIRouter(
    prefix="/leaderboard",
    tags=["Leaderboard"]
)


@router.get(
    ""
)
def leaderboard(
    db: Session = Depends(get_db),
    limit: int | None = None,
    offset: int = 0
):
    results = get_leaderboard(db)

    if limit is None:
        return results

    items, meta = paginate_list(results, limit, offset)
    return {"items": items, "meta": {**meta}}