from pydantic import BaseModel
from datetime import datetime

from app.schemas.notification import NotificationResponse


class DashboardUserSummary(BaseModel):
    id: int
    name: str
    username: str | None = None
    headline: str | None = None
    rank: str
    points: int


class DashboardRecentActivity(BaseModel):
    type: str
    title: str
    created_at: datetime | None = None


class DashboardResponse(BaseModel):
    user: DashboardUserSummary
    connections_count: int
    projects_count: int
    unread_messages: int
    notifications: list[NotificationResponse]
    repository_score: int | None
    verified_skills: list[str]
    recent_activity: list[DashboardRecentActivity]
