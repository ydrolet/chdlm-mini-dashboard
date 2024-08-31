from dataclasses import dataclass
from enum import Enum

from pydantic import field_validator, model_validator, EmailStr
from pydantic_extra_types.pendulum_dt import Duration, DateTime
from typing_extensions import Self

from chdlm_mini_dashboard.helpers.utils import get_month_name
from chdlm_mini_dashboard.models.common import CustomBaseModel, RootModelStrDict, RootModelIntDict


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


class CommitteeInvolvement(RootModelStrDict[list[AccomplishedTask]]):
    @property
    def total_involvement_hours(self) -> dict[str, float]:
        return {committee_name: sum(task.hours_spent for task in tasks)
                for committee_name, tasks in self.root.items()}


class MonthlyInvolvement(RootModelIntDict[CommitteeInvolvement]):
    @property
    def total_involvement_hours(self) -> dict[int, float]:
        return {
            month: sum(committee_hours for committee_hours in committee_involvement.total_involvement_hours.values())
            for month, committee_involvement in self.root.items()}


class YearlyInvolvement(RootModelIntDict[MonthlyInvolvement]):
    @property
    def total_involvement_hours(self) -> dict[int, float]:
        return {year: sum(month_hours for month_hours in monthly_involvement.total_involvement_hours.values())
                for year, monthly_involvement in self.root.items()}


class Resident(CustomBaseModel):
    first_name: str
    last_name: str
    address: Address | None = None
    member_status: MemberStatus
    email_address: EmailStr

    @model_validator(mode='after')
    def check_former_member_address(self) -> Self:
        if self.member_status == MemberStatus.former and self.address is not None:
            raise ValueError('Address must be null for former members')
        return self

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"


class Member(Resident):
    involvement: YearlyInvolvement


Residents = RootModelStrDict[Resident]
Members = RootModelStrDict[Member]


class ExtractedInvolvementData(CustomBaseModel):
    data: Members | None = None
    log: list[LogEntry]
    execution_time: ExecutionTime


@dataclass
class Period:
    year: int
    month: int

    @property
    def month_name(self) -> str:
        return f"{get_month_name(int(self.month))} {self.year}"
