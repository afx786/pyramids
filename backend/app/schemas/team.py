from pydantic import BaseModel
from datetime import datetime


class TeamCreate(BaseModel):
    name: str
    description: str
    purpose: str | None = None
    hackathon_id: int | None = None
    research_project_id: int | None = None
    visibility: str = "public"
    looking_for: list[str] | None = None


class TeamResponse(BaseModel):
    id: int
    public_id: str
    name: str
    description: str
    owner_id: int
    purpose: str | None = None
    hackathon_id: int | None = None
    research_project_id: int | None = None
    visibility: str | None = None
    looking_for: list[str] | None = None


class TeamMemberResponse(BaseModel):
    id: int
    name: str
    role: str
    builder_id: str | None = None


class TeamOwnerResponse(BaseModel):
    id: int
    name: str
    builder_id: str | None = None


class HackathonBrief(BaseModel):
    id: int
    title: str
    banner_url: str | None = None
    mode: str | None = None
    prize_pool: str | None = None
    display_prize: str | None = None
    numeric_prize: int | None = None
    start_date: str | None = None
    end_date: str | None = None
    team_size_min: int | None = None
    team_size_max: int | None = None


class ResearchProjectBrief(BaseModel):
    id: int
    title: str
    domain: str | None = None
    supervisor: str | None = None


class TeamActivityItem(BaseModel):
    id: int
    action: str
    actor_id: int | None = None
    target_id: int | None = None
    metadata: dict = {}
    created_at: datetime

    class Config:
        from_attributes = True


class TeamDetailResponse(BaseModel):
    id: int
    public_id: str
    name: str
    description: str
    purpose: str | None = None
    hackathon_id: int | None = None
    research_project_id: int | None = None
    visibility: str | None = None
    looking_for: list[str] | None = None
    hackathon: HackathonBrief | None = None
    research_project: ResearchProjectBrief | None = None
    owner: TeamOwnerResponse
    members: list[TeamMemberResponse]
    activities: list[TeamActivityItem] | None = None


class TransferOwnershipRequest(BaseModel):
    new_owner_id: int


class TeamMemberInviteRequest(BaseModel):
    user_id: int
    role: str = "Member"


class TeamMemberInviteByBuilderId(BaseModel):
    builder_id: str
    role: str = "Member"


class TeamMemberRoleUpdate(BaseModel):
    role: str


class TeamJoinByCode(BaseModel):
    invite_code: str
