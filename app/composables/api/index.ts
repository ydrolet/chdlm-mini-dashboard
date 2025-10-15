import type {EmailedInvolvementSummaryRequest, EmailedInvolvementSummaryRequestResult} from "#shared/types/dto/commands"

export function useInfo() {
  return useLazyFetch<Info>("/api/info")
}

export function useSendMail(body: EmailedInvolvementSummaryRequest) {
  return $fetch<EmailedInvolvementSummaryRequestResult>("/api/command/send-email", {
    method: "post",
    body,
  })
}
