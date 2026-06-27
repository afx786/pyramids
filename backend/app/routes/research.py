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
    ResearchProjectResponse,
    ResearchMemberResponse,
    ResearchUpdate
)

from app.services.research_service import (
    create_research_project,
    get_all_research_projects,
    get_research_project,
    join_research_project,
    get_research_members,
    update_research,
    delete_research,
    leave_research
)
from app.schemas.research_join_request import (
    ResearchJoinRequestResponse
)
from app.services.research_join_request_service import (
    create_research_join_request,
    get_research_requests,
    approve_research_request,
    reject_research_request
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


@router.post(
    "/{research_id}/join",
    response_model=ResearchJoinRequestResponse
)
def join_research(
    research_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = create_research_join_request(
        db=db,
        research_id=research_id,
        user_id=current_user.id
    )

    if result == "research_not_found":
        raise HTTPException(
            status_code=404,
            detail="Research project not found"
        )

    if result == "owner":
        raise HTTPException(
            status_code=400,
            detail="Owner cannot request collaboration"
        )

    if result == "already_member":
        raise HTTPException(
            status_code=400,
            detail="Already a collaborator"
        )

    if result == "already_requested":
        raise HTTPException(
            status_code=400,
            detail="Request already pending"
        )

    return result

@router.get(
    "/{research_id}/members",
    response_model=list[ResearchMemberResponse]
)
def list_research_members(
    research_id: int,
    db: Session = Depends(get_db)
):
    return get_research_members(
        db,
        research_id
    )


@router.patch(
    "/{research_id}",
    response_model=ResearchProjectResponse
)
def edit_research(
    research_id: int,
    data: ResearchUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = update_research(
        db=db,
        research_id=research_id,
        user_id=current_user.id,
        data=data
    )

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Research project not found"
        )

    if result == "forbidden":
        raise HTTPException(
            status_code=403,
            detail="Only the owner can update this research"
        )

    return result

@router.delete(
    "/{research_id}"
)
def remove_research(
    research_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = delete_research(
        db=db,
        research_id=research_id,
        user_id=current_user.id
    )

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Research project not found"
        )

    if result == "forbidden":
        raise HTTPException(
            status_code=403,
            detail="Only the owner can delete this research"
        )

    return {
        "message": "Research project deleted successfully"
    }

@router.post(
    "/{research_id}/leave"
)
def leave_research_project(
    research_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = leave_research(
        db=db,
        research_id=research_id,
        user_id=current_user.id
    )

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Research project not found"
        )

    if result == "owner_cannot_leave":
        raise HTTPException(
            status_code=400,
            detail="Owner cannot leave their own research project"
        )

    if result == "not_member":
        raise HTTPException(
            status_code=400,
            detail="You are not a member of this research project"
        )

    return {
        "message": "Left research project successfully"
    }
@router.get(
    "/{research_id}/requests",
    response_model=list[ResearchJoinRequestResponse]
)
def list_research_requests(
    research_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = get_research_requests(
        db=db,
        research_id=research_id,
        current_user_id=current_user.id
    )

    if result == "research_not_found":
        raise HTTPException(
            status_code=404,
            detail="Research project not found"
        )

    if result == "forbidden":
        raise HTTPException(
            status_code=403,
            detail="Only the owner can view requests"
        )

    return result
@router.post(
    "/requests/{request_id}/approve",
    response_model=ResearchJoinRequestResponse
)
def approve_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = approve_research_request(
        db=db,
        request_id=request_id,
        current_user_id=current_user.id
    )

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Request not found"
        )

    if result == "already_processed":
        raise HTTPException(
            status_code=400,
            detail="Request already processed"
        )

    if result == "forbidden":
        raise HTTPException(
            status_code=403,
            detail="Only the owner can approve requests"
        )

    return result
@router.post(
    "/requests/{request_id}/reject",
    response_model=ResearchJoinRequestResponse
)
def reject_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = reject_research_request(
        db=db,
        request_id=request_id,
        current_user_id=current_user.id
    )

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Request not found"
        )

    if result == "already_processed":
        raise HTTPException(
            status_code=400,
            detail="Request already processed"
        )

    if result == "forbidden":
        raise HTTPException(
            status_code=403,
            detail="Only the owner can reject requests"
        )

    return result