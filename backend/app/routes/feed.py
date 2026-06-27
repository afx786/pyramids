from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.deps import get_db

from app.schemas.feed import (
    FeedItemResponse
)

from app.services.feed_service import (
    get_feed
)

router = APIRouter(
    prefix="/feed",
    tags=["Feed"]
)


@router.get("")
def feed(
    type: str = "all",
    sort: str = "newest",
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    return get_feed(
        db=db,
        feed_type=type,
        sort=sort,
        limit=limit,
        offset=offset
    )