---
title: "Module 5: Performance"
sidebar_position: 5
---

# Module 5: Performance

## Learning Objectives

By the end of this module, you will be able to:

- Profile Python code to identify bottlenecks
- Detect and eliminate N+1 query problems
- Use Django's `select_related` and `prefetch_related` strategically
- Design database indexes for common query patterns
- Implement caching at multiple levels
- Measure and reduce API response times
- Apply Are-Self's performance patterns to your own code

## The Golden Rule of Performance

Do not optimize code that is not slow. Measure first, then optimize.

Premature optimization creates complex code that is hard to maintain, for gains that may not matter. The only valid optimization starts with profiling — measuring where time is actually spent.

## Profiling Python Code

### cProfile: Function-Level Profiling

```python
import cProfile
import pstats
from io import StringIO


def profile_function(func, *args, **kwargs):
    """Profile a function and print the top time consumers."""
    profiler = cProfile.Profile()
    profiler.enable()
    result = func(*args, **kwargs)
    profiler.disable()
    
    stream = StringIO()
    stats = pstats.Stats(profiler, stream=stream)
    stats.sort_stats("cumulative")
    stats.print_stats(20)  # Top 20 functions
    print(stream.getvalue())
    
    return result


# Usage
profile_function(find_relevant_engrams, min_score=0.5, limit=100)
```

### Django Debug Toolbar

For web request profiling, Django Debug Toolbar shows you:
- Every SQL query executed during a request
- How long each query took
- Duplicate queries (the N+1 problem)
- Template rendering time
- Cache hits and misses

```python
# settings.py (development only)
INSTALLED_APPS += ["debug_toolbar"]
MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]
INTERNAL_IPS = ["127.0.0.1"]
```

### django-silk: Request Profiling

```python
# settings.py
INSTALLED_APPS += ["silk"]
MIDDLEWARE += ["silk.middleware.SilkyMiddleware"]
SILKY_PYTHON_PROFILER = True
```

Silk records every request with its queries, timing, and Python profiling data. Invaluable for identifying slow endpoints.

## The N+1 Problem in Detail

This is the single most common performance problem in Django applications:

```python
# This view generates N+1 queries
def list_spike_trains(request):
    trains = SpikeTrain.objects.all()  # Query 1: get all trains
    data = []
    for train in trains:
        pathway_name = train.pathway.name  # Query 2, 3, 4, ... (one per train)
        spike_count = train.spikes.count()  # Query N+2, N+3, ... (one per train)
        data.append({
            "id": str(train.id),
            "pathway": pathway_name,
            "spike_count": spike_count,
        })
    return JsonResponse(data, safe=False)
```

With 100 spike trains, this makes 201 queries. With 1000, it makes 2001.

### Fixing With `select_related`

```python
# One query with JOIN — for ForeignKey and OneToOneField
trains = SpikeTrain.objects.select_related("pathway").all()
# Now train.pathway.name uses data already loaded — no extra query
```

### Fixing With `prefetch_related`

```python
# Two queries — for ManyToMany and reverse ForeignKey
trains = SpikeTrain.objects.prefetch_related("spikes").all()
# Now train.spikes.all() uses pre-loaded data — no extra query
```

### Combining Both

```python
def get_spike_trains_optimized():
    """Fully optimized spike train query."""
    return (
        SpikeTrain.objects
        .select_related("pathway")              # JOIN pathway
        .prefetch_related(
            "spikes",                            # Prefetch spikes
            "spikes__neuron",                    # Prefetch each spike's neuron
            "spikes__neuron__outgoing_axons",    # And the neuron's axons
        )
        .annotate(
            spike_count=Count("spikes"),         # Compute in SQL, not Python
            total_duration=Sum("spikes__duration"),
        )
        .order_by("-created_at")
    )
```

This makes 4 queries total regardless of how many spike trains exist: one for trains (with pathway JOIN), one for spikes, one for neurons, one for axons.

### Custom Prefetch With `Prefetch`

```python
from django.db.models import Prefetch

# Only prefetch active, high-relevance engrams for each cluster
clusters = MemoryCluster.objects.prefetch_related(
    Prefetch(
        "engrams",
        queryset=Engram.objects.filter(
            is_active=True,
            relevance_score__gte=0.5
        ).order_by("-relevance_score")[:10],
        to_attr="top_engrams",  # Access via cluster.top_engrams
    )
)
```

## Database Indexing

Indexes speed up queries but slow down writes. Add them for columns you filter, order, or join on frequently.

```python
class Engram(models.Model):
    name = models.CharField(max_length=255, db_index=True)        # Indexed
    hash = models.CharField(max_length=64, unique=True, db_index=True)  # Indexed
    relevance_score = models.FloatField(default=0.0, db_index=True)     # Indexed
    is_active = models.BooleanField(default=True)                 # Consider indexing
    created_at = models.DateTimeField(auto_now_add=True, db_index=True) # Indexed
    
    class Meta:
        indexes = [
            # Composite index for common query patterns
            models.Index(
                fields=["is_active", "-relevance_score"],
                name="idx_active_relevance",
            ),
            # Partial index — only index active engrams
            models.Index(
                fields=["-relevance_score"],
                name="idx_active_relevance_partial",
                condition=models.Q(is_active=True),
            ),
        ]
```

### Using `EXPLAIN` to Verify

