---
title: "Module 2: Concurrency"
sidebar_position: 2
---

# Module 2: Concurrency

## Learning Objectives

By the end of this module, you will be able to:

- Distinguish between concurrency and parallelism
- Write async code with `asyncio` and `async/await`
- Design Celery task queues for background processing
- Use `concurrent.futures` for thread and process pools
- Understand thread safety and race conditions
- Analyze Are-Self's PNS heartbeat and spike execution concurrency model

## Concurrency vs Parallelism

**Concurrency** is about managing multiple tasks at once. **Parallelism** is about executing multiple tasks at once. You can have concurrency without parallelism — like a single chef managing three pots on the stove, switching attention between them.

Python's Global Interpreter Lock (GIL) means that only one thread executes Python bytecode at a time. This affects your concurrency strategy:

- **I/O-bound work** (API calls, database queries, file reads): use `asyncio` or threads — waiting for I/O does not hold the GIL
- **CPU-bound work** (computing embeddings, data processing): use `multiprocessing` or external services — each process has its own GIL

## Asyncio: Cooperative Concurrency

`asyncio` uses an event loop and cooperative scheduling. Functions declare themselves as `async` and yield control with `await`:

```python
import asyncio
import aiohttp


async def call_model_api(session, model_name, prompt):
    """Call a model API asynchronously."""
    url = f"http://localhost:8000/api/hypothalamus/infer/"
    payload = {"model": model_name, "prompt": prompt}
    
    async with session.post(url, json=payload) as response:
        data = await response.json()
        return data


async def execute_spike(spike_config):
    """Execute a single spike asynchronously."""
    async with aiohttp.ClientSession() as session:
        result = await call_model_api(
            session, 
            spike_config["model"],
            spike_config["prompt"]
        )
        return {
            "neuron": spike_config["neuron"],
            "status": "completed",
            "result": result,
        }


async def execute_parallel_spikes(spikes):
    """Execute multiple independent spikes concurrently."""
    tasks = [execute_spike(spike) for spike in spikes]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    completed = []
    failed = []
    for result in results:
        if isinstance(result, Exception):
            failed.append(str(result))
        else:
            completed.append(result)
    
    return completed, failed


# Run it
async def main():
    spikes = [
        {"neuron": "Retrieve Memory", "model": "claude-haiku", "prompt": "Recall user preferences"},
        {"neuron": "Analyze Context", "model": "claude-sonnet", "prompt": "What is the user asking?"},
        {"neuron": "Check History", "model": "claude-haiku", "prompt": "What happened before?"},
    ]
    
    completed, failed = await execute_parallel_spikes(spikes)
    print(f"Completed: {len(completed)}, Failed: {len(failed)}")

asyncio.run(main())
```

`asyncio.gather()` runs multiple coroutines concurrently. While one is waiting for its API response, the others can proceed. This is dramatically faster than sequential execution for I/O-bound work.

### Timeouts and Cancellation

```python
async def execute_with_timeout(spike, timeout_seconds=30):
    """Execute a spike with a timeout."""
    try:
        result = await asyncio.wait_for(
            execute_spike(spike),
            timeout=timeout_seconds
        )
        return result
    except asyncio.TimeoutError:
        return {
            "neuron": spike["neuron"],
            "status": "failed",
            "error": f"Timeout after {timeout_seconds}s",
        }
```

## Celery: Distributed Task Queues

For tasks that should run in the background — not blocking the API response — Are-Self uses Celery with a message broker (Redis or RabbitMQ).

