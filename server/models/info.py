from server.models.common import CustomBaseModel


class Info(CustomBaseModel):
    min_preceding_months: int
    max_preceding_months: int
