from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.deps import get_db

from app.core.auth import get_current_user

from app.schemas.bookmark import (
    BookmarkCreate,
    BookmarkResponse
)

from app.services.bookmark_service import (
    create_bookmark,
    get_bookmarks,
    delete_bookmark
)

router = APIRouter(
    prefix="/bookmarks",
    tags=["Bookmarks"]
)


@router.post(
    "",
    response_model=BookmarkResponse
)
def add_bookmark(
    data: BookmarkCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = create_bookmark(
        db=db,
        user_id=current_user.id,
        item_type=data.item_type,
        item_id=data.item_id
    )

    if result == "already_bookmarked":
        raise HTTPException(
            status_code=400,
            detail="Already bookmarked"
        )
    if result == "invalid_type":
        raise HTTPException(
            status_code=400,
            detail="Invalid bookmark type"
        )

    if result == "item_not_found":
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    return result


@router.get(
    "",
    response_model=list[BookmarkResponse]
)
def list_bookmarks(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_bookmarks(
        db,
        current_user.id
    )


@router.delete(
    "/{bookmark_id}"
)
def remove_bookmark(
    bookmark_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = delete_bookmark(
        db,
        bookmark_id,
        current_user.id
    )

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Bookmark not found"
        )

    return {
        "message": "Bookmark removed successfully"
    }