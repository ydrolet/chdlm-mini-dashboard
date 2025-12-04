"use strict"

function loadResidents() {
  const allResidentsSpreadsheet = SpreadsheetApp.openById("***********************")

  const allResidentsSheet = allResidentsSpreadsheet?.getSheetByName('Résidents')
  if (!allResidentsSheet) throw 'Error while loading residents spreadsheet.'

  const residentsRangeValues = allResidentsSheet.getRange('residentsList').getValues().filter(row => !row.every(value => value === ""))

  const unsortedAllResidents = []

  for (const residentRowValues of residentsRangeValues) {
    const firstName = residentRowValues[3]
    const lastName = residentRowValues[4]
    const timesheetsDropdownsFullName = residentRowValues[5]
    const civicNumber = residentRowValues[0]
    const unitNumber = residentRowValues[1]
    const memberStatus = residentRowValues[2]
    const emailAddress = residentRowValues[6] || null

    if (!Object.values(statusMapping).includes(memberStatus)) {
      throw `Resident status "${memberStatus}" isn't recognized.`
    }

    const address = memberStatus !== statusMapping.former ? new Address(civicNumber, unitNumber) : null

    const resident = new Resident(
      firstName,
      lastName,
      address,
      memberStatus,
      emailAddress
    )

    if (resident.fullName !== timesheetsDropdownsFullName) {
      throw `Resident "${resident.fullName}" doesn't match full name used in timesheets dropdowns`
    }

    unsortedAllResidents.push(resident)
  }

  const sortedResidents = unsortedAllResidents.sort((a, b) => {
    if (a.fullName < b.fullName) {
      return -1
    }
    if (a.fullName > b.fullName) {
      return 1
    }
    return 0
  })

  return sortedResidents
}


const committeesTimesheetsIds = {
  "Comité ad hoc des grandes rénovations": "***********************",
  "Comité d'accueil et de formation": "***********************",
  "Comité d'entretien extérieur": "***********************",
  "Comité d'entretien intérieur": "***********************",
  "Comité d'informatique": "***********************",
  "Comité de coordination-participation": "***********************",
  "Comité de maintenance": "***********************",
  "Comité de participation": "***********************",
  "Comité de piscine": "***********************",
  "Comité de recrutement": "***********************",
  "Comité de secrétariat": "***********************",
  "Comité de sécurité incendie": "***********************",
  "Comité des finances": "***********************",
  "Comité des loisirs": "***********************",
  "Comité du projet DIX35": "***********************",
  "Conseil d'administration": "***********************",
  "Équipe Café du village": "***********************",
  "Projets spéciaux": "***********************",
  "Sous-comité animaux": "***********************",
}


function loadInvolvementTimesheets() {
  return objectMap(committeesTimesheetsIds, v => SpreadsheetApp.openById(v))
}


function getInvolvementTimesheetsLastUpdated() {
  return objectMap(committeesTimesheetsIds, v => DriveApp.getFileById(v).getLastUpdated())
}


function getEnvVars() {
  const userProps = PropertiesService.getUserProperties()

  const envVars = {
    chdlmMiniDashboardUrl: userProps.getProperty("chdlmMiniDashboardUrl"),
    chdlmMiniDashboardApiKey: userProps.getProperty("chdlmMiniDashboardApiKey"),
    mailApp: {
      toEmail: userProps.getProperty("mailAppToEmail"),
      fromName: userProps.getProperty("mailAppFromName")
    },
  }

  if (envVars.chdlmMiniDashboardUrl === null) {
    throw "CHDLM Mini Dashboard URL must be correctly set."
  }

  if (envVars.chdlmMiniDashboardApiKey === null) {
    throw "CHDLM Mini Dashboard API key must be correctly set."
  }

  if (envVars.mailApp.toEmail === null) {
    throw "MailApp 'To' email address must be correctly set."
  }

  if (envVars.mailApp.fromEmail === null || envVars.mailApp.fromName === null) {
    throw "MailApp 'From' email address, with name, must be correctly set."
  }

  return envVars
}
