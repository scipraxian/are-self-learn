---
title: "Module 8: Capstone Project"
sidebar_position: 8
---

# Module 8: Capstone Project

## Learning Objectives

By the end of this module, you will be able to:

- Design a Django model with proper fields, relationships, and mixins
- Implement a DRF serializer and ViewSet with light/full variants
- Write signal handlers for model lifecycle events
- Write comprehensive tests for your implementation
- Extend an existing Are-Self brain region with new functionality

## The Project: Extend the Hippocampus With Memory Clusters

You will add a new concept to Are-Self's hippocampus: **Memory Clusters**. A Memory Cluster is a group of related Engrams that together represent a coherent topic or theme. Think of it as a folder for memories, but one that is semantically meaningful and can track its own aggregate relevance.

This feature touches every concept from the Intermediate course:
- Classes and OOP (Module 1)
- Inheritance and mixins (Module 2)
- Error handling (Module 3)
- API endpoints (Module 4)
- Database queries (Module 5)
- Testing (Module 6)
- Signals (Module 7)

## Requirements

### Part 1: The Model

Create a `MemoryCluster` model in the hippocampus app:

```python
class MemoryCluster(CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin, VectorMixin):
    """A group of semantically related Engrams."""
    
    description = models.TextField(blank=True, default="")
    engrams = models.ManyToManyField(
        "Engram", blank=True, related_name="clusters"
    )
    aggregate_relevance = models.FloatField(default=0.0)
    is_active = models.BooleanField(default=True)
    max_size = models.IntegerField(default=50)
    
    class Meta:
        ordering = ["-aggregate_relevance"]
    
    def __str__(self):
        return f"{self.name} ({self.engram_count} engrams, relevance: {self.aggregate_relevance:.2f})"
    
    @property
    def engram_count(self):
        return self.engrams.count()
    
    def recalculate_relevance(self):
        """Recalculate aggregate relevance from member engrams."""
        # Implementation: average of member engrams' relevance scores
        pass
    
    def is_full(self):
        """Check if the cluster has reached its maximum size."""
        return self.engram_count >= self.max_size
    
    def add_engram(self, engram):
        """Add an engram to this cluster with validation."""
        # Must check: is the cluster full? Is the engram already a member?
        pass
```

Implement all methods. The `recalculate_relevance` method should compute the mean relevance score of all member engrams. The `add_engram` method should raise appropriate custom exceptions for validation failures.

### Part 2: Custom Exceptions

Create exceptions specific to the Memory Cluster feature:

```python
class ClusterFullError(AreException):
    """Raised when attempting to add an engram to a full cluster."""
    pass

class DuplicateClusterMemberError(AreException):
    """Raised when an engram is already in the cluster."""
    pass
```

### Part 3: Signal Handlers

Write signal handlers that:

1. **On `m2m_changed` for `MemoryCluster.engrams`**: Recalculate the cluster's aggregate relevance whenever engrams are added or removed. Also regenerate the cluster's embedding vector based on its members.

2. **On `post_save` for `MemoryCluster`**: Fire an acetylcholine neurotransmitter signal to notify the system of cluster creation or updates.

3. **On `post_save` for `Engram`**: When an Engram's relevance score changes, recalculate the aggregate relevance of all clusters it belongs to.

### Part 4: Serializers

Create two serializers:

**Light Serializer** (for list views):
```python
class MemoryClusterLightSerializer(serializers.ModelSerializer):
    engram_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = MemoryCluster
        fields = ["id", "name", "aggregate_relevance", "engram_count", 
                  "is_active", "created_at"]
```

**Full Serializer** (for detail views):
```python
class MemoryClusterFullSerializer(serializers.ModelSerializer):
    engrams = EngramLightSerializer(many=True, read_only=True)
    engram_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = MemoryCluster
        fields = ["id", "name", "description", "aggregate_relevance",
                  "engrams", "engram_count", "is_active", "max_size",
                  "created_at", "modified_at", "delta"]
```

### Part 5: ViewSet

Create a DRF ViewSet:

