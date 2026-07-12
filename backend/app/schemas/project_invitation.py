from pydantic import BaseModel
from datetime import datetime


class ProjectInvitationCreate(BaseModel):
    user_id: int


class ProjectMemberResponse(BaseModel):
    id: int
    project_id: int
    user_id: int
    role: str
    joined_at: datetime

    class Config:
        from_attributes = True


class ProjectInvitationResponse(BaseModel):
    id: int
    project_id: int
    invited_user_id: int
    invited_by_id: int
    status: str
    created_at: datetime
    responded_at: datetime | None

    class Config:
        from_attributes = True
