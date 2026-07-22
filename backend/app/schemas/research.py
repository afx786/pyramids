from pydantic import BaseModel
from datetime import datetime
from typing import Any


class ResearchProjectCreate(BaseModel):
    title: str
    abstract: str | None = None
    problem_statement: str | None = None
    description: str
    research_type: str
    domain: str
    research_domain: str | None = None
    skills_needed: str | None = None
    required_roles: list[str] | None = None
    expected_outcomes: str | None = None
    methodology: str | None = None
    datasets: str | None = None
    resources: str | None = None
    repository_url: str | None = None
    paper_link: str | None = None
    funding: str | None = None
    supervisor: str | None = None
    institution: str | None = None
    publication_goal: str | None = None
    duration: str | None = None
    mode: str | None = None
    open_positions: int | None = None
    difficulty: str | None = None
    application_deadline: datetime | None = None
    team_size: int | None = None


class ResearchUpdate(BaseModel):
    title: str | None = None
    abstract: str | None = None
    problem_statement: str | None = None
    description: str | None = None
    research_type: str | None = None
    domain: str | None = None
    research_domain: str | None = None
    skills_needed: str | None = None
    required_roles: list[str] | None = None
    expected_outcomes: str | None = None
    methodology: str | None = None
    datasets: str | None = None
    resources: str | None = None
    repository_url: str | None = None
    paper_link: str | None = None
    funding: str | None = None
    supervisor: str | None = None
    institution: str | None = None
    publication_goal: str | None = None
    duration: str | None = None
    mode: str | None = None
    open_positions: int | None = None
    difficulty: str | None = None
    application_deadline: datetime | None = None
    team_size: int | None = None
    status: str | None = None


class ResearchProjectResponse(BaseModel):
    id: int
    public_id: str
    title: str
    abstract: str | None = None
    problem_statement: str | None = None
    description: str
    research_type: str
    domain: str
    research_domain: str | None = None
    skills_needed: str | None = None
    required_roles: list[Any] | None = None
    expected_outcomes: str | None = None
    methodology: str | None = None
    datasets: str | None = None
    resources: str | None = None
    repository_url: str | None = None
    paper_link: str | None = None
    funding: str | None = None
    supervisor: str | None = None
    institution: str | None = None
    publication_goal: str | None = None
    duration: str | None = None
    mode: str | None = None
    open_positions: int | None = None
    difficulty: str | None = None
    application_deadline: datetime | None = None
    team_size: int | None = None
    status: str | None = None
    owner_id: int
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True


class ResearchMemberResponse(BaseModel):
    id: int | None = None
    research_id: int | None = None
    user_id: int | None = None
    role: str | None = None
    joined_at: datetime | None = None

    class Config:
        from_attributes = True


class ResearchMilestoneCreate(BaseModel):
    title: str
    description: str | None = None
    due_date: datetime | None = None


class ResearchMilestoneResponse(BaseModel):
    id: int
    research_id: int
    title: str
    description: str | None = None
    due_date: datetime | None = None
    is_completed: bool | None = None
    completed_at: datetime | None = None
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class ResearchUpdateContent(BaseModel):
    content: str


class ResearchUpdateResponse(BaseModel):
    id: int
    research_id: int
    author_id: int
    content: str
    created_at: datetime | None = None

    class Config:
        from_attributes = True
