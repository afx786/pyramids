from pydantic import BaseModel
from datetime import datetime


class ConversationCreate(BaseModel):
    user_id: int


class ConversationResponse(BaseModel):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    conversation_id: int
    content: str


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    content: str

    class Config:
        from_attributes = True
        
class ConversationListResponse(BaseModel):
    conversation_id: int
    participant_ids: list[int]