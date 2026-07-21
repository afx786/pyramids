from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Boolean, ForeignKey
)
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base import Base


class Hackathon(Base):
    __tablename__ = "hackathons"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    title = Column(String, nullable=False)
    description = Column(Text)
    theme = Column(String)
    banner_url = Column(String)
    organizer = Column(String, nullable=False)

    # Schedule
    registration_opens = Column(DateTime)
    registration_closes = Column(DateTime)
    start_date = Column(DateTime)
    end_date = Column(DateTime)

    # Mode & Location
    mode = Column(String)
    venue = Column(String)
    city = Column(String)
    country = Column(String)

    # Links
    official_website = Column(String)
    registration_link = Column(String)

    # Competition
    prize_pool = Column(String)
    team_size_min = Column(Integer, default=1)
    team_size_max = Column(Integer)
    eligibility = Column(Text)

    # Domains & Technologies
    domains = Column(JSON, default=list)
    technologies = Column(JSON, default=list)

    # Sponsors, Judges, Rules, FAQs
    sponsors = Column(JSON, default=list)
    judges = Column(JSON, default=list)
    rules = Column(Text)
    faqs = Column(JSON, default=list)
    contact_info = Column(String)

    # Status Workflow
    status = Column(String, default="draft")
    admin_feedback = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    source = Column(String, default="host")
    external_url = Column(String)
    external_id = Column(String)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    creator = relationship("User", back_populates="created_hackathons")
    teams = relationship("HackathonTeam", back_populates="hackathon", cascade="all, delete-orphan")
    submissions = relationship("HackathonSubmission", back_populates="hackathon", cascade="all, delete-orphan")
