---
title: "Module 3: Vector Mathematics"
sidebar_position: 3
---

# Module 3: Vector Mathematics

## Learning Objectives

By the end of this module, you will be able to:

- Explain what vector embeddings are and why they matter
- Calculate cosine similarity between vectors
- Use pgvector for efficient vector storage and search in PostgreSQL
- Understand the mathematics behind Are-Self's 768-dimensional semantic matching
- Implement the 90% deduplication threshold logic
- Work with embedding APIs to generate vectors from text

## What Are Embeddings?

An embedding is a way to represent text (or images, or any data) as a list of numbers — a vector — such that similar content produces similar vectors.

```python
# These are conceptual — real embeddings have 768 or more dimensions
embedding_python = [0.8, 0.1, 0.9, 0.2, 0.7]  # "Python programming"
embedding_coding = [0.7, 0.2, 0.8, 0.3, 0.6]  # "coding tutorial"
embedding_recipe = [0.1, 0.9, 0.2, 0.8, 0.1]  # "pasta recipe"
```

The Python and coding vectors are close together (similar concepts). The recipe vector is far away (different concept). This "distance" is what makes semantic search possible.

Are-Self uses 768-dimensional vectors — each piece of text is mapped to a point in 768-dimensional space. The VectorMixin provides this capability to every model that needs semantic search.

## Vector Basics

A vector is an ordered list of numbers. Its dimensionality is the count of those numbers.

```python
import math

def vector_length(v):
    """Calculate the magnitude (length) of a vector."""
    return math.sqrt(sum(x ** 2 for x in v))

def dot_product(a, b):
    """Calculate the dot product of two vectors."""
    return sum(x * y for x, y in zip(a, b))

def normalize(v):
    """Normalize a vector to unit length."""
    length = vector_length(v)
    if length == 0:
        return v
    return [x / length for x in v]
```

## Cosine Similarity

Cosine similarity measures the angle between two vectors, ignoring their magnitude. It ranges from -1 (opposite) to 1 (identical):

```python
def cosine_similarity(a, b):
    """Calculate cosine similarity between two vectors.
    
    Returns a value between -1 and 1:
      1.0 = identical direction
      0.0 = orthogonal (unrelated)
     -1.0 = opposite direction
    """
    dot = dot_product(a, b)
    mag_a = vector_length(a)
    mag_b = vector_length(b)
    
    if mag_a == 0 or mag_b == 0:
        return 0.0
    
    return dot / (mag_a * mag_b)
```

Why cosine similarity instead of Euclidean distance? Because cosine similarity is scale-invariant. Two vectors pointing in the same direction have similarity 1.0 regardless of their length. This is important for text embeddings where the absolute magnitude is less meaningful than the direction.

```python
# These point in the same direction but have different magnitudes
v1 = [1.0, 2.0, 3.0]
v2 = [2.0, 4.0, 6.0]  # v1 scaled by 2

print(cosine_similarity(v1, v2))  # 1.0 — same direction
print(euclidean_distance(v1, v2)) # 3.74 — different "position"
```

## Are-Self Connection: The 90% Dedup Threshold

Are-Self uses cosine similarity to detect duplicate Engrams. When a new memory is about to be stored, the system checks its embedding against existing memories:

```python
DEDUP_THRESHOLD = 0.90  # 90% similarity = duplicate


def check_for_duplicates(new_embedding, existing_engrams):
    """Check if a new memory is too similar to existing ones.
    
    Returns the most similar existing engram if above threshold,
    or None if the memory is sufficiently unique.
    """
    best_match = None
    best_similarity = 0.0
    
    for engram in existing_engrams:
        similarity = cosine_similarity(new_embedding, engram.embedding)
        if similarity > best_similarity:
            best_similarity = similarity
            best_match = engram
    
    if best_similarity >= DEDUP_THRESHOLD:
        return best_match, best_similarity
    
    return None, best_similarity


def store_engram(name, description, embedding):
    """Store a new engram with deduplication."""
    existing = Engram.objects.filter(is_active=True)
    
    duplicate, similarity = check_for_duplicates(embedding, existing)
    
    if duplicate:
        raise DuplicateEngram(
            existing_name=duplicate.name,
            similarity=similarity,
        )
    
    engram = Engram.objects.create(
        name=name,
        description=description,
        embedding=embedding,
        hash=generate_hash(f"{name} {description}"),
    )
    return engram
```

The 0.90 threshold means: if two memories are 90% similar in semantic meaning, they are considered duplicates. This prevents the memory system from filling up with near-identical entries while still allowing genuinely different memories to coexist.

## pgvector: Vector Search in PostgreSQL

Scanning every engram and computing cosine similarity in Python is too slow for production. Are-Self uses pgvector, a PostgreSQL extension that adds native vector operations:

```python
# In Django models, using pgvector's Django integration
from pgvector.django import VectorField, CosineDistance


class VectorMixin(models.Model):
    """Mixin providing a 768-dimensional embedding vector."""
    
    embedding = VectorField(dimensions=768, null=True, blank=True)
    
    class Meta:
        abstract = True


class Engram(VectorMixin, ...):
    ...
```

### Vector Queries With pgvector

```python
from pgvector.django import CosineDistance

def semantic_search(query_embedding, limit=10, min_relevance=0.5):
    """Find the most semantically similar engrams to a query."""
    return (
        Engram.objects
        .filter(is_active=True, relevance_score__gte=min_relevance)
        .annotate(distance=CosineDistance("embedding", query_embedding))
        .order_by("distance")  # Lower distance = more similar
        [:limit]
    )
```

