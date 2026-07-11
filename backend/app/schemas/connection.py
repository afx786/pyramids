from pydantic import BaseModel
from datetime import datetime


class ConnectionRequestCreate(BaseModel):
    receiver_id: int


class ConnectionRequestResponse(BaseModel):

    id: int

    sender_id: int

    receiver_id: int

    status: str

    created_at: datetime

    class Config:
        from_attributes = True


class ConnectionUser(BaseModel):

    id: int

    name: str

    username: str | None = None

    profile_picture: str | None = None

    headline: str | None = None

    class Config:
        from_attributes = True


class ConnectionResponse(BaseModel):

    id: int

    user: ConnectionUser

    connected_at: datetime

    class Config:
        from_attributes = True


class ConnectionRequestWithSenderResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    status: str
    created_at: datetime
    sender: ConnectionUser | None = None

    class Config:
        from_attributes = True


class ConnectionRequestWithReceiverResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    status: str
    created_at: datetime
    receiver: ConnectionUser | None = None

    class Config:
        from_attributes = True