import logging

from pendulum import duration

from chdlm_mini_dashboard.clients.google_api import GoogleApiClient
from chdlm_mini_dashboard.models.chdlm_involvement_data import Members, Residents, ExtractedInvolvementData
from chdlm_mini_dashboard.utils import persistent_memoize


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
