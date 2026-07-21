from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Boolean, ForeignKey
)
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base import Base


class ResearchProject(Base):
    __tablename__ = "research_projects"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    abstract = Column(Text)
    problem_statement = Column(Text)
    description = Column(Text, nullable=False)

    # Type
    research_type = Column(String, nullable=False)

    # Domain & Skills
    domain = Column(String, nullable=False)
    research_domain = Column(String)
    skills_needed = Column(Text)
    required_roles = Column(JSON, default=list)

    # Expected Outcomes
    expected_outcomes = Column(Text)
    methodology = Column(Text)

    # Resources
    datasets = Column(Text)
    resources = Column(Text)
    repository_url = Column(String)
    paper_link = Column(String)

    # Funding & Institution
    funding = Column(String)
    supervisor = Column(String)
    institution = Column(String)
    publication_goal = Column(String)

    # Logistics
    duration = Column(String)
    mode = Column(String, default="remote")
    open_positions = Column(Integer, default=1)
    difficulty = Column(String)
    application_deadline = Column(DateTime, nullable=True)
    team_size = Column(Integer, default=1)

    # Status
    status = Column(String, default="draft")

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="research_projects")
    members = relationship("ResearchMember", back_populates="research", cascade="all, delete-orphan")
    join_requests = relationship("ResearchJoinRequest", cascade="all, delete-orphan")
    milestones = relationship("ResearchMilestone", back_populates="research", cascade="all, delete-orphan")
    updates = relationship("ResearchUpdate", back_populates="research", cascade="all, delete-orphan")
