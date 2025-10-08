import customDayjs from "#shared/utils/custom-dayjs"
import type {AccomplishedTask} from "#shared/types/dto/timesheets-extracted-data"

export class Period {
  constructor(
    public readonly year: number,
    public readonly month: number, // 1 = January, 12 = December
  ) {}

  toString(): string {
    return customDayjs(new Date(this.year, this.month - 1, 1)).format("MMMM YYYY")
  }
}

export interface MonthlyInvolvement {
  period: Period
  involvement: {[committeeName: string]: AccomplishedTask[]} | null
  totalHours: number
}
