# app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, ValidationError
from app.core.logging_config import setup_logging

logger = setup_logging()

class Settings(BaseSettings):
    COHERE_API_KEY: str = Field(..., min_length=1, description="API key for Cohere")

    model_config = SettingsConfigDict(env_file=".env")

try:
    settings = Settings()
    logger.info("Configuration loaded successfully")
except ValidationError as ve:
    logger.error(f"Configuration validation error: {ve}")
    raise
except Exception as e:
    logger.error(f"Error loading configuration: {e}")
    raise
