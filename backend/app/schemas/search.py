from pydantic import BaseModel


class UserSearchResponse(BaseModel):
    id: int
    name: str
    rank: str
    points: int