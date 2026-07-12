from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.deps import get_db
from app.core.auth import get_current_user

from app.schemas.hackathon import (
    HackathonCreate,
    HackathonResponse,
    HackathonSubmission
)

from app.schemas.hackathon_registration import (
    TeamRegistrationRequest
)
from app.schemas.hackathon_invitation import (
    HackathonInvitationCreate,
    HackathonInvitationResponse
)

from app.schemas.hackathon_team import (
    HackathonTeamResponse
)

from app.services.hackathon_service import (
    create_hackathon,
    get_all_hackathons,
    get_hackathon,
    register_team_for_hackathon,
    get_hackathon_teams,
    submit_hackathon,
    get_pending_hackathons,
    approve_hackathon
)
from app.services.hackathon_invitation_service import (
    invite_hackathon_member,
    list_my_hackathon_invitations,
    accept_hackathon_invitation,
    reject_hackathon_invitation
)

router = APIRouter(
    prefix="/hackathons",
    tags=["Hackathons"]
)




@router.post(
    "",
    response_model=HackathonResponse
)
def create_new_hackathon(
    data: HackathonCreate,
    db: Session = Depends(get_db)
):
    return create_hackathon(
        db,
        data
    )




@router.get(
    "",
    response_model=list[HackathonResponse]
)
def list_hackathons(
    db: Session = Depends(get_db)
):
    return get_all_hackathons(db)


@router.get(
    "/invitations/my",
    response_model=list[HackathonInvitationResponse]
)
def my_hackathon_invitations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return list_my_hackathon_invitations(
        db,
        current_user.id
    )


@router.post(
    "/invitations/{invitation_id}/accept",
    response_model=HackathonInvitationResponse
)
def accept_hackathon_invite(
    invitation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = accept_hackathon_invitation(
        db=db,
        invitation_id=invitation_id,
        current_user_id=current_user.id
    )

    if result == "not_found":
        raise HTTPException(status_code=404, detail="Invitation not found")

    if result == "forbidden":
        raise HTTPException(status_code=403, detail="Not allowed")

    if result == "already_processed":
        raise HTTPException(status_code=400, detail="Invitation already processed")

    return result


@router.post(
    "/invitations/{invitation_id}/reject",
    response_model=HackathonInvitationResponse
)
def reject_hackathon_invite(
    invitation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = reject_hackathon_invitation(
        db=db,
        invitation_id=invitation_id,
        current_user_id=current_user.id
    )

    if result == "not_found":
        raise HTTPException(status_code=404, detail="Invitation not found")

    if result == "forbidden":
        raise HTTPException(status_code=403, detail="Not allowed")

    if result == "already_processed":
        raise HTTPException(status_code=400, detail="Invitation already processed")

    return result




@router.post(
    "/submit",
    response_model=HackathonResponse
)
def submit_new_hackathon(
    data: HackathonSubmission,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return submit_hackathon(
        db=db,
        data=data,
        user_id=current_user.id
    )




@router.get(
    "/pending",
    response_model=list[HackathonResponse]
)
def pending_hackathons(
    db: Session = Depends(get_db)
):
    return get_pending_hackathons(db)



@router.get(
    "/{hackathon_id}/teams",
    response_model=list[HackathonTeamResponse]
)
def list_registered_teams(
    hackathon_id: int,
    db: Session = Depends(get_db)
):
    return get_hackathon_teams(
        db,
        hackathon_id
    )



@router.post(
    "/{hackathon_id}/register-team"
)
def register_team(
    hackathon_id: int,
    data: TeamRegistrationRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = register_team_for_hackathon(
        db=db,
        hackathon_id=hackathon_id,
        team_id=data.team_id,
        current_user_id=current_user.id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Hackathon not found"
        )

    if result == "team_not_found":
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    if result == "forbidden":
        raise HTTPException(
            status_code=403,
            detail="Only team owner can register"
        )

    if result == "already_registered":
        raise HTTPException(
            status_code=400,
            detail="Team already registered"
        )

    return {
        "message": "Team registered successfully"
    }


@router.post(
    "/{hackathon_id}/invitations",
    response_model=HackathonInvitationResponse
)
def invite_to_hackathon_team(
    hackathon_id: int,
    data: HackathonInvitationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = invite_hackathon_member(
        db=db,
        hackathon_id=hackathon_id,
        team_id=data.team_id,
        invited_user_id=data.user_id,
        current_user_id=current_user.id
    )

    if result == "hackathon_not_found":
        raise HTTPException(status_code=404, detail="Hackathon not found")

    if result == "team_not_found":
        raise HTTPException(status_code=404, detail="Team not found")

    if result == "forbidden":
        raise HTTPException(status_code=403, detail="Only team owner/admin can invite")

    if result == "user_not_found":
        raise HTTPException(status_code=404, detail="User not found")

    if result == "already_member":
        raise HTTPException(status_code=400, detail="User is already a team member")

    if result == "already_invited":
        raise HTTPException(status_code=400, detail="Invitation already pending")

    return result




@router.post(
    "/{hackathon_id}/approve",
    response_model=HackathonResponse
)
def approve_submitted_hackathon(
    hackathon_id: int,
    db: Session = Depends(get_db)
):
    hackathon = approve_hackathon(
        db,
        hackathon_id
    )

    if not hackathon:
        raise HTTPException(
            status_code=404,
            detail="Hackathon not found"
        )

    return hackathon




@router.get(
    "/{hackathon_id}",
    response_model=HackathonResponse
)
def single_hackathon(
    hackathon_id: int,
    db: Session = Depends(get_db)
):
    hackathon = get_hackathon(
        db,
        hackathon_id
    )

    if not hackathon:
        raise HTTPException(
            status_code=404,
            detail="Hackathon not found"
        )

    return hackathon
