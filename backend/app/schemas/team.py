from pydantic import BaseModel


class TeamCreate(BaseModel):
    name: str
    description: str


class TeamResponse(BaseModel):
    id: int
    name: str
    description: str
    owner_id: int