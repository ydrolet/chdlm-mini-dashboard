import {createTimesheetExtractedDataDbService, defineEventHandlerWithAuth} from "~~/server/utils"

export default defineEventHandlerWithAuth(async () => {
  return (await createTimesheetExtractedDataDbService()).getLastDocument()
})
