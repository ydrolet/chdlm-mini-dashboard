import type {H3Event, EventHandler, EventHandlerRequest} from "h3"
import {serverSupabaseServiceRole} from "#supabase/server"
import {ChdlmInvolvementService} from "~~/server/services/chdlm-involvement"
import {MailgunService} from "~~/server/services/mailgun"
import {MongodbService} from "~~/server/services/mongodb"
import type {TimesheetsExtractedData} from "#shared/types/dto/timesheets-extracted-data"

export function createChdlmInvolvementService(event: H3Event) {
  const config = useRuntimeConfig()
  return new ChdlmInvolvementService(
    serverSupabaseServiceRole(event),
    new MailgunService(config.mailgunApiKey, config.mailgunDomainName)
  )
}

export async function createTimesheetExtractedDataDbService() {
  const config = useRuntimeConfig()
  return await MongodbService.create<TimesheetsExtractedData>(
    config.mongodbUri,
    "google_sheets",
    "extracted_data",
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

    try {
      const response = await handler(event)
      return {response}
    }
    catch (err) {
      return {err}
    }
  })
}
