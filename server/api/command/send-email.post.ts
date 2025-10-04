import {type EmailedInvolvementSummaryRequestResult, EmailedInvolvementSummaryRequestSchema} from "#shared/types/dto/commands"
import {EmailSendingError, MemberNotFound, NoEmailAddress} from "~~/server/utils/errors"

export default defineEventHandler<Promise<EmailedInvolvementSummaryRequestResult>>(async (event) => {
  const result = await readValidatedBody(event, body => EmailedInvolvementSummaryRequestSchema.safeParse(body))
  if (!result.success) throw createError({statusCode: 400, statusMessage: JSON.stringify(result.error.issues)})

  const involvementService = createChdlmInvolvementService(event)

  try {
    const member = await involvementService.sendInvolvementSummaryEmail(
      result.data.memberFullName,
      result.data.precedingMonths
    )

    return {
      memberFullName: member.fullName,
      precedingMonths: result.data.precedingMonths,
      maskedEmailAddress: member.emailAddress && maskEmailAddress(member.emailAddress),
    }
  }
  catch (err: unknown) {
    if (err instanceof MemberNotFound) {
      throw createError({statusCode: 404, statusMessage: err.message})
    }
    else if (err instanceof NoEmailAddress) {
      throw createError({statusCode: 406, statusMessage: err.message})
    }
    else if (err instanceof EmailSendingError) {
      throw createError({statusCode: 500, statusMessage: err.message})
    }
    else {
      throw createError({statusCode: 500, statusMessage: `Une erreur inattendue s'est produite: ${err}`})
    }
  }
})
