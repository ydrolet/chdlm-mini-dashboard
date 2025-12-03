import type {MongodbService} from "~~/server/services/mongodb"
import {humanizeAddress, type Member, type TimesheetsExtractedData} from "#shared/types/dto/timesheets-extracted-data"
import nunjucks from "nunjucks"
import mjml2html from "mjml"
import {EmailSendingError, MemberNotFound, NoEmailAddress} from "~~/server/utils/errors"

export class ChdlmInvolvementService {
  private serverAssets = useStorage("assets:templates")

  constructor(
    private db: MongodbService<TimesheetsExtractedData>,
    private mailer: MailService,
  ) {
  }

  async getTimesheetExtractedData(): Promise<TimesheetsExtractedData> {
    console.time("Loading of timesheets extracted data from database")
    const extractedInvolvementData = await this.db.getLastDocument()
    console.timeEnd("Loading of timesheets extracted data from database")

    return extractedInvolvementData
  }

  async sendInvolvementSummaryEmail(
    memberFullName: string,
    precedingMonthsCount: number = 4,
  ): Promise<Member> {
    const config = useRuntimeConfig()

    const extractData = await this.getTimesheetExtractedData()
    const member = extractData.getMember(memberFullName)

    if (!member) {
      throw new MemberNotFound(`Le résident "${memberFullName}" est introuvable.`)
    }

    if (!member.emailAddress) {
      throw new NoEmailAddress(`Le résident "${memberFullName}" n'a pas d'adresse courriel.`)
    }

    const monthlyInvolvement = member.monthlyInvolvement(precedingMonthsCount)
    const grandTotal = monthlyInvolvement.reduce((acc, curr) => acc + curr.totalHours, 0)

    const mjmlTemplate = Buffer.from(
      (await this.serverAssets.getItem("involvement-summary.mjml")) as Uint8Array)
      .toString("utf-8")
    if (!mjmlTemplate) throw new Error("MJML template file not found.")

    const renderedMjml = nunjucks.renderString(mjmlTemplate, {
      member,
      latestExtraction: extractData.extractionInfo.timestamp.format("D MMMM YYYY à HH:mm"),
      monthlyInvolvement,
      grandTotal,
      humanizeAddress,
    })
    const renderedHtml = mjml2html(renderedMjml)

    if (config.debugRecipientEmailAddress) {
      console.warn(`Sending email to debugRecipientEmailAddress (${config.debugRecipientEmailAddress})`)
    }

    const result = await this.mailer.sendEmail(
      {name: config.fromName, email: config.fromEmailAddress},
      config.debugRecipientEmailAddress || member.emailAddress,
      `[CHDLM] Bilan de participation de ${member.fullName}`,
      renderedHtml.html,
    )

    if (result.ok) {
      console.info(`Email sent to ${member.fullName} (${member.emailAddress}) for `
        + `involvement summary over ${precedingMonthsCount} months`)
    }
    else {
      console.error(`Error when sending email to ${member.fullName} (${member.emailAddress})`)
      throw new EmailSendingError("Une erreur s'est produite lors de l'envoi du courriel.")
    }

    return member
  }
}
