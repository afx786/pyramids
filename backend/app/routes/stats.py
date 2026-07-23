from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_db
from app.models.user import User
from app.models.project import Project
from app.models.research_project import ResearchProject
from app.models.organization import Organization

from app.schemas.stats import (
    UserStatsResponse
)

from app.services.stats_service import (
    get_user_stats
)

router = APIRouter(
    prefix="/stats",
    tags=["Stats"]
)


@router.get("/public")
def get_public_stats(db: Session = Depends(get_db)):
    return {
        "builders": db.query(User).count(),
        "projects": db.query(Project).count(),
        "research": db.query(ResearchProject).count(),
        "organizations": db.query(Organization).count(),
    }


@router.get(
    "/user/{user_id}",
    response_model=UserStatsResponse
)
def user_stats(
    user_id: int,
    db: Session = Depends(get_db)
):
    stats = get_user_stats(
        db,
        user_id
    )

    if stats is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return stats