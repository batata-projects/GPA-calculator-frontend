import uuid
from typing import Annotated, Optional

from email_validator import EmailNotValidError, validate_email
from pydantic.functional_validators import BeforeValidator


def validate_uuid(v: Optional[str] = None) -> Optional[str]:
    if not v:
        return None
    try:
        uuid.UUID(v)
    except ValueError:
        raise ValueError(f"{v} is an invalid UUID")
    return v


def validate_email_str(v: Optional[str] = None) -> Optional[str]:
    if not v:
        return None
    try:
        if validate_email(v, check_deliverability=False).domain not in [
            "mail.aub.edu",
            "aub.edu.lb",
        ]:
            raise EmailNotValidError
    except EmailNotValidError:
        raise ValueError(f"{v} is an invalid email")
    return v


UuidStr = Annotated[str, BeforeValidator(validate_uuid)]
EmailStr = Annotated[str, BeforeValidator(validate_email_str)]
