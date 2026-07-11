from pydantic import BaseModel
from datetime import datetime
from typing import List
from app.schemas.technology import ProjectTechnologyCreate
from app.schemas.technology import ProjectTechnologyResponse
from typing import List

class ProjectCreate(BaseModel):
    title: str
    description: str
    domain: str
    visibility: str = "public"
    status: str = "building"

    skills: List[str] = []

    technologies: list[ProjectTechnologyCreate] = []


class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    domain: str
    visibility: str
    status: str
    owner_id: int
    owner_name: str | None = None
    created_at: datetime
    skills: List[str]
    technologies: list[ProjectTechnologyResponse]
    verification_status: str
    verified_at: datetime | None
    verification_notes: str | None

    class Config:
        from_attributes = True
 
class ProjectUpdate(BaseModel):
    title: str
    description: str
    domain: str
    visibility: str
    status: str        