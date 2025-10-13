import {MemberStatus} from "#shared/types/dto/timesheets-extracted-data"
import {createChdlmInvolvementService} from "~~/server/utils"

export default defineEventHandler<Promise<string[]>>(async (event) => {
  const involvementService = createChdlmInvolvementService(event)

  const members = await involvementService.getMembersInvolvementData()

  return members.filter(m => m.memberStatus !== MemberStatus.Former).map(m => m.fullName).toSorted()
})