```python
from django.db import connection

def explain_query(queryset):
    """Print the PostgreSQL EXPLAIN output for a queryset."""
    sql, params = queryset.query.sql_with_params()
    with connection.cursor() as cursor:
        cursor.execute(f"EXPLAIN ANALYZE {sql}", params)
        for row in cursor.fetchall():
            print(row[0])

explain_query(
    Engram.objects.filter(is_active=True, relevance_score__gte=0.8)
)
```

Look for "Seq Scan" (table scan — no index used) vs "Index Scan" (index used). If you see a sequential scan on a large table with a filter, you probably need an index.

## Caching

### Per-View Caching

```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 5)  # Cache for 5 minutes
def brain_region_stats(request):
    """Dashboard statistics — expensive to compute, changes slowly."""
    stats = compute_region_stats()
    return JsonResponse(stats)
```

### Low-Level Caching

```python
from django.core.cache import cache

def get_model_config(model_name):
    """Get model config with caching."""
    cache_key = f"model_config:{model_name}"
    config = cache.get(cache_key)
    
    if config is None:
        config = ModelConfig.objects.get(name=model_name)
        cache.set(cache_key, config, timeout=300)  # 5 minutes
    
    return config


def invalidate_model_config(model_name):
    """Invalidate cache when config changes."""
    cache.delete(f"model_config:{model_name}")
```

### QuerySet Caching Gotcha

```python
# BAD — queryset is evaluated every time
def get_active_engrams():
    return Engram.objects.filter(is_active=True)

# This evaluates the queryset TWICE:
count = get_active_engrams().count()  # SQL query
items = list(get_active_engrams())    # Another SQL query

# GOOD — evaluate once and reuse
engrams = list(Engram.objects.filter(is_active=True))
count = len(engrams)
# Use engrams list directly
```

## Are-Self Connection: Performance in Production

### Engram Search Optimization

```python
def optimized_engram_search(query_embedding, filters=None, limit=20):
    """Production-grade engram search with all optimizations."""
    
    # Start with indexed vector search (pgvector)
    queryset = (
        Engram.objects
        .filter(is_active=True)
        .annotate(distance=CosineDistance("embedding", query_embedding))
    )
    
    # Apply additional filters
    if filters:
        if "min_relevance" in filters:
            queryset = queryset.filter(
                relevance_score__gte=filters["min_relevance"]
            )
        if "tags" in filters:
            queryset = queryset.filter(tags__name__in=filters["tags"])
    
    # Prefetch tags to avoid N+1 when serializing results
    queryset = queryset.prefetch_related("tags")
    
    # Order by distance (closest first) and limit
    queryset = queryset.order_by("distance")[:limit]
    
    return queryset
```

### Serializer Performance

```python
# SLOW — full serializer for list view loads too much data
class EngramFullSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    clusters = MemoryClusterSerializer(many=True)
    
    class Meta:
        model = Engram
        fields = "__all__"

# FAST — light serializer for list view loads only what is needed
class EngramLightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Engram
        fields = ["id", "name", "relevance_score", "is_active", "created_at"]
```

The light/full serializer pattern is not just about API design — it is a performance optimization. List views with 25+ items should never return nested relationships.

## Bulk Operations

```python
# SLOW — N individual INSERT statements
for data in engram_data_list:
    Engram.objects.create(**data)

# FAST — one INSERT with many rows
Engram.objects.bulk_create([
    Engram(**data) for data in engram_data_list
])

# SLOW — N individual UPDATE statements
for engram in Engram.objects.filter(is_active=True):
    engram.relevance_score *= 0.99
    engram.save()

# FAST — one UPDATE statement
Engram.objects.filter(is_active=True).update(
    relevance_score=F("relevance_score") * 0.99
)
```

The `F()` expression tells Django to compute the new value in SQL, not Python. This avoids loading every row into memory.

## Exercises

### Exercise 1: Profile and Optimize

Take a view function that lists spike trains with their pathways, spikes, and neurons. Profile it with 100 spike trains. Identify all N+1 problems. Fix them. Profile again and report the improvement.

### Exercise 2: Index Design

Given the following common queries, design the appropriate indexes:
1. Find active engrams with relevance > 0.8, ordered by relevance
2. Find spike trains by pathway name, ordered by creation date
3. Find neurons by type within a specific pathway
4. Find engrams by tag name with relevance > 0.5

### Exercise 3: Cache Strategy

Design a caching strategy for Are-Self's API:
- Which endpoints should be cached?
- What TTL for each?
- How should cache invalidation work?
- How do you handle authenticated vs unauthenticated users?

Implement caching for the top 3 most-accessed endpoints.

### Exercise 4: Bulk Import

Write a management command that imports 10,000 engrams from a JSON file using `bulk_create`. Compare its performance to individual `create()` calls. Report timing and memory usage.

### Exercise 5: Performance Dashboard

Write a view that returns performance metrics:
- Total database queries in the last hour
- Average query time
- Slowest queries
- Cache hit rate
- Endpoint response time percentiles (p50, p95, p99)

## Reflection

Performance connects to the Variable of **Time** in its most literal form. Every unnecessary query steals time from users. Every unindexed search wastes cycles. Every uncached computation repeats work already done.

But performance optimization also connects to **Responsibility**. A slow application wastes the time of every person who uses it. If a thousand people each wait an extra second for your page to load, you have collectively wasted sixteen minutes of human life. At scale, that number grows into hours, days, years.

Measure first. Optimize what matters. And remember: the fastest code is the code that does not run at all. Question whether the work needs to be done before you question how fast it can be done.
