---
title: "Week 8 — Background Tasks"
sidebar_position: 10
---

# Week 8: Background Tasks

Students learn to offload work from the request-response cycle using Celery. They study task queues, periodic tasks, retry strategies, and Are-Self's PNS heartbeat pattern. The lab adds async processing to their project.

## Week Overview

**Theme:** Celery, task queues, periodic tasks, and Are-Self's PNS heartbeat

**Primary Variable:** Time — Background tasks exist because some work takes too long for a user to wait. The decision to make something async is always a decision about whose time matters and how long is too long.

<!-- Definition of Ready — perspective -->

**Why This Week Matters:**
Production Django applications can't do everything in the request-response cycle. Sending emails, processing images, computing embeddings, calling external APIs, running health checks — these operations take seconds or minutes, and users won't wait. Celery is the standard solution: a task queue that runs work in background workers while Django responds immediately. Are-Self's Peripheral Nervous System uses Celery Beat to send heartbeats, monitor worker health, and trigger periodic maintenance — the same pattern used by every serious Django deployment.

<!-- Definition of Ready — assertions -->

**Learning Goals:**

- Explain the producer-consumer pattern and how Celery implements it
- Configure Celery with Django and Redis as the message broker
- Define and invoke Celery tasks with arguments, retries, and error handling
- Schedule periodic tasks with Celery Beat
- Describe Are-Self's PNS heartbeat pattern and its use of Celery Beat
- Monitor task execution using Celery's built-in tools

<!-- Definition of Ready — outside -->

**What This Week Is Not:**

- No distributed Celery deployment (single worker for this course)
- No custom Celery routing or queue prioritization
- No Celery Canvas (chains, groups, chords) beyond brief mention
- No container orchestration for workers

---

## Day 1 (Lecture): Celery Fundamentals

### Objective

Students will understand the producer-consumer pattern, configure Celery with Django and Redis, and write their first async tasks.

### Materials Needed

- Projector with IDE and terminal
- Redis running (Docker or native)
- Celery installed in the virtual environment
- Whiteboard for architecture diagrams

### Lecture Content (75 minutes)

#### Opening (10 minutes)

"You have an API endpoint that needs to compute a 768-dimensional vector embedding for a new Engram. The computation takes 3 seconds. Your user clicks 'Save' and waits. Three seconds doesn't sound like much — until 50 users do it simultaneously and your web server is frozen."

"The solution: don't do it in the request. Accept the request, queue the work, return immediately. A background worker picks up the task and processes it. The user gets a 202 Accepted. The work happens anyway. That's Celery."

#### Part 1: The Architecture (15 minutes)

Diagram on the board:

```
Django (Producer)
    │
    ▼ sends task message
Redis (Message Broker)
    │
    ▼ delivers to available worker
Celery Worker (Consumer)
    │
    ▼ stores result (optional)
Redis / Database (Result Backend)
```

- **Producer:** Django code that calls `task.delay()` or `task.apply_async()`
- **Broker:** Redis (or RabbitMQ). Holds task messages in a queue.
- **Worker:** A separate process that runs task code. Multiple workers can run in parallel.
- **Result Backend:** Optional. Stores return values for later retrieval.

"Django sends a message. Redis holds it. A worker picks it up. They never talk directly. That decoupling is the entire point."

#### Part 2: Configuration (15 minutes)

```python
# celery_app.py (or project/celery.py)
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')

app = Celery('project')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
```

```python
# settings.py
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'
```

```python
# project/__init__.py
from .celery_app import app as celery_app
__all__ = ('celery_app',)
```

Start the worker:

```bash
celery -A project worker --loglevel=info
```

Show the worker starting, discovering tasks, and waiting for work. "This is a separate process. It runs alongside Django, not inside it."

#### Part 3: Defining and Calling Tasks (20 minutes)

