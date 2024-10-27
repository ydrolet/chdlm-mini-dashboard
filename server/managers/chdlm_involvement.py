import logging
from pathlib import Path

from sendgrid import SendGridAPIClient, Mail, From
from supabase import Client

from server.helpers.mjml import render_mjml_template_to_html
from server.helpers.utils import EmailSendingException
from server.models.chdlm_involvement_data import Members, TimesheetsExtractedData, Member
from server.settings import settings


class ChdlmInvolvementManager:
    def __init__(self, supabase_api_client: Client, sendgrid_api: SendGridAPIClient):
        self.supabase_api_client = supabase_api_client
        self.sendgrid_api = sendgrid_api

    def get_timesheets_extracted_data(self) -> TimesheetsExtractedData:
        logging.info("Loading timesheets extracted data...")
        response = (self.supabase_api_client.table("google_sheets_extracted_data")
                    .select("extracted_data")
                    .order("created_at", desc=True)
                    .limit(1)
                    .execute())
        extracted_involvement_data = TimesheetsExtractedData.model_validate(response.data[0]["extracted_data"])
        logging.info("Timesheets extracted data successfully loaded.")
        return extracted_involvement_data

    def get_members_involvement_data(self) -> Members:
        return self.get_timesheets_extracted_data().data

    def send_involvement_summary_email(
            self,
            member_full_name: str,
            preceding_months_count: int = 3,
    ) -> Member:
        member = self.get_members_involvement_data()[member_full_name]

        monthly_involvement = member.get_involvement_slice(preceding_months_count)
        grand_total = sum(month.total_hours for month in monthly_involvement.values() if month is not None)

        rendered_html = render_mjml_template_to_html(
            Path("templates/email/involvement_summary.mjml"),
            {
                "member": member,
                "monthly_involvement": monthly_involvement,
                "grand_total": grand_total
            }
        )

        email = Mail(
            to_emails=settings.debug_recipient_email_address or member.email_address,
            from_email=From(settings.from_email_address, settings.from_name),
            subject=f"[CHDLM] Données de participation pour {member.full_name}",
            html_content=rendered_html,
        )
        email.reply_to = settings.reply_to_email_address

        send_result = self.sendgrid_api.send(email)

        if send_result.status_code != 202:
            raise EmailSendingException

        return member
