from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base import Base


class HackathonAnnouncement(Base):
    __tablename__ = "hackathon_announcements"

    id = Column(Integer, primary_key=True, index=True)

    hackathon_id = Column(Integer, ForeignKey("hackathons.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    hackathon = relationship("Hackathon")
    author = relationship("User")
