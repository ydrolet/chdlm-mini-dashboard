from pydantic import FilePath
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    script_id: str
    token_file_path: FilePath

    model_config = SettingsConfigDict(
        env_file='.env',
    )


settings = Settings()
