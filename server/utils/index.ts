import type {H3Event} from "h3"
import {serverSupabaseServiceRole} from "#supabase/server"
import {ChdlmInvolvementService} from "~~/server/services/chdlm-involvement"
import {MailgunService} from "~~/server/services/mailgun"

export function createChdlmInvolvementService(event: H3Event) {
  const config = useRuntimeConfig()
  return new ChdlmInvolvementService(
    serverSupabaseServiceRole(event),
    new MailgunService(config.mailgunApiKey, config.mailgunDomainName)
  )
}
