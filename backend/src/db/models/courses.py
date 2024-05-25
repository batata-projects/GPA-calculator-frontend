from typing import Optional

from pydantic import BaseModel

from backend.src.db.models.utils import UuidStr


class Course(BaseModel):
    id: Optional[UuidStr] = None
    username: Optional[str] = None


# TODO: Specify string kind, ie. create a util where the string has the type: COURSE_NAME COURSE NUMBER; example: EECE 230

course = Course()