```python
class MemoryClusterViewSet(viewsets.ModelViewSet):
    queryset = MemoryCluster.objects.all()
    filterset_fields = ["is_active", "aggregate_relevance"]
    
    def get_serializer_class(self):
        if self.action == "list":
            return MemoryClusterLightSerializer
        return MemoryClusterFullSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == "list":
            return queryset.annotate(engram_count=Count("engrams"))
        return queryset.prefetch_related("engrams__tags")
    
    @action(detail=True, methods=["post"])
    def add_engram(self, request, pk=None):
        """Custom action to add an engram to a cluster."""
        # Validate engram_id from request data
        # Call cluster.add_engram()
        # Handle ClusterFullError and DuplicateClusterMemberError
        pass
    
    @action(detail=True, methods=["post"])
    def recalculate(self, request, pk=None):
        """Force recalculation of cluster statistics."""
        pass
```

### Part 6: URL Configuration

Register the ViewSet in the URL router:

```python
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"memory-clusters", MemoryClusterViewSet)

urlpatterns = router.urls
```

### Part 7: Tests

Write tests covering:

**Model Tests:**
- Creating a MemoryCluster with defaults
- Adding engrams and verifying the count
- Recalculating aggregate relevance
- Cluster full check and error raising
- Duplicate member prevention

**Signal Tests:**
- Relevance recalculation on M2M change
- Neurotransmitter firing on save
- Cascade recalculation when an engram's relevance changes

**API Tests:**
- List clusters (verify light serializer)
- Retrieve a cluster (verify full serializer with nested engrams)
- Create a cluster via POST
- Add an engram via the custom action
- Filter clusters by relevance

Aim for at least 15 test cases.

## Scaffolding

Here is the file structure for your implementation:

```
are_self/hippocampus/
    models.py          # Add MemoryCluster model
    serializers.py     # Add light and full serializers
    views.py           # Add MemoryClusterViewSet
    signals.py         # Add signal handlers
    urls.py            # Register URL routes
    exceptions.py      # Add custom exceptions
    tests/
        test_models.py        # Model tests
        test_signals.py       # Signal tests
        test_api.py           # API endpoint tests
```

## Evaluation Criteria

| Criterion | What to Check |
|-----------|---------------|
| **Model Design** | Correct use of mixins, appropriate field types, sensible defaults |
| **Error Handling** | Custom exceptions with useful messages, proper validation |
| **Signals** | Correct signal types, avoiding infinite loops, proper guard conditions |
| **Serializers** | Light/full pattern, correct field exposure, nested serialization |
| **ViewSet** | Proper queryset optimization, custom actions, error responses |
| **Tests** | Coverage of happy path and edge cases, clear test names |
| **Code Quality** | Docstrings, consistent style, DRY principles |

## Stretch Goals

1. **Auto-Clustering**: Write a management command that automatically groups engrams into clusters based on their embedding vectors' cosine similarity.

2. **Cluster Merge**: Implement a `merge_clusters(cluster_a, cluster_b)` function that combines two clusters, deduplicates engrams, and recalculates everything.

3. **Relevance Decay**: Add a signal that gradually decreases a cluster's relevance over time if its engrams are not accessed.

4. **Cluster Visualization**: Add an API endpoint that returns cluster data formatted for a graph visualization library (nodes = engrams, edges = shared tags).

## Reflection

You have built a feature from the ground up — model, exceptions, signals, serializers, API, and tests. This is a complete vertical slice through a Django application.

This capstone connects to the Variable of **Fulfillment**. Building something that plugs into a larger system, that follows the system's patterns and extends its capabilities — that is deeply satisfying work. You did not just learn Python concepts in isolation. You learned how they combine in a real architecture.

It also connects to **Perseverance**. This was not a trivial exercise. There were moments where the signals had to be debugged, where the queryset optimization was not obvious, where the test setup was tedious. You worked through those moments. That persistence is more valuable than any individual technique.

## What Comes Next

The Python Advanced course awaits. You will learn:
- Metaprogramming — decorators, descriptors, and metaclasses
- Concurrency — asyncio, Celery, and parallel execution
- Vector mathematics — the math behind Are-Self's semantic search
- Design patterns — the architectural decisions that shape production systems
- Performance optimization — profiling and query tuning
- Security — protecting Django applications
- Deployment — shipping code to production
- A final capstone — designing a new brain region from scratch

You have the foundation. The advanced course builds the tower.
