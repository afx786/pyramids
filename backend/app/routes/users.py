from fastapi import APIRouter, Depends, HTTPException
from app.core.auth import get_current_user
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.research import (
    UserResearchResponse
)

from app.services.research_service import (
    get_user_research_projects
)


from sqlalchemy.orm import Session

from app.deps import get_db
router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_me(current_user = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(data: UserUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user = db.query(type(current_user)).filter(type(current_user).id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


@router.get(
    "/{user_id}/research",
    response_model=list[UserResearchResponse]
)
def get_user_research(
    user_id: int,
    db: Session = Depends(get_db)
):
    return get_user_research_projects(
        db,
        user_id
    )