---
title: "Module 6: Security"
sidebar_position: 6
---

# Module 6: Security

## Learning Objectives

By the end of this module, you will be able to:

- Explain and configure Django's security middleware
- Implement token-based API authentication
- Configure CORS and CSRF protection for APIs
- Prevent SQL injection, XSS, and other common vulnerabilities
- Manage secrets and environment variables safely
- Audit an Are-Self deployment for security issues

## Security Is Not Optional

Every application connected to the internet will be attacked. Automated scanners probe for common vulnerabilities constantly. A single misconfiguration can expose user data, API keys, or system access.

Are-Self manages AI model API keys, user identity data, and system state. A security breach could expose API keys (financial damage), corrupt memories (data integrity damage), or allow unauthorized system access (operational damage).

Security is a practice, not a feature. You do not add it once and forget it. You maintain it continuously.

## Django's Built-In Security

Django provides robust security out of the box, but you must configure it correctly.

### Security Middleware

```python
# settings.py — production security settings
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",  # Must be first
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# HTTPS enforcement
SECURE_SSL_REDIRECT = True           # Redirect all HTTP to HTTPS
SECURE_HSTS_SECONDS = 31536000       # Tell browsers to only use HTTPS (1 year)
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Cookie security
SESSION_COOKIE_SECURE = True         # Only send cookies over HTTPS
CSRF_COOKIE_SECURE = True            # Only send CSRF cookie over HTTPS
SESSION_COOKIE_HTTPONLY = True        # JavaScript cannot access session cookie
CSRF_COOKIE_HTTPONLY = True

# Content security
SECURE_CONTENT_TYPE_NOSNIFF = True   # Prevent MIME type sniffing
X_FRAME_OPTIONS = "DENY"             # Prevent clickjacking
SECURE_BROWSER_XSS_FILTER = True
```

### What Each Setting Prevents

| Setting | Attack Prevented |
|---------|-----------------|
| `SECURE_SSL_REDIRECT` | Man-in-the-middle attacks on HTTP |
| `SECURE_HSTS_SECONDS` | SSL stripping attacks |
| `SESSION_COOKIE_HTTPONLY` | Session hijacking via XSS |
| `CSRF_COOKIE_SECURE` | Cross-site request forgery over HTTP |
| `X_FRAME_OPTIONS = "DENY"` | Clickjacking (embedding site in iframe) |
| `SECURE_CONTENT_TYPE_NOSNIFF` | MIME confusion attacks |

## Authentication: API Tokens

Are-Self uses token-based authentication for its DRF API:

```python
# settings.py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}
```

### Token Management

```python
from rest_framework.authtoken.models import Token

# Generate a token for a user
token, created = Token.objects.get_or_create(user=user)
print(token.key)  # "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"

# Client sends token in headers
# Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

### Custom Permission Classes

```python
from rest_framework.permissions import BasePermission


class IsAdminOrReadOnly(BasePermission):
    """Allow read access to all authenticated users, write access only to admins."""
    
    def has_permission(self, request, view):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return request.user.is_authenticated
        return request.user.is_staff


class HasBrainRegionAccess(BasePermission):
    """Check if the user has access to a specific brain region."""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        region = view.kwargs.get("region")
        return request.user.has_perm(f"access_{region}")


class OwnsIdentityDisc(BasePermission):
    """Only allow access to the user's own IdentityDisc."""
    
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
```

### Applying Permissions to ViewSets

```python
class EngramViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    
    def get_permissions(self):
        if self.action == "destroy":
            # Only admins can delete engrams
            return [IsAuthenticated(), IsAdminUser()]
        return super().get_permissions()
```

## CORS: Cross-Origin Resource Sharing

If Are-Self's API is called from a web frontend on a different domain, you need CORS configuration:

```python
# settings.py
INSTALLED_APPS += ["corsheaders"]

# Restrictive — only allow specific origins
CORS_ALLOWED_ORIGINS = [
    "https://dashboard.are-self.example.com",
    "https://admin.are-self.example.com",
]

# Or pattern-based
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://\w+\.are-self\.example\.com$",
]

# Credentials (cookies, authorization headers)
CORS_ALLOW_CREDENTIALS = True

# Allowed headers
CORS_ALLOW_HEADERS = [
    "accept",
    "authorization",
    "content-type",
    "x-requested-with",
]
```

Never use `CORS_ALLOW_ALL_ORIGINS = True` in production. It defeats the purpose of CORS entirely.

## CSRF Protection for APIs

Django's CSRF protection prevents cross-site request forgery — where a malicious site tricks a user's browser into making requests to your site.

For token-authenticated API endpoints, CSRF is typically handled by the authentication mechanism itself. Token authentication is immune to CSRF because the token must be explicitly included in the request header — it is not automatically sent by the browser like cookies are.

```python
# For views that must be CSRF-exempt (e.g., webhook receivers)
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def webhook_receiver(request):
    """Receive webhooks from external services."""
    # Verify the webhook signature instead
    signature = request.headers.get("X-Webhook-Signature")
    if not verify_signature(signature, request.body):
        return HttpResponse(status=403)
    # Process webhook...
```

## SQL Injection Prevention

Django's ORM prevents SQL injection by default through parameterized queries. But raw SQL is sometimes necessary:

```python
# SAFE — parameterized query
Engram.objects.raw(
    "SELECT * FROM hippocampus_engram WHERE relevance_score > %s",
    [min_score]
)

