from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.connection import Connection
from app.models.message import Message
from app.models.conversation_participant import ConversationParticipant
from app.models.notification import Notification
from app.models.project import Project
from app.models.project_skill import ProjectSkill
from app.models.skill import Skill
from app.models.user import User
from app.services.rank_service import get_user_rank


def get_dashboard(
    db: Session,
    user_id: int
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    rank_data = get_user_rank(
        db,
        user_id
    )

    connections_count = (
        db.query(Connection)
        .filter(
            or_(
                Connection.user_one_id == user_id,
                Connection.user_two_id == user_id
            )
        )
        .count()
    )

    projects = (
        db.query(Project)
        .filter(Project.owner_id == user_id)
        .order_by(Project.created_at.desc())
        .all()
    )

    unread_messages = (
        db.query(Message)
        .join(
            ConversationParticipant,
            ConversationParticipant.conversation_id == Message.conversation_id
        )
        .filter(
            ConversationParticipant.user_id == user_id,
            Message.sender_id != user_id,
            Message.is_read == False
        )
        .count()
    )

    notifications = (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .limit(10)
        .all()
    )

    skill_rows = (
        db.query(Skill.name)
        .join(ProjectSkill, ProjectSkill.skill_id == Skill.id)
        .join(Project, Project.id == ProjectSkill.project_id)
        .filter(Project.owner_id == user_id)
        .distinct()
        .all()
    )

    verified_skills = [
        row[0]
        for row in skill_rows
    ]

    repository_scores = [
        project.repository_score
        for project in projects
        if project.repository_score is not None
    ]

    repository_score = (
        max(repository_scores)
        if repository_scores
        else None
    )

    for project in projects:
        if project.verified_skills:
            for skill in project.verified_skills:
                if skill not in verified_skills:
                    verified_skills.append(skill)

    recent_activity = [
        {
            "type": "project",
            "title": project.title,
            "created_at": project.created_at
        }
        for project in projects[:5]
    ]

    recent_activity.extend([
        {
            "type": "notification",
            "title": notification.title,
            "created_at": notification.created_at
        }
        for notification in notifications[:5]
    ])

    recent_activity = sorted(
        recent_activity,
        key=lambda item: item["created_at"],
        reverse=True
    )[:10]

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "headline": user.headline,
            "rank": rank_data["rank"],
            "points": rank_data["points"]
        },
        "connections_count": connections_count,
        "projects_count": len(projects),
        "unread_messages": unread_messages,
        "notifications": notifications,
        "repository_score": repository_score,
        "verified_skills": verified_skills,
        "recent_activity": recent_activity
    }
