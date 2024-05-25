from typing import Optional

from pydantic import BaseModel

from backend.src.db.models.utils import UuidStr


class Term(BaseModel):
    id: Optional[UuidStr] = None
    # TODO: Specify term kind, ie. create a util where the string has the type: TERM_NAME TERM YEARS; example: Fall 2022 - 2023
    name: str