The `CosineDistance` annotation computes similarity entirely in PostgreSQL using a vector index. This transforms an O(n) Python loop into an indexed database query that can search millions of vectors in milliseconds.

### Indexing for Performance

```python
# In a migration
from django.db import migrations

class Migration(migrations.Migration):
    operations = [
        migrations.RunSQL(
            "CREATE INDEX engram_embedding_idx ON hippocampus_engram "
            "USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);",
            reverse_sql="DROP INDEX engram_embedding_idx;"
        ),
    ]
```

The IVFFlat index partitions the vector space into regions (lists) for approximate nearest-neighbor search. With 100 lists and proper tuning, this provides sub-millisecond search over millions of vectors with negligible accuracy loss.

## Generating Embeddings

Are-Self generates embeddings by calling an embedding API:

```python
import requests


def generate_embedding(text, model="text-embedding-3-small"):
    """Generate a 768-dimensional embedding from text."""
    response = requests.post(
        "https://api.openai.com/v1/embeddings",
        headers={
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "input": text,
            "model": model,
            "dimensions": 768,
        },
    )
    response.raise_for_status()
    return response.json()["data"][0]["embedding"]


def build_engram_text(engram):
    """Build the text representation for embedding generation."""
    parts = [engram.name]
    if engram.description:
        parts.append(engram.description)
    tag_names = list(engram.tags.values_list("name", flat=True))
    if tag_names:
        parts.append(" ".join(tag_names))
    return " ".join(parts)
```

## Are-Self Connection: Semantic Model Selection

The Hypothalamus uses vector similarity not just for memories, but for choosing which AI model is best for a task. Each model configuration has an embedding representing what it is good at:

```python
def select_model_by_semantics(task_description, budget_remaining):
    """Select the most semantically appropriate model within budget."""
    task_embedding = generate_embedding(task_description)
    
    candidates = (
        ModelConfig.objects
        .filter(
            is_active=True,
            cost_per_request__lte=budget_remaining,
        )
        .annotate(
            semantic_distance=CosineDistance("capability_embedding", task_embedding)
        )
        .order_by("semantic_distance")
    )
    
    # Check circuit breakers for top candidates
    for candidate in candidates:
        breaker = get_circuit_breaker(candidate.name)
        if breaker.can_execute():
            return candidate
    
    raise ModelUnavailable("No suitable model available within budget")
```

This is layered filtering: first budget (hard constraint), then semantic similarity (soft optimization), then circuit breaker status (availability check).

## Working With High-Dimensional Space

Intuitions from 2D and 3D space often break down in high dimensions:

```python
import random

def random_vector(dimensions):
    """Generate a random unit vector."""
    v = [random.gauss(0, 1) for _ in range(dimensions)]
    return normalize(v)


# In high dimensions, random vectors are nearly orthogonal
similarities = []
for _ in range(1000):
    a = random_vector(768)
    b = random_vector(768)
    similarities.append(cosine_similarity(a, b))

avg = sum(similarities) / len(similarities)
print(f"Average similarity of random 768-dim vectors: {avg:.4f}")
# Approximately 0.0 — random vectors are nearly orthogonal
```

This is why 0.90 is a meaningful deduplication threshold. In 768 dimensions, a cosine similarity of 0.90 indicates extremely strong semantic overlap — far above the near-zero baseline of random vectors.

## Exercises

### Exercise 1: Vector Operations Library

Implement a complete vector operations module:
- `cosine_similarity(a, b)`
- `euclidean_distance(a, b)`
- `vector_add(a, b)`
- `vector_scale(v, scalar)`
- `centroid(vectors)` — the average of a list of vectors
- `nearest_neighbors(query, vectors, k)` — find k closest vectors

Include tests for each function.

### Exercise 2: Memory Cluster Centroid

Write a function that computes a Memory Cluster's representative embedding as the centroid (average) of its member Engrams' embeddings. Use this to implement "find the cluster most related to a new engram."

### Exercise 3: Dedup Analysis

Write a script that:
1. Generates a set of test embeddings (some similar, some different)
2. Tests deduplication at various thresholds (0.80, 0.85, 0.90, 0.95)
3. Reports how many duplicates would be caught at each threshold
4. Visualizes the similarity distribution (using print-based histogram)

### Exercise 4: Semantic Search Ranking

Implement a search function that:
- Takes a text query
- Generates its embedding
- Computes cosine similarity against all engrams
- Returns results ranked by a combined score: `0.7 * similarity + 0.3 * relevance_score`
- Supports optional tag filtering

### Exercise 5: Embedding Update Pipeline

Design and implement a Celery task pipeline that:
1. Finds all engrams with stale or missing embeddings
2. Batches them (to avoid overwhelming the embedding API)
3. Generates embeddings concurrently
4. Updates the database
5. Recalculates deduplication for affected engrams
6. Reports results

## Reflection

Vector mathematics connects to the Variable of **Perception** at its most fundamental. Embeddings are a way of teaching machines to perceive meaning — to understand that "Python programming" and "coding tutorial" are close neighbors in concept space, even though they share no words.

The 768 dimensions are not arbitrary. Each dimension captures some aspect of meaning that humans cannot easily name or visualize. Together, they form a rich representation of semantic content. This is perception beyond human intuition — a machine seeing patterns in a space too complex for us to navigate directly.

And yet we built it. We chose the threshold (0.90). We decided what counts as "too similar." The mathematics is precise, but the application is a human judgment call. That interplay between mathematical rigor and human decision-making is at the heart of building systems that work.
