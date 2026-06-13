from pydantic import BaseModel


class TopSkillResponse(BaseModel):
    skill: str
    projects: int