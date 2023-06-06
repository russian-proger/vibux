import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

username = os.environ.get('DB_USERNAME', 'vibux')
password = os.environ.get('DB_PASSWORD', '1234')
host = os.environ.get('DB_HOST', 'localhost')
port = os.environ.get('DB_PORT', '5432')
name = os.environ.get('DB_NAME', 'vibux')

engine = create_engine(f'postgresql://{username}:{password}@{host}:{port}/{name}')

from .conference import Conference
from .user import User
from .message import Message

Base.metadata.create_all(engine)