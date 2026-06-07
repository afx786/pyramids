from pydantic import BaseModel
from datetime import datetime


class ProjectCreate(BaseModel):
    title: str
    description: str
    domain: str
    visibility: str = "public"
    status: str = "building"


class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    domain: str
    visibility: str
    status: str
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True
        