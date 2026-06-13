from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_db

from app.schemas.stats import (
    UserStatsResponse
)

from app.services.stats_service import (
    get_user_stats
)

router = APIRouter(
    prefix="/stats",
    tags=["Stats"]
)


@router.get(
    "/user/{user_id}",
    response_model=UserStatsResponse
)
def user_stats(
    user_id: int,
    db: Session = Depends(get_db)
):
    stats = get_user_stats(
        db,
        user_id
    )

    if stats is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return stats