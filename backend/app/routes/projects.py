from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_db
from app.core.auth import get_current_user
from app.services.project_service import serialize_project

from app.schemas.project import (
    ProjectCreate,
    ProjectResponse
)

from app.services.project_service import (
    create_project,
    get_project,
    get_all_projects,
    update_project,
    delete_project
)

from app.schemas.project import (
    ProjectUpdate
)


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


@router.get("", response_model=list[ProjectResponse])
def list_projects(
    db: Session = Depends(get_db)
):
    projects = get_all_projects(db)

    return [
        serialize_project(project)
        for project in projects
    ]


@router.get(
    "/{project_id}",
    response_model=ProjectResponse
)
def get_single_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    project = get_project(db, project_id)

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    return serialize_project(project)

@router.put(
    "/{project_id}",
    response_model=ProjectResponse
)
def edit_project(
    project_id: int,
    data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    project = update_project(
        db=db,
        project_id=project_id,
        current_user_id=current_user.id,
        title=data.title,
        description=data.description,
        domain=data.domain,
        visibility=data.visibility,
        status=data.status
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    if project == "forbidden":
        raise HTTPException(
            status_code=403,
            detail="Not project owner"
        )

    return serialize_project(project)

@router.delete(
    "/{project_id}"
)
def remove_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = delete_project(
        db=db,
        project_id=project_id,
        current_user_id=current_user.id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    if result == "forbidden":
        raise HTTPException(
            status_code=403,
            detail="Not project owner"
        )

    return {
        "message": "Project deleted successfully"
    }