```python
# are_self/frontal_lobe/tasks.py
from celery import shared_task
from are_self.frontal_lobe.models import SpikeTrain, Spike


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def execute_spike_train(self, spike_train_id):
    """Execute a complete spike train as a background task."""
    try:
        train = SpikeTrain.objects.select_related("pathway").get(id=spike_train_id)
        train.status = "running"
        train.save()
        
        for spike in train.spikes.order_by("sequence_number"):
            try:
                execute_single_spike(spike)
                spike.status = "completed"
                spike.save()
            except Exception as exc:
                spike.status = "failed"
                spike.error_message = str(exc)
                spike.save()
                
                # Check if we should follow failure branch
                failure_axon = spike.neuron.outgoing_axons.filter(
                    branch_type="failure"
                ).first()
                if failure_axon:
                    continue  # Follow failure path
                else:
                    train.status = "failed"
                    train.save()
                    raise
        
        train.status = "completed"
        train.save()
        
    except Exception as exc:
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@shared_task
def generate_engram_embedding(engram_id):
    """Generate embedding vector for an engram in the background."""
    from are_self.hippocampus.models import Engram
    
    engram = Engram.objects.get(id=engram_id)
    text = f"{engram.name} {engram.description}"
    
    # Call embedding API (I/O bound)
    embedding = call_embedding_service(text)
    
    engram.set_embedding(embedding)
    engram.save(update_fields=["embedding", "modified_at"])
```

### Dispatching Tasks

```python
# From a view or signal handler
from are_self.frontal_lobe.tasks import execute_spike_train

# Fire and forget — returns immediately
execute_spike_train.delay(spike_train_id="uuid-1234")

# With options
execute_spike_train.apply_async(
    args=["uuid-1234"],
    countdown=10,          # Wait 10 seconds before starting
    expires=300,           # Expire if not started within 5 minutes
    queue="spike_execution",  # Route to specific queue
)
```

### Task Chains and Groups

Celery supports composing tasks:

```python
from celery import chain, group, chord

# Sequential execution
workflow = chain(
    parse_query.s(query_text),
    retrieve_memories.s(),        # Receives output of parse_query
    generate_response.s(),        # Receives output of retrieve_memories
)
workflow.delay()

# Parallel execution
parallel = group(
    generate_engram_embedding.s(engram_id)
    for engram_id in engram_ids
)
parallel.delay()

# Parallel then aggregate (chord)
aggregate = chord(
    group(score_engram.s(eid) for eid in engram_ids),
    aggregate_scores.s()  # Receives list of all results
)
aggregate.delay()
```

## Are-Self Connection: PNS Heartbeat

The Peripheral Nervous System maintains a heartbeat — a periodic check that verifies system health:

```python
# are_self/peripheral_nervous_system/tasks.py

@shared_task
def pns_heartbeat():
    """Periodic health check for all Are-Self subsystems."""
    results = {}
    
    checks = [
        ("database", check_database_connection),
        ("redis", check_redis_connection),
        ("embedding_service", check_embedding_service),
        ("model_apis", check_model_availability),
        ("circuit_breakers", report_circuit_breaker_status),
    ]
    
    for name, check_func in checks:
        try:
            results[name] = {
                "status": "healthy",
                "details": check_func(),
            }
        except Exception as e:
            results[name] = {
                "status": "unhealthy",
                "error": str(e),
            }
            # Fire cortisol signal for unhealthy subsystems
            fire_neurotransmitter(
                NeurotransmitterType.CORTISOL,
                source_region="peripheral_nervous_system",
                target_region="central_nervous_system",
                message=f"Health check failed: {name}",
                payload={"check": name, "error": str(e)},
            )
    
    return results


# Celery Beat schedule (periodic tasks)
# In settings.py or celery.py:
CELERY_BEAT_SCHEDULE = {
    "pns-heartbeat": {
        "task": "are_self.peripheral_nervous_system.tasks.pns_heartbeat",
        "schedule": 30.0,  # Every 30 seconds
    },
}
```

## Thread Safety and Race Conditions

When multiple operations access shared state, you must prevent race conditions:

```python
import threading


class ThreadSafeCircuitBreaker:
    """A circuit breaker that is safe for concurrent use."""
    
    def __init__(self, name, failure_threshold=3):
        self.name = name
        self.failure_threshold = failure_threshold
        self.failure_count = 0
        self.state = "closed"
        self._lock = threading.Lock()
    
    def record_failure(self):
        with self._lock:  # Only one thread at a time
            self.failure_count += 1
            if self.failure_count >= self.failure_threshold:
                self.state = "open"
    
    def record_success(self):
        with self._lock:
            self.failure_count = 0
            self.state = "closed"
    
    def can_execute(self):
        with self._lock:
            return self.state != "open"
```

