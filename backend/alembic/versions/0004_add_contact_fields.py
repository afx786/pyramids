"""add contact fields and contact_request model

Revision ID: 0004
Revises: 0003
Create Date: 2026-07-23

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("contact_email", sa.String(), nullable=True))
    op.add_column("users", sa.Column("whatsapp_number", sa.String(), nullable=True))

    op.create_table(
        "contact_requests",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("requester_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("target_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", sa.String(), default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("contact_requests")
    op.drop_column("users", "whatsapp_number")
    op.drop_column("users", "contact_email")
