"use strict"

class LogEntry {
  constructor(msg, level) {
    this.timestamp = Utilities.formatDate(new Date(), "America/Toronto", "yyyy-MM-dd'T'HH:mm:ssZ")
    this.message = msg
    this.level = level
  }
}

class StoredLogger {
  constructor() {
    this.storage = []
  }

  info(msg) {
    this.storage.push(new LogEntry(msg, "info"))
    console.info(msg)
  }

  warn(msg) {
    this.storage.push(new LogEntry(msg, "warning"))
    console.warn(msg)
  }

  error(msg) {
    this.storage.push(new LogEntry(msg, "error"))
    console.error(msg)
  }
}

function extractInvolvementData(precedingYears = 2) {
  const extractionTimestamp = new Date()
  const log = new StoredLogger()

  log.info("Data extraction started.")

  let data = null
  let allInvolvementTimesheetsLastUpdated = null
  const extractionDuration = {
    spreadsheetLoading: null,
    dataExtraction: null,
  }
  let t0, t1, t2 = 0

  try {
    t0 = new Date().getTime()
    log.info(`Loading spreadsheets...`)

    const allMembers = loadResidents().map(r => new Member(r.firstName, r.lastName, r.address, r.memberStatus, r.emailAddress))
    allInvolvementTimesheetsLastUpdated = getInvolvementTimesheetsLastUpdated()
    const allInvolvementTimesheets = loadInvolvementTimesheets()

    t1 = new Date().getTime()
    extractionDuration.spreadsheetLoading = `PT${(t1 - t0) / 1000}S`
    log.info(`All spreadsheets loading duration: ${extractionDuration.spreadsheetLoading}`)

    const currentYear = new Date().getFullYear()

    for (const [committeeName, spreadsheet] of Object.entries(allInvolvementTimesheets)) {
      log.info(`Extracting data of committee "${committeeName}" ...`)
      const spreadsheetDocumentCommitteeName = spreadsheet.getName().match(/\((?<name>.*)\)/)?.groups?.name
      if (spreadsheetDocumentCommitteeName !== committeeName) {
        throw `Committee name "${committeeName}" mismatch with document name "${spreadsheetDocumentCommitteeName}"`
      }

      for (const year of [...Array(precedingYears + 1).keys()].map(i => currentYear - i)) {
        const yearlyCommitteeTimesheet = spreadsheet.getSheetByName(year.toString())
        if (!yearlyCommitteeTimesheet) {
          const message = `Can't load timesheet of the year "${year}" for the committee "${committeeName}"`

          if (year === currentYear) {
            throw message
          }
          else {
            log.warn(message)
            continue
          }
        }

        const monthsRowPosition = yearlyCommitteeTimesheet.createTextFinder('Mois :')
          .matchCase(true)
          .matchEntireCell(true)
          .findNext()?.getRow()

        const membersRowPosition = yearlyCommitteeTimesheet.createTextFinder('Membres :')
          .matchCase(true)
          .matchEntireCell(true)
          .findNext()?.getRow()

        const totalHoursRowPosition = yearlyCommitteeTimesheet.createTextFinder('Total du mois par membre :')
          .matchCase(true)
          .matchEntireCell(true)
          .findNext()?.getRow()

        if (!monthsRowPosition) throw `Can't find months row of committee "${committeeName}"`
        if (!membersRowPosition) throw `Can't find members row of committee "${committeeName}"`
        if (!totalHoursRowPosition) throw `Can't find total hours row of committee "${committeeName}"`

        const monthsRange = yearlyCommitteeTimesheet.getRange(`${monthsRowPosition}:${monthsRowPosition}`)
        const membersRange = yearlyCommitteeTimesheet.getRange(`${membersRowPosition}:${membersRowPosition}`)
        const hoursWithTasksRange = yearlyCommitteeTimesheet.getRange(`${membersRowPosition + 1}:${totalHoursRowPosition - 1}`)
        const totalHoursRange = yearlyCommitteeTimesheet.getRange(`${totalHoursRowPosition}:${totalHoursRowPosition}`)

        if (!monthsRange) throw `Can't get months row range "${monthsRowPosition}:${monthsRowPosition}" of committee "${committeeName}"`
        if (!membersRange) throw `Can't get members row range "${membersRowPosition}:${membersRowPosition}" of committee "${committeeName}"`
        if (!hoursWithTasksRange) throw `Can't get hours rows range "${membersRowPosition + 1}:${totalHoursRowPosition - 1}" of committee "${committeeName}"`
        if (!totalHoursRange) throw `Can't get total hours row range "${totalHoursRowPosition}:${totalHoursRowPosition}" of committee "${committeeName}"`

        const monthsMergedCells = monthsRange.getMergedRanges()
        const monthForEachColumn = new Array(monthsRange.getWidth())

        for (let i = 0; i < monthsMergedCells.length; i++) {
          const mergedRangeValue = monthsMergedCells[i].getValue()

          if (mergedRangeValue instanceof Date) {
            const leftMostColumnIndex = monthsMergedCells[i].getColumn() - 1
            const rightMostColumnIndex = monthsMergedCells[i].getLastColumn() - 1

            for (let columnIndex = leftMostColumnIndex; columnIndex <= rightMostColumnIndex; columnIndex++) {
              monthForEachColumn[columnIndex] = mergedRangeValue
            }
          }
        }

        const membersDataValidations = membersRange.getDataValidations()[0]
        const membersNamesRow = membersRange.getValues()[0]
        const hoursWithTasksMatrix = hoursWithTasksRange.getValues()
        const notesMatrix = hoursWithTasksRange.getNotes()
        const totalHoursRow = totalHoursRange.getValues()[0]

        if (membersDataValidations.findIndex(d => d !== null) !== 2) {
          throw `The first member name dropdown isn't on the 3rd column of committee "${committeeName}"`
        }

        for (let columnIndex = 0; columnIndex < membersDataValidations.length; columnIndex++) {
          if (membersDataValidations[columnIndex] === null) {
            continue
          }

          const memberFullNameInTimesheet = membersNamesRow[columnIndex]
          if (memberFullNameInTimesheet === "") {
            continue
          }

          if (allMembers.find(m => m.fullName === memberFullNameInTimesheet) === undefined) {
            log.warn(`Member name "${memberFullNameInTimesheet}" is unrecognized in the committees "${committeeName}" on year ${year}`)
            continue
          }

          const month = monthForEachColumn[columnIndex]?.getMonth() + 1
          if (!month) {
            log.warn(`Month is badly formatted on column ${columnIndexToLetterNotation(columnIndex)} of committee "${committeeName}" on year ${year}`)
            continue
          }

          let totalHours = 0
          for (const [rowIndex, hoursRow] of hoursWithTasksMatrix.entries()) {
            const hourEntry = hoursRow[columnIndex]
            const noteEntry = notesMatrix[rowIndex][columnIndex]
            const taskName = hoursRow[1]

            switch (typeof hourEntry) {
              case 'number':
                allMembers.find(m => m.fullName === memberFullNameInTimesheet).addAccomplishedTask(
                  committeeName,
                  { year, month },
                  new AccomplishedTask(taskName, hourEntry, noteEntry)
                )
                totalHours += hourEntry
                break
              case 'string':
                if (hourEntry === '') {
                  break
                }
              default:
                log.warn(`A hour entry has something else than a number on column ${columnIndexToLetterNotation(columnIndex)} of committee "${committeeName}" on year ${year}`)
            }
          }

          if (totalHours !== totalHoursRow[columnIndex]) {
            log.warn(`Total hours is incorrect on column ${columnIndexToLetterNotation(columnIndex)} of committee "${committeeName}" on year ${year}`)
          }
        }
      }
    }

    data = allMembers

  } catch (e) {
    log.error(e)
    data = null
  } finally {
    t2 = new Date().getTime()
    extractionDuration.dataExtraction = `PT${(t2 - t1) / 1000}S`
    log.info(`Data extraction duration: ${extractionDuration.dataExtraction}`)
  }

  return {
    data,
    timesheetsInfo: {
      allCommitteesLastUpdated: allInvolvementTimesheetsLastUpdated,
      mostRecentUpdate: Object.values(allInvolvementTimesheetsLastUpdated).sort((a, b) => a - b).slice(-1)[0]
    },
    extractionInfo: {
      log: log.storage,
      duration: extractionDuration,
      timestamp: extractionTimestamp,
    }
  }
}


