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

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get(
    "",
    response_model=list[NotificationResponse]
)
def list_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
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