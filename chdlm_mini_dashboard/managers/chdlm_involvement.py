import logging
from pathlib import Path

import pendulum
from pendulum import duration

from chdlm_mini_dashboard.clients.google_api import GoogleApiClient
from chdlm_mini_dashboard.helpers.mjml import render_mjml_template_to_html
from chdlm_mini_dashboard.models.chdlm_involvement_data import Members, Residents, ExtractedInvolvementData, Member, \
    Period
from chdlm_mini_dashboard.helpers.utils import persistent_memoize
from chdlm_mini_dashboard.settings import settings


class ChdlmInvolvementManager:
    def __init__(self, google_api_client: GoogleApiClient, data_extraction_script_id: str):
        self.google_api_client = google_api_client
        self.data_extraction_script_id = data_extraction_script_id
        self._instance_keys = [data_extraction_script_id]

    @persistent_memoize(ttl=duration(days=5))
    def get_involvement_data(self) -> Members:
        logging.info("Loading involvement data...")
        response = self.google_api_client.execute_script_function(
            self.data_extraction_script_id, "extractInvolvementData")
        extracted_involvement_data = ExtractedInvolvementData.model_validate(response["response"]["result"])
        logging.info("Involvement data successfully loaded.")
        return extracted_involvement_data.data

    @persistent_memoize(ttl=duration(days=5))
    def get_residents_list(self) -> Residents:
        logging.info("Loading residents list...")
        response = self.google_api_client.execute_script_function(
            self.data_extraction_script_id, "loadChdlmResidents")
        extracted_residents_list = Residents.model_validate(response["response"]["result"])
        logging.info("Residents list successfully loaded.")
        return extracted_residents_list

    def send_involvement_summary_email(self, member: Member, previous_months_count: int = 3):
        monthly_involvement = member.get_involvement_slice(previous_months_count)
        grand_total = sum(month.total_hours for month in monthly_involvement.values() if month is not None)

        rendered_html = render_mjml_template_to_html(
            Path("chdlm_mini_dashboard/templates/email/involvement_summary.mjml"),
            {
                "member": member,
                "monthly_involvement": monthly_involvement,
                "grand_total": grand_total
            }
        )

        self.google_api_client.send_email(
            f"[CHDLM] Données de participation pour {member.full_name}",
            rendered_html,
            settings.debug_email_address or member.email_address
        )
