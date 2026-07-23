from fastapi import APIRouter, Depends, HTTPException
from app.core.auth import get_current_user
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.research import (
    UserResearchResponse
)

from app.services.research_service import (
    get_user_research_projects
)
from app.services.auth_service import search_by_builder_id


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


@router.get("/by-builder-id")
def find_by_builder_id(builder_id: str, db: Session = Depends(get_db)):
    from app.services.auth_service import get_user_by_builder_id
    user = get_user_by_builder_id(db, builder_id)
    if not user:
        raise HTTPException(status_code=404, detail="Builder not found")
    return {
        "id": user.id,
        "name": user.name,
        "builder_id": user.builder_id,
        "public_id": user.public_id,
        "profile_picture": user.profile_picture,
        "headline": user.headline,
    }


@router.get("/search-by-builder-id")
def search_users_by_builder_id(q: str, db: Session = Depends(get_db)):
    users = search_by_builder_id(db, q)
    return [
        {
            "id": u.id,
            "name": u.name,
            "builder_id": u.builder_id,
            "public_id": u.public_id,
            "profile_picture": u.profile_picture,
            "headline": u.headline,
        }
        for u in users
    ]


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