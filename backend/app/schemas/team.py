from pydantic import BaseModel


class TeamCreate(BaseModel):
    name: str
    description: str


class TeamResponse(BaseModel):
    id: int
    name: str
    description: str
    owner_id: int
    
class TeamMemberResponse(BaseModel):
    id: int
    name: str
    role: str


class TeamOwnerResponse(BaseModel):
    id: int
    name: str


class TeamDetailResponse(BaseModel):
    id: int
    name: str
    description: str

    owner: TeamOwnerResponse

    members: list[TeamMemberResponse]
    
class TransferOwnershipRequest(BaseModel):
    new_owner_id: int