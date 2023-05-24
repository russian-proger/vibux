from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

engine = create_engine("postgresql://vibux:1234@localhost:5432/vibux")

Base.metadata.create_all(engine)