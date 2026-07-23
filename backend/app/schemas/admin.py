from pydantic import BaseModel
from datetime import datetime



class DashboardStats(BaseModel):
    total_users: int
    total_projects: int
    total_teams: int
    total_research_projects: int
    total_messages: int
    total_notifications: int
    total_bookmarks: int




class GrowthAnalytics(BaseModel):
    users: int
    projects: int
    teams: int
    research_projects: int


class SkillAnalytics(BaseModel):
    skill: str
    projects: int


class LeaderboardUser(BaseModel):
    id: int
    name: str
    points: int
    rank: str


class AnalyticsResponse(BaseModel):
    growth: GrowthAnalytics
    top_skills: list[SkillAnalytics]
    leaderboard: list[LeaderboardUser]




class PendingTeamRequest(BaseModel):
    id: int
    team_id: int
    user_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class PendingResearchRequest(BaseModel):
    id: int
    research_id: int
    user_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class PendingResponse(BaseModel):
    team_requests: list[PendingTeamRequest]
    research_requests: list[PendingResearchRequest]



class PlatformReport(BaseModel):
    active_users: int
    inactive_users: int

    public_projects: int
    private_projects: int

    open_research_projects: int
    closed_research_projects: int





class RecentUser(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class RecentProject(BaseModel):
    id: int
    title: str
    status: str

    class Config:
        from_attributes = True


class ModerationResponse(BaseModel):
    recent_users: list[RecentUser]
    recent_projects: list[RecentProject]