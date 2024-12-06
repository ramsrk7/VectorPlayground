# app/core/config.py
import os
from pydantic_settings import BaseSettings
from app.core.logging_config import setup_logging

logger = setup_logging()

class Settings(BaseSettings):
    COHERE_API_KEY: str = os.getenv("COHERE_API_KEY", "")

    class Config:
        env_file = ".env"

try:
    settings = Settings()
    logger.info("Configuration loaded successfully")
except Exception as e:
    logger.error(f"Error loading configuration: {e}")
    raise
