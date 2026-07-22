import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.deps import get_db
from app.core.auth import get_current_user
from app.core.admin import get_current_admin
from app.models.organization import Organization


def _resolve_public_id(db, model, identifier):
    if re.match(r'^PYR-[A-Z]+-[A-Z0-9]{6}$', str(identifier).upper()):
        return db.query(model).filter(func.upper(model.public_id) == str(identifier).upper()).first()
    try:
        return db.query(model).get(int(identifier))
    except (ValueError, TypeError):
        return None

from app.schemas.organization import (
    OrganizationCreate, OrganizationUpdate, OrganizationResponse,
    OrganizationMemberResponse,
)
from app.services.organization_service import (
    create_organization, get_organization, get_my_organizations,
    update_organization, delete_organization,
    get_organization_members, add_organization_member,
    remove_organization_member, approve_organization,
    get_all_organizations, get_pending_organizations,
)
from app.services.pagination import paginate_list

router = APIRouter(prefix="/organizations", tags=["Organizations"])


@router.post("", response_model=OrganizationResponse)
def create_new_organization(data: OrganizationCreate,
                             db: Session = Depends(get_db),
                             current_user=Depends(get_current_user)):
    return create_organization(db, data, current_user.id)


@router.get("/my", response_model=list[OrganizationResponse])
def my_organizations(db: Session = Depends(get_db),
                      current_user=Depends(get_current_user)):
    return get_my_organizations(db, current_user.id)


@router.get("")
def list_organizations(db: Session = Depends(get_db),
                        limit: int | None = None, offset: int = 0,
                        status: str | None = None):
    results = get_all_organizations(db, status)
    if limit is None:
        return results
    items, meta = paginate_list(results, limit, offset)
    return {"items": items, "meta": meta}


@router.get("/{org_id}", response_model=OrganizationResponse)
def single_organization(org_id: str, db: Session = Depends(get_db)):
    org = _resolve_public_id(db, Organization, org_id)
    if not org:
        raise HTTPException(404, "Organization not found")
    return get_organization(db, org.id)


@router.patch("/{org_id}", response_model=OrganizationResponse)
def edit_organization(org_id: str, data: OrganizationUpdate,
                       db: Session = Depends(get_db),
                       current_user=Depends(get_current_user)):
    org = _resolve_public_id(db, Organization, org_id)
    if not org:
        raise HTTPException(404, "Organization not found")
    result = update_organization(db, org.id, current_user.id, data)
    if result == "forbidden":
        raise HTTPException(403, "Only the owner can update")
    return result


@router.delete("/{org_id}")
def remove_organization(org_id: str, db: Session = Depends(get_db),
                         current_user=Depends(get_current_user)):
    org = _resolve_public_id(db, Organization, org_id)
    if not org:
        raise HTTPException(404, "Organization not found")
    result = delete_organization(db, org.id, current_user.id)
    if result == "forbidden":
        raise HTTPException(403, "Only the owner can delete")
    return {"message": "Organization deleted"}


@router.get("/{org_id}/members", response_model=list[OrganizationMemberResponse])
def list_organization_members(org_id: str, db: Session = Depends(get_db)):
    org = _resolve_public_id(db, Organization, org_id)
    if not org:
        raise HTTPException(404, "Organization not found")
    return get_organization_members(db, org.id)


@router.post("/{org_id}/members", response_model=OrganizationMemberResponse)
def add_member(org_id: str, user_id: int,
               db: Session = Depends(get_db),
               current_user=Depends(get_current_user)):
    org = _resolve_public_id(db, Organization, org_id)
    if not org:
        raise HTTPException(404, "Organization not found")
    result = add_organization_member(db, org.id, user_id, current_user.id)
    if result == "forbidden":
        raise HTTPException(403, "Only the owner can add members")
    if result == "already_member":
        raise HTTPException(400, "User is already a member")
    return result


@router.delete("/{org_id}/members/{user_id}")
def remove_member(org_id: str, user_id: int,
                   db: Session = Depends(get_db),
                   current_user=Depends(get_current_user)):
    org = _resolve_public_id(db, Organization, org_id)
    if not org:
        raise HTTPException(404, "Organization not found")
    result = remove_organization_member(db, org.id, user_id, current_user.id)
    if result == "forbidden":
        raise HTTPException(403, "Only the owner can remove members")
    if result == "not_member":
        raise HTTPException(404, "User is not a member")
    if result == "cannot_remove_owner":
        raise HTTPException(400, "Cannot remove the owner")
    return {"message": "Member removed"}


# ── Admin ──

@router.post("/{org_id}/verify", response_model=OrganizationResponse)
def verify_organization(org_id: str, db: Session = Depends(get_db),
                         current_user=Depends(get_current_admin)):
    org = _resolve_public_id(db, Organization, org_id)
    if not org:
        raise HTTPException(404, "Organization not found")
    result = approve_organization(db, org.id, current_user.id)
    return result


@router.get("/pending/all", response_model=list[OrganizationResponse])
def list_pending_organizations(db: Session = Depends(get_db),
                                current_user=Depends(get_current_admin)):
    return get_pending_organizations(db)
