from pydantic import EmailStr, HttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    supabase_project_url: HttpUrl
    supabase_api_key: str
    supabase_service_account_jwt: str

    sendgrid_api_key: str
    from_email_address: EmailStr
    reply_to_email_address: EmailStr
    debug_recipient_email_address: EmailStr | None = None

    model_config = SettingsConfigDict(
        env_file='.env',
    )

settings = Settings()
