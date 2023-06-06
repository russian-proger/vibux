from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from . import Base



class Conference(Base):
    __tablename__ = "conference"
    
    id: Mapped[int] = mapped_column(primary_key=True)

    def __init__(self):
        pass