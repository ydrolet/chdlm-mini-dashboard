from typing import Annotated

from fastapi import Depends

from chdlm_mini_dashboard.clients.google_api import GoogleApiClient
from chdlm_mini_dashboard.managers.chdlm_involvement import ChdlmInvolvementManager
from chdlm_mini_dashboard.settings import settings


def get_google_api_client() -> GoogleApiClient:
    return GoogleApiClient(
        settings.token_file_path,
        ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/gmail.send"],
    )


def get_chdlm_involvement_manager(
        google_api_client: Annotated[GoogleApiClient, Depends(get_google_api_client)]
) -> ChdlmInvolvementManager:
    return ChdlmInvolvementManager(google_api_client, settings.chdlm_involvement_data_extraction_script_id)
