from pydantic import BaseModel


class UserRankResponse(BaseModel):
    user_id: int
    points: int
    rank: str
    projects_count: int
    skills_count: int