function extractDataThenWriteToDatabase(onlyIfDataChanged = false) {
  const envVars = getEnvVars()

  if (onlyIfDataChanged) {
    console.info("Checking if data changed...")
    const currentMostRecentUpdate = Object.values(getInvolvementTimesheetsLastUpdated()).sort((a, b) => a - b).slice(-1)[0]

    const response = UrlFetchApp.fetch(`${envVars.chdlmMiniDashboardUrl}/api/data?apiKey=${envVars.chdlmMiniDashboardApiKey}`, {
      method: "get",
    })
    const timesheetsInfo = JSON.parse(response.getContentText(), dateReviver).response.timesheetsInfo
    const storedMostRecentUpdate = timesheetsInfo.mostRecentUpdate

    if (storedMostRecentUpdate >= currentMostRecentUpdate) {
      console.info("Data didn't change")
      return
    }
    console.info("Data has changed, so data will be extracted and written to database")
  }

  const data = extractInvolvementData()

  if (data.extractionInfo.log.find(e => e.level === "warning" || e.level === "error")) {
    MailApp.sendEmail({
      to: envVars.mailApp.toEmail,
      name: envVars.mailApp.fromName,
      subject: "Warnings or errors in the latest CHDLM involvement data extraction",
      body: JSON.stringify(data.extractionInfo.log, null, "  "),
      noReply: true,
    })
  }

  UrlFetchApp.fetch(`${envVars.chdlmMiniDashboardUrl}/api/data?apiKey=${envVars.chdlmMiniDashboardApiKey}`, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data)
  })
  console.info("Extracted data was written to the database")
}


function extractDataThenWriteToDatabaseOnlyIfDataChanged() {
  extractDataThenWriteToDatabase(true)
}
