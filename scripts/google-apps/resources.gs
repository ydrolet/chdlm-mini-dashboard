"use strict"

function loadResidents() {
  const allResidentsSpreadsheet = SpreadsheetApp.openById("***********************")

  const allResidentsSheet = allResidentsSpreadsheet?.getSheetByName('Résidents')
  if (!allResidentsSheet) throw 'Error while loading residents spreadsheet.'

  const residentsRangeValues = allResidentsSheet.getRange('residentsList').getValues().filter(row => !row.every(value => value === ""))

  const unsortedallResidents = []
  const allResidents = {}

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

    unsortedallResidents.push(resident)
  }

  const sortedResidents = unsortedallResidents.sort((a, b) => {
    if (a.fullName < b.fullName) {
      return -1
    }
    if (a.fullName > b.fullName) {
      return 1
    }
    return 0
  })

  for (const t of sortedResidents) {
    allResidents[t.fullName] = t
  }

  return allResidents
}


const committeesTimesheetsIds = {
  "Comité ad hoc des grandes rénovations": "***********************",
  "Comité d'accueil et de formation": "***********************",
  "Comité d'entretien extérieur": "***********************",
  "Comité d'entretien intérieur": "***********************",
  "Comité d'informatique": "***********************",
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
    supabase: {
      projectUrl: userProps.getProperty("supabaseProjectUrl"),
      publicApiKey: userProps.getProperty("supabasePublicApiKey"),
      miniDashboardServiceAccountJwt: userProps.getProperty("supabaseMiniDashboardServiceAccountJwt")
    },
    sendgrid: {
      apiKey: userProps.getProperty("sendgridApiKey"),
      toEmail: userProps.getProperty("sendgridToEmail"),
      fromEmail: userProps.getProperty("sendgridFromEmail"),
      fromName: userProps.getProperty("sendgridFromName")
    }
  }

  if (envVars.supabase.projectUrl === null) {
    throw "Supabase project URL must be correctly set."
  }

  if (envVars.supabase.publicApiKey === null || envVars.supabase.miniDashboardServiceAccountJwt === null) {
    throw "Supabase tokens must be correctly set."
  }

  if (envVars.sendgrid.apiKey === null) {
    throw "SendGrid API key must be correctly set."
  }

  if (envVars.sendgrid.toEmail === null) {
    throw "SendGrid 'To' email address must be correctly set."
  }

  if (envVars.sendgrid.fromEmail === null || envVars.sendgrid.fromName === null) {
    throw "SendGrid 'From' email address, with name, must be correctly set."
  }

  return envVars
}
