from pydantic_extra_types.pendulum_dt import DateTime

from server.models.common import CustomBaseModel


class Info(CustomBaseModel):
    min_preceding_months: int
    max_preceding_months: int
    latest_extraction: DateTime
