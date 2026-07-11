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

    class Config:
        from_attributes = True


class ConnectionResponse(BaseModel):

    id: int

    user: ConnectionUser

    connected_at: datetime