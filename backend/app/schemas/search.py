from pydantic import BaseModel


class UserSearchResponse(BaseModel):

    id: int

    name: str

    username: str | None = None

    profile_picture: str | None = None

    headline: str | None = None

    branch: str | None = None

    domain: str | None = None

    rank: str

    points: int