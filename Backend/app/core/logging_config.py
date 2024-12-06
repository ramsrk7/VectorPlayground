# app/core/logging_config.py
import logging
import os
import sys
from logging.handlers import RotatingFileHandler

def setup_logging():
    # Get the log level from the environment variable or default to DEBUG
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    # Validate log level
    if log_level not in ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]:
        log_level = "DEBUG"

    logger = logging.getLogger("Backend")
    logger.setLevel(getattr(logging, log_level))  # Dynamically set the logging level

    # Define log format
    formatter = logging.Formatter(
        fmt="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Console handler for output to stdout
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(getattr(logging, log_level))
    console_handler.setFormatter(formatter)

    # (Optional) File handler for logging to a file with rotation
    file_handler = RotatingFileHandler("app.log", maxBytes=10*1024*1024, backupCount=5)
    file_handler.setLevel(logging.INFO)  # File logging level remains fixed
    file_handler.setFormatter(formatter)

    # Add handlers to the logger
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger
