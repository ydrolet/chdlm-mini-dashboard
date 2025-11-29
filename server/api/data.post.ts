import {TimesheetsExtractedData} from "#shared/types/dto/timesheets-extracted-data"
import {MongodbService} from "~~/server/services/mongodb"

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => TimesheetsExtractedData.safeParse(body))
  if (!result.success) throw createError({statusCode: 400, statusMessage: JSON.stringify(result.error.issues)})

  const query = getQuery(event)

  const config = useRuntimeConfig()

  if (query.apiKey === config.apiKey) {
    const mongodbService = await MongodbService.create(
      config.mongodbUri,
      "google_sheets",
      "extracted_data",
    )

    await mongodbService.insertData(result.data)
  }
  else {
    throw createError({statusCode: 401, statusMessage: "Unauthorized API key."})
  }
})
