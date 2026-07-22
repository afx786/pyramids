import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.deps import get_db
from app.core.auth import get_current_user
from app.core.admin import get_current_admin
from app.models.connection import Connection
from app.models.project import Project
from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate
)
from app.schemas.project_invitation import (
    ProjectInvitationCreate,
    ProjectInvitationResponse,
    ProjectMemberResponse
)
from app.schemas.project_verification import (
    ProjectVerificationRequest,
    ProjectRepositoryVerificationRequest
)
from app.services.pagination import (
    apply_created_sort,
    paginate_query,
    paginate_list
)
from app.services.project_invitation_service import (
    invite_project_member,
    list_project_invitations,
    list_my_project_invitations,
    accept_project_invitation,
    reject_project_invitation,
    get_project_members
)
from app.services.project_service import (
    create_project,
    get_project,
    get_all_projects,
    get_projects_query,
    serialize_project,
    update_project,
    delete_project,
    verify_project,
    trigger_project_verification
)
from app.services.rank_service import get_user_rank


def _resolve_public_id(db, model, identifier):
    if re.match(r'^PYR-[A-Z]+-[A-Z0-9]{6}$', str(identifier).upper()):
        return db.query(model).filter(func.upper(model.public_id) == str(identifier).upper()).first()
    try:
        return db.query(model).get(int(identifier))
    except (ValueError, TypeError):
        return None


router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


@router.post(
    "",
    response_model=ProjectResponse
)
def create_new_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    project = create_project(
        db=db,
        data=data,
        owner_id=current_user.id
    )

    return serialize_project(project)


@router.get("")
def list_projects(
    db: Session = Depends(get_db),
    limit: int | None = None,
    offset: int = 0,
    sort: str = "newest"
):
    if limit is not None:
        if sort in [
            "highest_rank",
            "most_active",
            "most_connected",
            "most_verified"
        ]:
            projects = get_all_projects(db)

            if sort == "highest_rank":
                projects = sorted(
                    projects,
                    key=lambda project: get_user_rank(db, project.owner_id)["points"],
                    reverse=True
                )

            elif sort == "most_active":
                projects = sorted(
                    projects,
                    key=lambda project: len(project.owner.projects) if project.owner else 0,
                    reverse=True
                )

            elif sort == "most_connected":
                def connection_count(project):
                    return (
                        db.query(Connection)
                        .filter(
                            or_(
                                Connection.user_one_id == project.owner_id,
                                Connection.user_two_id == project.owner_id
                            )
                        )
                        .count()
                    )

                projects = sorted(
                    projects,
                    key=connection_count,
                    reverse=True
                )

            elif sort == "most_verified":
                projects = sorted(
                    projects,
                    key=lambda project: project.verification_status == "verified",
                    reverse=True
                )

            items, meta = paginate_list(
                projects,
                limit,
                offset
            )

            return {
                "items": [
                    serialize_project(project)
                    for project in items
                ],
                "meta": {
                    **meta,
                    "sort": sort
                }
            }

        query = apply_created_sort(
            get_projects_query(db),
            Project,
            sort
        )

        projects, meta = paginate_query(
            query,
            limit,
            offset
        )

        return {
            "items": [
                serialize_project(project)
                for project in projects
            ],
            "meta": {
                **meta,
                "sort": sort
            }
        }

    projects = get_all_projects(db)

    return [
        serialize_project(project)
        for project in projects
    ]


@router.get(
    "/invitations/my",
    response_model=list[ProjectInvitationResponse]
)
def my_project_invitations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return list_my_project_invitations(
        db,
        current_user.id
    )


