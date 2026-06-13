from pydantic import BaseModel


class UserStatsResponse(BaseModel):
    user_id: int
    projects_count: int
    skills_count: int
    points: int
    rank: str