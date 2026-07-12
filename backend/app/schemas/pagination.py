from pydantic import BaseModel


class PaginationMeta(BaseModel):
    total: int
    limit: int
    offset: int
    sort: str


class PaginatedResponse(BaseModel):
    items: list
    meta: PaginationMeta