```python
# hippocampus/tasks.py
from celery import shared_task
from .models import Engram

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def compute_embedding(self, engram_id):
    """Compute the 768-dim vector embedding for an Engram."""
    try:
        engram = Engram.objects.get(pk=engram_id)
        # Simulate embedding computation
        embedding = generate_embedding(engram.content)
        engram.embedding = embedding
        engram.save(update_fields=['embedding', 'modified'])
        return {'engram_id': str(engram_id), 'status': 'complete'}
    except Engram.DoesNotExist:
        return {'engram_id': str(engram_id), 'status': 'not_found'}
    except Exception as exc:
        raise self.retry(exc=exc)
```

Calling the task:

```python
# In a view or signal handler
from .tasks import compute_embedding

# Fire and forget
compute_embedding.delay(str(engram.id))

# With options
compute_embedding.apply_async(
    args=[str(engram.id)],
    countdown=10,  # Wait 10 seconds before executing
    expires=300,   # Cancel if not picked up within 5 minutes
)
```

Key points:
- `@shared_task` makes the task available across apps
- `bind=True` gives access to `self` for retries
- Pass IDs, not model instances — tasks serialize arguments as JSON
- `max_retries` and `default_retry_delay` handle transient failures
- `self.retry(exc=exc)` re-queues the task with exponential backoff

#### Part 4: Connecting Signals to Tasks (15 minutes)

Bridge Week 7 to Week 8:

```python
# hippocampus/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Engram
from .tasks import compute_embedding

@receiver(post_save, sender=Engram)
def queue_embedding_computation(sender, instance, created, **kwargs):
    if created:
        compute_embedding.delay(str(instance.id))
```

"The signal fires synchronously. But instead of computing the embedding right there — blocking the save — it queues a task. The save returns immediately. The worker handles the heavy lifting."

This is the pattern used throughout Are-Self: signals for detection, Celery for execution.

### Assessment

- Can students explain the producer-broker-worker architecture?
- Can students configure Celery with Django and Redis?
- Can students define tasks with retry logic and call them asynchronously?

### Differentiation

**Advanced Learners:**
- Research Celery Canvas: chains, groups, and chords. Describe a scenario where you'd chain two Are-Self tasks.

**Struggling Learners:**
- Provide the Celery configuration files pre-written; student focuses on defining and calling tasks

---

## Day 2 (Lecture): Periodic Tasks and the PNS Heartbeat

### Objective

Students will configure Celery Beat for periodic task scheduling, study Are-Self's PNS heartbeat pattern, and understand monitoring and observability for background workers.

### Materials Needed

- Projector with IDE and terminal
- Celery worker and Beat scheduler running
- Are-Self's PNS app open in the IDE

### Lecture Content (75 minutes)

#### Opening (10 minutes)

"Yesterday you learned to queue tasks on demand — a signal fires, a task runs. Today you learn to schedule tasks on a clock. Every 30 seconds, every 5 minutes, every night at midnight. That's Celery Beat."

#### Part 1: Celery Beat Configuration (20 minutes)

```python
# settings.py
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'heartbeat-every-30-seconds': {
        'task': 'peripheral_nervous_system.tasks.send_heartbeat',
        'schedule': 30.0,  # Every 30 seconds
    },
    'cleanup-expired-tokens-nightly': {
        'task': 'identity.tasks.cleanup_expired_tokens',
        'schedule': crontab(hour=2, minute=0),  # 2:00 AM daily
    },
    'recompute-stale-embeddings': {
        'task': 'hippocampus.tasks.recompute_stale_embeddings',
        'schedule': crontab(minute='*/15'),  # Every 15 minutes
    },
}
```

Start the Beat scheduler:

```bash
celery -A project beat --loglevel=info
```

"Beat is a separate process — a scheduler that sends task messages at the configured times. It doesn't run the tasks. It tells workers to run them. You need both: a Beat process and at least one worker."

Show the Beat output: "Sending task heartbeat-every-30-seconds..." Then show the worker receiving and executing it.

#### Part 2: Are-Self's PNS Heartbeat Pattern (30 minutes)

The Peripheral Nervous System manages the worker fleet. Its heartbeat pattern:

