from fastapi import FastAPI

from app.routes.auth import router as auth_router
from app.routes.users import router as user_router

from app.models.user import User
from app.models.project import Project

from app.database.base import Base
from app.database.session import engine

from app.routes.projects import router as project_router
from app.models.skill import Skill
from app.models.project_skill import ProjectSkill

from app.routes.skills import router as skill_router
from app.models.team import Team
from app.models.team_member import TeamMember
from app.routes.ranks import router as rank_router
from app.routes.profile import router as profile_router
from app.routes.search import router as search_router
from app.models.opportunity import Opportunity
from app.routes.leaderboard import (
    router as leaderboard_router
)
from app.routes.project_search import (
    router as project_search_router
)

from app.routes.stats import (
    router as stats_router
)

from app.routes.skill_analytics import (
    router as skill_analytics_router
)

from app.routes.teams import (
    router as teams_router
)
from app.models.hackathon import Hackathon

from app.routes.hackathons import (
    router as hackathon_router
)

from app.models.hackathon_team import HackathonTeam
from app.routes.opportunities import (
    router as opportunity_router
)
from app.routes.feed import (
    router as feed_router
)
from app.models.research_project import ResearchProject
from app.routes.research import (
    router as research_router
)
from app.models.research_member import ResearchMember
from app.models.conversation import Conversation
from app.models.conversation_participant import ConversationParticipant
from app.models.message import Message
from app.routes.messages import (
    router as messages_router
)
from app.models.notification import Notification
from app.routes.notifications import (
    router as notifications_router
)
from app.models.bookmark import Bookmark
from app.routes.bookmarks import (
    router as bookmarks_router
)
from app.models.team_join_request import TeamJoinRequest
from app.models.research_join_request import ResearchJoinRequest


from app.routes.admin import (
    router as admin_router
)
from app.routes.technologies import (
    router as technology_router
)
from app.routes.github import (
    router as github_router
)
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(project_router)
app.include_router(skill_router)
app.include_router(rank_router)
app.include_router(profile_router)
app.include_router(search_router)
app.include_router(
    leaderboard_router
)
app.include_router(
    project_search_router
)

app.include_router(
    stats_router
)

app.include_router(
    skill_analytics_router
)

app.include_router(
    teams_router
)

app.include_router(
    hackathon_router
)

@app.get("/")
def root():
    return {"message": "Pyramids Backend Running"}

app.include_router(
    opportunity_router
)

app.include_router(
    feed_router
)

app.include_router(
    research_router
)
app.include_router(
    messages_router
)
app.include_router(
    notifications_router
)
app.include_router(
    bookmarks_router
)
app.include_router(
    admin_router
)
app.include_router(
    technology_router
)
app.include_router(
    github_router
)