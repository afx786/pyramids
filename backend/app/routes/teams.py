from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import get_db
from app.core.auth import get_current_user

from app.schemas.team import (
    TeamCreate,
    TeamResponse
)

from app.services.team_service import (
    create_team
)

from app.services.team_service import (
    create_team,
    join_team,
    get_all_teams,
    get_team
)

from app.schemas.team import (
    TeamDetailResponse
)

from fastapi import HTTPException

router = APIRouter(
    prefix="/teams",
    tags=["Teams"]
)


@router.post(
    "",
    response_model=TeamResponse
)
def create_new_team(
    data: TeamCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_team(
        db=db,
        name=data.name,
        description=data.description,
        owner_id=current_user.id
    )
    
@router.post(
    "/{team_id}/join"
)
def join_existing_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = join_team(
        db,
        team_id,
        current_user.id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    if result == "already_joined":
        raise HTTPException(
            status_code=400,
            detail="Already a member"
        )

    return {
        "message": "Joined team successfully"
    }
    
@router.get(
    "",
    response_model=list[TeamDetailResponse]
)
def list_teams(
    db: Session = Depends(get_db)
):
    return get_all_teams(db)

@router.get(
    "/{team_id}",
    response_model=TeamDetailResponse
)
def single_team(
    team_id: int,
    db: Session = Depends(get_db)
):
    team = get_team(
        db,
        team_id
    )

    if not team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    return team