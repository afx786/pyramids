from pydantic import BaseModel, EmailStr, field_validator


class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone_number: str
    program: str | None = None
    joining_year: int | None = None
    graduating_year: int | None = None

    @field_validator('name')
    @classmethod
    def name_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

    @field_validator('phone_number')
    @classmethod
    def validate_phone_number(cls, v):
        if not v or not v.strip():
            raise ValueError('Phone number is required')
        stripped = v.strip()
        if len(stripped) < 4 or len(stripped) > 20:
            raise ValueError('Phone number must be between 4 and 20 characters')
        return stripped

    @field_validator('joining_year')
    @classmethod
    def validate_joining_year(cls, v):
        if v is not None and (v < 2020 or v > 2040):
            raise ValueError('Joining year must be between 2020 and 2040')
        return v

    @field_validator('graduating_year')
    @classmethod
    def validate_graduating_year(cls, v, info):
        if v is not None and (v < 2020 or v > 2040):
            raise ValueError('Graduating year must be between 2020 and 2040')
        joining = info.data.get('joining_year')
        if v is not None and joining is not None and v < joining:
            raise ValueError('Graduating year cannot be earlier than joining year')
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    public_id: str
    name: str
    email: str
    contact_email: str | None = None
    phone_number: str | None = None
    program: str | None = None
    joining_year: int | None = None
    graduating_year: int | None = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    bio: str | None = None
    joining_year: int | None = None
    graduating_year: int | None = None

    @field_validator('name')
    @classmethod
    def name_not_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip() if v else v

    @field_validator('joining_year')
    @classmethod
    def validate_joining_year(cls, v):
        if v is not None and (v < 2020 or v > 2040):
            raise ValueError('Joining year must be between 2020 and 2040')
        return v

    @field_validator('graduating_year')
    @classmethod
    def validate_graduating_year(cls, v, info):
        if v is not None and (v < 2020 or v > 2040):
            raise ValueError('Graduating year must be between 2020 and 2040')
        joining = info.data.get('joining_year')
        if v is not None and joining is not None and v < joining:
            raise ValueError('Graduating year cannot be earlier than joining year')
        return v