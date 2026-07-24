"""Add prize normalization and team activity refactor

Revision ID: 0010
Revises: 0009
Create Date: 2026-07-24

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0010"
down_revision: Union[str, None] = "0009"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add prize columns to hackathons
    op.add_column("hackathons", sa.Column("display_prize", sa.String(), nullable=True))
    op.add_column("hackathons", sa.Column("numeric_prize", sa.Integer(), nullable=True))

    # Refactor team_activities: drop description, drop old user_id FK, add actor_id + target_id
    op.drop_column("team_activities", "description")
    op.drop_constraint("team_activities_user_id_fkey", "team_activities", type_="foreignkey")
    op.drop_column("team_activities", "user_id")
    op.add_column("team_activities", sa.Column("actor_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True))
    op.add_column("team_activities", sa.Column("target_id", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("hackathons", "numeric_prize")
    op.drop_column("hackathons", "display_prize")

    op.drop_column("team_activities", "target_id")
    op.drop_column("team_activities", "actor_id")
    op.add_column("team_activities", sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True))
    op.create_foreign_key("team_activities_user_id_fkey", "team_activities", "users", ["user_id"], ["id"])
    op.add_column("team_activities", sa.Column("description", sa.String(), nullable=False, server_default=""))
    op.alter_column("team_activities", "description", server_default=None)
