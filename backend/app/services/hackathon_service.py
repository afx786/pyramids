from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.hackathon import Hackathon
from app.models.hackathon_team import HackathonTeam
from app.models.hackathon_submission import HackathonSubmission
from app.models.hackathon_announcement import HackathonAnnouncement
from app.models.team import Team
from app.services.notification_service import create_notification
from app.services.id_service import generate_public_id


def create_hackathon(db: Session, data, user_id: int):
    hackathon = Hackathon(
        public_id=generate_public_id('HACK'),
        title=data.title,
        description=data.description,
        theme=data.theme,
        banner_url=data.banner_url,
        organizer=data.organizer,
        registration_opens=data.registration_opens,
        registration_closes=data.registration_closes,
        start_date=data.start_date,
        end_date=data.end_date,
        mode=data.mode,
        venue=data.venue,
        city=data.city,
        country=data.country,
        official_website=data.official_website,
        registration_link=data.registration_link,
        prize_pool=data.prize_pool,
        team_size_min=data.team_size_min,
        team_size_max=data.team_size_max,
        eligibility=data.eligibility,
        domains=data.domains or [],
        technologies=data.technologies or [],
        sponsors=data.sponsors or [],
        judges=data.judges or [],
        rules=data.rules,
        faqs=data.faqs or [],
        contact_info=data.contact_info,
        status="draft",
        source="host",
        created_by=user_id,
    )
    db.add(hackathon)
    db.commit()
    db.refresh(hackathon)
    return hackathon


def get_host_hackathons(db: Session, user_id: int):
    return (
        db.query(Hackathon)
        .filter(Hackathon.created_by == user_id)
        .order_by(desc(Hackathon.updated_at))
        .all()
    )


def get_hackathon(db: Session, hackathon_id: int):
    return db.query(Hackathon).filter(Hackathon.id == hackathon_id).first()


def update_hackathon(db: Session, hackathon_id: int, user_id: int, data):
    hackathon = get_hackathon(db, hackathon_id)
    if not hackathon:
        return "not_found"
    if hackathon.created_by != user_id:
        return "forbidden"
    if hackathon.status not in ("draft", "rejected"):
        return "cannot_edit"

    for field in ("title", "description", "theme", "banner_url", "organizer",
                  "registration_opens", "registration_closes", "start_date", "end_date",
                  "mode", "venue", "city", "country",
                  "official_website", "registration_link",
                  "prize_pool", "team_size_min", "team_size_max", "eligibility",
                  "domains", "technologies", "sponsors", "judges",
                  "rules", "faqs", "contact_info"):
        val = getattr(data, field, None)
        if val is not None:
            setattr(hackathon, field, val)

    db.commit()
    db.refresh(hackathon)
    return hackathon


def delete_hackathon(db: Session, hackathon_id: int, user_id: int):
    hackathon = get_hackathon(db, hackathon_id)
    if not hackathon:
        return "not_found"
    if hackathon.created_by != user_id:
        return "forbidden"
    if hackathon.status not in ("draft", "rejected"):
        return "cannot_delete"

    db.delete(hackathon)
    db.commit()
    return "deleted"


def submit_for_review(db: Session, hackathon_id: int, user_id: int):
    hackathon = get_hackathon(db, hackathon_id)
    if not hackathon:
        return "not_found"
    if hackathon.created_by != user_id:
        return "forbidden"
    if hackathon.status not in ("draft", "rejected"):
        return "invalid_status"

    hackathon.status = "submitted"
    db.commit()
    db.refresh(hackathon)
    return hackathon


def approve_hackathon(db: Session, hackathon_id: int, feedback: str | None = None):
    hackathon = get_hackathon(db, hackathon_id)
    if not hackathon:
        return "not_found"
    if hackathon.status != "submitted":
        return "invalid_status"

    hackathon.status = "approved"
    hackathon.admin_feedback = feedback
    db.commit()
    db.refresh(hackathon)

    if hackathon.created_by:
        msg = f"Your hackathon '{hackathon.title}' has been approved."
        if feedback:
            msg += f" Feedback: {feedback}"
        create_notification(db=db, user_id=hackathon.created_by,
                            title="Hackathon Approved", message=msg,
                            notification_type="hackathon_approved")
    return hackathon


def reject_hackathon(db: Session, hackathon_id: int, feedback: str | None = None):
    hackathon = get_hackathon(db, hackathon_id)
    if not hackathon:
        return "not_found"
    if hackathon.status != "submitted":
        return "invalid_status"

    hackathon.status = "rejected"
    hackathon.admin_feedback = feedback
    db.commit()
    db.refresh(hackathon)

    if hackathon.created_by:
        msg = f"Your hackathon '{hackathon.title}' was not approved."
        if feedback:
            msg += f" Reason: {feedback}"
        create_notification(db=db, user_id=hackathon.created_by,
                            title="Hackathon Rejected", message=msg,
                            notification_type="hackathon_rejected")
    return hackathon


