import logging
from pathlib import Path

from pendulum import duration
from starlette.concurrency import run_in_threadpool

from chdlm_mini_dashboard.clients.google_api import GoogleApiClient
from chdlm_mini_dashboard.helpers.mjml import render_mjml_template_to_html
from chdlm_mini_dashboard.models.chdlm_involvement_data import Members, Residents, ExtractedInvolvementData, Resident
from chdlm_mini_dashboard.helpers.utils import persistent_memoize, execute_one_time_and_wait
from chdlm_mini_dashboard.settings import settings


class ChdlmInvolvementManager:
    def __init__(self, google_api_client: GoogleApiClient, data_extraction_script_id: str):
        self.google_api_client = google_api_client
        self.data_extraction_script_id = data_extraction_script_id
        self._instance_keys = [data_extraction_script_id]

    @execute_one_time_and_wait
    @persistent_memoize(ttl=duration(minutes=15))
    async def get_involvement_data(self) -> Members:
        logging.info("Loading involvement data...")
        response = await run_in_threadpool(self.google_api_client.execute_script_function,
                                           self.data_extraction_script_id, "extractInvolvementData")
        extracted_involvement_data = ExtractedInvolvementData.model_validate(response["response"]["result"])
        logging.info("Involvement data successfully loaded.")
        return extracted_involvement_data.data

    @persistent_memoize(ttl=duration(hours=6))
    async def get_residents_list(self) -> Residents:
        logging.info("Loading residents list...")
        response = self.google_api_client.execute_script_function(
            self.data_extraction_script_id, "loadChdlmResidents")
        extracted_residents_list = Residents.model_validate(response["response"]["result"])
        logging.info("Residents list successfully loaded.")
        return extracted_residents_list

    async def send_involvement_summary_email(
            self,
            resident: Resident,
            preceding_months_count: int = 3,
    ):
        involvement_data = await self.get_involvement_data()
        member = involvement_data[resident.full_name]

        monthly_involvement = member.get_involvement_slice(preceding_months_count)
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
