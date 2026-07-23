from pydantic import BaseModel


class HackathonTeamResponse(BaseModel):
    id: int
    name: str
    owner_id: int