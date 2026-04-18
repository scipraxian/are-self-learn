---
title: "Week 7 — Signals and Middleware"
sidebar_position: 9
---

# Week 7: Signals and Middleware

Students learn Django's event system — signals that fire when models change and middleware that wraps every request. They study Are-Self's neurotransmitter pattern (Dopamine, Cortisol, Acetylcholine, Glutamate, Norepinephrine) as a production example of signals driving system behavior. The week opens with Iteration 4 Demos. The lab produces a signal-based notification system.

## Week Overview

**Theme:** Django signals, m2m_changed, and Are-Self's neurotransmitter pattern

**Primary Variable:** Perseverance — Signals are invisible. When something breaks in a signal handler, the error can be silent, delayed, or appear to come from somewhere else entirely. Debugging signal-driven systems requires patience and systematic investigation.

<!-- Definition of Ready — perspective -->

**Why This Week Matters:**
Signals decouple components. Instead of model A calling model B directly, model A emits a signal and model B listens. This makes systems modular — you can add new behavior without touching existing code. But it also makes systems harder to trace. Students need to understand both the power and the danger. Are-Self's neurotransmitter system is a real-world example: when a Spike completes, Dopamine fires. When a budget is exceeded, Cortisol fires. These signals drive real-time WebSocket updates (Week 9), logging, and cascading actions.

<!-- Definition of Ready — assertions -->

**Learning Goals:**

- Explain Django's signal dispatch system and common built-in signals (`pre_save`, `post_save`, `pre_delete`, `post_delete`, `m2m_changed`)
- Implement signal handlers with proper receiver decoration and connection
- Handle `m2m_changed` signals including the `action` parameter (pre_add, post_add, pre_remove, post_remove)
- Describe Are-Self's neurotransmitter pattern and how it maps to Django signals
- Write custom middleware that processes requests and responses
- Debug signal-driven behavior using logging and Django's signal dispatch introspection

<!-- Definition of Ready — outside -->

**What This Week Is Not:**

- No Celery integration yet — that's Week 8 (signals fire synchronously unless explicitly made async)
- No WebSocket delivery — that's Week 9 (signals fire the event; WebSockets deliver it)
- No deep middleware customization beyond request/response processing

---

## Iteration 4 Demo and Retrospective (Day 1 opening, 30 minutes)

### Demo (20 minutes)

Students demonstrate their secured API from Weeks 5-6:
- Light/full serializer variants
- Token authentication working end-to-end
- Permission classes rejecting unauthorized requests
- Custom permission class with tests

### Retrospective (10 minutes)

- How did the security review exercise work? Should we do more peer-adversarial testing?
- Are Definitions of Ready helping? Are they slowing you down?
- Iteration 4 commitments.

---

## Day 1 (Lecture): Django Signals

### Objective

Students will understand Django's signal dispatch system, implement handlers for model lifecycle signals, and handle the complex `m2m_changed` signal.

### Materials Needed

- Projector with IDE
- Are-Self repository open to signal handler files
- Whiteboard for event flow diagrams

### Lecture Content (45 minutes, after Demo/Retro)

#### Opening (5 minutes)

"Your models have lifecycle events: created, updated, deleted, relationships changed. Django lets you hook into every one of these events without modifying the model itself. That's the signal system. It's powerful, invisible, and the source of some of the most confusing bugs you'll ever encounter."

#### Part 1: Built-in Signals (15 minutes)

```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Engram

@receiver(post_save, sender=Engram)
def engram_saved(sender, instance, created, **kwargs):
    if created:
        print(f'New engram created: {instance.name}')
    else:
        print(f'Engram updated: {instance.name}')
```

Walk through the built-in signals:
- `pre_save` / `post_save` — Before and after `model.save()`. The `created` kwarg distinguishes new vs. updated.
- `pre_delete` / `post_delete` — Before and after deletion.
- `m2m_changed` — When a ManyToManyField changes. The complex one.

