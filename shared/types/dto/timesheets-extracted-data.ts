import z from "zod"
import {Z} from "zod-class"
import _ from "lodash"
import customDayjs from "#shared/utils/custom-dayjs"
import {type MonthlyInvolvement, Period} from "#shared/types/involvement"

const dayjsSchema = z.string().datetime({offset: true}).transform(date => customDayjs(date).tz())
const durationSchema = z.number().transform(secs => customDayjs.duration({seconds: secs}))

export enum LogLevel {
  Info = "info",
  Warning = "warning",
  Error = "error"
}

export class Address extends Z.class({
  civicNumber: z.number().int(),
  unitNumber: z.number().int(),
}) {}

// Adding a method to the Address class doesn't work because it is nullable on Resident class
export function humanizeAddress(address: Address): string {
  return `${address.civicNumber}\u00a0#${address.unitNumber}`
}

export enum MemberStatus {
  Member = "Membre",
  Probation = "Probation",
  NonMember = "Non-membre",
  Former = "Ancien"
}

export interface MemberInvolvementStats {
  totalHoursPerYear: { [year: number]: number }
  totalHoursPerMonth: { [year: number]: { [month: number]: number } }
  totalHoursPerCommittee: { [year: number]: { [month: number]: { [committeeName: string]: number } } }
}

export class AccomplishedTask extends Z.class({
  taskName: z.string(),
  hoursSpent: z.number(),
  note: z.string(),
}) {}

export class Resident extends Z.class({
  firstName: z.string(),
  lastName: z.string(),
  address: Address.nullable(),
  memberStatus: z.nativeEnum(MemberStatus).optional(),
  emailAddress: z.string().email().nullable()
}) {
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  findCoResidents(residents: Resident[]): Resident[] {
    return residents.filter(resident => _.isEqual(resident.address, this.address) && resident !== this)
  }
}

export class Member extends Resident.extend({
  involvement: z.record(
    z.coerce.number(), // year
    z.record(
      z.coerce.number().min(1).max(12), // month
      z.record(
        z.string(), // committee name
        z.object(AccomplishedTask.shape).array()
      )
    )
  )
}) {
  get involvementStats(): MemberInvolvementStats {
    const stats: MemberInvolvementStats = {
      totalHoursPerYear: {},
      totalHoursPerMonth: {},
      totalHoursPerCommittee: {},
    }

    for (const yearKey in this.involvement) {
      const year = Number(yearKey)
      const months = this.involvement[year]

      if (!stats.totalHoursPerYear[year]) stats.totalHoursPerYear[year] = 0
      if (!stats.totalHoursPerMonth[year]) stats.totalHoursPerMonth[year] = {}
      if (!stats.totalHoursPerCommittee[year]) stats.totalHoursPerCommittee[year] = {}

      for (const monthKey in months) {
        const month = Number(monthKey)
        const committees = months[month]

        if (!stats.totalHoursPerMonth[year][month]) stats.totalHoursPerMonth[year][month] = 0
        if (!stats.totalHoursPerCommittee[year][month]) stats.totalHoursPerCommittee[year][month] = {}

        for (const committeeName in committees) {
          const accomplishedTasks = committees[committeeName]

          let sum = 0
          if (accomplishedTasks) {
            for (const accomplishedTask of accomplishedTasks) {
              sum += accomplishedTask.hoursSpent
            }
          }

          if (!stats.totalHoursPerCommittee[year][month][committeeName]) {
            stats.totalHoursPerCommittee[year][month][committeeName] = 0
          }
          stats.totalHoursPerCommittee[year][month][committeeName] += sum
          stats.totalHoursPerMonth[year][month] += sum
          stats.totalHoursPerYear[year] += sum
        }
      }
    }

    return stats
  }

  monthlyInvolvement(precedingMonthsCount: number): MonthlyInvolvement[] {
    const periods: Period[] = []
    let cursor = customDayjs().tz()
    do {
      periods.push(new Period(cursor.year(), cursor.month() + 1))
      cursor = cursor.subtract(1, "month")
    } while (periods.length < precedingMonthsCount)

    return periods.map<MonthlyInvolvement>(period => ({
      period,
      involvement: this.involvement[period.year]?.[period.month] ?? null,
      totalHours: this.involvementStats.totalHoursPerMonth[period.year]?.[period.month] ?? 0,
    }))
  }
}

export class TimesheetsExtractedData extends Z.class({
  data: z.array(Member),
  timesheetsInfo: z.object({
    allCommitteesLastUpdated: z.record(z.string(), dayjsSchema),
    mostRecentUpdate: dayjsSchema
  }),
  extractionInfo: z.object({
    log: z.object({
      timestamp: dayjsSchema,
      message: z.string(),
      level: z.nativeEnum(LogLevel),
    }).array(),
    duration: z.object({
      spreadsheetLoading: durationSchema,
      dataExtraction: durationSchema,
    }),
    timestamp: dayjsSchema
  })
}) {
  getMember(fullName: string): Member | undefined {
    return this.data.find(member => member.fullName === fullName)
  }
}
