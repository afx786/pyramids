from sqlalchemy import Column, Integer, String
from app.database.base import Base
from sqlalchemy.orm import relationship

class Skill(Base):
    __tablename__ = "skills"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        unique=True,
        nullable=False
    )

    slug = Column(
        String(100),
        unique=True,
        nullable=False
    )
    
    project_skills = relationship(
        "ProjectSkill",
        back_populates="skill"
    )