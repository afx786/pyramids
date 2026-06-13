from pydantic import BaseModel


class ProfileResponse(BaseModel):
    user: dict
    rank: dict
    skills: list[str]
    projects: list[dict]