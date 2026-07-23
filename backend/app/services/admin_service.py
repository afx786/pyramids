from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.user import User
from app.models.project import Project
from app.models.team import Team
from app.models.research_project import ResearchProject
from app.models.message import Message
from app.models.notification import Notification
from app.models.bookmark import Bookmark
from app.models.team_join_request import TeamJoinRequest
from app.models.research_join_request import ResearchJoinRequest

from app.services.leaderboard_service import (
    get_leaderboard
)

from app.services.skill_analytics_service import (
    get_top_skills
)


# =====================================================
# Dashboard
# =====================================================

def get_dashboard_stats(
    db: Session
):
    return {

        "total_users": (
            db.query(User)
            .count()
        ),

        "total_projects": (
            db.query(Project)
            .count()
        ),

        "total_teams": (
            db.query(Team)
            .count()
        ),

        "total_research_projects": (
            db.query(ResearchProject)
            .count()
        ),

        "total_messages": (
            db.query(Message)
            .count()
        ),

        "total_notifications": (
            db.query(Notification)
            .count()
        ),

        "total_bookmarks": (
            db.query(Bookmark)
            .count()
        )
    }


# =====================================================
# Analytics
# =====================================================

def get_platform_analytics(
    db: Session
):

    growth = {

        "users": (
            db.query(User)
            .count()
        ),

        "projects": (
            db.query(Project)
            .count()
        ),

        "teams": (
            db.query(Team)
            .count()
        ),

        "research_projects": (
            db.query(ResearchProject)
            .count()
        ),

    }

    top_skills = get_top_skills(db)

    leaderboard = get_leaderboard(db)

    return {

        "growth": growth,

        "top_skills": top_skills[:10],

        "leaderboard": leaderboard[:10]
    }


# =====================================================
# Dashboard Cards (for future frontend)
# =====================================================

def get_dashboard_cards(
    db: Session
):

    stats = get_dashboard_stats(db)

    return [

        {
            "title": "Users",
            "value": stats["total_users"]
        },

        {
            "title": "Projects",
            "value": stats["total_projects"]
        },

        {
            "title": "Teams",
            "value": stats["total_teams"]
        },

        {
            "title": "Research",
            "value": stats["total_research_projects"]
        },

        {
            "title": "Messages",
            "value": stats["total_messages"]
        }

    ]
    # =====================================================
# Pending Requests
# =====================================================

def get_pending_requests(
    db: Session
):

    team_requests = (
        db.query(TeamJoinRequest)
        .filter(
            TeamJoinRequest.status == "pending"
        )
        .all()
    )

    research_requests = (
        db.query(ResearchJoinRequest)
        .filter(
            ResearchJoinRequest.status == "pending"
        )
        .all()
    )

    return {

        "team_requests": team_requests,

        "research_requests": research_requests

    }


# =====================================================
# Platform Reports
# =====================================================

def get_platform_report(
    db: Session
):

    active_users = (
        db.query(User)
        .filter(
            User.rank_points > 0
        )
        .count()
    )

    inactive_users = (
        db.query(User)
        .filter(
            User.rank_points == 0
        )
        .count()
    )

    public_projects = (
        db.query(Project)
        .filter(
            Project.visibility == "public"
        )
        .count()
    )

    private_projects = (
        db.query(Project)
        .filter(
            Project.visibility == "private"
        )
        .count()
    )

    open_research_projects = (
        db.query(ResearchProject)
        .filter(
            ResearchProject.status == "open"
        )
        .count()
    )

    closed_research_projects = (
        db.query(ResearchProject)
        .filter(
            ResearchProject.status == "closed"
        )
        .count()
    )

    return {

        "active_users": active_users,

        "inactive_users": inactive_users,

        "public_projects": public_projects,

        "private_projects": private_projects,

        "open_research_projects": open_research_projects,

        "closed_research_projects": closed_research_projects,

    }


# =====================================================
# Platform Statistics
# =====================================================

def get_platform_statistics(
    db: Session
):

    return {

        "users": (
            db.query(User).count()
        ),

        "projects": (
            db.query(Project).count()
        ),

        "teams": (
            db.query(Team).count()
        ),

        "research_projects": (
            db.query(ResearchProject).count()
        ),

        "messages": (
            db.query(Message).count()
        ),

        "notifications": (
            db.query(Notification).count()
        ),

        "bookmarks": (
            db.query(Bookmark).count()
        ),

        "team_requests_pending": (
            db.query(TeamJoinRequest)
            .filter(
                TeamJoinRequest.status == "pending"
            )
            .count()
        ),

        "research_requests_pending": (
            db.query(ResearchJoinRequest)
            .filter(
                ResearchJoinRequest.status == "pending"
            )
            .count()
        )

    }


# =====================================================
# Quick Insights
# =====================================================

def get_quick_insights(
    db: Session
):

    stats = get_platform_statistics(db)

    return {

        "total_content": (
            stats["projects"]
            + stats["research_projects"]
        ),

        "total_collaboration_requests": (
            stats["team_requests_pending"]
            + stats["research_requests_pending"]
        ),

        "community_size": (
            stats["users"]
        )

    }
    # =====================================================
# Moderation
# =====================================================

def get_moderation_dashboard(
    db: Session
):

    recent_users = (
        db.query(User)
        .order_by(
            User.created_at.desc()
        )
        .limit(10)
        .all()
    )

    recent_projects = (
        db.query(Project)
        .order_by(
            Project.created_at.desc()
        )
        .limit(10)
        .all()
    )

    return {

        "recent_users": recent_users,

        "recent_projects": recent_projects

    }


# =====================================================
# Recent Activity
# =====================================================

def get_recent_activity(
    db: Session
):

    activities = []

    users = (
        db.query(User)
        .order_by(
            User.created_at.desc()
        )
        .limit(5)
        .all()
    )

    for user in users:

        activities.append({

            "type": "user",

            "title": f"{user.name} joined Pyramids",

            "time": user.created_at

        })

    projects = (
        db.query(Project)
        .order_by(
            Project.created_at.desc()
        )
        .limit(5)
        .all()
    )

    for project in projects:

        activities.append({

            "type": "project",

            "title": f"Project '{project.title}' created",

            "time": project.created_at

        })

    research_projects = (
        db.query(ResearchProject)
        .order_by(
            ResearchProject.created_at.desc()
        )
        .limit(5)
        .all()
    )

    for research in research_projects:

        activities.append({

            "type": "research",

            "title": f"Research '{research.title}' published",

            "time": research.created_at

        })

    activities.sort(
        key=lambda x: x["time"],
        reverse=True
    )

    return activities[:20]


# =====================================================
# Admin Overview
# =====================================================

def get_admin_overview(
    db: Session
):

    return {

        "dashboard": get_dashboard_stats(db),

        "analytics": get_platform_analytics(db),

        "pending": get_pending_requests(db),

        "reports": get_platform_report(db),

        "moderation": get_moderation_dashboard(db),

        "recent_activity": get_recent_activity(db)

    }


# =====================================================
# Helper APIs
# =====================================================

def get_recent_users(
    db: Session,
    limit: int = 10
):

    return (
        db.query(User)
        .order_by(
            User.created_at.desc()
        )
        .limit(limit)
        .all()
    )


def get_recent_projects(
    db: Session,
    limit: int = 10
):

    return (
        db.query(Project)
        .order_by(
            Project.created_at.desc()
        )
        .limit(limit)
        .all()
    )


def get_recent_notifications(
    db: Session,
    limit: int = 10
):

    return (
        db.query(Notification)
        .order_by(
            Notification.created_at.desc()
        )
        .limit(limit)
        .all()
    )