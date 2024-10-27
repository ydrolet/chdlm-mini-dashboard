from typing import Annotated

from fastapi import Depends
from sendgrid import SendGridAPIClient
from supabase import create_client, Client, ClientOptions

from server.managers.chdlm_involvement import ChdlmInvolvementManager
from server.settings import settings


def get_supabase_api_client() -> Client:
    return create_client(
        supabase_url=str(settings.supabase_project_url).rstrip("/"),
        supabase_key=settings.supabase_api_key,
        options=ClientOptions(headers={"Authorization": f"Bearer {settings.supabase_service_account_jwt}"}),
    )


def get_sendgrid_api_client() -> SendGridAPIClient:
    return SendGridAPIClient(api_key=settings.sendgrid_api_key)


def get_chdlm_involvement_manager(
        supabase_api_client: Annotated[Client, Depends(get_supabase_api_client)],
        sendgrid_api_client: Annotated[SendGridAPIClient, Depends(get_sendgrid_api_client)],
) -> ChdlmInvolvementManager:
    return ChdlmInvolvementManager(
        supabase_api_client,
        sendgrid_api_client,
    )
