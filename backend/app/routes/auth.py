from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.user import UserSignup, UserLogin, UserResponse, BuilderIdCheck, BuilderIdCheckResponse
from app.services.auth_service import signup_user, login_user, check_builder_id_available
from app.deps import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=UserResponse)
def signup(data: UserSignup, db: Session = Depends(get_db)):
    return signup_user(db, data.name, data.email, data.password, data.phone_number, data.builder_id, data.program, data.joining_year, data.graduating_year)


@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    return login_user(db, data.email, data.password)


@router.post("/check-builder-id", response_model=BuilderIdCheckResponse)
def check_builder_id(data: BuilderIdCheck, db: Session = Depends(get_db)):
    available = check_builder_id_available(db, data.builder_id)
    return BuilderIdCheckResponse(available=available, builder_id=data.builder_id.strip().lower())