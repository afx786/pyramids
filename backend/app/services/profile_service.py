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
            "public_id": project.public_id,
            "title": project.title,
            "domain": project.domain,
            "status": project.status,
            "member_count": len(project.members)
        }
        for project in user.projects
    ]

    # -----------------------------
    # Research
    # -----------------------------

    research = [
        {
            "id": research.id,
            "public_id": research.public_id,
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
                "public_id": membership.team.public_id,
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
            "public_id": hackathon.public_id,
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
            "public_id": user.public_id,
            "name": user.name,
            "email": user.email,
            "handle": user.handle,
            "bio": user.bio,
            "program": user.program,
            "role": user.role,
            "joining_year": user.joining_year,
            "graduating_year": user.graduating_year,
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