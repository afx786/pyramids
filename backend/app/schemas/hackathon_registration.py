from pydantic import BaseModel


class TeamRegistrationRequest(BaseModel):
    team_id: int