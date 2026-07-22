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
    created_at: datetime

    class Config:
        from_attributes = True
        


from datetime import datetime


class ConversationUser(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class ConversationListResponse(BaseModel):
    conversation_id: int

    other_user: ConversationUser

    last_message: str | None

    last_message_time: datetime | None

    unread_count: int