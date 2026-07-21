from pydantic import BaseModel
from datetime import datetime
from typing import Any


class OrganizationCreate(BaseModel):
    name: str
    description: str | None = None
    org_type: str | None = None
    logo_url: str | None = None
    website: str | None = None
    email: str | None = None
    location: str | None = None
    domains: list[str] | None = None
    social_links: list[dict[str, Any]] | None = None


class OrganizationUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    org_type: str | None = None
    logo_url: str | None = None
    website: str | None = None
    email: str | None = None
    location: str | None = None
    domains: list[str] | None = None
    social_links: list[dict[str, Any]] | None = None


class OrganizationResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    org_type: str | None = None
    logo_url: str | None = None
    website: str | None = None
    email: str | None = None
    location: str | None = None
    is_verified: bool | None = None
    domains: list[Any] | None = None
    social_links: list[Any] | None = None
    status: str | None = None
    owner_id: int
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True


class OrganizationMemberResponse(BaseModel):
    id: int
    organization_id: int
    user_id: int
    role: str | None = None
    joined_at: datetime | None = None

    class Config:
        from_attributes = True
