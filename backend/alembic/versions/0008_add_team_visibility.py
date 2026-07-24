"""add visibility column to teams

Revision ID: 0008
Revises: 0007_add_builder_id_and_team_purpose
Create Date: 2026-07-24

"""

from alembic import op
import sqlalchemy as sa


revision = '0008'
down_revision = '0007_add_builder_id_and_team_purpose'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('teams', sa.Column('visibility', sa.String(), server_default='public', nullable=True))


def downgrade() -> None:
    op.drop_column('teams', 'visibility')
