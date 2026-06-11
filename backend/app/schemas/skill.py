from pydantic import BaseModel


class UserSkillsResponse(BaseModel):
    user_id: int
    skills: list[str]