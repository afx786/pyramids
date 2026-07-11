from pydantic import BaseModel, EmailStr


class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    program: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    program: str | None = None

    class Config:
        from_attributes = True