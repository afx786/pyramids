from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.core.security import hash_password, verify_password
from app.core.auth import create_access_token
from app.services.id_service import generate_public_id


def signup_user(db: Session, name: str, email: str, password: str, phone_number: str, program: str | None = None, joining_year: int | None = None, graduating_year: int | None = None):
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="An account with this email address already exists. Please log in instead.")

    new_user = User(
        public_id=generate_public_id('USER', db=db, model=User),
        name=name,
        email=email,
        contact_email=email,
        whatsapp_number=phone_number,
        password_hash=hash_password(password),
        program=program,
        joining_year=joining_year,
        graduating_year=graduating_year
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": user.id})

    return {
        "access_token": token,
        "token_type": "bearer"
    }