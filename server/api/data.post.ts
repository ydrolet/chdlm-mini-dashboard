import {TimesheetsExtractedData} from "#shared/types/dto/timesheets-extracted-data"
import {createTimesheetExtractedDataDbService, defineEventHandlerWithAuth} from "~~/server/utils"

export default defineEventHandlerWithAuth(async (event) => {
  const body = await readValidatedBody(event, b => TimesheetsExtractedData.parse(b))
  await (await createTimesheetExtractedDataDbService()).insertData(body)
})
