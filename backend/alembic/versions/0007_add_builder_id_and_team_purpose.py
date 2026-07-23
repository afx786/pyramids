"""add builder_id to users, purpose/hackathon_id/research_project_id to teams

Revision ID: 0007
Revises: 0006_rename_whatsapp_to_phone
Create Date: 2026-07-24

"""

from alembic import op
import sqlalchemy as sa


revision = '0007'
down_revision = '0006_rename_whatsapp_to_phone'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('users', sa.Column('builder_id', sa.String(20), unique=True, nullable=True, index=True))
    op.add_column('teams', sa.Column('purpose', sa.String(), nullable=True))
    op.add_column('teams', sa.Column('hackathon_id', sa.Integer(), sa.ForeignKey('hackathons.id'), nullable=True))
    op.add_column('teams', sa.Column('research_project_id', sa.Integer(), sa.ForeignKey('research_projects.id'), nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'builder_id')
    op.drop_column('teams', 'purpose')
    op.drop_column('teams', 'hackathon_id')
    op.drop_column('teams', 'research_project_id')
