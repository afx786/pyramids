from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import get_db

from app.schemas.skill_analytics import (
    TopSkillResponse
)

from app.services.skill_analytics_service import (
    get_top_skills
)

router = APIRouter(
    prefix="/skills",
    tags=["Skill Analytics"]
)


@router.get(
    "/top",
    response_model=list[TopSkillResponse]
)
def top_skills(
    db: Session = Depends(get_db)
):
    return get_top_skills(db)