# DANGEROUS — string interpolation (NEVER DO THIS)
Engram.objects.raw(
    f"SELECT * FROM hippocampus_engram WHERE relevance_score > {min_score}"
)

# SAFE — using extra() with params
Engram.objects.extra(
    where=["relevance_score > %s"],
    params=[min_score]
)
```

The rule: never put user input directly into a SQL string. Always use parameterized queries.

## Secrets Management

```python
# WRONG — secrets in code
SECRET_KEY = "my-super-secret-key-12345"
OPENAI_API_KEY = "sk-abc123..."

# RIGHT — secrets from environment variables
import os
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]

# BETTER — secrets from a secrets manager or .env file
from dotenv import load_dotenv
load_dotenv()  # Loads from .env file

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
```

### The `.env` File

```bash
# .env — NEVER commit this to version control
DJANGO_SECRET_KEY=your-random-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/are_self_db
OPENAI_API_KEY=sk-your-key-here
REDIS_URL=redis://localhost:6379/0
```

```gitignore
# .gitignore — always include this
.env
*.pem
*.key
secrets/
```

### Validating Settings at Startup

```python
# settings.py
REQUIRED_ENV_VARS = [
    "DJANGO_SECRET_KEY",
    "DATABASE_URL",
    "OPENAI_API_KEY",
]

missing = [var for var in REQUIRED_ENV_VARS if var not in os.environ]
if missing:
    raise ImproperlyConfigured(
        f"Missing required environment variables: {', '.join(missing)}"
    )
```

## Are-Self Connection: API Key Protection

Are-Self's Hypothalamus manages multiple AI model API keys. These must be protected:

```python
class ModelConfig(models.Model):
    name = models.CharField(max_length=100)
    api_key = models.CharField(max_length=255)  # Encrypted at rest
    
    def save(self, *args, **kwargs):
        """Encrypt the API key before saving."""
        if self.api_key and not self.api_key.startswith("enc:"):
            self.api_key = encrypt(self.api_key)
        super().save(*args, **kwargs)
    
    def get_api_key(self):
        """Decrypt the API key for use."""
        if self.api_key.startswith("enc:"):
            return decrypt(self.api_key)
        return self.api_key


# In serializers — NEVER expose API keys
class ModelConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelConfig
        fields = ["id", "name", "cost_per_request", "is_active"]
        # Note: api_key is NOT in the fields list
```

## Rate Limiting

Protect your API from abuse:

```python
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

class BurstRateThrottle(UserRateThrottle):
    rate = "60/minute"

class SustainedRateThrottle(UserRateThrottle):
    rate = "1000/day"

# settings.py
REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": [
        "are_self.common.throttling.BurstRateThrottle",
        "are_self.common.throttling.SustainedRateThrottle",
    ],
}
```

## Security Checklist

Before deploying Are-Self (or any Django application):

- [ ] `DEBUG = False` in production
- [ ] `SECRET_KEY` is random and not in source control
- [ ] `ALLOWED_HOSTS` is set (not `["*"]`)
- [ ] HTTPS is enforced with HSTS
- [ ] Cookies are secure and HTTP-only
- [ ] CORS is configured with specific origins
- [ ] API keys are not exposed in API responses
- [ ] Database credentials are in environment variables
- [ ] Rate limiting is enabled
- [ ] Admin URL is changed from `/admin/`
- [ ] Unused Django apps and middleware are removed
- [ ] Django security check passes: `python manage.py check --deploy`

## Exercises

### Exercise 1: Security Audit

Run `python manage.py check --deploy` on an Are-Self installation. Fix every warning. Document what each warning means and how your fix addresses it.

### Exercise 2: Permission System

Design and implement a permission system for Are-Self where:
- Regular users can read engrams and pathways
- Operators can create and update engrams
- Admins can delete engrams and modify system configuration
- Each brain region can have its own permission set

### Exercise 3: API Key Rotation

Implement an API key rotation system:
- Generate new keys without invalidating old ones
- Grace period where both old and new keys work
- Automatic expiration of old keys after the grace period
- Logging of which key was used for each request

### Exercise 4: Input Validation

Write a comprehensive input validation layer for the Engram creation endpoint:
- Name: non-empty, max 255 chars, no script tags
- Description: max 10,000 chars, sanitized HTML
- Relevance score: float between 0.0 and 1.0
- Tags: max 20 tags, each max 50 chars, alphanumeric plus hyphens only

Return clear, non-revealing error messages.

### Exercise 5: Security Monitoring

Design a security monitoring system that:
- Logs all authentication failures
- Alerts on brute-force patterns (many failures from one IP)
- Tracks API key usage patterns
- Detects and reports suspicious query patterns

## Reflection

Security is the Variable of **Permadeath** made concrete. A data breach cannot be undone. Once secrets are exposed, they are compromised forever. Once user data is leaked, it is leaked permanently. There is no "undo" for a security failure in production.

This gives security work a gravity that other engineering does not have. A slow endpoint can be optimized later. A missing feature can be added next sprint. But a security hole exploited today causes damage that persists.

Treat security with the seriousness it demands. Not paranoia — that leads to systems so locked down they are unusable. But discipline. Every configuration choice should be intentional. Every default should be examined. Every piece of user input should be treated as potentially hostile until validated.

The system trusts nothing. The engineer trusts nothing. And through that disciplined skepticism, the system becomes trustworthy.
