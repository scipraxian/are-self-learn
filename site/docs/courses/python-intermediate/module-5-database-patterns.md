---
title: "Module 5: Database Patterns"
sidebar_position: 5
---

# Module 5: Database Patterns

## Learning Objectives

By the end of this module, you will be able to:

- Explain how Django's ORM maps Python classes to database tables
- Write querysets to filter, order, and aggregate data
- Use `select_related` and `prefetch_related` to optimize queries
- Understand ForeignKey and ManyToManyField relationships
- Read and write Are-Self model queries for Engrams, Pathways, and Spikes

## The ORM: Objects Meet Databases

Django's ORM (Object-Relational Mapper) lets you interact with a PostgreSQL database using Python instead of SQL. Each model class maps to a database table. Each instance maps to a row. Each field maps to a column.

```python
# This Python code:
engram = Engram.objects.get(id="uuid-1234")

# Generates this SQL:
# SELECT * FROM hippocampus_engram WHERE id = 'uuid-1234';
```

You write Python. Django writes SQL. The database executes it and Django converts the results back to Python objects.

## Basic Queries

### Retrieving All Objects

```python
# Get all engrams
all_engrams = Engram.objects.all()

# This returns a QuerySet — a lazy collection
# No database query happens until you actually use the results
for engram in all_engrams:
    print(engram.name, engram.relevance_score)
```

### Filtering

```python
# Filter by exact value
active_engrams = Engram.objects.filter(is_active=True)

# Filter by comparison
high_relevance = Engram.objects.filter(relevance_score__gte=0.8)

# Filter by string containment
reasoning = Engram.objects.filter(name__icontains="reasoning")

# Chain filters (AND logic)
important = Engram.objects.filter(
    is_active=True,
    relevance_score__gte=0.8
)
```

### Lookup Expressions

Django uses double-underscore suffixes for comparison operators:

| Lookup | Meaning | Example |
|--------|---------|---------|
| `__exact` | Exact match (default) | `name__exact="test"` |
| `__iexact` | Case-insensitive match | `name__iexact="Test"` |
| `__contains` | Contains substring | `name__contains="reason"` |
| `__icontains` | Case-insensitive contains | `name__icontains="REASON"` |
| `__gt` | Greater than | `relevance_score__gt=0.5` |
| `__gte` | Greater than or equal | `relevance_score__gte=0.5` |
| `__lt` | Less than | `relevance_score__lt=0.3` |
| `__lte` | Less than or equal | `relevance_score__lte=0.3` |
| `__in` | In a list | `status__in=["completed", "running"]` |
| `__isnull` | Is null | `parent__isnull=True` |
| `__startswith` | Starts with | `name__startswith="User"` |
| `__range` | Between two values | `relevance_score__range=(0.5, 0.9)` |

### Excluding

```python
# Exclude low-relevance engrams
meaningful = Engram.objects.exclude(relevance_score__lt=0.3)
```

### Ordering

```python
# Order by relevance (ascending)
ordered = Engram.objects.order_by("relevance_score")

# Order by relevance (descending)
ordered = Engram.objects.order_by("-relevance_score")

# Order by multiple fields
ordered = Engram.objects.order_by("-relevance_score", "name")
```

### Getting a Single Object

```python
# Get exactly one object — raises DoesNotExist if not found
try:
    engram = Engram.objects.get(id="uuid-1234")
except Engram.DoesNotExist:
    print("Engram not found.")

# Get the first matching object — returns None if not found
engram = Engram.objects.filter(name="Test").first()
```

## Aggregation

```python
from django.db.models import Avg, Count, Max, Min, Sum

# Average relevance score
avg = Engram.objects.aggregate(avg_relevance=Avg("relevance_score"))
print(avg)  # {"avg_relevance": 0.72}

# Count active engrams
count = Engram.objects.filter(is_active=True).count()

# Multiple aggregations at once
stats = Engram.objects.aggregate(
    total=Count("id"),
    avg_relevance=Avg("relevance_score"),
    max_relevance=Max("relevance_score"),
    min_relevance=Min("relevance_score"),
)
```

## Relationships

### ForeignKey (One-to-Many)

A Neuron belongs to a NeuralPathway. One pathway has many neurons.

```python
class NeuralPathway(models.Model):
    name = models.CharField(max_length=255)

class Neuron(models.Model):
    name = models.CharField(max_length=255)
    pathway = models.ForeignKey(
        NeuralPathway, on_delete=models.CASCADE, related_name="neurons"
    )
```

Queries across relationships:

```python
# Get all neurons for a pathway
pathway = NeuralPathway.objects.get(name="query_processing")
neurons = pathway.neurons.all()  # Uses the related_name

# Filter neurons by their pathway's name
neurons = Neuron.objects.filter(pathway__name="query_processing")

# Get the pathway for a neuron
neuron = Neuron.objects.get(name="Analyze Intent")
print(neuron.pathway.name)
```

### ManyToManyField

An Engram can have many Tags. A Tag can belong to many Engrams.

```python
# Add tags to an engram
engram = Engram.objects.get(name="User prefers concise answers")
tag_reasoning = Tag.objects.get(name="reasoning")
tag_context = Tag.objects.get(name="context")
engram.tags.add(tag_reasoning, tag_context)

# Get all tags for an engram
for tag in engram.tags.all():
    print(tag.name)

# Get all engrams with a specific tag
reasoning_engrams = Engram.objects.filter(tags__name="reasoning")

# Count engrams per tag
from django.db.models import Count
tag_counts = Tag.objects.annotate(
    engram_count=Count("engrams")
).order_by("-engram_count")
```

