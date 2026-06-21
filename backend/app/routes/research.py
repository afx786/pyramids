from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.deps import get_db

from app.core.auth import get_current_user

from app.schemas.research import (
    ResearchProjectCreate,
    ResearchProjectResponse
)

from app.services.research_service import (
    create_research_project,
    get_all_research_projects,
    get_research_project
)

router = APIRouter(
    prefix="/research",
    tags=["Research"]
)


@router.post(
    "",
    response_model=ResearchProjectResponse
)
def create_research(
    data: ResearchProjectCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_research_project(
        db=db,
        data=data,
        owner_id=current_user.id
    )


@router.get(
    "",
    response_model=list[ResearchProjectResponse]
)
def list_research(
    db: Session = Depends(get_db)
):
    return get_all_research_projects(db)


@router.get(
    "/{research_id}",
    response_model=ResearchProjectResponse
)
def single_research(
    research_id: int,
    db: Session = Depends(get_db)
):
    research = get_research_project(
        db,
        research_id
    )

    if not research:
        raise HTTPException(
            status_code=404,
            detail="Research project not found"
        )

    return research