from chdlm_mini_dashboard.clients.google_api import GoogleApiClient
from chdlm_mini_dashboard.models.chdlm_involvement_data import Members, Residents, ExtractedInvolvementData


class ChdlmInvolvementManager:
    def __init__(self, google_api_client: GoogleApiClient, data_extraction_script_id: str):
        self.google_api_client = google_api_client
        self.data_extraction_script_id = data_extraction_script_id

    def get_involvement_data(self) -> Members:
        response = self.google_api_client.execute_script_function(
            self.data_extraction_script_id, "extractInvolvementData")
        extracted_involvement_data = ExtractedInvolvementData.model_validate(response["response"]["result"])
        return extracted_involvement_data.data

    def get_residents_list(self) -> Residents:
        response = self.google_api_client.execute_script_function(
            self.data_extraction_script_id, "loadChdlmResidents")
        return Residents.model_validate(response["response"]["result"])
