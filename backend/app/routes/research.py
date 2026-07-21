from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_db
from app.core.auth import get_current_user

from app.schemas.research import (
    ResearchProjectCreate, ResearchProjectResponse, ResearchUpdate,
    ResearchMemberResponse,
    ResearchMilestoneCreate, ResearchMilestoneResponse,
    ResearchUpdateContent, ResearchUpdateResponse,
)
from app.schemas.research_join_request import ResearchJoinRequestResponse
from app.services.research_service import (
    create_research_project, get_research_project, get_all_research_projects,
    get_my_research_projects, update_research, delete_research,
    get_research_members, add_milestone, get_milestones,
    complete_milestone, create_update, get_updates,
)
from app.services.research_join_request_service import (
    create_research_join_request, approve_research_request,
    reject_research_request,
)
from app.services.pagination import paginate_list

router = APIRouter(prefix="/research", tags=["Research"])


@router.post("", response_model=ResearchProjectResponse)
def create_research(data: ResearchProjectCreate,
                     db: Session = Depends(get_db),
                     current_user=Depends(get_current_user)):
    return create_research_project(db, data, current_user.id)


@router.get("/my", response_model=list[ResearchProjectResponse])
def my_research_projects(db: Session = Depends(get_db),
                          current_user=Depends(get_current_user)):
    return get_my_research_projects(db, current_user.id)


@router.get("")
def list_research(db: Session = Depends(get_db),
                   limit: int | None = None, offset: int = 0,
                   sort: str = "newest", status: str | None = None,
                   research_type: str | None = None):
    results = get_all_research_projects(db, status)
    if research_type:
        results = [r for r in results if r.research_type == research_type]
    if sort == "oldest":
        results = list(reversed(results))
    if limit is None:
        return results
    items, meta = paginate_list(results, limit, offset)
    return {"items": items, "meta": {**meta, "sort": sort}}


@router.get("/{research_id}", response_model=ResearchProjectResponse)
def single_research(research_id: int, db: Session = Depends(get_db)):
    research = get_research_project(db, research_id)
    if not research:
        raise HTTPException(404, "Research project not found")
    return research


@router.patch("/{research_id}", response_model=ResearchProjectResponse)
def edit_research(research_id: int, data: ResearchUpdate,
                   db: Session = Depends(get_db),
                   current_user=Depends(get_current_user)):
    result = update_research(db, research_id, current_user.id, data)
    if result == "not_found":
        raise HTTPException(404, "Research project not found")
    if result == "forbidden":
        raise HTTPException(403, "Only the owner can update")
    return result


@router.delete("/{research_id}")
def remove_research(research_id: int, db: Session = Depends(get_db),
                     current_user=Depends(get_current_user)):
    result = delete_research(db, research_id, current_user.id)
    if result == "not_found":
        raise HTTPException(404, "Research project not found")
    if result == "forbidden":
        raise HTTPException(403, "Only the owner can delete")
    return {"message": "Research project deleted"}


@router.get("/{research_id}/members", response_model=list[ResearchMemberResponse])
def list_research_members(research_id: int, db: Session = Depends(get_db)):
    return get_research_members(db, research_id)


@router.post("/{research_id}/join", response_model=ResearchJoinRequestResponse)
def join_research(research_id: int, db: Session = Depends(get_db),
                   current_user=Depends(get_current_user)):
    result = create_research_join_request(db, research_id, current_user.id)
    if result == "research_not_found":
        raise HTTPException(404, "Research project not found")
    if result == "owner":
        raise HTTPException(400, "Owner cannot request collaboration")
    if result == "already_member":
        raise HTTPException(400, "Already a collaborator")
    if result == "already_requested":
        raise HTTPException(400, "Request already pending")
    return result


@router.get("/{research_id}/requests", response_model=list[ResearchJoinRequestResponse])
def list_research_requests(research_id: int, db: Session = Depends(get_db),
                            current_user=Depends(get_current_user)):
    from app.services.research_service import get_research_requests
    result = get_research_requests(db, research_id, current_user.id)
    if result == "research_not_found":
        raise HTTPException(404, "Research project not found")
    if result == "forbidden":
        raise HTTPException(403, "Only the owner can view requests")
    return result


@router.post("/requests/{request_id}/approve", response_model=ResearchJoinRequestResponse)
def approve_request(request_id: int, db: Session = Depends(get_db),
                     current_user=Depends(get_current_user)):
    result = approve_research_request(db, request_id, current_user.id)
    if result == "not_found":
        raise HTTPException(404, "Request not found")
    if result == "already_processed":
        raise HTTPException(400, "Request already processed")
    if result == "forbidden":
        raise HTTPException(403, "Only the owner can approve")
    return result


@router.post("/requests/{request_id}/reject", response_model=ResearchJoinRequestResponse)
def reject_request(request_id: int, db: Session = Depends(get_db),
                    current_user=Depends(get_current_user)):
    result = reject_research_request(db, request_id, current_user.id)
    if result == "not_found":
        raise HTTPException(404, "Request not found")
    if result == "already_processed":
        raise HTTPException(400, "Request already processed")
    if result == "forbidden":
        raise HTTPException(403, "Only the owner can reject")
    return result


@router.post("/{research_id}/leave")
def leave_research_project(research_id: int, db: Session = Depends(get_db),
                            current_user=Depends(get_current_user)):
    from app.services.research_service import delete_research as leave_service
    from app.models.research_member import ResearchMember
    member = db.query(ResearchMember).filter(
        ResearchMember.research_id == research_id,
        ResearchMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(400, "Not a member")
    if member.role == "owner":
        raise HTTPException(400, "Owner cannot leave")
    db.delete(member)
    db.commit()
    return {"message": "Left research project"}


# ── Milestones ──

@router.post("/{research_id}/milestones", response_model=ResearchMilestoneResponse)
def create_research_milestone(research_id: int, data: ResearchMilestoneCreate,
                               db: Session = Depends(get_db),
                               current_user=Depends(get_current_user)):
    result = add_milestone(db, research_id, current_user.id, data)
    if result == "not_found":
        raise HTTPException(404, "Research project not found")
    if result == "forbidden":
        raise HTTPException(403, "Only the owner can create milestones")
    return result


@router.get("/{research_id}/milestones", response_model=list[ResearchMilestoneResponse])
def list_research_milestones(research_id: int, db: Session = Depends(get_db)):
    return get_milestones(db, research_id)


@router.post("/milestones/{milestone_id}/complete", response_model=ResearchMilestoneResponse)
def complete_research_milestone(milestone_id: int, db: Session = Depends(get_db),
                                 current_user=Depends(get_current_user)):
    result = complete_milestone(db, milestone_id, current_user.id)
    if result == "not_found":
        raise HTTPException(404, "Milestone not found")
    if result == "forbidden":
        raise HTTPException(403, "Only the project owner can complete milestones")
    return result


# ── Updates ──

@router.post("/{research_id}/updates", response_model=ResearchUpdateResponse)
def create_research_update(research_id: int, data: ResearchUpdateContent,
                            db: Session = Depends(get_db),
                            current_user=Depends(get_current_user)):
    result = create_update(db, research_id, current_user.id, data.content)
    if result == "not_found":
        raise HTTPException(404, "Research project not found")
    if result == "forbidden":
        raise HTTPException(403, "Only members can post updates")
    return result


@router.get("/{research_id}/updates", response_model=list[ResearchUpdateResponse])
def list_research_updates(research_id: int, db: Session = Depends(get_db)):
    return get_updates(db, research_id)
