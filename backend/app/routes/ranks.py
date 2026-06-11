from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_db

from app.schemas.rank import (
    UserRankResponse
)

from app.services.rank_service import (
    get_user_rank
)

router = APIRouter(
    prefix="/ranks",
    tags=["Ranks"]
)


@router.get(
    "/user/{user_id}",
    response_model=UserRankResponse
)
def fetch_user_rank(
    user_id: int,
    db: Session = Depends(get_db)
):
    result = get_user_rank(
        db,
        user_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return result