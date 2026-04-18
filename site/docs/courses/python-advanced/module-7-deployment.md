---
title: "Module 7: Deployment"
sidebar_position: 7
---

# Module 7: Deployment

## Learning Objectives

By the end of this module, you will be able to:

- Containerize a Django application with Docker
- Configure Gunicorn as a production WSGI server
- Set up Nginx as a reverse proxy
- Manage PostgreSQL with pgvector in a production environment
- Handle environment variables and secrets across environments
- Implement health checks and monitoring
- Deploy Are-Self with a production-ready configuration

## The Gap Between Development and Production

On your development machine, you run `python manage.py runserver`. This is a single-threaded, non-optimized server designed for development convenience. It cannot handle concurrent requests well, has no static file optimization, and lacks the security hardening that production demands.

A production deployment requires:
- A multi-process application server (Gunicorn)
- A reverse proxy for TLS, static files, and load balancing (Nginx)
- A managed database (PostgreSQL with pgvector)
- A message broker for task queues (Redis)
- Environment-based configuration
- Health checks and monitoring
- Log aggregation

## Docker: Containerizing Are-Self

### The Dockerfile

```dockerfile
# are_self/Dockerfile
FROM python:3.12-slim AS base

# System dependencies for psycopg2 and pgvector
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r areself && useradd -r -g areself areself

WORKDIR /app

# Install Python dependencies first (caching layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Switch to non-root user
USER areself

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health/')" || exit 1

EXPOSE 8000

CMD ["gunicorn", "are_self.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "4", \
     "--threads", "2", \
     "--timeout", "120", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
```

Key decisions:
- **`python:3.12-slim`** — minimal base image, smaller attack surface
- **Non-root user** — the container runs as `areself`, not root
- **Layer caching** — requirements are copied and installed before code, so code changes do not rebuild the dependency layer
- **`collectstatic`** — baked into the image at build time, not runtime

### Docker Compose for Full Stack

```yaml
# docker-compose.yml
services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DJANGO_SETTINGS_MODULE=are_self.settings.production
      - DATABASE_URL=postgresql://areself:password@db:5432/areself
      - REDIS_URL=redis://redis:6379/0
      - DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: pgvector/pgvector:pg16
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=areself
      - POSTGRES_USER=areself
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U areself"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  celery_worker:
    build: .
    command: celery -A are_self worker -l info --concurrency=4
    environment:
      - DJANGO_SETTINGS_MODULE=are_self.settings.production
      - DATABASE_URL=postgresql://areself:password@db:5432/areself
      - REDIS_URL=redis://redis:6379/0
      - DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
      - redis
    restart: unless-stopped

  celery_beat:
    build: .
    command: celery -A are_self beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
    environment:
      - DJANGO_SETTINGS_MODULE=are_self.settings.production
      - DATABASE_URL=postgresql://areself:password@db:5432/areself
      - REDIS_URL=redis://redis:6379/0
      - DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}
    depends_on:
      - db
      - redis
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./staticfiles:/app/staticfiles:ro
      - ./certbot/conf:/etc/letsencrypt:ro
    depends_on:
      - web
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

Note the `pgvector/pgvector:pg16` image — this is PostgreSQL 16 with the pgvector extension pre-installed. Are-Self's 768-dimensional vectors require this.

## Gunicorn Configuration

```python
# gunicorn.conf.py
import multiprocessing

# Workers
workers = multiprocessing.cpu_count() * 2 + 1
threads = 2
worker_class = "gthread"

# Networking
bind = "0.0.0.0:8000"
backlog = 2048

# Timeouts
timeout = 120           # Worker timeout for slow requests
graceful_timeout = 30   # Time to finish requests on restart
keepalive = 5

# Logging
accesslog = "-"         # stdout
errorlog = "-"          # stderr
loglevel = "info"

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# Process naming
proc_name = "are_self"

# Restart workers periodically to prevent memory leaks
max_requests = 1000
max_requests_jitter = 50
```

The formula `workers = CPU_COUNT * 2 + 1` is the standard recommendation. For a 4-core machine, this gives 9 workers. Each can handle one request at a time (plus 2 threads for I/O-bound work).

## Nginx Configuration

```nginx
# nginx/nginx.conf
upstream are_self {
    server web:8000;
}

