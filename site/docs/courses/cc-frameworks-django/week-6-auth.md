---
title: "Week 6 — Authentication and Permissions"
sidebar_position: 8
---

# Week 6: Authentication and Permissions

Students secure their APIs. They learn Django's built-in authentication system, DRF's permission classes, and token-based authentication. The lab has them lock down their API so that unauthenticated users get 401s and unauthorized users get 403s. The week opens with Iteration 3 Demos.

## Week Overview

**Theme:** Django auth, DRF permissions, and token authentication

**Primary Variable:** Fear + Responsibility — Security is driven by the fear of what happens when you get it wrong (data breaches, unauthorized access, user harm) and the responsibility to protect the people who trust your system with their data.

<!-- Definition of Ready — perspective -->

**Why This Week Matters:**
An unsecured API is not an API — it's a liability. Every production system needs authentication (who are you?) and authorization (what can you do?). Django provides a robust auth system. DRF extends it with permission classes that attach security to every endpoint. Token authentication enables stateless API access for clients that can't use cookies. Students who understand these layers can secure any Django application.

<!-- Definition of Ready — assertions -->

**Learning Goals:**

- Explain the difference between authentication (identity) and authorization (permission)
- Configure Django's built-in User model and authentication backends
- Implement DRF permission classes: `IsAuthenticated`, `IsAdminUser`, `IsAuthenticatedOrReadOnly`
- Write custom permission classes for domain-specific access control
- Set up token authentication for API clients
- Test authentication and permission behavior with DRF's test client

<!-- Definition of Ready — outside -->

**What This Week Is Not:**

- No OAuth2 or social authentication (mentioned, not implemented)
- No JWT (compared to DRF tokens conceptually)
- No frontend authentication flows
- No CSRF deep dive (mentioned in context of API tokens)

---

## Iteration 3 Demo and Retrospective (Day 1 opening, 30 minutes)

### Demo (20 minutes)

Students demonstrate their Week 5 API:
- Light and full serializer variants
- ViewSet with CRUD and custom actions
- Router-generated URL patterns
- Filtering with DjangoFilterBackend

### Retrospective (10 minutes)

- Is the light/full pattern valuable or over-engineering? Where did it help?
- How are Standups working? Adjust the format if needed.
- Iteration 3 commitments.

---

## Day 1 (Lecture): Django Authentication

### Objective

Students will understand Django's authentication system, the User model, authentication backends, and how sessions work.

### Materials Needed

- Projector with IDE
- Are-Self running with the admin login page accessible
- Whiteboard for auth flow diagrams

### Lecture Content (45 minutes, after Demo/Retro)

#### Opening (5 minutes)

"Your API works. Anyone can read, create, update, and delete any object. That's fine for development. It's catastrophic for production. Today we fix it."

#### Part 1: Authentication vs. Authorization (10 minutes)

Draw on the board:

```
Authentication: WHO are you?
    → Username/password, token, certificate, biometric

Authorization: WHAT can you do?
    → Read-only, read-write, admin, owner-only
```

Authentication comes first. You can't decide what someone is allowed to do until you know who they are. Django handles both, but they're separate systems.

#### Part 2: Django's Auth System (15 minutes)

Walk through the built-in components:

- `django.contrib.auth` — The app that provides User, Group, Permission
- `User` model — username, email, password (hashed, never plain text), is_staff, is_superuser, is_active
- `authenticate()` — Takes credentials, returns a User or None
- `login()` / `logout()` — Manages the session
- `@login_required` decorator — Protects views
- Password hashing — Django uses PBKDF2 by default. Never store plain text passwords. Ever.

Show the auth tables in the database. Show a hashed password. "This is what security looks like in the database. If you can read the password, the system is broken."

#### Part 3: Sessions and Cookies (10 minutes)

Diagram the session flow:

1. User submits credentials
2. Django authenticates, creates a session in the database
3. Django sends a session cookie to the browser
4. Every subsequent request includes the cookie
5. Django looks up the session, attaches the User to `request.user`

"Sessions work great for browsers. They don't work for API clients — mobile apps, scripts, other services. That's why we need tokens, which we'll cover on Day 2."

#### Part 4: Are-Self's Identity Model (5 minutes)

