from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_db

from app.schemas.skill import (
    UserSkillsResponse
)

from app.services.skill_service import (
    get_user_skills
)

router = APIRouter(
    prefix="/skills",
    tags=["Skills"]
)


@router.get(
    "/user/{user_id}",
    response_model=UserSkillsResponse
)
def fetch_user_skills(
    user_id: int,
    db: Session = Depends(get_db)
):
    result = get_user_skills(
        db,
        user_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return result