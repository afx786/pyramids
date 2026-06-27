from pydantic import BaseModel
from datetime import datetime


class TeamJoinRequestResponse(BaseModel):
    id: int
    team_id: int
    user_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True