from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.deps import get_db

from app.core.auth import get_current_user

from app.schemas.notification import (
    NotificationResponse
)

from app.services.notification_service import (
    get_notifications,
    mark_as_read
)
from app.models.notification import Notification
from app.services.pagination import (
    apply_created_sort,
    paginate_query
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("")
def list_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    limit: int | None = None,
    offset: int = 0,
    sort: str = "newest"
):
    if limit is not None:
        query = (
            db.query(Notification)
            .filter(Notification.user_id == current_user.id)
        )
        query = apply_created_sort(
            query,
            Notification,
            sort
        )
        notifications, meta = paginate_query(
            query,
            limit,
            offset
        )

        return {
            "items": notifications,
            "meta": {
                **meta,
                "sort": sort
            }
        }

    return get_notifications(
        db,
        current_user.id
    )


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse
)
def read_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    notification = mark_as_read(
        db,
        notification_id,
        current_user.id
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    return notification
