from fastapi import FastAPI

from app.routes.auth import router as auth_router
from app.routes.users import router as user_router

from app.models.user import User
from app.models.project import Project

from app.database.base import Base
from app.database.session import engine

from app.routes.projects import router as project_router
from app.models.skill import Skill
from app.models.project_skill import ProjectSkill

from app.routes.skills import router as skill_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(project_router)
app.include_router(skill_router)

@app.get("/")
def root():
    return {"message": "Pyramids Backend Running"}