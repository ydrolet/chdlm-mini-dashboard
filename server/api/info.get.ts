import {createChdlmInvolvementService} from "~~/server/utils"

export default defineEventHandler<Promise<Info>>(async (event) => {
  const involvementService = createChdlmInvolvementService(event)

  const extractedData = await involvementService.getTimesheetExtractedData()

  return {
    latestExtraction: extractedData.extractionInfo.timestamp,
  }
})
