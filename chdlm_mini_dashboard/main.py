import logging

from chdlm_mini_dashboard.clients.google_api import GoogleApiClient
from chdlm_mini_dashboard.managers.chdlm_involvement import ChdlmInvolvementManager
from chdlm_mini_dashboard.settings import settings

logging.basicConfig(level=logging.INFO)

google_api_client = GoogleApiClient(settings.token_file_path, ["https://www.googleapis.com/auth/spreadsheets"])
chdlm_involvement_manager = ChdlmInvolvementManager(
    google_api_client, settings.chdlm_involvement_data_extraction_script_id)

residents = chdlm_involvement_manager.get_residents_list()
print(residents)

involvement_data = chdlm_involvement_manager.get_involvement_data()
print(involvement_data)
