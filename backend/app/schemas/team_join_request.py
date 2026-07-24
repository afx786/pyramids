from pydantic import BaseModel
from datetime import datetime


class JoinRequestUserInfo(BaseModel):
    id: int
    name: str | None = None
    builder_id: str | None = None


class TeamJoinRequestResponse(BaseModel):
    id: int
    team_id: int
    user_id: int
    status: str
    created_at: datetime
    user: JoinRequestUserInfo | None = None

    class Config:
        from_attributes = True