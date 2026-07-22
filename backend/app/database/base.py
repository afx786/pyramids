from sqlalchemy.orm import declarative_base

Base = declarative_base()
from app.models.connection_request import ConnectionRequest
from app.models.connection import Connection
from app.models.contact_request import ContactRequest