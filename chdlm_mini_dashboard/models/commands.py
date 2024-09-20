from typing import Annotated

from pydantic import Field, EmailStr

from chdlm_mini_dashboard.models.common import CustomBaseModel


class SendEmail(CustomBaseModel):
    resident_name: str
    preceding_months: Annotated[int, Field(ge=3, le=36)]


class SendEmailResponse(SendEmail):
    masked_email_address: EmailStr
