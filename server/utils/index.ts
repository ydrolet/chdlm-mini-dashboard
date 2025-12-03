import type {EventHandler, EventHandlerRequest} from "h3"
import {ChdlmInvolvementService} from "~~/server/services/chdlm-involvement"
import {MailgunService} from "~~/server/services/mailgun"
import {MongodbService} from "~~/server/services/mongodb"
import {TimesheetsExtractedData} from "#shared/types/dto/timesheets-extracted-data"

export async function createChdlmInvolvementService() {
  const config = useRuntimeConfig()
  return new ChdlmInvolvementService(
    await createTimesheetExtractedDataDbService(),
    new MailgunService(config.mailgunApiKey, config.mailgunDomainName)
  )
}

export async function createTimesheetExtractedDataDbService() {
  const config = useRuntimeConfig()
  return await MongodbService.create<TimesheetsExtractedData>(
    config.mongodbUri,
    "google_sheets",
    "extracted_data",
    TimesheetsExtractedData.schema(),
  )
}

export function defineEventHandlerWithAuth<T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>,
): EventHandler<T, D> {
  return defineEventHandler<T>(async (event) => {
    const query = getQuery(event)
    const config = useRuntimeConfig()

    if (query.apiKey !== config.apiKey) {
      throw createError({statusCode: 401, statusMessage: "Unauthorized API key."})
    }

    const response = await handler(event)
    return {response}
  })
}
