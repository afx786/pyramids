from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.organization import Organization, OrganizationMember
from app.services.notification_service import create_notification


def create_organization(db: Session, data, user_id: int):
    org = Organization(
        name=data.name,
        description=data.description,
        org_type=data.org_type,
        logo_url=data.logo_url,
        website=data.website,
        email=data.email,
        location=data.location,
        domains=data.domains or [],
        social_links=data.social_links or [],
        owner_id=user_id,
    )
    db.add(org)
    db.commit()
    db.refresh(org)

    member = OrganizationMember(organization_id=org.id, user_id=user_id, role="owner")
    db.add(member)
    db.commit()
    return org


def get_organization(db: Session, org_id: int):
    return db.query(Organization).filter(Organization.id == org_id).first()


def get_my_organizations(db: Session, user_id: int):
    member_of = db.query(OrganizationMember.organization_id).filter(
        OrganizationMember.user_id == user_id
    ).subquery()
    return db.query(Organization).filter(Organization.id.in_(member_of)).all()


def update_organization(db: Session, org_id: int, user_id: int, data):
    org = get_organization(db, org_id)
    if not org:
        return "not_found"
    if org.owner_id != user_id:
        return "forbidden"

    for field in ("name", "description", "org_type", "logo_url", "website",
                  "email", "location", "domains", "social_links"):
        val = getattr(data, field, None)
        if val is not None:
            setattr(org, field, val)

    db.commit()
    db.refresh(org)
    return org


def delete_organization(db: Session, org_id: int, user_id: int):
    org = get_organization(db, org_id)
    if not org:
        return "not_found"
    if org.owner_id != user_id:
        return "forbidden"
    db.delete(org)
    db.commit()
    return "deleted"


def get_organization_members(db: Session, org_id: int):
    return db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id
    ).all()


def add_organization_member(db: Session, org_id: int, user_id: int, current_user_id: int):
    org = get_organization(db, org_id)
    if not org:
        return "not_found"
    if org.owner_id != current_user_id:
        return "forbidden"

    existing = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == user_id
    ).first()
    if existing:
        return "already_member"

    member = OrganizationMember(organization_id=org_id, user_id=user_id)
    db.add(member)
    db.commit()
    return member


def remove_organization_member(db: Session, org_id: int, user_id: int, current_user_id: int):
    org = get_organization(db, org_id)
    if not org:
        return "not_found"
    if org.owner_id != current_user_id:
        return "forbidden"

    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == user_id
    ).first()
    if not member:
        return "not_member"
    if member.role == "owner":
        return "cannot_remove_owner"

    db.delete(member)
    db.commit()
    return "removed"


def approve_organization(db: Session, org_id: int, admin_id: int):
    org = get_organization(db, org_id)
    if not org:
        return "not_found"
    org.is_verified = True
    org.verified_by = admin_id
    org.status = "verified"
    db.commit()
    db.refresh(org)

    create_notification(db=db, user_id=org.owner_id,
                        title="Organization Verified",
                        message=f"Your organization '{org.name}' has been verified.",
                        notification_type="org_verified")
    return org


def get_all_organizations(db: Session, status: str | None = None):
    q = db.query(Organization)
    if status:
        q = q.filter(Organization.status == status)
    return q.order_by(desc(Organization.created_at)).all()


def get_pending_organizations(db: Session):
    return db.query(Organization).filter(Organization.status == "pending").all()
