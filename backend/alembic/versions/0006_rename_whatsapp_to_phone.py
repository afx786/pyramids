"""rename whatsapp_number to phone_number in users table

Revision ID: 0006
Revises: 0005
Create Date: 2026-07-23

"""
from typing import Sequence, Union

from alembic import op


revision: str = "0006"
down_revision: Union[str, None] = "0005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("users", "whatsapp_number", new_column_name="phone_number")


def downgrade() -> None:
    op.alter_column("users", "phone_number", new_column_name="whatsapp_number")
