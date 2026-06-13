from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import get_db

from app.schemas.project_search import (
    ProjectSearchResponse
)

from app.services.project_search_service import (
    search_projects_by_skill
)

router = APIRouter(
    prefix="/project-search",
    tags=["Project Search"]
)


@router.get(
    "",
    response_model=list[ProjectSearchResponse]
)
def search_projects(
    skill: str,
    db: Session = Depends(get_db)
):
    return search_projects_by_skill(
        db,
        skill
    )