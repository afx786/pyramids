"""
Supported event types and their metadata payloads.

All actions must be referenced via TeamActivityType constants:
    from app.constants.team_activity import TeamActivityType

All TeamActivity records store event information using a generic schema:
  - action:       str  — the event type constant
  - actor_id:     int  — the user who performed the action (nullable)
  - target_id:    int  — the user affected by the action (nullable)
  - metadata:     dict — action-specific payload, never null (defaults to {})
  - team_id:      int  — the team this event belongs to
  - created_at:   datetime — when the event occurred

Adding a new event type requires no schema changes:
  1. Pick a unique action constant
  2. Call create_team_activity() with the appropriate metadata
  3. Add a frontend renderer in getActivityDescription()

------------------------------------------------------------------------------
team_created
    actor_id: creator
    metadata: { "team_name": str }

member_joined
    actor_id: who added the member (or the member themselves if self-join)
    target_id: the member who joined
    metadata: { } | { "builder_id": str }

member_left
    actor_id: the member who left
    metadata: { }

member_removed
    actor_id: who removed the member
    target_id: the member removed
    metadata: { "target_name": str }

join_request_sent
    actor_id: the requester
    target_id: the team owner
    metadata: { "team_name": str }

join_request_approved
    actor_id: who approved (the owner)
    target_id: the requester who was approved
    metadata: { "team_name": str } | { "team_name": str, "builder_id": str }

join_request_declined
    actor_id: who declined (the owner)
    target_id: the requester who was declined
    metadata: { "team_name": str }

visibility_changed
    actor_id: who changed visibility
    metadata: { "visibility": "public" | "private" }

team_full
    metadata: { "member_count": int, "max_members": int }

invite_sent*
    actor_id: who sent the invite
    target_id: who was invited
    metadata: { "team_name": str }

invite_accepted*
    actor_id: who accepted
    metadata: { "team_name": str }

invite_declined*
    actor_id: who declined
    metadata: { "team_name": str }

owner_transferred*
    actor_id: the new owner
    target_id: the old owner
    metadata: { "team_name": str }

research_attached*
    actor_id: who attached the project
    metadata: { "research_title": str }

hackathon_changed*
    actor_id: who changed the hackathon
    metadata: { "hackathon_title": str }

 * Not yet implemented — reserved for future use.
------------------------------------------------------------------------------
"""

from sqlalchemy.orm import Session

from app.models.team_activity import TeamActivity


def create_team_activity(
    db: Session,
    team_id: int,
    action: str,
    actor_id: int | None = None,
    target_id: int | None = None,
    metadata: dict | None = None,
) -> TeamActivity:
    activity = TeamActivity(
        team_id=team_id,
        actor_id=actor_id,
        target_id=target_id,
        action=action,
        metadata_json=metadata if metadata else {},
    )
    db.add(activity)
    return activity
