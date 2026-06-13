from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import get_db

from app.schemas.search import (
    UserSearchResponse
)

from app.services.search_service import (
    search_users_by_skill,
    search_users_by_name,
    search_users_by_rank
)

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)


@router.get(
    "/users",
    response_model=list[UserSearchResponse]
)
def search_users(
    skill: str,
    db: Session = Depends(get_db)
):
    return search_users_by_skill(
        db,
        skill
    )

@router.get(
    "/users/by-name",
    response_model=list[UserSearchResponse]
)
def search_by_name(
    name: str,
    db: Session = Depends(get_db)
):
    return search_users_by_name(
        db,
        name
    )

@router.get(
    "/users/by-rank",
    response_model=list[UserSearchResponse]
)
def search_by_rank(
    rank: str,
    db: Session = Depends(get_db)
):
    return search_users_by_rank(
        db,
        rank
    )