from pydantic import BaseModel
from datetime import datetime


class BookmarkCreate(BaseModel):
    item_type: str
    item_id: int


class BookmarkResponse(BaseModel):
    id: int
    user_id: int
    item_type: str
    item_id: int
    created_at: datetime

    class Config:
        from_attributes = True