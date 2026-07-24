"""Convert team_activity metadata_json from Text to JSONB

Revision ID: 0011
Revises: 0010
Create Date: 2026-07-24

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


revision: str = "0011"
down_revision: Union[str, None] = "0010"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()

    # 1. Set null values to empty JSON object (column is still TEXT at this point)
    bind.execute(
        sa.text(
            "UPDATE team_activities SET metadata_json = '{}' "
            "WHERE metadata_json IS NULL OR metadata_json = ''"
        )
    )

    # 2. Alter column type from TEXT to JSONB using ::jsonb cast
    op.alter_column(
        "team_activities",
        "metadata_json",
        type_=JSONB,
        nullable=False,
        server_default=sa.text("'{}'::jsonb"),
        postgresql_using="metadata_json::jsonb",
    )


def downgrade() -> None:
    # Convert JSONB back to serialized JSON text
    op.alter_column(
        "team_activities",
        "metadata_json",
        type_=sa.Text,
        nullable=True,
        server_default=None,
        postgresql_using="metadata_json::text",
    )
