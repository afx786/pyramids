from pydantic import BaseModel
from datetime import datetime


class ContactRequestCreate(BaseModel):
    target_id: int


class ContactRequestResponse(BaseModel):
    id: int
    requester_id: int
    target_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ContactInfoResponse(BaseModel):
    contact_email: str | None = None
    whatsapp_number: str | None = None


class ContactInfoUpdate(BaseModel):
    contact_email: str | None = None
    whatsapp_number: str | None = None
