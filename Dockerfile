# syntax=docker/dockerfile:1.9
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY pyproject.toml README.md /app/
RUN pip install --upgrade pip && pip install .

COPY src /app/src

# Re-install in editable mode after sources are present for better debugging
RUN pip install -e .

ENV HOST=0.0.0.0 \
    PORT=8000

EXPOSE 8000

CMD ["hyperbrowser-mcp", "serve", "--host", "0.0.0.0", "--port", "8000"]
