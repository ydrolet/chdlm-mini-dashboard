import logging
from pathlib import Path

from supabase import Client

from server.helpers.mjml import render_mjml_template_to_html
from server.helpers.utils import EmailSendingException, default_timezone, NoEmailAddress
from server.models.chdlm_involvement_data import Members, TimesheetsExtractedData, Member
from server.services.mailgun import MailgunClient, From
from server.settings import settings


class ChdlmInvolvementManager:
    def __init__(self, supabase_api_client: Client, mailgun_api_client: MailgunClient):
        self.supabase_api_client = supabase_api_client
        self.mailgun_api_client = mailgun_api_client

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
        preceding_months_count: int = 4,
    ) -> Member:
        extracted_data = self.get_timesheets_extracted_data()
        member = extracted_data.data[member_full_name]

        if member.email_address is None:
            raise NoEmailAddress

        monthly_involvement = member.get_involvement_slice(preceding_months_count)
        grand_total = sum(month.total_hours for month in monthly_involvement.values() if month is not None)

        rendered_html = render_mjml_template_to_html(
            Path("templates/email/involvement_summary.mjml"),
            {
                "member": member,
                "latest_extraction": extracted_data.extraction_info.timestamp.in_tz(default_timezone).format("D MMMM YYYY à HH:mm"),
                "monthly_involvement": monthly_involvement,
                "grand_total": grand_total,
            }
        )

        send_result = self.mailgun_api_client.send_email(
            from_=From(name=settings.from_name, email=settings.from_email_address),
            to=settings.debug_recipient_email_address or member.email_address,
            subject=f"[CHDLM] Bilan de participation de {member.full_name}",
            html_content=rendered_html,
        )

        if send_result.status_code != 200:
            raise EmailSendingException

        return member
