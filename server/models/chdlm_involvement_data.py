from dataclasses import dataclass
from enum import Enum

import pendulum
from pydantic import field_validator, model_validator, EmailStr
from pydantic_extra_types.pendulum_dt import Duration, DateTime
from typing_extensions import Self

from server.helpers.utils import get_month_name
from server.models.common import CustomBaseModel, RootModelStrDict, RootModelIntDict


class ExtractionDuration(CustomBaseModel):
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


@dataclass(frozen=True)
class Period:
    year: int
    month: int

    def __repr__(self):
        return f"{self.year}-{self.month:02}"

    def __str__(self):
        return f"{get_month_name(int(self.month))} {self.year}"


class CommitteeInvolvement(RootModelStrDict[list[AccomplishedTask]]):
    @property
    def total_hours_per_committee(self) -> dict[str, float]:
        return {committee_name: sum(task.hours_spent for task in tasks)
                for committee_name, tasks in self.root.items()}

    @property
    def total_hours(self) -> float:
        return sum(self.total_hours_per_committee.values())


class MonthlyInvolvement(RootModelIntDict[CommitteeInvolvement]):
    @property
    def total_hours_per_month(self) -> dict[int, float]:
        return {
            month: sum(committee_hours for committee_hours in committee_involvement.total_hours_per_committee.values())
            for month, committee_involvement in self.root.items()}

    @property
    def total_hours(self) -> float:
        return sum(self.total_hours_per_month.values())


class YearlyInvolvement(RootModelIntDict[MonthlyInvolvement]):
    @property
    def total_hours_per_year(self) -> dict[int, float]:
        return {year: sum(month_hours for month_hours in monthly_involvement.total_hours_per_month.values())
                for year, monthly_involvement in self.root.items()}

    @property
    def total_hours(self) -> float:
        return sum(self.total_hours_per_year.values())


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

    def get_involvement_slice(self, preceding_months_count: int) -> dict[Period, CommitteeInvolvement | None]:
        interval = pendulum.interval(pendulum.now().subtract(months=preceding_months_count), pendulum.now())
        periods = [Period(year=date.year, month=date.month) for date in interval.range('months')]
        periods = list(reversed(periods[:-1]))

        return {period: self.involvement.get(period.year, {}).get(period.month, None) for period in periods}


Residents = RootModelStrDict[Resident]
Members = RootModelStrDict[Member]


class TimesheetsInfo(CustomBaseModel):
    all_committees_last_updated: dict[str, DateTime]
    most_recent_update: DateTime


class ExtractionInfo(CustomBaseModel):
    log: list[LogEntry]
    duration: ExtractionDuration
    timestamp: DateTime


class TimesheetsExtractedData(CustomBaseModel):
    data: Members | None = None
    timesheets_info: TimesheetsInfo
    extraction_info: ExtractionInfo