Brief connection: Are-Self's `identity` app has IdentityDisc — the AI's sense of self. It's not Django auth, but it parallels the concept: before the system can reason, it needs to know who it is. The addon phases (IDENTIFY, CONTEXT, HISTORY, TERMINAL) are the AI's authentication flow.

### Assessment

- Can students explain the difference between authentication and authorization?
- Can students describe the session-based auth flow?
- Can students explain why passwords are hashed?

---

## Day 2 (Lecture): DRF Permissions and Token Authentication

### Objective

Students will implement DRF permission classes, set up token authentication, and write custom permission classes for domain-specific access control.

### Materials Needed

- Projector with IDE and browser
- DRF browsable API accessible
- `curl` or `httpie` for testing

### Lecture Content (75 minutes)

#### Opening (10 minutes)

"Django's auth secures browser-based views. DRF's permission system secures API endpoints. They work together, but DRF adds a layer that's designed for API-first applications."

#### Part 1: DRF Permission Classes (20 minutes)

Global settings in `settings.py`:

```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}
```

Per-view overrides:

```python
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

class NeuralPathwayViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def execute(self, request, pk=None):
        # Only admins can execute pathways
        ...
```

Built-in permission classes:
- `AllowAny` — No restriction. Use sparingly.
- `IsAuthenticated` — Must be logged in. The default for most APIs.
- `IsAdminUser` — Must be staff. For admin-only operations.
- `IsAuthenticatedOrReadOnly` — Logged in for writes, anyone can read. Good for public data with protected mutations.

#### Part 2: Custom Permission Classes (20 minutes)

```python
from rest_framework.permissions import BasePermission

class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level permission: only the owner can modify.
    Anyone authenticated can read.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions for any authenticated request
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        # Write permissions only for the owner
        return obj.owner == request.user
```

Walk through:
- `has_permission()` — Checked before the view runs. Access to the endpoint.
- `has_object_permission()` — Checked after `get_object()`. Access to a specific instance.
- Return `True` to allow, `False` to deny (403 Forbidden)

Show how Are-Self might use this pattern: only the creator of a Neural Pathway can modify it. Others can view and execute but not edit.

#### Part 3: Token Authentication (20 minutes)

Setup:

```python
# settings.py
INSTALLED_APPS = [
    ...
    'rest_framework.authtoken',
]
```

```bash
python manage.py migrate  # Creates the token table
```

Create tokens:

```python
from rest_framework.authtoken.models import Token
token = Token.objects.create(user=user)
print(token.key)  # The token string
```

Client usage:

```bash
curl -H "Authorization: Token abc123def456" http://localhost:8000/api/cns/pathways/
```

Walk through the flow:
1. Client sends credentials to a login endpoint
2. Server validates, returns a token
3. Client includes the token in every subsequent request header
4. DRF's `TokenAuthentication` extracts and validates the token
5. `request.user` is set to the token's owner

Build the login endpoint:

```python
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('api/auth/token/', obtain_auth_token, name='api-token'),
]
```

"POST username and password, get a token back. Include that token in every subsequent request. Stateless, no cookies, works for any client."

#### Part 4: Token vs. JWT vs. OAuth2 (5 minutes)

Brief comparison:
- **DRF Token:** Simple, database-backed, good for single-server apps
- **JWT:** Stateless, self-contained, good for distributed systems, more complex
- **OAuth2:** Full authorization framework, for third-party access, complex but powerful

For this course: DRF tokens. They're sufficient, simple, and teach the concepts without the complexity.

### Assessment

- Can students configure global and per-view permission classes?
- Can students write a custom permission class?
- Can students set up and use token authentication?

### Differentiation

**Advanced Learners:**
- Implement a custom authentication backend that authenticates via API key in a custom header instead of the standard Token header

**Struggling Learners:**
- Provide a decision flowchart: "Is the user logged in? → IsAuthenticated. Is the user an admin? → IsAdminUser. Can anonymous users read? → IsAuthenticatedOrReadOnly."

---

## Day 3 (Lab): Secure Your API

### Objective

Students will add authentication and permissions to their Week 5 API, implement token auth, write a custom permission class, and test that unauthenticated and unauthorized requests are properly rejected.