Without the lock, two threads could read `failure_count` simultaneously, both see 2, both increment to 3, but the count should actually be 4.

### Django's Database-Level Locking

For database operations, use Django's `select_for_update()`:

```python
from django.db import transaction

def safely_update_relevance(engram_id, new_score):
    """Update relevance score with database-level locking."""
    with transaction.atomic():
        engram = (
            Engram.objects
            .select_for_update()  # Lock the row
            .get(id=engram_id)
        )
        engram.relevance_score = new_score
        engram.save()
```

## Concurrent Futures: Simple Parallelism

For simpler parallelism needs, `concurrent.futures` provides thread and process pools:

```python
from concurrent.futures import ThreadPoolExecutor, as_completed


def fetch_engram_embedding(engram):
    """Fetch embedding from the embedding service."""
    # I/O-bound work — good for threads
    response = requests.post(
        "http://embedding-service/embed",
        json={"text": f"{engram.name} {engram.description}"}
    )
    return engram.id, response.json()["embedding"]


def batch_update_embeddings(engrams, max_workers=10):
    """Update embeddings for multiple engrams concurrently."""
    results = {}
    errors = []
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_engram = {
            executor.submit(fetch_engram_embedding, engram): engram
            for engram in engrams
        }
        
        for future in as_completed(future_to_engram):
            engram = future_to_engram[future]
            try:
                engram_id, embedding = future.result()
                results[engram_id] = embedding
            except Exception as e:
                errors.append((engram.id, str(e)))
    
    print(f"Updated: {len(results)}, Failed: {len(errors)}")
    return results, errors
```

## Exercises

### Exercise 1: Async Spike Executor

Write an async spike execution engine that:
- Takes a DAG of neurons and axons
- Identifies neurons that can run in parallel (no dependencies between them)
- Executes parallel neurons concurrently with `asyncio.gather()`
- Follows success/failure branches based on results
- Enforces a per-spike timeout

### Exercise 2: Celery Task Design

Design Celery tasks for:
1. `batch_dedup_engrams` — Check all engrams for duplicates (similarity >= 0.90) and deactivate duplicates
2. `recalculate_cluster_stats` — Recalculate aggregate relevance for all memory clusters
3. `circuit_breaker_cleanup` — Reset circuit breakers whose cooldowns have expired

Include retry logic, error handling, and logging.

### Exercise 3: Thread-Safe Cache

Build a thread-safe in-memory cache for model configurations:

```python
class ModelConfigCache:
    def get(self, model_name): ...
    def set(self, model_name, config, ttl_seconds=300): ...
    def invalidate(self, model_name): ...
    def clear(self): ...
```

Must handle concurrent reads and writes without data corruption. Include TTL (time-to-live) expiration.

### Exercise 4: Rate Limiter

Implement an async rate limiter for API calls:

```python
class AsyncRateLimiter:
    def __init__(self, max_calls, per_seconds):
        ...
    
    async def acquire(self):
        """Wait until a call slot is available."""
        ...
```

Use it to ensure Are-Self does not exceed the AI model provider's rate limits.

### Exercise 5: Concurrent Health Check

Write a health check system that concurrently checks multiple services and returns a combined status:
- Database (PostgreSQL)
- Cache (Redis)
- Embedding service
- Each registered model API

Use `asyncio.gather()` with timeouts. If any check fails, fire the appropriate neurotransmitter.

## Reflection

Concurrency is about **Time** — specifically, about not wasting it. When your program waits for a network response, every millisecond of idle CPU is time squandered. Concurrency lets you use that time productively.

But concurrency also connects to **Fear** — the productive kind. Race conditions, deadlocks, data corruption: these are the risks of concurrent systems. The lock, the atomic transaction, the careful task design — these are not paranoia. They are engineering discipline. They acknowledge that concurrency introduces a category of bugs that sequential code does not have, and they address them systematically.

Are-Self's heartbeat is a beautiful example. It runs every 30 seconds, checking the pulse of every subsystem. It runs concurrently with everything else. And when it finds something wrong, it does not panic — it fires a cortisol signal and lets the rest of the system respond. Calm, disciplined, concurrent awareness.
