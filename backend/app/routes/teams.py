import re
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.deps import get_db
from app.core.auth import get_current_user
from app.models.team import Team

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


def _resolve_public_id(db, model, identifier):
    if re.match(r'^PYR-[A-Z]+-[A-Z0-9]{6}$', str(identifier).upper()):
        return db.query(model).filter(func.upper(model.public_id) == str(identifier).upper()).first()
    try:
        return db.query(model).get(int(identifier))
    except (ValueError, TypeError):
        return None


router = APIRouter(
    prefix="/teams",
    tags=["Teams"]
)

from app.schemas.team import (
    TransferOwnershipRequest
)
from app.schemas.team import (
    TeamMemberInviteRequest,
    TeamMemberInviteByBuilderId,
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
from app.services.pagination import paginate_list


@router.post(
    "",
    response_model=TeamResponse
)
def create_new_team(
    data: TeamCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if data.purpose == "hackathon" and data.hackathon_id:
        from app.models.hackathon import Hackathon
        hackathon = db.query(Hackathon).filter(Hackathon.id == data.hackathon_id).first()
        if not hackathon:
            raise HTTPException(status_code=404, detail="Hackathon not found")
        if hackathon.status != "published":
            raise HTTPException(status_code=400, detail="Hackathon is not active")
        today = datetime.utcnow()
        if hackathon.registration_closes and hackathon.registration_closes < today:
            raise HTTPException(status_code=400, detail="Hackathon registration has closed")
        existing = db.query(HackathonTeam).join(Team).filter(
            HackathonTeam.hackathon_id == hackathon.id,
            Team.owner_id == current_user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="You already have a team for this hackathon")

    if data.purpose == "research" and data.research_project_id:
        from app.models.research_project import ResearchProject
        rp = db.query(ResearchProject).filter(ResearchProject.id == data.research_project_id).first()
        if not rp:
            raise HTTPException(status_code=404, detail="Research project not found")

    result = create_team(
        db=db,
        name=data.name,
        description=data.description,
        owner_id=current_user.id,
        purpose=data.purpose,
        hackathon_id=data.hackathon_id,
        research_project_id=data.research_project_id,
    )

    if result == "hackathon_not_found":
        raise HTTPException(status_code=404, detail="Hackathon not found")

    if result == "team_full":
        raise HTTPException(status_code=400, detail="This hackathon already has the maximum number of teams")

    return result
    
@router.post(
    "/{team_id}/join",
    response_model=TeamJoinRequestResponse
)
def join_existing_team(
    team_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    from app.models.team import Team
    team = _resolve_public_id(db, Team, team_id)
    if not team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    result = create_join_request(
        db=db,
        team_id=team.id,
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
    ""
)
def list_teams(
    db: Session = Depends(get_db),
    limit: int | None = None,
    offset: int = 0,
    sort: str = "newest"
):
    results = get_all_teams(db)

    if sort == "oldest":
        results = list(reversed(results))

    if limit is None:
        return results

    items, meta = paginate_list(results, limit, offset)
    return {"items": items, "meta": {**meta, "sort": sort}}

@router.get(
    "/{team_id}",
    response_model=TeamDetailResponse
)
def single_team(
    team_id: str,
    db: Session = Depends(get_db)
):
    team = _resolve_public_id(db, Team, team_id)

    if not team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    return get_team(db, team.id)

@router.post(
    "/{team_id}/leave"
)
def leave_existing_team(
    team_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    team = _resolve_public_id(db, Team, team_id)
    if not team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    result = leave_team(
        db,
        team.id,
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
    team_id: str,
    data: TransferOwnershipRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    team = _resolve_public_id(db, Team, team_id)
    if not team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    result = transfer_team_ownership(
        db=db,
        team_id=team.id,
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
    team_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    team = _resolve_public_id(db, Team, team_id)
    if not team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    result = delete_team(
        db=db,
        team_id=team.id,
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
    team_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    team = _resolve_public_id(db, Team, team_id)
    if not team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    result = get_team_requests(
        db=db,
        team_id=team.id,
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
    "/{team_id}/invite-by-builder-id"
)
def invite_by_builder_id(
    team_id: str,
    data: TeamMemberInviteByBuilderId,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    from app.services.auth_service import get_user_by_builder_id
    team = _resolve_public_id(db, Team, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    target = get_user_by_builder_id(db, data.builder_id)
    if not target:
        raise HTTPException(status_code=404, detail="Builder not found")

    if target.id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot invite yourself")

    existing = db.query(TeamMember).filter(
        TeamMember.team_id == team.id,
        TeamMember.user_id == target.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already a team member")

    if team.purpose == "hackathon" and team.hackathon_id:
        from app.models.hackathon import Hackathon
        hackathon = db.query(Hackathon).filter(Hackathon.id == team.hackathon_id).first()
        if hackathon and hackathon.team_size_max:
            current_count = db.query(TeamMember).filter(
                TeamMember.team_id == team.id,
                TeamMember.role != "Pending Invite"
            ).count()
            if current_count >= hackathon.team_size_max:
                raise HTTPException(status_code=400, detail=f"Team is full (max {hackathon.team_size_max} members)")

    result = add_team_member(
        db=db,
        team_id=team.id,
        current_user_id=current_user.id,
        user_id=target.id,
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

    return {"message": f"Invited @{data.builder_id} to the team"}


@router.post(
    "/{team_id}/members"
)
def invite_member(
    team_id: str,
    data: TeamMemberInviteRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    team = _resolve_public_id(db, Team, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    result = add_team_member(
        db=db,
        team_id=team.id,
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
    team_id: str,
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    team = _resolve_public_id(db, Team, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    result = remove_team_member(
        db=db,
        team_id=team.id,
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
    team_id: str,
    user_id: int,
    data: TeamMemberRoleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    team = _resolve_public_id(db, Team, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    result = change_team_member_role(
        db=db,
        team_id=team.id,
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
