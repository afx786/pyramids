"""add approved_at to contact_requests, metadata to notifications

Revision ID: 0005
Revises: 0004
Create Date: 2026-07-23

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0005"
down_revision: Union[str, None] = "0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("contact_requests", sa.Column("approved_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("notifications", sa.Column("reference_data", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("notifications", "reference_data")
    op.drop_column("contact_requests", "approved_at")
