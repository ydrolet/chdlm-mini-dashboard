import type {SupabaseClient} from "@supabase/supabase-js"
import {humanizeAddress, type Member, TimesheetsExtractedData} from "#shared/types/dto/timesheets-extracted-data"
import nunjucks from "nunjucks"
import mjml2html from "mjml"
import {EmailSendingError, MemberNotFound, NoEmailAddress} from "~~/server/utils/errors"

export class ChdlmInvolvementService {
  private serverAssets = useStorage("assets:templates")

  constructor(
    private db: SupabaseClient,
    private mailer: MailService,
  ) {
  }

  async getTimesheetExtractedData(): Promise<TimesheetsExtractedData> {
    console.time("Loading of timesheets extracted data from database")
    const {data} = await this.db.from("google_sheets_extracted_data")
      .select("extracted_data")
      .order("created_at", {ascending: false})
      .limit(1)
    console.timeEnd("Loading of timesheets extracted data from database")

    console.time("Parsing of timesheets extracted data")
    const extractedInvolvementData = TimesheetsExtractedData.parse(data?.[0]?.["extracted_data"])
    console.timeEnd("Parsing of timesheets extracted data")

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

    const result = await this.mailer.sendEmail(
      {name: config.fromName, email: config.fromEmailAddress},
      config.debugRecipientEmailAddress || member.emailAddress,
      `[CHDLM] Bilan de participation de ${member.fullName}`,
      renderedHtml.html,
    )

    if (!result.ok) {
      throw new EmailSendingError("Une erreur s'est produite lors de l'envoi du courriel.")
    }

    return member
  }
}
