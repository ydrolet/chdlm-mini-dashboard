import z from "zod"

export const EmailedInvolvementSummaryRequestSchema = z.object({
  memberFullName: z.string(),
  precedingMonths: z.number().min(MIN_PRECEDING_MONTHS).max(MAX_PRECEDING_MONTHS),
})
export type EmailedInvolvementSummaryRequest = z.infer<typeof EmailedInvolvementSummaryRequestSchema>

export interface EmailedInvolvementSummaryRequestResult extends EmailedInvolvementSummaryRequest {
  maskedEmailAddress: string | null
}
