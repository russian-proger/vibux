import datetime

from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from . import Base



class Conference(Base):
    __tablename__ = "conference"
    
    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime)

    def __init__(self):
        self.created_at = datetime.datetime.now()