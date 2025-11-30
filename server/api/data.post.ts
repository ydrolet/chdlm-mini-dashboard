import {TimesheetsExtractedData} from "#shared/types/dto/timesheets-extracted-data"
import {createTimesheetExtractedDataDbService, defineEventHandlerWithAuth} from "~~/server/utils"

export default defineEventHandlerWithAuth(async (event) => {
  const result = await readValidatedBody(event, body => TimesheetsExtractedData.safeParse(body))
  if (!result.success) throw createError({statusCode: 400, statusMessage: JSON.stringify(result.error.issues)})
  await (await createTimesheetExtractedDataDbService()).insertData(result.data)
})
