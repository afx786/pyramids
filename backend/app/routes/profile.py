from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_db

from app.schemas.profile import (
    ProfileResponse
)

from app.services.profile_service import (
    get_user_profile
)

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get(
    "/{user_id}",
    response_model=ProfileResponse
)
def profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    result = get_user_profile(
        db,
        user_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return result