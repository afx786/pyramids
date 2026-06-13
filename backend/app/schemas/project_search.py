from pydantic import BaseModel


class ProjectOwner(BaseModel):
    id: int
    name: str


class ProjectSearchResponse(BaseModel):
    id: int
    title: str
    domain: str
    status: str

    owner: ProjectOwner

    skills: list[str]