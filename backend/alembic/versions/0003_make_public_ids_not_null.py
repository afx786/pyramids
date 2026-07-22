"""make_public_ids_not_null

Revision ID: 0003
Revises: 0002
Create Date: 2026-07-22

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("users", "public_id", nullable=False)
    op.alter_column("projects", "public_id", nullable=False)
    op.alter_column("teams", "public_id", nullable=False)
    op.alter_column("hackathons", "public_id", nullable=False)
    op.alter_column("research_projects", "public_id", nullable=False)
    op.alter_column("organizations", "public_id", nullable=False)


def downgrade() -> None:
    op.alter_column("organizations", "public_id", nullable=True)
    op.alter_column("research_projects", "public_id", nullable=True)
    op.alter_column("hackathons", "public_id", nullable=True)
    op.alter_column("teams", "public_id", nullable=True)
    op.alter_column("projects", "public_id", nullable=True)
    op.alter_column("users", "public_id", nullable=True)
