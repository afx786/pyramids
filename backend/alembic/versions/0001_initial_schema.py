"""initial_schema

Revision ID: 0001
Revises:
Create Date: 2026-07-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), unique=True, index=True, nullable=False),
        sa.Column("password_hash", sa.String(), nullable=False),
        sa.Column("handle", sa.String(), unique=True, index=True),
        sa.Column("bio", sa.String()),
        sa.Column("program", sa.String()),
        sa.Column("role", sa.String()),
        sa.Column("rank_points", sa.Integer(), server_default="0"),
        sa.Column("username", sa.String(), unique=True),
        sa.Column("headline", sa.String()),
        sa.Column("profile_picture", sa.String()),
        sa.Column("is_admin", sa.Boolean(), server_default="false", nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "skills",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("name", sa.String(100), unique=True, nullable=False),
        sa.Column("slug", sa.String(100), unique=True, nullable=False),
    )

    op.create_table(
        "technologies",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("name", sa.String(), unique=True, nullable=False),
        sa.Column("slug", sa.String(), unique=True, index=True, nullable=False),
        sa.Column("category", sa.String(), nullable=False),
        sa.Column("icon", sa.String()),
        sa.Column("website", sa.String()),
    )

    op.create_table(
        "opportunities",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("organizer", sa.String()),
        sa.Column("external_url", sa.String()),
        sa.Column("status", sa.String(), server_default="active"),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("domain", sa.String(100), nullable=False),
        sa.Column("visibility", sa.String(), server_default="public"),
        sa.Column("status", sa.String(), server_default="building"),
        sa.Column("is_verified", sa.String(), server_default="pending"),
        sa.Column("verified_at", sa.DateTime()),
        sa.Column("verified_by", sa.Integer(), sa.ForeignKey("users.id")),
        sa.Column("verification_notes", sa.Text()),
        sa.Column("github_url", sa.String()),
        sa.Column("repository_score", sa.Integer()),
        sa.Column("repository_analysis", sa.JSON()),
        sa.Column("verified_skills", sa.JSON()),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "teams",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.String()),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "hackathons",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.String()),
        sa.Column("organizer", sa.String(), nullable=False),
        sa.Column("mode", sa.String()),
        sa.Column("start_date", sa.DateTime()),
        sa.Column("end_date", sa.DateTime()),
        sa.Column("registration_deadline", sa.DateTime()),
        sa.Column("source", sa.String(), server_default="admin"),
        sa.Column("status", sa.String(), server_default="approved"),
        sa.Column("external_url", sa.String()),
        sa.Column("external_id", sa.String()),
        sa.Column("created_by", sa.Integer(), sa.ForeignKey("users.id")),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "conversations",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "research_projects",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("domain", sa.String(), nullable=False),
        sa.Column("research_type", sa.String(), nullable=False),
        sa.Column("skills_needed", sa.Text()),
        sa.Column("team_size", sa.Integer(), server_default="1"),
        sa.Column("status", sa.String(), server_default="open"),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("message", sa.String(), nullable=False),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("is_read", sa.Boolean(), server_default="false"),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "bookmarks",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("item_type", sa.String(), nullable=False),
        sa.Column("item_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "connections",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_one_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("user_two_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "connection_requests",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("sender_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("receiver_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", sa.String(), server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "project_skills",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id"), nullable=False),
        sa.Column("skill_id", sa.Integer(), sa.ForeignKey("skills.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "project_technologies",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id"), nullable=False),
        sa.Column("technology_id", sa.Integer(), sa.ForeignKey("technologies.id"), nullable=False),
    )

    op.create_table(
        "project_members",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("role", sa.String(), server_default="Member"),
        sa.Column("joined_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "project_invitations",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id"), nullable=False),
        sa.Column("invited_user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("invited_by_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", sa.String(), server_default="pending"),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("responded_at", sa.DateTime()),
    )

    op.create_table(
        "team_members",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("team_id", sa.Integer(), sa.ForeignKey("teams.id"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("role", sa.String(), server_default="Member"),
        sa.Column("joined_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "team_join_requests",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("team_id", sa.Integer(), sa.ForeignKey("teams.id"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", sa.String(), server_default="pending"),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "hackathon_teams",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("hackathon_id", sa.Integer(), sa.ForeignKey("hackathons.id")),
        sa.Column("team_id", sa.Integer(), sa.ForeignKey("teams.id")),
        sa.Column("registered_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "hackathon_invitations",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("hackathon_id", sa.Integer(), sa.ForeignKey("hackathons.id"), nullable=False),
        sa.Column("team_id", sa.Integer(), sa.ForeignKey("teams.id"), nullable=False),
        sa.Column("invited_user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("invited_by_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", sa.String(), server_default="pending"),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("responded_at", sa.DateTime()),
    )

    op.create_table(
        "conversation_participants",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("conversation_id", sa.Integer(), sa.ForeignKey("conversations.id"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("is_deleted", sa.Boolean(), server_default="false"),
        sa.Column("deleted_at", sa.DateTime()),
    )

    op.create_table(
        "messages",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("conversation_id", sa.Integer(), sa.ForeignKey("conversations.id"), nullable=False),
        sa.Column("sender_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("is_read", sa.Boolean(), server_default="false"),
        sa.Column("deleted_for_sender", sa.Boolean(), server_default="false"),
        sa.Column("deleted_for_receiver", sa.Boolean(), server_default="false"),
    )

    op.create_table(
        "research_members",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("research_id", sa.Integer(), sa.ForeignKey("research_projects.id"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("joined_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table(
        "research_join_requests",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("research_id", sa.Integer(), sa.ForeignKey("research_projects.id"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", sa.String(), server_default="pending"),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("research_join_requests")
    op.drop_table("research_members")
    op.drop_table("messages")
    op.drop_table("conversation_participants")
    op.drop_table("hackathon_invitations")
    op.drop_table("hackathon_teams")
    op.drop_table("team_join_requests")
    op.drop_table("team_members")
    op.drop_table("project_invitations")
    op.drop_table("project_members")
    op.drop_table("project_technologies")
    op.drop_table("project_skills")
    op.drop_table("connection_requests")
    op.drop_table("connections")
    op.drop_table("bookmarks")
    op.drop_table("notifications")
    op.drop_table("research_projects")
    op.drop_table("conversations")
    op.drop_table("hackathons")
    op.drop_table("teams")
    op.drop_table("projects")
    op.drop_table("opportunities")
    op.drop_table("technologies")
    op.drop_table("skills")
    op.drop_table("users")
