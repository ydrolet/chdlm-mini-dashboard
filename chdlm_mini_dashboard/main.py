from chdlm_mini_dashboard.clients.google_api import GoogleApiClient
from chdlm_mini_dashboard.settings import settings

google_api_client = GoogleApiClient(settings.token_file_path, ["https://www.googleapis.com/auth/spreadsheets"])

response = google_api_client.execute_script_function(settings.script_id, "extractData")

print(response)
