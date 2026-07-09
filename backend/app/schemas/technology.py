from pydantic import BaseModel


class TechnologyCreate(BaseModel):
    name: str
    category: str
    icon: str | None = None
    website: str | None = None


class TechnologyResponse(BaseModel):
    id: int
    name: str
    slug: str
    category: str
    icon: str | None
    website: str | None

    class Config:
        from_attributes = True


class ProjectTechnologyCreate(BaseModel):
    name: str
    category: str


class ProjectTechnologyResponse(BaseModel):
    id: int
    name: str
    category: str

    class Config:
        from_attributes = True