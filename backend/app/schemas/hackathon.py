from pydantic import BaseModel
from datetime import datetime


class HackathonCreate(BaseModel):
    title: str
    description: str
    organizer: str

    mode: str

    start_date: datetime
    end_date: datetime
    registration_deadline: datetime

    external_url: str | None = None


class HackathonResponse(BaseModel):
    id: int
    title: str
    description: str
    organizer: str
    mode: str

    start_date: datetime
    end_date: datetime
    registration_deadline: datetime

    class Config:
        from_attributes = True
        
class HackathonSubmission(BaseModel):
    title: str
    description: str
    organizer: str

    external_url: str

    mode: str

    start_date: datetime
    end_date: datetime
    registration_deadline: datetime