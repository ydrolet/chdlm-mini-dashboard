import {createTimesheetExtractedDataDbService, defineEventHandlerWithAuth} from "~~/server/utils"
import {timesheetsSortField} from "~~/server/services/chdlm-involvement"

export default defineEventHandlerWithAuth(async () => {
  const dbService = await createTimesheetExtractedDataDbService()
  return await dbService.getLastDocument(timesheetsSortField)
})