@router.post(
    "/invitations/{invitation_id}/accept",
    response_model=ProjectInvitationResponse
)
def accept_invitation(
    invitation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = accept_project_invitation(
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
    response_model=ProjectInvitationResponse
)
def reject_invitation(
    invitation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = reject_project_invitation(
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


@router.get(
    "/{project_id}",
    response_model=ProjectResponse
)
def get_single_project(
    project_id: str,
    db: Session = Depends(get_db)
):
    project = _resolve_public_id(db, Project, project_id)

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    return serialize_project(project)


@router.post(
    "/{project_id}/invitations",
    response_model=ProjectInvitationResponse
)
def invite_user_to_project(
    project_id: str,
    data: ProjectInvitationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    project = _resolve_public_id(db, Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    result = invite_project_member(
        db=db,
        project_id=project.id,
        invited_user_id=data.user_id,
        current_user_id=current_user.id
    )

    if result == "project_not_found":
        raise HTTPException(status_code=404, detail="Project not found")

    if result == "forbidden":
        raise HTTPException(status_code=403, detail="Only project owner can invite")

    if result == "cannot_invite_self":
        raise HTTPException(status_code=400, detail="Cannot invite yourself")

    if result == "user_not_found":
        raise HTTPException(status_code=404, detail="User not found")

    if result == "already_member":
        raise HTTPException(status_code=400, detail="User is already a project member")

    if result == "already_invited":
        raise HTTPException(status_code=400, detail="Invitation already pending")

    return result


@router.get(
    "/{project_id}/invitations",
    response_model=list[ProjectInvitationResponse]
)
def project_invitations(
    project_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    project = _resolve_public_id(db, Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    result = list_project_invitations(
        db=db,
        project_id=project.id,
        current_user_id=current_user.id
    )

    if result == "project_not_found":
        raise HTTPException(status_code=404, detail="Project not found")

    if result == "forbidden":
        raise HTTPException(status_code=403, detail="Only project owner can view invitations")

    return result


@router.get(
    "/{project_id}/members",
    response_model=list[ProjectMemberResponse]
)
def project_members(
    project_id: str,
    db: Session = Depends(get_db)
):
    project = _resolve_public_id(db, Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return get_project_members(
        db,
        project.id
    )


@router.put(
    "/{project_id}",
    response_model=ProjectResponse
)
def edit_project(
    project_id: str,
    data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    project = _resolve_public_id(db, Project, project_id)
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    result = update_project(
        db=db,
        project_id=project.id,
        current_user_id=current_user.id,
        title=data.title,
        description=data.description,
        domain=data.domain,
        visibility=data.visibility,
        status=data.status
    )

    if result == "forbidden":
        raise HTTPException(
            status_code=403,
            detail="Not project owner"
        )

    return serialize_project(result)


@router.delete(
    "/{project_id}"
)
def remove_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    project = _resolve_public_id(db, Project, project_id)
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    result = delete_project(
        db=db,
        project_id=project.id,
        current_user_id=current_user.id
    )

    if result == "forbidden":
        raise HTTPException(
            status_code=403,
            detail="Not project owner"
        )

    return {
        "message": "Project deleted successfully"
    }


@router.patch(
    "/{project_id}/verify",
    response_model=ProjectResponse
)
def verify_existing_project(
    project_id: str,
    data: ProjectVerificationRequest,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    project = _resolve_public_id(db, Project, project_id)
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    result = verify_project(
        db=db,
        project_id=project.id,
        admin_id=admin.id,
        status=data.status,
        notes=data.notes
    )

    return serialize_project(result)


@router.post(
    "/{project_id}/verify"
)
def verify_project_repository(
    project_id: str,
    data: ProjectRepositoryVerificationRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    project = _resolve_public_id(db, Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    result = trigger_project_verification(
        db=db,
        project_id=project.id,
        current_user_id=current_user.id,
        github_url=data.github_url
    )

    if result == "not_found":
        raise HTTPException(status_code=404, detail="Project not found")

    if result == "forbidden":
        raise HTTPException(status_code=403, detail="Only project owner can verify repository")

    if result == "invalid_github_url":
        raise HTTPException(status_code=400, detail="Invalid GitHub URL")

    if result == "rate_limit":
        raise HTTPException(status_code=429, detail="GitHub API rate limit exceeded")

    if result == "repository_not_found":
        raise HTTPException(status_code=404, detail="Repository not found")

    if result == "github_error":
        raise HTTPException(status_code=502, detail="GitHub API unavailable")

    return {
        "project": serialize_project(result["project"]),
        "analysis": result["analysis"]
    }
