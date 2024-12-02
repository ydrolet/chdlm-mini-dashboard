from typing import Annotated

from fastapi import Depends
from supabase import create_client, Client, ClientOptions

from server.managers.chdlm_involvement import ChdlmInvolvementManager
from server.services.mailgun import MailgunClient
from server.settings import settings


def get_supabase_api_client() -> Client:
    return create_client(
        supabase_url=str(settings.supabase_project_url).rstrip("/"),
        supabase_key=settings.supabase_api_key,
        options=ClientOptions(headers={"Authorization": f"Bearer {settings.supabase_service_account_jwt}"}),
    )


def get_mailgun_api_client() -> MailgunClient:
    return MailgunClient(
        api_key=settings.mailgun_api_key,
        domain_name=settings.mailgun_domain_name,
    )


def get_chdlm_involvement_manager(
        supabase_api_client: Annotated[Client, Depends(get_supabase_api_client)],
        mailgun_api_client: Annotated[MailgunClient, Depends(get_mailgun_api_client)],
) -> ChdlmInvolvementManager:
    return ChdlmInvolvementManager(
        supabase_api_client,
        mailgun_api_client,
    )
