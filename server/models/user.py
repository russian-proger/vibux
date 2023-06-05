from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from . import Base



class User(Base):
    __tablename__ = "user"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    nickname: Mapped[str] = mapped_column(String(30))
    password: Mapped[str] = mapped_column(String(128))
    
    def __init__(self, nickname: str = "", password: str = ""):
        self.nickname = nickname
        self.password = password