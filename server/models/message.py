from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from . import Base



class Message(Base):
    __tablename__ = "message"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    conference: Mapped[str] = mapped_column(String(30))
    text: Mapped[str] = mapped_column(String(128))
    
    def __init__(self, conference: str = "", text: str = ""):
        self.conference = conference
        self.text = text