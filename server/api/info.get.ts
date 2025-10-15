import {createChdlmInvolvementService} from "~~/server/utils"
import {type Member, MemberStatus} from "#shared/types/dto/timesheets-extracted-data"

export default defineEventHandler<Promise<Info>>(async (event) => {
  const involvementService = createChdlmInvolvementService(event)

  const timesheetsExtractedData = await involvementService.getTimesheetExtractedData()
  const membersInvolvementData = timesheetsExtractedData.data as Member[] // FIXME: Casting shouldn't be needed

  return {
    latestExtraction: timesheetsExtractedData.extractionInfo.timestamp,
    membersNames: membersInvolvementData.filter(m => m.memberStatus !== MemberStatus.Former).map(m => m.fullName).toSorted(),
  }
})
