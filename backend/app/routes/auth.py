from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.user import UserSignup, UserLogin, UserResponse
from app.services.auth_service import signup_user, login_user
from app.deps import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=UserResponse)
def signup(data: UserSignup, db: Session = Depends(get_db)):
    return signup_user(db, data.name, data.email, data.password, data.phone_number, data.program, data.joining_year, data.graduating_year)


@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    return login_user(db, data.email, data.password)