from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.deps import get_db

from app.core.admin import get_current_admin

from app.schemas.admin import (
    DashboardStats,
    AnalyticsResponse,
    PendingResponse,
    PlatformReport,
    ModerationResponse
)
from app.schemas.hackathon import HackathonResponse
from app.schemas.organization import OrganizationResponse

from app.services.admin_service import (
    get_dashboard_stats,
    get_platform_analytics,
    get_pending_requests,
    get_platform_report,
    get_moderation_dashboard,
    get_admin_overview,
    get_platform_statistics,
    get_dashboard_cards,
    get_recent_activity,
    get_quick_insights,
    get_recent_users,
    get_recent_projects,
    get_recent_hackathons,
    get_recent_notifications
)
from app.services.hackathon_service import (
    approve_hackathon as approve_hackathon_svc,
    reject_hackathon as reject_hackathon_svc,
    request_changes_hackathon,
    get_pending_hackathons,
)
from app.services.organization_service import (
    approve_organization as approve_org_svc,
    get_pending_organizations,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(get_current_admin)]
)


# =====================================================
# Dashboard
# =====================================================

@router.get(
    "/dashboard",
    response_model=DashboardStats
)
def dashboard(
    db: Session = Depends(get_db)
):
    return get_dashboard_stats(db)


# =====================================================
# Analytics
# =====================================================

@router.get(
    "/analytics",
    response_model=AnalyticsResponse
)
def analytics(
    db: Session = Depends(get_db)
):
    return get_platform_analytics(db)


# =====================================================
# Pending Requests
# =====================================================

@router.get(
    "/pending",
    response_model=PendingResponse
)
def pending_requests(
    db: Session = Depends(get_db)
):
    return get_pending_requests(db)


# =====================================================
# Reports
# =====================================================

@router.get(
    "/reports",
    response_model=PlatformReport
)
def reports(
    db: Session = Depends(get_db)
):
    return get_platform_report(db)


# =====================================================
# Moderation
# =====================================================

@router.get(
    "/moderation",
    response_model=ModerationResponse
)
def moderation(
    db: Session = Depends(get_db)
):
    return get_moderation_dashboard(db)


# =====================================================
# Complete Admin Overview
# =====================================================

@router.get(
    "/overview"
)
def overview(
    db: Session = Depends(get_db)
):
    return get_admin_overview(db)


# =====================================================
# Platform Statistics
# =====================================================

@router.get(
    "/statistics"
)
def platform_statistics(
    db: Session = Depends(get_db)
):
    return get_platform_statistics(db)


# =====================================================
# Dashboard Cards
# =====================================================

@router.get(
    "/dashboard/cards"
)
def dashboard_cards(
    db: Session = Depends(get_db)
):
    return get_dashboard_cards(db)


# =====================================================
# Quick Insights
# =====================================================

@router.get(
    "/insights"
)
def quick_insights(
    db: Session = Depends(get_db)
):
    return get_quick_insights(db)


# =====================================================
# Recent Activity
# =====================================================

@router.get(
    "/activity"
)
def recent_activity(
    db: Session = Depends(get_db)
):
    return get_recent_activity(db)


# =====================================================
# Recent Users
# =====================================================

@router.get(
    "/recent/users"
)
def recent_users(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    return get_recent_users(
        db,
        limit
    )


# =====================================================
# Recent Projects
# =====================================================

@router.get(
    "/recent/projects"
)
def recent_projects(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    return get_recent_projects(
        db,
        limit
    )


# =====================================================
# Recent Hackathons
# =====================================================

@router.get(
    "/recent/hackathons"
)
def recent_hackathons(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    return get_recent_hackathons(
        db,
        limit
    )


# =====================================================
# Recent Notifications
# =====================================================

@router.get(
    "/recent/notifications"
)
def recent_notifications(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    return get_recent_notifications(
        db,
        limit
    )


# ── Admin: Hackathon Review ──

@router.get("/hackathons/pending", response_model=list[HackathonResponse])
def admin_pending_hackathons(db: Session = Depends(get_db)):
    return get_pending_hackathons(db)


@router.post("/hackathons/{hackathon_id}/approve", response_model=HackathonResponse)
def admin_approve_hackathon(hackathon_id: int, feedback: str | None = None,
                             db: Session = Depends(get_db)):
    result = approve_hackathon_svc(db, hackathon_id, feedback)
    if result == "not_found":
        from fastapi import HTTPException
        raise HTTPException(404, "Hackathon not found")
    if result == "invalid_status":
        raise HTTPException(400, "Not in submitted status")
    return result


@router.post("/hackathons/{hackathon_id}/reject", response_model=HackathonResponse)
def admin_reject_hackathon(hackathon_id: int, feedback: str | None = None,
                            db: Session = Depends(get_db)):
    result = reject_hackathon_svc(db, hackathon_id, feedback)
    if result == "not_found":
        from fastapi import HTTPException
        raise HTTPException(404, "Hackathon not found")
    if result == "invalid_status":
        raise HTTPException(400, "Not in submitted status")
    return result


@router.post("/hackathons/{hackathon_id}/request-changes", response_model=HackathonResponse)
def admin_request_hackathon_changes(hackathon_id: int, feedback: str | None = None,
                                     db: Session = Depends(get_db)):
    result = request_changes_hackathon(db, hackathon_id, feedback)
    if result == "not_found":
        from fastapi import HTTPException
        raise HTTPException(404, "Hackathon not found")
    if result == "invalid_status":
        raise HTTPException(400, "Not in submitted status")
    return result


# ── Admin: Organization Review ──

@router.get("/organizations/pending", response_model=list[OrganizationResponse])
def admin_pending_organizations(db: Session = Depends(get_db)):
    return get_pending_organizations(db)


@router.post("/organizations/{org_id}/verify", response_model=OrganizationResponse)
def admin_verify_organization(org_id: int, db: Session = Depends(get_db)):
    result = approve_org_svc(db, org_id, None)
    if result == "not_found":
        from fastapi import HTTPException
        raise HTTPException(404, "Organization not found")
    return result