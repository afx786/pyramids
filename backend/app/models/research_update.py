from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base import Base


class ResearchUpdate(Base):
    __tablename__ = "research_updates"

    id = Column(Integer, primary_key=True, index=True)

    research_id = Column(Integer, ForeignKey("research_projects.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    research = relationship("ResearchProject", back_populates="updates")
    author = relationship("User")