```python
# peripheral_nervous_system/tasks.py
@shared_task
def send_heartbeat():
    """
    Every worker sends a heartbeat. The PNS records it.
    If a worker misses two consecutive heartbeats, it's marked unhealthy.
    If it misses five, it's marked dead and its in-progress tasks are requeued.
    """
    from .models import Worker

    worker_id = get_current_worker_id()
    worker, created = Worker.objects.get_or_create(
        worker_id=worker_id,
        defaults={'status': 'healthy', 'last_heartbeat': timezone.now()}
    )

    if not created:
        worker.last_heartbeat = timezone.now()
        worker.status = 'healthy'
        worker.consecutive_misses = 0
        worker.save(update_fields=['last_heartbeat', 'status', 'consecutive_misses'])


@shared_task
def check_worker_health():
    """
    Runs every minute. Checks all workers for missed heartbeats.
    """
    from .models import Worker

    threshold = timezone.now() - timedelta(seconds=90)  # 3x heartbeat interval
    stale_workers = Worker.objects.filter(
        last_heartbeat__lt=threshold,
        status='healthy'
    )

    for worker in stale_workers:
        worker.consecutive_misses += 1
        if worker.consecutive_misses >= 5:
            worker.status = 'dead'
            requeue_worker_tasks(worker)
        elif worker.consecutive_misses >= 2:
            worker.status = 'unhealthy'
        worker.save()
```

Walk through the full cycle:
1. Every 30 seconds, each worker runs `send_heartbeat` — updates its record
2. Every 60 seconds, `check_worker_health` scans for workers that haven't reported
3. Missed heartbeats escalate: healthy → unhealthy → dead
4. Dead workers' tasks get requeued to living workers

"This is biological. Your peripheral nervous system monitors your body's extremities. If a nerve stops reporting, the brain investigates. Are-Self does the same thing with Celery workers."

Connect to the Hypothalamus circuit breaker pattern: when too many tasks fail, the Hypothalamus trips a circuit breaker with escalating timeouts (30s → 60s → 120s → 300s). The PNS heartbeat detects the failing worker. The Hypothalamus prevents new work from being sent to it. Two systems, working together.

#### Part 3: Monitoring and Observability (15 minutes)

```bash
# Real-time worker status
celery -A project inspect active
celery -A project inspect reserved
celery -A project inspect stats

# Task result inspection
celery -A project result <task-id>
```

