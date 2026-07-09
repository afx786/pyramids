from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.project_technology import ProjectTechnology
from app.database.base import Base
from sqlalchemy import Boolean
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    domain = Column(String(100), nullable=False)

    visibility = Column(String(20), default="public")
    status = Column(String(20), default="building")
    is_verified = Column(
        String,
        default="pending"
    )

    verified_at = Column(
        DateTime,
        nullable=True
    )

    verified_by = Column(
        Integer,
        ForeignKey("users.id"),
    nullable=True
    )

    verification_notes = Column(
        Text,
        nullable=True
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
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

    owner = relationship(
        "User",
        back_populates="projects",
        foreign_keys=[owner_id]
    )
    verified_by_user = relationship(
        "User",
        foreign_keys=[verified_by]
    )
    
    skills = relationship(
        "ProjectSkill",
         back_populates="project",
         cascade="all, delete-orphan"
    )
    technologies = relationship(
        "ProjectTechnology",
        back_populates="project",
        cascade="all, delete-orphan"
    )
    
    