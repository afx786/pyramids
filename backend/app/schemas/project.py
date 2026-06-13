from pydantic import BaseModel
from datetime import datetime
from typing import List

from typing import List

class ProjectCreate(BaseModel):
    title: str
    description: str
    domain: str
    visibility: str = "public"
    status: str = "building"

    tech_stack: List[str]


class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    domain: str
    visibility: str
    status: str
    owner_id: int
    created_at: datetime

    tech_stack: List[str]

    class Config:
        from_attributes = True
 
class ProjectUpdate(BaseModel):
    title: str
    description: str
    domain: str
    visibility: str
    status: str        