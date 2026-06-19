from pydantic import BaseModel


class FeedItemResponse(BaseModel):
    type: str

    id: int

    title: str

    organizer: str