server {
    listen 80;
    server_name are-self.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name are-self.example.com;

    ssl_certificate /etc/letsencrypt/live/are-self.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/are-self.example.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Static files — served directly by Nginx (fast)
    location /static/ {
        alias /app/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # API and application
    location / {
        proxy_pass http://are_self;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support (for Synaptic Cleft neurotransmitters)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
    }

    # Health check endpoint
    location /health/ {
        proxy_pass http://are_self;
        access_log off;
    }

    # Request size limit
    client_max_body_size 10M;
}
```

## Production Django Settings

```python
# are_self/settings/production.py
from .base import *
import dj_database_url

DEBUG = False

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")

# Database
DATABASES = {
    "default": dj_database_url.config(
        default=os.environ["DATABASE_URL"],
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Cache
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": os.environ["REDIS_URL"],
    }
}

# Static files
STATIC_URL = "/static/"
STATIC_ROOT = "/app/staticfiles"
STATICFILES_STORAGE = "django.contrib.staticfiles.storage.ManifestStaticFilesStorage"

# Celery
CELERY_BROKER_URL = os.environ["REDIS_URL"]
CELERY_RESULT_BACKEND = os.environ["REDIS_URL"]

# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {
            "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
            "format": "%(asctime)s %(name)s %(levelname)s %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "json",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django": {"level": "WARNING"},
        "are_self": {"level": "INFO"},
    },
}
```

## Health Checks

```python
# are_self/common/views.py
from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache


def health_check(request):
    """Health check endpoint for load balancers and monitoring."""
    checks = {}
    
    # Database
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        checks["database"] = "healthy"
    except Exception as e:
        checks["database"] = f"unhealthy: {e}"
    
    # Cache
    try:
        cache.set("health_check", "ok", 10)
        if cache.get("health_check") == "ok":
            checks["cache"] = "healthy"
        else:
            checks["cache"] = "unhealthy: read mismatch"
    except Exception as e:
        checks["cache"] = f"unhealthy: {e}"
    
    # Overall status
    all_healthy = all(v == "healthy" for v in checks.values())
    status_code = 200 if all_healthy else 503
    
    return JsonResponse(
        {"status": "healthy" if all_healthy else "unhealthy", "checks": checks},
        status=status_code,
    )
```

## Database Migrations in Production

```bash
# In your deployment script or CI/CD pipeline
docker compose exec web python manage.py migrate --noinput

# For pgvector, ensure the extension is created
docker compose exec db psql -U areself -d areself -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

Migrations should be backward-compatible. If you are renaming a field, do it in two deployments:
1. Add the new field, deploy code that writes to both
2. Migrate data, deploy code that reads from the new field, drop the old field

## Environment Management

```python
# are_self/settings/__init__.py
import os

environment = os.environ.get("DJANGO_SETTINGS_MODULE", "are_self.settings.development")
```

Maintain separate settings files:
- `settings/base.py` — shared settings
- `settings/development.py` — DEBUG=True, local database, verbose logging
- `settings/production.py` — DEBUG=False, remote database, JSON logging
- `settings/testing.py` — in-memory database, no external services

## Exercises

### Exercise 1: Dockerize Are-Self

Write a complete Dockerfile and docker-compose.yml for Are-Self. Include:
- Web application (Gunicorn)
- PostgreSQL with pgvector
- Redis
- Celery worker and beat
- Nginx

Verify the entire stack starts with `docker compose up`.

### Exercise 2: Production Settings

Create a complete `settings/production.py` that:
- Reads all secrets from environment variables
- Validates required variables at startup
- Configures logging in JSON format
- Sets all security headers
- Configures the cache backend

### Exercise 3: Health Check System

Implement a comprehensive health check that verifies:
- Database connectivity and query performance
- Redis connectivity
- pgvector extension availability
- Celery worker availability (via ping)
- Embedding service availability
- Disk space remaining

Return detailed status for each check.

### Exercise 4: Zero-Downtime Deployment

Design a deployment strategy that:
- Builds the new Docker image
- Runs migrations
- Starts new containers alongside old ones
- Switches traffic to new containers
- Stops old containers
- Rolls back if health checks fail

Document the strategy as a deployment script.

### Exercise 5: Monitoring and Alerting

Design a monitoring configuration for Are-Self:
- What metrics should be collected? (response time, error rate, query count, etc.)
- What thresholds trigger alerts?
- What is the escalation path for each alert type?
- How do you correlate neurotransmitter signals with system health?

## Reflection

Deployment is where the Variable of **Responsibility** reaches its fullest expression. Every decision you have made in development — every model design, every security configuration, every performance optimization — is tested when real users depend on the system.

It also engages **Perseverance**. The first deployment rarely goes smoothly. Configuration issues, missing environment variables, unexpected database states — these are not failures. They are the process. Each issue resolved makes the next deployment smoother.

And it engages **Fear** — the healthy kind. The fear that asks "what if the database migration fails halfway?" and builds rollback procedures. The fear that asks "what if the health check passes but the embedding service is slow?" and builds granular monitoring.

Production is not where you hope things work. It is where you verify they do, continuously, with automated checks that never sleep. Build systems that earn trust through rigorous, ongoing verification.