Registration:
- Decorator style: `@receiver(signal, sender=Model)`
- Connect style: `signal.connect(handler, sender=Model)`
- Where to register: in the app's `apps.py` via `ready()` method

```python
# apps.py
class HippocampusConfig(AppConfig):
    name = 'hippocampus'

    def ready(self):
        import hippocampus.signals  # noqa: F401
```

"The `ready()` method runs once when Django starts. That's where signal handlers must be imported. If you import them elsewhere, they might register twice or not at all."

#### Part 2: The m2m_changed Signal (15 minutes)

```python
from django.db.models.signals import m2m_changed
from django.dispatch import receiver

@receiver(m2m_changed, sender=Engram.tags.through)
def engram_tags_changed(sender, instance, action, pk_set, **kwargs):
    if action == 'post_add':
        # Tags were added — recompute the vector embedding
        instance.recompute_embedding()
        instance.save()
    elif action == 'post_remove':
        # Tags were removed — recompute
        instance.recompute_embedding()
        instance.save()
    elif action == 'post_clear':
        # All tags removed — clear the embedding
        instance.embedding = None
        instance.save()
```

The `action` parameter values:
- `pre_add` / `post_add` — Before/after adding to the M2M
- `pre_remove` / `post_remove` — Before/after removing from the M2M
- `pre_clear` / `post_clear` — Before/after clearing all M2M relationships

"This is how Are-Self auto-updates vector embeddings when tags change. The model doesn't know about embeddings. The signal handler does. If you remove the handler, the model still works — it just doesn't recompute vectors."

Show the actual Are-Self signal handler that does this. Point out: `sender=Model.field.through` — the sender is the intermediary table, not the model itself.

#### Part 3: Signal Gotchas (10 minutes)

- **Signals are synchronous by default.** A slow handler blocks the save.
- **Signals can fire multiple times.** `bulk_create`, `update()`, and raw SQL don't trigger signals. `save()` does.
- **Signals are invisible.** grep won't find the caller. You need to know the signal exists.
- **Circular signals.** A post_save handler that calls `.save()` on the same model triggers post_save again. Use `update_fields` or a flag to prevent recursion.

"Every signal gotcha is a debugging story. You'll write yours in the lab."

### Assessment

- Can students implement a post_save handler with proper registration?
- Can students handle m2m_changed with different action types?
- Can students identify when signals fire and when they don't?

---

## Day 2 (Lecture): Middleware and the Neurotransmitter Pattern

### Objective

Students will write custom middleware, understand the middleware execution order, and study Are-Self's neurotransmitter pattern as a production-grade signal architecture.

### Materials Needed

- Projector with IDE
- Are-Self's neurotransmitter signal implementation
- Whiteboard for middleware pipeline diagram

### Lecture Content (75 minutes)

#### Opening (10 minutes)

"Signals respond to model events. Middleware responds to request events. Together, they let you add behavior to a Django system without modifying the views or models themselves. Today you'll build middleware, and then we'll look at how Are-Self uses signals to implement a neurotransmitter system."

#### Part 1: Custom Middleware (25 minutes)

```python
import time
import logging

logger = logging.getLogger(__name__)

class RequestTimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.monotonic()
        response = self.get_response(request)
        duration = time.monotonic() - start
        logger.info(f'{request.method} {request.path} - {duration:.3f}s')
        response['X-Request-Duration'] = f'{duration:.3f}'
        return response
```

Walk through the middleware lifecycle:
1. `__init__` runs once at startup
2. `__call__` runs for every request
3. Code before `get_response(request)` runs on the way in
4. Code after runs on the way out
5. Middleware executes in `MIDDLEWARE` list order going in, reverse order going out

Draw the pipeline on the board:

```
Request → Middleware A (in) → Middleware B (in) → View → Middleware B (out) → Middleware A (out) → Response
```

Build a second example — a middleware that adds the current user's username to every API response header:

```python
class UserHeaderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if hasattr(request, 'user') and request.user.is_authenticated:
            response['X-User'] = request.user.username
        return response
```

#### Part 2: Are-Self's Neurotransmitter Pattern (35 minutes)

This is the centerpiece of the lecture. Are-Self models five neurotransmitters as signal types:

| Neurotransmitter | Biology | Are-Self Meaning | When It Fires |
|---|---|---|---|
| **Dopamine** | Reward, motivation | Success, task completion | Spike completes successfully |
| **Cortisol** | Stress response | Budget exceeded, errors | Cost threshold crossed, circuit breaker tripped |
| **Acetylcholine** | Learning, memory | New memory formed | Engram created or updated |
| **Glutamate** | Excitation, activation | New work started | Spike Train initiated, Neuron activated |
| **Norepinephrine** | Alertness, attention | Priority escalation | Deadline approaching, high-priority work queued |

Implementation pattern:

```python
# Custom signal definition
import django.dispatch

neurotransmitter_fired = django.dispatch.Signal()
# Provides: sender, neurotransmitter, payload, timestamp

# Firing a neurotransmitter
from .signals import neurotransmitter_fired

def on_spike_complete(spike):
    neurotransmitter_fired.send(
        sender=spike.__class__,
        neurotransmitter='dopamine',
        payload={
            'spike_id': str(spike.id),
            'pathway': str(spike.spike_train.pathway.name),
            'duration': str(spike.delta),
        },
        timestamp=timezone.now(),
    )
```

Receivers:

```python
@receiver(neurotransmitter_fired)
def log_neurotransmitter(sender, neurotransmitter, payload, timestamp, **kwargs):
    logger.info(f'[{neurotransmitter.upper()}] {payload}')

@receiver(neurotransmitter_fired)
def broadcast_neurotransmitter(sender, neurotransmitter, payload, timestamp, **kwargs):
    # Week 9: this will push to WebSocket
    channel_layer.group_send('neurotransmitters', {
        'type': neurotransmitter,
        'payload': payload,
    })
```

Key insight: one signal, many receivers. The spike doesn't know about logging or WebSocket broadcast. It fires dopamine. The receivers decide what to do with it. Adding a new reaction (email notification, Slack alert, metric recording) means adding a new receiver, not changing the spike code.

"This is the Observer pattern. Django's signal system is a built-in Observer implementation. Are-Self's neurotransmitters are a domain-specific layer on top of it."

#### Part 3: Async Signals — Preview (5 minutes)

"Right now, all of these fire synchronously. The spike waits for every receiver to finish before continuing. In Week 8, we'll offload slow receivers to Celery tasks. In Week 9, we'll deliver them through WebSockets in real time. The signal is the trigger. The delivery mechanism is separate."

### Assessment

- Can students write custom middleware with before/after request processing?
- Can students explain the neurotransmitter pattern as an application of Django signals?
- Can students define and send custom signals?

### Differentiation

**Advanced Learners:**
- Implement a middleware that records every API request to the database (method, path, user, status code, duration) for analytics

**Struggling Learners:**
- Provide the neurotransmitter signal definition and one receiver pre-written; student adds a second receiver

---

## Day 3 (Lab): Implement a Signal-Based Notification System

### Objective

Students will implement signal handlers that fire when their models change, define a custom signal for domain events, write middleware for request processing, and test the entire signal chain.

### Lab Duration

110 minutes

### Standup (10 minutes)

### Pre-Planning (10 minutes)

Definition of Ready:
- What model events should trigger notifications? (created, updated, deleted, M2M changed)
- What custom signals will you define? (one domain-specific event minimum)
- What middleware will you write?
- What logging or output will verify the signals fired?

### Build Phase (60 minutes)

Students implement:

1. **post_save handler** — Fires when their Week 2 model is created or updated. Logs the event with instance details.
2. **m2m_changed handler** — If their model has M2M relationships, handles tag/relationship changes. Otherwise, add one to an Are-Self model.
3. **Custom signal** — Define a domain-specific signal (like a neurotransmitter). Fire it from a ViewSet action. Register at least two receivers.
4. **Custom middleware** — Request timing middleware that logs method, path, user, and duration.
5. **Signal registration** — Proper `ready()` method in `apps.py`.
6. **Tests** — At least three:
   - post_save handler fires on model creation (use `mock.patch` to verify)
   - Custom signal fires from the ViewSet action
   - Middleware adds the expected response header

### Debugging Exercise (15 minutes)

Instructor introduces a deliberate signal bug (provided as a code snippet):
- A post_save handler that triggers an infinite recursion
- Students identify the bug, explain why it happens, and implement the fix (checking `update_fields` or using a flag)

### Wrap-Up (15 minutes)

Discussion: "Signals make code modular but harder to trace. When is the tradeoff worth it? When should you just call the function directly?" There's no single right answer — this is where Perseverance and engineering judgment intersect.

### Exit Criteria

- post_save handler fires and logs correctly
- Custom signal with two receivers works end-to-end
- Middleware processes requests and adds headers
- Signal registration in apps.py ready() method
- At least three tests pass
- Debugging exercise completed

### Assessment

| Criterion | Meets Expectations | Approaching | Not Yet |
|---|---|---|---|
| post_save handler | Fires on create and update with correct logging | Fires but only on create | Doesn't fire |
| m2m_changed or custom M2M | Handles action types correctly | Handles one action type | Not implemented |
| Custom signal | Defined, fired, two receivers | Defined and fired, one receiver | Not implemented |
| Middleware | Logs timing and adds headers | One of logging or headers | Doesn't work |
| Tests | 3+ passing, including signal verification | 1-2 tests | No tests |
| Debugging exercise | Bug identified, explained, and fixed | Bug identified but fix incomplete | Not attempted |

### Differentiation

**Advanced Learners:**
- Implement the full neurotransmitter pattern: define five signal types, fire them from appropriate model events, and write a receiver that aggregates them into a "system health" summary

**Struggling Learners:**
- Provide the signal handler skeleton and apps.py registration; student fills in the handler logic and writes the test

---

## Materials for This Week

- Django documentation: [Signals](https://docs.djangoproject.com/en/6.0/topics/signals/)
- Django documentation: [Middleware](https://docs.djangoproject.com/en/6.0/topics/http/middleware/)
- Are-Self source: signal handler files across brain region apps
- Are-Self source: neurotransmitter signal definitions
- Are-Self source: middleware implementations

## Assignments

| Assignment | Due | Weight |
|------------|-----|--------|
| Lab: Signal-based notification system | End of Week 7 | Part of Lab grade (Week 7) |
| Reading: Celery getting started guide | Before Week 8 Day 1 | Preparation (not graded) |

## Exit Criteria for Week 7

A student has completed Week 7 when:

- They can implement signal handlers for model lifecycle events
- They can handle m2m_changed signals with action-type awareness
- They can define and fire custom signals
- They can write custom middleware
- They understand the neurotransmitter pattern as an application of Django signals
- Signal registration is correct and tests verify behavior

---

## Instructor Notes

### Common Issues

**Q: Signal handlers don't fire.**
A: 90% of the time, the `ready()` import is missing. 9% of the time, the sender is wrong. 1% of the time, the handler was connected but a later import overwrote it.

**Q: Students create infinite recursion with post_save.**
A: That's the debugging exercise, but some students will encounter it naturally. Use it as a teaching moment. The fix: use `Model.objects.filter(pk=instance.pk).update(field=value)` instead of `instance.save()`, or check `update_fields`.

**Q: "Why not just override save()?"**
A: You can. It's more explicit and easier to trace. Signals are for when the sender shouldn't know about the receiver — cross-app communication, plugin architectures, decoupled systems. If the behavior is within the same app, `save()` is often cleaner.

---

*Built by the Are-Self project. MIT licensed. Free to use, modify, and share.*
