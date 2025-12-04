import {createTimesheetExtractedDataDbService, defineEventHandlerWithAuth} from "~~/server/utils"

export default defineEventHandlerWithAuth(async () => {
  const dbService = await createTimesheetExtractedDataDbService()
  return await dbService.getLastDocument()
})
