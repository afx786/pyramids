import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.deps import get_db
from app.core.auth import get_current_user
from app.core.admin import get_current_admin
from app.models.hackathon import Hackathon


def _resolve_public_id(db, model, identifier):
    if re.match(r'^PYR-[A-Z]+-[A-Z0-9]{6}$', str(identifier).upper()):
        return db.query(model).filter(func.upper(model.public_id) == str(identifier).upper()).first()
    try:
        return db.query(model).get(int(identifier))
    except (ValueError, TypeError):
        return None

from app.schemas.hackathon import (
    HackathonCreate, HackathonUpdate, HackathonResponse,
    HackathonSubmissionCreate, HackathonSubmissionResponse,
    HackathonAnnouncementCreate, HackathonAnnouncementResponse,
)
from app.schemas.hackathon_registration import TeamRegistrationRequest
from app.schemas.hackathon_invitation import (
    HackathonInvitationCreate, HackathonInvitationResponse,
)
from app.schemas.hackathon_team import HackathonTeamResponse

from app.services.hackathon_service import (
    create_hackathon, get_host_hackathons, get_hackathon,
    update_hackathon, delete_hackathon, submit_for_review,
    approve_hackathon, reject_hackathon, request_changes_hackathon,
    publish_hackathon, complete_hackathon, archive_hackathon,
    get_all_hackathons, get_pending_hackathons,
    register_team_for_hackathon, get_hackathon_teams,
    create_submission, get_submissions, get_team_submissions,
    review_submission, create_announcement, get_announcements,
)
from app.services.hackathon_invitation_service import (
    invite_hackathon_member, list_my_hackathon_invitations,
    accept_hackathon_invitation, reject_hackathon_invitation,
)
from app.services.pagination import paginate_list

router = APIRouter(prefix="/hackathons", tags=["Hackathons"])


# ── Host Workflow ──

@router.post("/drafts", response_model=HackathonResponse)
def create_draft(data: HackathonCreate, db: Session = Depends(get_db),
                 current_user=Depends(get_current_user)):
    return create_hackathon(db, data, current_user.id)


@router.get("/host", response_model=list[HackathonResponse])
def list_host_hackathons(db: Session = Depends(get_db),
                          current_user=Depends(get_current_user)):
    return get_host_hackathons(db, current_user.id)


