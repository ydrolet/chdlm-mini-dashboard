import type {EmailedInvolvementSummaryRequest, EmailedInvolvementSummaryRequestResult} from "#shared/types/dto/commands"

export function useInfo() {
  return useFetch<Info>("/api/info")
}

export function useMembersNames() {
  return useFetch<string[]>("/api/data/members")
}

export function useSendMail(body: EmailedInvolvementSummaryRequest) {
  return $fetch<EmailedInvolvementSummaryRequestResult>("/api/command/send-email", {
    method: "post",
    body,
  })
}
