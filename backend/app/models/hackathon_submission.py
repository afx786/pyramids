from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey
)
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base import Base


class HackathonSubmission(Base):
    __tablename__ = "hackathon_submissions"

    id = Column(Integer, primary_key=True, index=True)

    hackathon_id = Column(Integer, ForeignKey("hackathons.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    submitted_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Submission Content
    title = Column(String)
    description = Column(Text)
    repository_url = Column(String)
    demo_url = Column(String)
    presentation_url = Column(String)
    tech_stack = Column(JSON, default=list)
    screenshots = Column(JSON, default=list)
    documentation_url = Column(String)

    # Status
    status = Column(String, default="submitted")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hackathon = relationship("Hackathon", back_populates="submissions")
    team = relationship("Team")
    submitter = relationship("User", foreign_keys=[submitted_by])
