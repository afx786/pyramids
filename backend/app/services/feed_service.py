from sqlalchemy import desc, asc

from app.models.project import Project
from app.models.research_project import ResearchProject
from app.models.hackathon import Hackathon


def get_feed(
    db,
    feed_type: str = "all",
    sort: str = "newest",
    limit: int = 20,
    offset: int = 0
):

    order = desc

    if sort == "oldest":
        order = asc

    # Placeholder until likes/views/bookmarks exist
    if sort == "trending":
        order = desc

    def project_query():
        return (
            db.query(Project)
            .order_by(order(Project.created_at))
            .offset(offset)
            .limit(limit)
            .all()
        )

    def research_query():
        return (
            db.query(ResearchProject)
            .order_by(order(ResearchProject.created_at))
            .offset(offset)
            .limit(limit)
            .all()
        )

    def hackathon_query():
        return (
            db.query(Hackathon)
            .order_by(order(Hackathon.created_at))
            .offset(offset)
            .limit(limit)
            .all()
        )

    if feed_type == "projects":
        return {
            "projects": project_query()
        }

    if feed_type == "research":
        return {
            "research": research_query()
        }

    if feed_type == "hackathons":
        return {
            "hackathons": hackathon_query()
        }

    return {
        "projects": project_query(),
        "research": research_query(),
        "hackathons": hackathon_query()
    }