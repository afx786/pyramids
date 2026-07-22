"""add_public_ids

Revision ID: 0002
Revises: 0001
Create Date: 2026-07-22

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("public_id", sa.String(20), unique=True, index=True))
    op.add_column("projects", sa.Column("public_id", sa.String(20), unique=True, index=True))
    op.add_column("teams", sa.Column("public_id", sa.String(20), unique=True, index=True))
    op.add_column("hackathons", sa.Column("public_id", sa.String(20), unique=True, index=True))
    op.add_column("research_projects", sa.Column("public_id", sa.String(20), unique=True, index=True))
    op.add_column("organizations", sa.Column("public_id", sa.String(20), unique=True, index=True))


def downgrade() -> None:
    op.drop_column("organizations", "public_id")
    op.drop_column("research_projects", "public_id")
    op.drop_column("hackathons", "public_id")
    op.drop_column("teams", "public_id")
    op.drop_column("projects", "public_id")
    op.drop_column("users", "public_id")
