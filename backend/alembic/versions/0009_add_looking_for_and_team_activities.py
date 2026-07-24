"""add looking_for to teams, create team_activities table

Revision ID: 0009
Revises: 0008_add_team_visibility
Create Date: 2026-07-24

"""

from alembic import op
import sqlalchemy as sa


revision = '0009'
down_revision = '0008_add_team_visibility'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('teams', sa.Column('looking_for', sa.Text(), nullable=True))
    op.create_table(
        'team_activities',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('team_id', sa.Integer(), sa.ForeignKey('teams.id'), nullable=False),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('action', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('metadata_json', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('team_activities')
    op.drop_column('teams', 'looking_for')
