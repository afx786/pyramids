import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

os.environ["DATABASE_URL"] = "sqlite:///./test_pyramids.db"
os.environ["SECRET_KEY"] = "test-secret-key"

from app.database.base import Base
from app.database.session import SessionLocal, engine
from app.main import app
from app.deps import get_db


@pytest.fixture(scope="session")
def test_engine():
    engine = create_engine(
        "sqlite:///./test_pyramids.db",
        connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    engine.dispose()
    Base.metadata.drop_all(bind=engine)
    try:
        os.remove("./test_pyramids.db")
    except PermissionError:
        pass


@pytest.fixture(scope="function")
def db_session(test_engine):
    connection = test_engine.connect()
    transaction = connection.begin()
    TestSession = sessionmaker(bind=connection)
    session = TestSession()
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
