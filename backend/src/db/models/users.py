from typing import Optional

from pydantic import BaseModel

from backend.src.db.models.utils import EmailStr, UuidStr


class Users(BaseModel):
    id: Optional[UuidStr] = None
    username: str
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    credits: int
    grade: float
