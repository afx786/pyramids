import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.deps import get_db
from app.models.user import User

from app.schemas.profile import (
    ProfileResponse
)

from app.services.profile_service import (
    get_user_profile
)


def _resolve_public_id(db, model, identifier):
    if re.match(r'^PYR-[A-Z]+-[A-Z0-9]{6}$', str(identifier).upper()):
        return db.query(model).filter(func.upper(model.public_id) == str(identifier).upper()).first()
    try:
        return db.query(model).get(int(identifier))
    except (ValueError, TypeError):
        return None


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get(
    "/{user_id}",
    response_model=ProfileResponse
)
def profile(
    user_id: str,
    db: Session = Depends(get_db)
):
    user = _resolve_public_id(db, User, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return get_user_profile(
        db,
        user.id
    )