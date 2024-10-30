from typing import Annotated

from pydantic import Field, EmailStr

from server.models.common import CustomBaseModel
from server.settings import settings


class SendInvolvementSummaryEmail(CustomBaseModel):
    member_full_name: str
    preceding_months: Annotated[int, Field(ge=settings.min_preceding_months, le=settings.max_preceding_months)]


class SendInvolvementSummaryEmailResult(SendInvolvementSummaryEmail):
    masked_email_address: EmailStr