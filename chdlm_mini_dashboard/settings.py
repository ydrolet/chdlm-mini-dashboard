from pydantic import FilePath
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    chdlm_involvement_data_extraction_script_id: str
    token_file_path: FilePath

    model_config = SettingsConfigDict(
        env_file='.env',
    )


settings = Settings()
