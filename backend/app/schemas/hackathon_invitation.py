from pydantic import BaseModel
from datetime import datetime


class HackathonInvitationCreate(BaseModel):
    user_id: int
    team_id: int


class HackathonInvitationResponse(BaseModel):
    id: int
    hackathon_id: int
    team_id: int
    invited_user_id: int
    invited_by_id: int
    status: str
    created_at: datetime
    responded_at: datetime | None

    class Config:
        from_attributes = True
