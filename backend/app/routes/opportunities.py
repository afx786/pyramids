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
    "",
    response_model=list[OpportunityResponse]
)
def list_opportunities(
    db: Session = Depends(get_db)
):
    return get_all_opportunities(db)