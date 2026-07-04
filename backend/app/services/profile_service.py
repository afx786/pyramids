from sqlalchemy.orm import Session

from app.models.user import User
from app.models.team_member import TeamMember
from app.models.research_member import ResearchMember
from app.models.bookmark import Bookmark
from app.models.hackathon import Hackathon

from app.services.rank_service import get_user_rank


def get_user_profile(
    db: Session,
    user_id: int
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        return None

    # -----------------------------
    # Skills
    # -----------------------------

    skills = set()

    for project in user.projects:
        for project_skill in project.skills:
            skills.add(
                project_skill.skill.name
            )

    # -----------------------------
    # Rank
    # -----------------------------

    rank_data = get_user_rank(
        db,
        user_id
    )

    # -----------------------------
    # Projects
    # -----------------------------

    projects = [
        {
            "id": project.id,
            "title": project.title,
            "domain": project.domain,
            "status": project.status
        }
        for project in user.projects
    ]

    # -----------------------------
    # Research
    # -----------------------------

    research = [
        {
            "id": research.id,
            "title": research.title,
            "domain": research.domain,
            "status": research.status
        }
        for research in user.research_projects
    ]

    # -----------------------------
    # Teams
    # -----------------------------

    team_memberships = (
        db.query(TeamMember)
        .filter(
            TeamMember.user_id == user.id
        )
        .all()
    )

    teams = []

    for membership in team_memberships:
        if membership.team:
            teams.append({
                "id": membership.team.id,
                "name": membership.team.name,
                "role": membership.role
            })

    # -----------------------------
    # Hackathons
    # -----------------------------

    hackathons = (
        db.query(Hackathon)
        .filter(
            Hackathon.created_by == user.id
        )
        .all()
    )

    hackathon_data = [
        {
            "id": hackathon.id,
            "title": hackathon.title,
            "status": hackathon.status
        }
        for hackathon in hackathons
    ]

    # -----------------------------
    # Statistics
    # -----------------------------

    statistics = {
        "projects": len(projects),
        "research": len(research),
        "teams": len(teams),
        "hackathons": len(hackathon_data),
        "skills": len(skills),
        "bookmarks": (
            db.query(Bookmark)
            .filter(
                Bookmark.user_id == user.id
            )
            .count()
        )
    }

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "handle": user.handle,
            "bio": user.bio,
            "program": user.program,
            "role": user.role,
            "created_at": user.created_at
        },

        "rank": {
            "rank": rank_data["rank"],
            "points": rank_data["points"]
        },

        "skills": sorted(list(skills)),

        "projects": projects,

        "research": research,

        "teams": teams,

        "hackathons": hackathon_data,

        "statistics": statistics
    }