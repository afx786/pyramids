from sqlalchemy import (
    Column,
    Integer,
    String
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class Technology(Base):
    __tablename__ = "technologies"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        unique=True,
        nullable=False
    )

    slug = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    category = Column(
        String,
        nullable=False
    )

    icon = Column(
        String,
        nullable=True
    )

    website = Column(
        String,
        nullable=True
    )

    project_technologies = relationship(
        "ProjectTechnology",
        back_populates="technology",
        cascade="all, delete-orphan"
    )