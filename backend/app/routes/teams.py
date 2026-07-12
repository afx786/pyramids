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
    get_team,
    leave_team,
    transfer_team_ownership,
    delete_team,
    add_team_member,
    remove_team_member,
    change_team_member_role
)
from app.schemas.team import (
    TeamDetailResponse
)

from fastapi import HTTPException

router = APIRouter(
    prefix="/teams",
    tags=["Teams"]
)

from app.schemas.team import (
    TransferOwnershipRequest
)
from app.schemas.team import (
    TeamMemberInviteRequest,
    TeamMemberRoleUpdate
)
from app.schemas.team_join_request import TeamJoinRequestResponse
from app.services.team_join_request_service import create_join_request
from app.services.team_join_request_service import (
    create_join_request,
    get_team_requests,
    approve_join_request,
    reject_join_request
)
from app.schemas.team_join_request import (
    TeamJoinRequestResponse
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
    "/{team_id}/join",
    response_model=TeamJoinRequestResponse
)
def join_existing_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = create_join_request(
        db=db,
        team_id=team_id,
        user_id=current_user.id
    )

    if result == "team_not_found":
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    if result == "owner":
        raise HTTPException(
            status_code=400,
            detail="Owner cannot join their own team"
        )

    if result == "already_member":
        raise HTTPException(
            status_code=400,
            detail="Already a member"
        )

    if result == "already_requested":
        raise HTTPException(
            status_code=400,
            detail="Join request already pending"
        )

    return result
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

@router.post(
    "/{team_id}/leave"
)
def leave_existing_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = leave_team(
        db,
        team_id,
        current_user.id
    )

    if result == "not_member":
        raise HTTPException(
            status_code=404,
            detail="Not a team member"
        )

    if result == "owner_cannot_leave":
        raise HTTPException(
            status_code=400,
            detail="Owner must transfer ownership first"
        )

    return {
        "message": "Left team successfully"
    }

@router.post(
    "/{team_id}/transfer-ownership"
)
def transfer_ownership(
    team_id: int,
    data: TransferOwnershipRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = transfer_team_ownership(
        db=db,
        team_id=team_id,
        current_user_id=current_user.id,
        new_owner_id=data.new_owner_id
    )

    if result == "team_not_found":
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    if result == "not_owner":
        raise HTTPException(
            status_code=403,
            detail="Only owner can transfer ownership"
        )

    if result == "user_not_member":
        raise HTTPException(
            status_code=400,
            detail="New owner must be a team member"
        )

    return {
        "message": "Ownership transferred successfully"
    }
    
@router.delete(
    "/{team_id}"
)
def remove_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = delete_team(
        db=db,
        team_id=team_id,
        current_user_id=current_user.id
    )

    if result == "team_not_found":
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    if result == "not_owner":
        raise HTTPException(
            status_code=403,
            detail="Only owner can delete team"
        )

    return {
        "message": "Team deleted successfully"
    }
    


@router.get(
    "/{team_id}/requests",
    response_model=list[TeamJoinRequestResponse]
)
def list_team_requests(
    team_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = get_team_requests(
        db=db,
        team_id=team_id,
        current_user_id=current_user.id
    )

    if result == "team_not_found":
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    if result == "forbidden":
        raise HTTPException(
            status_code=403,
            detail="Only the team owner can view requests"
        )

    return result
@router.post(
    "/requests/{request_id}/approve",
    response_model=TeamJoinRequestResponse
)
def approve_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = approve_join_request(
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
            detail="This request has already been processed"
        )

    if result == "forbidden":
        raise HTTPException(
            status_code=403,
            detail="Only the team owner can approve requests"
        )

    return result
@router.post(
    "/requests/{request_id}/reject",
    response_model=TeamJoinRequestResponse
)
def reject_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = reject_join_request(
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
            detail="This request has already been processed"
        )
    
    if result == "forbidden":
        raise HTTPException(
            status_code=403,
            detail="Only the team owner can reject requests"
        )

    return result


@router.post(
    "/{team_id}/members"
)
def invite_member(
    team_id: int,
    data: TeamMemberInviteRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = add_team_member(
        db=db,
        team_id=team_id,
        current_user_id=current_user.id,
        user_id=data.user_id,
        role=data.role
    )

    if result == "team_not_found":
        raise HTTPException(status_code=404, detail="Team not found")

    if result == "forbidden":
        raise HTTPException(status_code=403, detail="Not allowed to manage team")

    if result == "invalid_role":
        raise HTTPException(status_code=400, detail="Invalid role")

    if result == "user_not_found":
        raise HTTPException(status_code=404, detail="User not found")

    if result == "already_member":
        raise HTTPException(status_code=400, detail="Already a team member")

    return {
        "message": "Member added successfully"
    }


@router.delete(
    "/{team_id}/members/{user_id}"
)
def remove_member(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = remove_team_member(
        db=db,
        team_id=team_id,
        current_user_id=current_user.id,
        user_id=user_id
    )

    if result == "team_not_found":
        raise HTTPException(status_code=404, detail="Team not found")

    if result == "forbidden":
        raise HTTPException(status_code=403, detail="Not allowed to manage team")

    if result == "not_member":
        raise HTTPException(status_code=404, detail="User is not a team member")

    if result == "cannot_remove_owner":
        raise HTTPException(status_code=400, detail="Owner cannot be removed")

    return {
        "message": "Member removed successfully"
    }


@router.patch(
    "/{team_id}/members/{user_id}/role"
)
def update_member_role(
    team_id: int,
    user_id: int,
    data: TeamMemberRoleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = change_team_member_role(
        db=db,
        team_id=team_id,
        current_user_id=current_user.id,
        user_id=user_id,
        role=data.role
    )

    if result == "team_not_found":
        raise HTTPException(status_code=404, detail="Team not found")

    if result == "forbidden":
        raise HTTPException(status_code=403, detail="Only owner can change roles")

    if result == "invalid_role":
        raise HTTPException(status_code=400, detail="Invalid role")

    if result == "not_member":
        raise HTTPException(status_code=404, detail="User is not a team member")

    if result == "cannot_change_owner":
        raise HTTPException(status_code=400, detail="Owner role cannot be changed")

    return {
        "message": "Role updated successfully"
    }
