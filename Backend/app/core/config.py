import os
from pydantic_settings import BaseSettings
from pydantic import Field, ValidationError
from app.core.logging_config import setup_logging

logger = setup_logging()

class Settings(BaseSettings):
    COHERE_API_KEY: str = Field(..., description="API key for Cohere")
    OPENAI_API_KEY: str = Field(..., description="API key for OpenAI")
    QDRANT_API_KEY: str = Field(..., description="API key for Qdrant")
    QDRANT_URL: str = Field(..., description="URL for QDRANT")

    class Config:
        env_file = ".env"

try:
    settings = Settings()

    # Ensure API keys are set in the environment for other modules to use
    os.environ["COHERE_API_KEY"] = settings.COHERE_API_KEY
    os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY
    os.environ["QDRANT_API_KEY"] = settings.QDRANT_API_KEY
    os.environ["QDRANT_URL"] = settings.QDRANT_URL

    # Explicit check for OpenAI API Key
    if not settings.OPENAI_API_KEY:
        raise ValueError(
            "No API key found for OpenAI.\n"
            "Please set either the OPENAI_API_KEY environment variable or openai.api_key prior to initialization.\n"
            "API keys can be found or created at https://platform.openai.com/account/api-keys"
        )

    logger.info("Configuration loaded successfully and environment variables set.")
except ValidationError as ve:
    logger.error(f"Configuration validation error: {ve}")
    raise
except ValueError as ve:
    logger.error(str(ve))
    raise
except Exception as e:
    logger.error(f"Error loading configuration: {e}")
    raise
