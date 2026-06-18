from pydantic import BaseModel
from datetime import datetime


class OpportunityCreate(BaseModel):
    title: str
    description: str

    type: str

    organizer: str
    external_url: str


class OpportunityResponse(BaseModel):
    id: int

    title: str
    description: str

    type: str

    organizer: str
    external_url: str

    status: str

    class Config:
        from_attributes = True