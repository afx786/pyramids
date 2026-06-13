from pydantic import BaseModel


class LeaderboardUser(BaseModel):
    id: int
    name: str
    points: int
    rank: str