## The N+1 Problem

This is the most common performance mistake in Django:

```python
# BAD — N+1 queries (1 for pathways + N for neurons)
pathways = NeuralPathway.objects.all()
for pathway in pathways:
    neuron_count = pathway.neurons.count()  # New query for EACH pathway
    print(f"{pathway.name}: {neuron_count} neurons")
```

If there are 50 pathways, this makes 51 database queries. For each pathway, Django goes back to the database to count its neurons.

### `select_related` (ForeignKey)

```python
# GOOD — 1 query with JOIN
neurons = Neuron.objects.select_related("pathway").all()
for neuron in neurons:
    print(f"{neuron.name} belongs to {neuron.pathway.name}")  # No extra query
```

`select_related` performs a SQL JOIN, fetching the related pathway data in the same query.

### `prefetch_related` (ManyToMany, Reverse ForeignKey)

```python
# GOOD — 2 queries (one for engrams, one for all related tags)
engrams = Engram.objects.prefetch_related("tags").all()
for engram in engrams:
    tag_names = [t.name for t in engram.tags.all()]  # No extra query
    print(f"{engram.name}: {tag_names}")
```

`prefetch_related` makes a separate query for the related objects and joins them in Python.

## Are-Self Connection: Real Query Patterns

### Finding Relevant Memories

```python
def find_relevant_engrams(query_embedding, min_relevance=0.5, limit=10):
    """Find the most relevant engrams for a given query."""
    return (
        Engram.objects
        .filter(is_active=True, relevance_score__gte=min_relevance)
        .prefetch_related("tags")
        .order_by("-relevance_score")
        [:limit]
    )
```

### Spike Train With Full Context

```python
def get_spike_train_detail(spike_train_id):
    """Get a spike train with all its spikes and related data."""
    return (
        SpikeTrain.objects
        .select_related("pathway")
        .prefetch_related("spikes__neuron")
        .get(id=spike_train_id)
    )
```

The `spikes__neuron` notation prefetches the neuron for each spike — two levels deep.

### Model Selection Query

```python
def find_affordable_models(budget_remaining, required_capabilities=None):
    """Find models within budget, optionally filtered by capabilities."""
    queryset = (
        ModelConfig.objects
        .filter(
            is_active=True,
            cost_per_request__lte=budget_remaining,
        )
        .order_by("cost_per_request")
    )
    
    if required_capabilities:
        for capability in required_capabilities:
            queryset = queryset.filter(capabilities__contains=[capability])
    
    return queryset
```

## Creating and Updating

```python
# Create
engram = Engram.objects.create(
    name="New discovery",
    description="Something the system just learned",
    relevance_score=0.75,
    is_active=True,
)

# Update a single field
engram.relevance_score = 0.85
engram.save()

# Bulk update
Engram.objects.filter(relevance_score__lt=0.1).update(is_active=False)

# Delete
Engram.objects.filter(is_active=False, relevance_score__lt=0.05).delete()
```

## Exercises

### Exercise 1: Engram Query Practice

Write Django ORM queries for the following (write them as you would in a Django shell or view):

1. All active engrams ordered by relevance (highest first)
2. Engrams with relevance between 0.5 and 0.9
3. Engrams tagged with both "reasoning" and "planning"
4. The average relevance score of all active engrams
5. The top 5 most relevant engrams with their tags prefetched

### Exercise 2: Pathway Explorer

Write functions that use the ORM:
1. `get_pathway_summary(pathway_id)` — returns pathway name, neuron count, and axon count
2. `find_entry_neurons(pathway_id)` — finds neurons with no incoming axons
3. `find_exit_neurons(pathway_id)` — finds neurons with no outgoing axons

### Exercise 3: N+1 Detector

Given this code, identify the N+1 problems and fix them:

```python
def generate_report():
    spike_trains = SpikeTrain.objects.all()
    for train in spike_trains:
        pathway = train.pathway
        print(f"Pathway: {pathway.name}")
        for spike in train.spikes.all():
            neuron = spike.neuron
            print(f"  {neuron.name}: {spike.status}")
            for tag in neuron.tags.all():
                print(f"    Tag: {tag.name}")
```

### Exercise 4: Analytics Dashboard Queries

Write ORM queries to power a dashboard:
1. Total engrams, active engrams, and average relevance
2. Spike trains completed in the last 24 hours
3. Most-used tags (top 10 by engram count)
4. Brain regions with the most models (using annotate and count)
5. Circuit breaker status for all registered models

### Exercise 5: Batch Operations

Write a management function that:
1. Finds all engrams with relevance below 0.1 that have not been modified in 30 days
2. Archives their data to a JSON file
3. Deactivates them (sets `is_active=False`)
4. Logs the operation

## Reflection

Databases are where the Variable of **Time** meets the Variable of **Permadeath**. Without a database, every piece of data dies when the program stops. The database is the system's long-term memory — its hippocampus, if you will.

But databases have their own challenges. Every query takes time. Every unnecessary query wastes resources. The N+1 problem is a perfect illustration: code that looks clean can hide terrible performance. Learning to see these invisible costs — to perceive the queries behind the Python — is a skill that separates competent developers from excellent ones.

Are-Self's Engram system is not just a metaphor for memory. It is a literal implementation of persistent memory, complete with relevance scoring and deduplication. When you write queries against it, you are interacting with a system designed to remember what matters and forget what does not. That is a powerful idea.