### Lab Duration

110 minutes

### Standup (10 minutes)

### Pre-Planning (10 minutes)

Definition of Ready:
- Which endpoints should be public? Which require authentication? Which require admin?
- What object-level permission makes sense for your model?
- What does "unauthorized" look like for your domain?

### Build Phase (60 minutes)

Students implement:

1. **Token authentication** — Add `rest_framework.authtoken` to INSTALLED_APPS, run migration, create tokens for test users
2. **Global permission default** — Set `IsAuthenticated` as the default
3. **Per-endpoint permissions** — Override for specific ViewSet actions (e.g., list is public, create requires auth, delete requires admin)
4. **Custom permission class** — Implement `IsOwnerOrReadOnly` or a domain-specific equivalent for their model
5. **Login endpoint** — Configure `obtain_auth_token`
6. **Tests** — At least four:
   - Unauthenticated request to protected endpoint returns 401
   - Authenticated request succeeds
   - Non-owner cannot modify another user's object (403)
   - Admin can perform admin-only actions

### Security Review (15 minutes)

Pair up. Each student tries to break their partner's API:
- Can you read data without a token?
- Can you modify someone else's object?
- Can you delete without admin privileges?
- What happens with an invalid token?

Document any vulnerabilities found. Fix them.

### Wrap-Up (15 minutes)

Class discussion: "What was easier to break than you expected? What held up?" Connect to the Variables: Fear (what could go wrong) drives Responsibility (building it right).

### Exit Criteria

- Token authentication works end-to-end
- Unauthenticated requests return 401
- Unauthorized requests return 403
- Custom permission class enforces object-level access
- At least four security tests pass

### Assessment

| Criterion | Meets Expectations | Approaching | Not Yet |
|---|---|---|---|
| Token auth | End-to-end working | Tokens created but not validated | Not configured |
| Permissions | Global + per-view + object-level | Global + per-view only | No permissions |
| Custom permission | Domain-specific, tested | Exists but untested | Not implemented |
| Security tests | 4+ tests, all pass | 2-3 tests | Fewer than 2 |
| Security review | Found and fixed issues in partner's API | Participated but superficially | Did not participate |

### Differentiation

**Advanced Learners:**
- Implement rate limiting with DRF's `UserRateThrottle` — 100 requests/hour for authenticated users, 10/hour for anonymous
- Add an endpoint that returns the current user's profile and permissions

**Struggling Learners:**
- Provide the custom permission class pre-written; student integrates it into their ViewSet and writes the tests

---

## Materials for This Week

- Django documentation: [Authentication](https://docs.djangoproject.com/en/6.0/topics/auth/)
- DRF documentation: [Authentication](https://www.django-rest-framework.org/api-guide/authentication/)
- DRF documentation: [Permissions](https://www.django-rest-framework.org/api-guide/permissions/)
- Are-Self source: `identity/` app (IdentityDisc, addon phases)

## Assignments

| Assignment | Due | Weight |
|------------|-----|--------|
| Lab: Secured API | End of Week 6 | Part of Lab grade (Week 6) |
| Iteration 3 Demo prep | Week 7 Day 1 | Part of Demo grade |
| Reading: Django signals documentation | Before Week 7 Day 1 | Preparation (not graded) |

## Exit Criteria for Week 6

A student has completed Week 6 when:

- They can explain authentication vs. authorization
- They can configure DRF permission classes globally and per-view
- They have working token authentication
- They have a custom permission class with tests
- Their API rejects unauthorized requests with correct status codes

---

## Instructor Notes

### Common Issues

**Q: Students forget to create tokens for test users.**
A: The test setup needs to explicitly create a user and token. Provide a test mixin that handles this.

**Q: SessionAuthentication causes CSRF errors in the browsable API.**
A: DRF's SessionAuthentication enforces CSRF. For API-only access, token auth doesn't require CSRF. Include both authentication classes but explain when each is used.

**Q: "Can't I just check `request.user.is_staff` in the view?"**
A: You can, but permission classes separate the concern. The view handles business logic. The permission class handles access control. When you need to change who can access what, you change the permission class, not the view.

---

*Built by the Are-Self project. MIT licensed. Free to use, modify, and share.*
