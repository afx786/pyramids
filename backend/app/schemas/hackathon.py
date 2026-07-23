from pydantic import BaseModel
from datetime import datetime
from typing import Any


class HackathonCreate(BaseModel):
    title: str
    description: str | None = None
    theme: str | None = None
    banner_url: str | None = None
    organizer: str
    registration_opens: datetime | None = None
    registration_closes: datetime | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    mode: str | None = None
    venue: str | None = None
    city: str | None = None
    country: str | None = None
    official_website: str | None = None
    registration_link: str | None = None
    prize_pool: str | None = None
    team_size_min: int | None = None
    team_size_max: int | None = None
    eligibility: str | None = None
    domains: list[str] | None = None
    technologies: list[str] | None = None
    sponsors: list[dict[str, Any]] | None = None
    judges: list[dict[str, Any]] | None = None
    rules: str | None = None
    faqs: list[dict[str, Any]] | None = None
    contact_info: str | None = None


class HackathonUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    theme: str | None = None
    banner_url: str | None = None
    organizer: str | None = None
    registration_opens: datetime | None = None
    registration_closes: datetime | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    mode: str | None = None
    venue: str | None = None
    city: str | None = None
    country: str | None = None
    official_website: str | None = None
    registration_link: str | None = None
    prize_pool: str | None = None
    team_size_min: int | None = None
    team_size_max: int | None = None
    eligibility: str | None = None
    domains: list[str] | None = None
    technologies: list[str] | None = None
    sponsors: list[dict[str, Any]] | None = None
    judges: list[dict[str, Any]] | None = None
    rules: str | None = None
    faqs: list[dict[str, Any]] | None = None
    contact_info: str | None = None


class HackathonResponse(BaseModel):
    id: int
    public_id: str
    title: str
    description: str | None = None
    theme: str | None = None
    banner_url: str | None = None
    organizer: str
    registration_opens: datetime | None = None
    registration_closes: datetime | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    mode: str | None = None
    venue: str | None = None
    city: str | None = None
    country: str | None = None
    official_website: str | None = None
    registration_link: str | None = None
    prize_pool: str | None = None
    team_size_min: int | None = None
    team_size_max: int | None = None
    eligibility: str | None = None
    domains: list[Any] | None = None
    technologies: list[Any] | None = None
    sponsors: list[Any] | None = None
    judges: list[Any] | None = None
    rules: str | None = None
    faqs: list[Any] | None = None
    contact_info: str | None = None
    status: str | None = None
    admin_feedback: str | None = None
    source: str | None = None
    created_by: int | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True


class HackathonSubmissionCreate(BaseModel):
    title: str | None = None
    description: str | None = None
    repository_url: str | None = None
    demo_url: str | None = None
    presentation_url: str | None = None
    tech_stack: list[str] | None = None
    screenshots: list[str] | None = None
    documentation_url: str | None = None


class HackathonSubmissionResponse(BaseModel):
    id: int
    hackathon_id: int
    team_id: int
    submitted_by: int
    title: str | None = None
    description: str | None = None
    repository_url: str | None = None
    demo_url: str | None = None
    presentation_url: str | None = None
    tech_stack: list[Any] | None = None
    screenshots: list[Any] | None = None
    documentation_url: str | None = None
    status: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True


class HackathonAnnouncementCreate(BaseModel):
    title: str
    content: str | None = None


class HackathonAnnouncementResponse(BaseModel):
    id: int
    hackathon_id: int
    author_id: int
    title: str
    content: str | None = None
    created_at: datetime | None = None

    class Config:
        from_attributes = True
