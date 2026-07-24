"""
Centralized constants for TeamActivity event types.

Every activity action in the system must use these constants.
No raw string values should appear outside this module.

Usage:
    from app.constants.team_activity import TeamActivityType

    create_team_activity(
        team_id=team.id,
        action=TeamActivityType.MEMBER_JOINED,
        actor_id=current_user_id,
        target_id=user_id,
        metadata={"builder_id": user.builder_id} if user.builder_id else {},
    )

Adding a new event type:
    1. Add a new constant here.
    2. Emit the event using create_team_activity().
    3. Add a frontend renderer in getActivityDescription() / getActivityIcon().
    No schema changes required.
"""


class TeamActivityType:
    """All supported team activity event types."""

    TEAM_CREATED = "team_created"
    MEMBER_JOINED = "member_joined"
    MEMBER_LEFT = "member_left"
    MEMBER_REMOVED = "member_removed"
    JOIN_REQUEST_SENT = "join_request_sent"
    JOIN_REQUEST_APPROVED = "join_request_approved"
    JOIN_REQUEST_DECLINED = "join_request_declined"
    TEAM_FULL = "team_full"
    VISIBILITY_CHANGED = "visibility_changed"
    INVITE_SENT = "invite_sent"
    INVITE_ACCEPTED = "invite_accepted"
    INVITE_DECLINED = "invite_declined"
    OWNER_TRANSFERRED = "owner_transferred"
    RESEARCH_ATTACHED = "research_attached"
    HACKATHON_CHANGED = "hackathon_changed"
