from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.deps import get_db

from app.schemas.technology import (
    TechnologyCreate,
    TechnologyResponse
)

from app.services.technology_service import (
    create_technology,
    get_all_technologies,
    get_technology,
    search_technologies,
    get_technologies_by_category
)

router = APIRouter(
    prefix="/technologies",
    tags=["Technologies"]
)


@router.post(
    "",
    response_model=TechnologyResponse
)
def create(
    data: TechnologyCreate,
    db: Session = Depends(get_db)
):
    return create_technology(
        db,
        data
    )


@router.get(
    "",
    response_model=list[TechnologyResponse]
)
def list_all(
    db: Session = Depends(get_db)
):
    return get_all_technologies(db)


@router.get(
    "/{technology_id}",
    response_model=TechnologyResponse
)
def single(
    technology_id: int,
    db: Session = Depends(get_db)
):
    technology = get_technology(
        db,
        technology_id
    )

    if not technology:
        raise HTTPException(
            status_code=404,
            detail="Technology not found"
        )

    return technology


@router.get(
    "/search/{query}",
    response_model=list[TechnologyResponse]
)
def search(
    query: str,
    db: Session = Depends(get_db)
):
    return search_technologies(
        db,
        query
    )


@router.get(
    "/category/{category}",
    response_model=list[TechnologyResponse]
)
def category(
    category: str,
    db: Session = Depends(get_db)
):
    return get_technologies_by_category(
        db,
        category
    )