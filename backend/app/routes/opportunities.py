from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.deps import get_db

from app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityResponse
)

from app.services.opportunity_service import (
    create_opportunity,
    get_all_opportunities
)
from app.services.pagination import paginate_list

router = APIRouter(
    prefix="/opportunities",
    tags=["Opportunities"]
)


@router.post(
    "",
    response_model=OpportunityResponse
)
def create_new_opportunity(
    data: OpportunityCreate,
    db: Session = Depends(get_db)
):
    return create_opportunity(
        db,
        data
    )


@router.get(
    ""
)
def list_opportunities(
    db: Session = Depends(get_db),
    limit: int | None = None,
    offset: int = 0,
    sort: str = "newest"
):
    results = get_all_opportunities(db)

    if sort == "oldest":
        results = list(reversed(results))

    if limit is None:
        return results

    items, meta = paginate_list(results, limit, offset)
    return {"items": items, "meta": {**meta, "sort": sort}}