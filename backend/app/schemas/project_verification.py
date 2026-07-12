from typing import Literal
from pydantic import BaseModel


class ProjectVerificationRequest(BaseModel):
    status: Literal[
        "pending",
        "verified",
        "rejected"
    ]

    notes: str | None = None


class ProjectRepositoryVerificationRequest(BaseModel):
    github_url: str
