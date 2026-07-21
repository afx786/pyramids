from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base import Base


class ResearchMilestone(Base):
    __tablename__ = "research_milestones"

    id = Column(Integer, primary_key=True, index=True)

    research_id = Column(Integer, ForeignKey("research_projects.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    due_date = Column(DateTime, nullable=True)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    research = relationship("ResearchProject", back_populates="milestones")