@router.patch("/{hackathon_id}", response_model=HackathonResponse)
def edit_hackathon(hackathon_id: str, data: HackathonUpdate,
                    db: Session = Depends(get_db),
                    current_user=Depends(get_current_user)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    result = update_hackathon(db, hackathon.id, current_user.id, data)
    if result == "forbidden":
        raise HTTPException(403, "Not authorized")
    if result == "cannot_edit":
        raise HTTPException(400, "Cannot edit in current status")
    return result


@router.delete("/drafts/{hackathon_id}")
def remove_draft(hackathon_id: str, db: Session = Depends(get_db),
                  current_user=Depends(get_current_user)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    result = delete_hackathon(db, hackathon.id, current_user.id)
    if result == "forbidden":
        raise HTTPException(403, "Not authorized")
    if result == "cannot_delete":
        raise HTTPException(400, "Cannot delete in current status")
    return {"message": "Hackathon deleted"}


@router.post("/{hackathon_id}/submit", response_model=HackathonResponse)
def submit_hackathon_for_review(hackathon_id: str,
                                 db: Session = Depends(get_db),
                                 current_user=Depends(get_current_user)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    result = submit_for_review(db, hackathon.id, current_user.id)
    if result == "forbidden":
        raise HTTPException(403, "Not authorized")
    if result == "invalid_status":
        raise HTTPException(400, "Only drafts and rejected hackathons can be submitted")
    return result


@router.post("/{hackathon_id}/publish", response_model=HackathonResponse)
def publish_hackathon_endpoint(hackathon_id: str,
                                db: Session = Depends(get_db)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    result = publish_hackathon(db, hackathon.id)
    if result == "invalid_status":
        raise HTTPException(400, "Only approved hackathons can be published")
    return result


@router.post("/{hackathon_id}/complete", response_model=HackathonResponse)
def complete_hackathon_endpoint(hackathon_id: str,
                                 db: Session = Depends(get_db),
                                 current_user=Depends(get_current_user)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    result = complete_hackathon(db, hackathon.id, current_user.id)
    if result == "forbidden":
        raise HTTPException(403, "Not authorized")
    if result == "invalid_status":
        raise HTTPException(400, "Only published hackathons can be completed")
    return result


@router.post("/{hackathon_id}/archive", response_model=HackathonResponse)
def archive_hackathon_endpoint(hackathon_id: str,
                                db: Session = Depends(get_db),
                                current_user=Depends(get_current_user)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    result = archive_hackathon(db, hackathon.id, current_user.id)
    if result == "forbidden":
        raise HTTPException(403, "Not authorized")
    return result


# ── Admin Review ──

@router.get("/pending", response_model=list[HackathonResponse])
def pending_hackathons(db: Session = Depends(get_db)):
    return get_pending_hackathons(db)


@router.post("/{hackathon_id}/approve", response_model=HackathonResponse)
def approve_submitted_hackathon(hackathon_id: str, feedback: str | None = None,
                                 db: Session = Depends(get_db)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    result = approve_hackathon(db, hackathon.id, feedback)
    if result == "invalid_status":
        raise HTTPException(400, "Hackathon is not in submitted status")
    return result


@router.post("/{hackathon_id}/reject", response_model=HackathonResponse)
def reject_submitted_hackathon(hackathon_id: str, feedback: str | None = None,
                                db: Session = Depends(get_db)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    result = reject_hackathon(db, hackathon.id, feedback)
    if result == "invalid_status":
        raise HTTPException(400, "Hackathon is not in submitted status")
    return result


@router.post("/{hackathon_id}/request-changes", response_model=HackathonResponse)
def request_hackathon_changes(hackathon_id: str, feedback: str | None = None,
                               db: Session = Depends(get_db)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    result = request_changes_hackathon(db, hackathon.id, feedback)
    if result == "invalid_status":
        raise HTTPException(400, "Hackathon is not in submitted status")
    return result


# ── Browse ──

@router.get("")
def list_hackathons(db: Session = Depends(get_db),
                     limit: int | None = None, offset: int = 0,
                     sort: str = "newest", status: str | None = "published"):
    results = get_all_hackathons(db, status)
    if sort == "oldest":
        results = list(reversed(results))
    if limit is None:
        return results
    items, meta = paginate_list(results, limit, offset)
    return {"items": items, "meta": {**meta, "sort": sort}}


@router.get("/{hackathon_id}", response_model=HackathonResponse)
def single_hackathon(hackathon_id: str, db: Session = Depends(get_db)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    return get_hackathon(db, hackathon.id)


# ── Team Registration ──

@router.post("/{hackathon_id}/register-team")
def register_team(hackathon_id: str, data: TeamRegistrationRequest,
                   db: Session = Depends(get_db),
                   current_user=Depends(get_current_user)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    result = register_team_for_hackathon(db, hackathon.id, data.team_id, current_user.id)
    if result == "team_not_found":
        raise HTTPException(404, "Team not found")
    if result == "forbidden":
        raise HTTPException(403, "Only team owner can register")
    if result == "already_registered":
        raise HTTPException(400, "Team already registered")
    return {"message": "Team registered successfully"}


@router.get("/{hackathon_id}/teams", response_model=list[HackathonTeamResponse])
def list_registered_teams(hackathon_id: str, db: Session = Depends(get_db)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    return get_hackathon_teams(db, hackathon.id)


# ── Invitations ──

@router.get("/invitations/my", response_model=list[HackathonInvitationResponse])
def my_hackathon_invitations(db: Session = Depends(get_db),
                              current_user=Depends(get_current_user)):
    return list_my_hackathon_invitations(db, current_user.id)


@router.post("/{hackathon_id}/invitations", response_model=HackathonInvitationResponse)
def invite_to_hackathon_team(hackathon_id: str, data: HackathonInvitationCreate,
                              db: Session = Depends(get_db),
                              current_user=Depends(get_current_user)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    result = invite_hackathon_member(db, hackathon.id, data.team_id, data.user_id, current_user.id)
    if result == "team_not_found":
        raise HTTPException(404, "Team not found")
    if result == "forbidden":
        raise HTTPException(403, "Only team owner/admin can invite")
    if result == "user_not_found":
        raise HTTPException(404, "User not found")
    if result == "already_member":
        raise HTTPException(400, "User is already a team member")
    if result == "already_invited":
        raise HTTPException(400, "Invitation already pending")
    return result


@router.post("/invitations/{invitation_id}/accept", response_model=HackathonInvitationResponse)
def accept_hackathon_invite(invitation_id: int, db: Session = Depends(get_db),
                             current_user=Depends(get_current_user)):
    result = accept_hackathon_invitation(db, invitation_id, current_user.id)
    if result == "not_found":
        raise HTTPException(404, "Invitation not found")
    if result == "forbidden":
        raise HTTPException(403, "Not allowed")
    if result == "already_processed":
        raise HTTPException(400, "Invitation already processed")
    return result


@router.post("/invitations/{invitation_id}/reject", response_model=HackathonInvitationResponse)
def reject_hackathon_invite(invitation_id: int, db: Session = Depends(get_db),
                             current_user=Depends(get_current_user)):
    result = reject_hackathon_invitation(db, invitation_id, current_user.id)
    if result == "not_found":
        raise HTTPException(404, "Invitation not found")
    if result == "forbidden":
        raise HTTPException(403, "Not allowed")
    if result == "already_processed":
        raise HTTPException(400, "Invitation already processed")
    return result


# ── Submissions ──

@router.post("/{hackathon_id}/submissions", response_model=HackathonSubmissionResponse)
def submit_project(hackathon_id: str, data: HackathonSubmissionCreate,
                    db: Session = Depends(get_db),
                    current_user=Depends(get_current_user)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    team_id = data.team_id if hasattr(data, "team_id") and data.team_id else None
    if not team_id:
        raise HTTPException(400, "team_id is required")
    return create_submission(db, hackathon.id, team_id, current_user.id, data)


@router.get("/{hackathon_id}/submissions", response_model=list[HackathonSubmissionResponse])
def list_submissions(hackathon_id: str, db: Session = Depends(get_db)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    return get_submissions(db, hackathon.id)


@router.post("/submissions/{submission_id}/review", response_model=HackathonSubmissionResponse)
def review_submission_endpoint(submission_id: int, status: str,
                                db: Session = Depends(get_db)):
    result = review_submission(db, submission_id, status)
    if result == "not_found":
        raise HTTPException(404, "Submission not found")
    return result


# ── Announcements ──

@router.post("/{hackathon_id}/announcements", response_model=HackathonAnnouncementResponse)
def create_hackathon_announcement(hackathon_id: str, data: HackathonAnnouncementCreate,
                                   db: Session = Depends(get_db),
                                   current_user=Depends(get_current_user)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    return create_announcement(db, hackathon.id, current_user.id, data)


@router.get("/{hackathon_id}/announcements", response_model=list[HackathonAnnouncementResponse])
def list_hackathon_announcements(hackathon_id: str, db: Session = Depends(get_db)):
    hackathon = _resolve_public_id(db, Hackathon, hackathon_id)
    if not hackathon:
        raise HTTPException(404, "Hackathon not found")
    return get_announcements(db, hackathon.id)
