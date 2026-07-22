from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.base import Base
from sqlalchemy import Boolean

class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    public_id = Column(
        String(20),
        unique=True,
        nullable=False,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )

    handle = Column(
        String,
        unique=True,
        index=True
    )

    bio = Column(
        String
    )

    program = Column(
        String
    )

    role = Column(
        String
    )

    rank_points = Column(
        Integer,
        default=0
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # -----------------------------
    # Projects
    # -----------------------------
    projects = relationship(
        "Project",
        back_populates="owner",
        cascade="all, delete-orphan",
        foreign_keys="Project.owner_id"
    )   

    # -----------------------------
    # Teams Owned
    # -----------------------------
    owned_teams = relationship(
        "Team",
        back_populates="owner"
    )

    # -----------------------------
    # Team Memberships
    # -----------------------------
    team_memberships = relationship(
        "TeamMember",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    project_memberships = relationship(
        "ProjectMember",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    # -----------------------------
    # Research Owned
    # -----------------------------
    research_projects = relationship(
        "ResearchProject"
    )

    # -----------------------------
    # Research Memberships
    # -----------------------------
    research_memberships = relationship(
        "ResearchMember",
        cascade="all, delete-orphan"
    )

    # -----------------------------
    # Bookmarks
    # -----------------------------
    bookmarks = relationship(
        "Bookmark",
        cascade="all, delete-orphan"
    )

    # -----------------------------
    # Notifications
    # -----------------------------
    notifications = relationship(
        "Notification",
        cascade="all, delete-orphan"
    )

    # -----------------------------
    # Messages
    # -----------------------------
    messages = relationship(
        "Message"
    )

    # -----------------------------
    # Contact Info
    # -----------------------------
    contact_email = Column(
        String,
        nullable=True
    )

    whatsapp_number = Column(
        String,
        nullable=True
    )

    username = Column(
        String,
        unique=True,
        nullable=True
    )

    headline = Column(
        String,
        nullable=True
    )

    profile_picture = Column(
        String,
        nullable=True
    )

    # -----------------------------
    # Hackathons Created
    # -----------------------------
    created_hackathons = relationship(
        "Hackathon"
    )
    joining_year = Column(
        Integer,
        nullable=True
    )

    graduating_year = Column(
        Integer,
        nullable=True
    )

    is_admin = Column(
    Boolean,
    default=False,
    nullable=False
)
