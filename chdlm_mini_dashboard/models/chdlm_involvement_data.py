from enum import Enum
from typing import Annotated

from pydantic import Field, field_validator, model_validator
from pydantic_extra_types.pendulum_dt import Duration, DateTime
from typing_extensions import Self

from chdlm_mini_dashboard.models.common import CustomBaseModel, RootModelDict


class ExecutionTime(CustomBaseModel):
    spreadsheet_loading: Duration
    data_extraction: Duration

    @field_validator("*", mode="before")
    def transform(cls, v) -> str:
        assert isinstance(v, float), 'Input value must be a float'
        return f"PT{v}S"

class LogLevel(str, Enum):
    info = "info"
    warning = "warning"
    error = "error"

class LogEntry(CustomBaseModel):
    timestamp: DateTime
    message: str
    level: LogLevel

class Address(CustomBaseModel):
    civic_number: int
    unit_number: int

class MemberStatus(str, Enum):
    member = "Membre"
    probation = "Probation"
    non_member = "Non-membre"
    former = "Ancien"

class AccomplishedTask(CustomBaseModel):
    task_name: str
    hours_spent: float
    note: str

type Involvement = dict[int, dict[Annotated[int, Field(ge=1, le=12)], dict[str, list[AccomplishedTask]]]]

class Resident(CustomBaseModel):
    first_name: str
    last_name: str
    address: Address | None = None
    member_status: MemberStatus

    @model_validator(mode='after')
    def check_former_member_address(self) -> Self:
        if self.member_status == MemberStatus.former and self.address is not None:
            raise ValueError('Address must be null for former members')
        return self

class Member(Resident):
    involvement: Involvement

Residents = RootModelDict[Resident]
Members = RootModelDict[Member]

class ExtractedInvolvementData(CustomBaseModel):
    data: Members | None = None
    log: list[LogEntry]
    execution_time: ExecutionTime
