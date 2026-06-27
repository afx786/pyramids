from sqlalchemy.orm import Session

from app.models.bookmark import Bookmark


def create_bookmark(
    db: Session,
    user_id: int,
    item_type: str,
    item_id: int
):
    existing = (
        db.query(Bookmark)
        .filter(
            Bookmark.user_id == user_id,
            Bookmark.item_type == item_type,
            Bookmark.item_id == item_id
        )
        .first()
    )

    if existing:
        return "already_bookmarked"

    bookmark = Bookmark(
        user_id=user_id,
        item_type=item_type,
        item_id=item_id
    )

    db.add(bookmark)

    db.commit()

    db.refresh(bookmark)

    return bookmark

def get_bookmarks(
    db: Session,
    user_id: int
):
    return (
        db.query(Bookmark)
        .filter(
            Bookmark.user_id == user_id
        )
        .order_by(
            Bookmark.created_at.desc()
        )
        .all()
    )


def delete_bookmark(
    db: Session,
    bookmark_id: int,
    user_id: int
):
    bookmark = (
        db.query(Bookmark)
        .filter(
            Bookmark.id == bookmark_id,
            Bookmark.user_id == user_id
        )
        .first()
    )

    if not bookmark:
        return "not_found"

    db.delete(bookmark)

    db.commit()

    return "success"