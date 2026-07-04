from pydantic import BaseModel


class ProfileResponse(BaseModel):
    user: dict
    rank: dict
    skills: list[str]
    projects: list[dict]
    research: list[dict]
    teams: list[dict]
    hackathons: list[dict]
    statistics: dict