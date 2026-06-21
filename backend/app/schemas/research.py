from pydantic import BaseModel
from datetime import datetime


class ResearchProjectCreate(BaseModel):
    title: str
    description: str

    domain: str

    research_type: str

    skills_needed: str

    team_size: int


class ResearchProjectResponse(BaseModel):
    id: int

    title: str
    description: str

    domain: str

    research_type: str

    skills_needed: str

    team_size: int

    status: str

    owner_id: int

    created_at: datetime

    class Config:
        from_attributes = True