from sqlalchemy import (
    Column,
    Integer,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class ProjectTechnology(Base):
    __tablename__ = "project_technologies"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    technology_id = Column(
        Integer,
        ForeignKey("technologies.id"),
        nullable=False
    )

    project = relationship(
        "Project",
        back_populates="technologies"
    )

    technology = relationship(
        "Technology",
        back_populates="project_technologies"
    )