def request_changes_hackathon(db: Session, hackathon_id: int, feedback: str | None = None):
    hackathon = get_hackathon(db, hackathon_id)
    if not hackathon:
        return "not_found"
    if hackathon.status != "submitted":
        return "invalid_status"

    hackathon.status = "rejected"
    hackathon.admin_feedback = feedback
    db.commit()
    db.refresh(hackathon)

    if hackathon.created_by:
        msg = f"Changes requested for '{hackathon.title}'."
        if feedback:
            msg += f" Details: {feedback}"
        create_notification(db=db, user_id=hackathon.created_by,
                            title="Changes Requested", message=msg,
                            notification_type="hackathon_changes_requested")
    return hackathon


def publish_hackathon(db: Session, hackathon_id: int):
    hackathon = get_hackathon(db, hackathon_id)
    if not hackathon:
        return "not_found"
    if hackathon.status != "approved":
        return "invalid_status"

    hackathon.status = "published"
    db.commit()
    db.refresh(hackathon)

    if hackathon.created_by:
        create_notification(db=db, user_id=hackathon.created_by,
                            title="Hackathon Published",
                            message=f"Your hackathon '{hackathon.title}' is now live!",
                            notification_type="hackathon_published")
    return hackathon


def complete_hackathon(db: Session, hackathon_id: int, user_id: int):
    hackathon = get_hackathon(db, hackathon_id)
    if not hackathon:
        return "not_found"
    if hackathon.created_by != user_id:
        return "forbidden"
    if hackathon.status != "published":
        return "invalid_status"

    hackathon.status = "completed"
    db.commit()
    db.refresh(hackathon)
    return hackathon


def archive_hackathon(db: Session, hackathon_id: int, user_id: int):
    hackathon = get_hackathon(db, hackathon_id)
    if not hackathon:
        return "not_found"
    if hackathon.created_by != user_id:
        return "forbidden"

    hackathon.status = "archived"
    db.commit()
    db.refresh(hackathon)
    return hackathon


def get_all_hackathons(db: Session, status: str | None = "published"):
    q = db.query(Hackathon)
    if status:
        q = q.filter(Hackathon.status == status)
    return q.order_by(desc(Hackathon.created_at)).all()


def get_pending_hackathons(db: Session):
    return db.query(Hackathon).filter(Hackathon.status == "submitted").all()


def register_team_for_hackathon(db: Session, hackathon_id: int, team_id: int, current_user_id: int):
    hackathon = get_hackathon(db, hackathon_id)
    if not hackathon:
        return None

    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        return "team_not_found"
    if team.owner_id != current_user_id:
        return "forbidden"

    existing = db.query(HackathonTeam).filter(
        HackathonTeam.hackathon_id == hackathon_id,
        HackathonTeam.team_id == team_id
    ).first()
    if existing:
        return "already_registered"

    registration = HackathonTeam(hackathon_id=hackathon_id, team_id=team_id)
    db.add(registration)
    db.commit()
    return registration


def get_hackathon_teams(db: Session, hackathon_id: int):
    registrations = db.query(HackathonTeam).filter(
        HackathonTeam.hackathon_id == hackathon_id
    ).all()
    return [{"id": r.team.id, "name": r.team.name, "owner_id": r.team.owner_id} for r in registrations]


def create_submission(db: Session, hackathon_id: int, team_id: int, user_id: int, data):
    submission = HackathonSubmission(
        hackathon_id=hackathon_id,
        team_id=team_id,
        submitted_by=user_id,
        title=data.title,
        description=data.description,
        repository_url=data.repository_url,
        demo_url=data.demo_url,
        presentation_url=data.presentation_url,
        tech_stack=data.tech_stack or [],
        screenshots=data.screenshots or [],
        documentation_url=data.documentation_url,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


def get_submissions(db: Session, hackathon_id: int):
    return db.query(HackathonSubmission).filter(
        HackathonSubmission.hackathon_id == hackathon_id
    ).all()


def get_team_submissions(db: Session, hackathon_id: int, team_id: int):
    return db.query(HackathonSubmission).filter(
        HackathonSubmission.hackathon_id == hackathon_id,
        HackathonSubmission.team_id == team_id
    ).all()


def review_submission(db: Session, submission_id: int, status: str):
    sub = db.query(HackathonSubmission).filter(HackathonSubmission.id == submission_id).first()
    if not sub:
        return "not_found"
    sub.status = status
    db.commit()
    db.refresh(sub)
    return sub


def create_announcement(db: Session, hackathon_id: int, user_id: int, data):
    announcement = HackathonAnnouncement(
        hackathon_id=hackathon_id,
        author_id=user_id,
        title=data.title,
        content=data.content,
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement


def get_announcements(db: Session, hackathon_id: int):
    return db.query(HackathonAnnouncement).filter(
        HackathonAnnouncement.hackathon_id == hackathon_id
    ).order_by(desc(HackathonAnnouncement.created_at)).all()
