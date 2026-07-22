import json

from pydantic import BaseModel, field_validator
from datetime import datetime


class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    reference_data: dict | None = None
    is_read: bool
    created_at: datetime

    @field_validator("reference_data", mode="before")
    @classmethod
    def parse_reference_data(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return None
        return v

    class Config:
        from_attributes = True
