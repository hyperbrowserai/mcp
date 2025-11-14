from __future__ import annotations

import logging

import structlog


def configure_logging(level: str) -> None:
    logging_level = getattr(logging, level.upper(), logging.INFO)
    logging.basicConfig(
        level=logging_level,
        format="%(message)s",
        handlers=[logging.StreamHandler()],
    )
    structlog.configure(
        processors=[
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(logging_level),
        cache_logger_on_first_use=True,
    )
