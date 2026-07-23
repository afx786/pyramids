from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.core.security import hash_password, verify_password
from app.core.auth import create_access_token
from app.services.id_service import generate_public_id


def signup_user(db: Session, name: str, email: str, password: str, phone_number: str, builder_id: str, program: str | None = None, joining_year: int | None = None, graduating_year: int | None = None):
    existing_email = db.query(User).filter(User.email == email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="An account with this email address already exists. Please log in instead.")

    existing_bid = db.query(User).filter(User.builder_id == builder_id).first()
    if existing_bid:
        raise HTTPException(status_code=400, detail="This Builder ID is already taken.")

    new_user = User(
        public_id=generate_public_id('USER', db=db, model=User),
        name=name,
        email=email,
        contact_email=email,
        phone_number=phone_number,
        builder_id=builder_id,
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


def check_builder_id_available(db: Session, builder_id: str):
    builder_id = builder_id.strip().lower()
    user = db.query(User).filter(User.builder_id == builder_id).first()
    return user is None


def search_by_builder_id(db: Session, builder_id: str, exact: bool = False):
    query = builder_id.strip().lower()
    users = db.query(User)
    if exact:
        users = users.filter(User.builder_id == query)
    else:
        users = users.filter(User.builder_id.ilike(f"{query}%"))
    return users.order_by(User.builder_id).limit(10).all()


def get_user_by_builder_id(db: Session, builder_id: str):
    return db.query(User).filter(User.builder_id == builder_id.strip().lower()).first()