Introduce Flower (Celery's web monitoring tool):

```bash
celery -A project flower --port=5555
```

Show the Flower dashboard: active tasks, worker status, task history, failure rates. "This is your observability layer. In production, you watch this dashboard the way a doctor watches vital signs."

Logging patterns for tasks:

```python
import logging
logger = logging.getLogger(__name__)

@shared_task(bind=True)
def my_task(self, arg):
    logger.info(f'Task {self.request.id} started with arg={arg}')
    try:
        result = do_work(arg)
        logger.info(f'Task {self.request.id} completed: {result}')
        return result
    except Exception as exc:
        logger.error(f'Task {self.request.id} failed: {exc}', exc_info=True)
        raise self.retry(exc=exc)
```

### Assessment

- Can students configure Celery Beat with periodic schedules?
- Can students explain the PNS heartbeat pattern?
- Can students use Celery inspection commands to monitor workers?

### Differentiation

**Advanced Learners:**
- Design a circuit breaker task that monitors failure rates and disables endpoints when the failure rate exceeds a threshold

**Struggling Learners:**
- Provide the Beat schedule configuration pre-written; student implements one periodic task

---

## Day 3 (Lab): Add Async Processing to Your Project

### Objective

Students will add Celery to their project, define at least two tasks (one on-demand, one periodic), connect a signal to a task, and verify execution through worker logs.

### Lab Duration

110 minutes

### Standup (10 minutes)

### Pre-Planning (10 minutes)

Definition of Ready:
- What slow operation in your project should be async? (Embedding computation, notification sending, data aggregation)
- What periodic maintenance does your model need? (Cleanup, health check, recomputation)
- How will you verify the tasks ran? (Logs, database state, worker output)

### Build Phase (60 minutes)

Students implement:

1. **Celery configuration** — `celery.py`, settings, `__init__.py` integration
2. **On-demand task** — A `@shared_task` with retry logic, called from a signal handler or ViewSet action
3. **Periodic task** — A Beat-scheduled task that runs every N seconds/minutes
4. **Signal-to-task bridge** — A post_save or custom signal handler that queues the on-demand task
5. **Logging** — Tasks log start, completion, and failure with task IDs
6. **Tests** — At least two:
   - On-demand task executes correctly (use `task.apply()` for synchronous test execution)
   - Periodic task produces expected results

Stretch: implement a simplified heartbeat — a periodic task that records a timestamp, and a check task that verifies the heartbeat is recent.

### Monitoring Exercise (15 minutes)

Students start their Celery worker and Beat scheduler. Observe:
- Worker logs showing task execution
- Beat logs showing scheduled task dispatch
- Use `celery inspect active` to see running tasks

If Flower is available, open the dashboard and explore.

### Wrap-Up (15 minutes)

Discussion: "What would happen to your application if the Celery worker crashed? What would users experience?" This surfaces the reality that async processing adds a failure mode. The user gets their 202, but the work might never happen if the worker dies. That's why the PNS heartbeat exists.

### Exit Criteria

- Celery configured and worker starts without errors
- On-demand task with retry logic
- Periodic task on a Beat schedule
- Signal-to-task bridge fires correctly
- Worker logs show task execution
- At least two tests pass

### Assessment

| Criterion | Meets Expectations | Approaching | Not Yet |
|---|---|---|---|
| Celery config | Worker and Beat start correctly | Worker starts, Beat has issues | Configuration broken |
| On-demand task | Retry logic, proper arguments, signal trigger | Task runs but no retry logic | Task doesn't execute |
| Periodic task | Beat-scheduled, runs on time | Scheduled but timing issues | Not scheduled |
| Signal bridge | Signal fires and queues task | Signal fires but task not queued | Not connected |
| Logging | Start/complete/failure with task IDs | Partial logging | No logging |
| Tests | 2+ passing | 1 test | No tests |

### Differentiation

**Advanced Learners:**
- Implement task chaining: the on-demand task, on completion, triggers a second task that updates related models
- Add a dead-letter handler for tasks that exceed max retries

**Struggling Learners:**
- Provide the Celery configuration and one complete task as reference; student builds the second task

---

## Materials for This Week

- Celery documentation: [Getting started with Django](https://docs.celeryq.dev/en/stable/django/first-steps-with-celery.html)
- Celery documentation: [Periodic Tasks](https://docs.celeryq.dev/en/stable/userguide/periodic-tasks.html)
- Are-Self source: `peripheral_nervous_system/tasks.py` (heartbeat pattern)
- Are-Self source: Celery configuration files
- Flower documentation: [Monitoring](https://flower.readthedocs.io/)

## Assignments

| Assignment | Due | Weight |
|------------|-----|--------|
| Lab: Async processing | End of Week 8 | Part of Lab grade (Week 8) |
| Iteration 4 Demo prep | Week 9 Day 1 | Part of Demo grade |
| Reading: Django Channels documentation | Before Week 9 Day 1 | Preparation (not graded) |

## Exit Criteria for Week 8

A student has completed Week 8 when:

- They can configure Celery with Django and Redis
- They can define tasks with retry logic
- They can schedule periodic tasks with Celery Beat
- They understand the PNS heartbeat pattern
- They have signal-to-task bridges working
- Background tasks execute and log correctly

---

## Instructor Notes

### Common Issues

**Q: Redis isn't running and Celery can't connect.**
A: Have `docker run -d -p 6379:6379 redis:7-alpine` ready as a one-liner. Most connection issues are Redis not running or wrong port.

**Q: Tasks appear to hang — they're queued but not executing.**
A: The worker isn't running, or it's not discovering the tasks. Check: is the worker process alive? Did `autodiscover_tasks()` find the task file? Is the task module importable?

**Q: Students test with `task.delay()` and then check the database immediately.**
A: The task is async — the database update hasn't happened yet. In tests, use `task.apply()` (synchronous) or `task.delay()` followed by a polling loop. This is a real-world lesson: async means you can't assume order.

---

*Built by the Are-Self project. MIT licensed. Free to use, modify, and share.*
