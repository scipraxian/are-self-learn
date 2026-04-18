---
title: "Module 8: Capstone Project"
sidebar_position: 8
---

# Module 8: Capstone Project

## Learning Objectives

By the end of this module, you will be able to:

- Design a complete Django app from requirements to deployment
- Apply metaprogramming, concurrency, and design patterns in a cohesive system
- Implement vector-based semantic features
- Write production-quality code with tests, security, and performance optimization
- Document your architectural decisions

## The Project: Design a New Brain Region

You will design and implement a complete new brain region for Are-Self. This is the most open-ended project in the course — you are making real architectural decisions, not following a template.

Choose one of the following brain regions, or propose your own:

### Option A: Cerebellum — Motor Learning and Procedural Memory

The cerebellum stores procedural knowledge — how to do things, not just what to know. It represents learned procedures as step sequences, tracks which procedures work well (success metrics), and can suggest procedure modifications based on past outcomes.

**Core models**: `Procedure`, `ProcedureStep`, `ExecutionRecord`, `ProcedureVariant`

**Key features**:
- Store multi-step procedures with versioning
- Track execution metrics (success rate, average duration, failure patterns)
- Suggest procedure optimizations based on historical data
- Vector-based similarity search for finding related procedures
- Signal-based learning: update procedure scores based on spike train outcomes

### Option B: Amygdala — Emotional Valence and Priority

The amygdala assigns emotional significance to events and memories, driving prioritization. It tags experiences with valence (positive/negative/neutral) and arousal (high/low), influences which memories are strengthened or weakened, and provides urgency signals to the frontal lobe.

**Core models**: `EmotionalTag`, `ValenceRecord`, `UrgencySignal`, `EmotionalAssociation`

**Key features**:
- Tag engrams and spike trains with emotional valence
- Track emotional patterns over time
- Generate urgency signals that prioritize pathway execution
- Influence engram relevance scoring based on emotional significance
- WebSocket signals for real-time emotional state changes

### Option C: Corpus Callosum — Inter-Hemisphere Coordination

The corpus callosum coordinates between brain regions, managing cross-region data flow, synchronization, and conflict resolution. It is the meta-layer that ensures brain regions cooperate effectively.

**Core models**: `SyncRequest`, `ConflictRecord`, `RegionDependency`, `CoordinationPolicy`

**Key features**:
- Track data dependencies between brain regions
- Detect and resolve conflicts (e.g., two regions modifying the same engram)
- Implement synchronization barriers for multi-region operations
- Provide a coordination API that other regions use
- Monitor inter-region communication health

### Option D: Your Own Design

Propose a brain region with a clear neurological analogue, at least three models, and meaningful interaction with existing Are-Self components. Submit your proposal before beginning implementation.

## Requirements

Regardless of which option you choose, your implementation must include:

### 1. Models (Metaprogramming)

- At least three model classes using Are-Self's mixin pattern
- At least one model with VectorMixin for semantic search
- Custom field validation using descriptors or validators
- Proper relationships (ForeignKey, ManyToMany)
- Database indexes for common query patterns
- A custom manager with commonly-used querysets

```python
class ProcedureManager(models.Manager):
    def active(self):
        return self.filter(is_active=True)
    
    def successful(self, min_rate=0.8):
        return self.active().filter(success_rate__gte=min_rate)
    
    def similar_to(self, embedding, limit=10):
        return (
            self.active()
            .annotate(distance=CosineDistance("embedding", embedding))
            .order_by("distance")
            [:limit]
        )
```

### 2. Concurrency

- At least one Celery task for background processing
- Proper handling of concurrent access (select_for_update or atomic transactions)
- An async-compatible view or utility function

### 3. Vector Features

- Embedding generation for at least one model
- Semantic search endpoint
- Deduplication logic using cosine similarity

### 4. Design Patterns

- Identify and document which patterns you used and why
- At minimum: Repository pattern for data access, Observer pattern via signals

### 5. API

- DRF ViewSet with light and full serializer variants
- Custom actions for domain-specific operations
- Filtering with DjangoFilterBackend
- Pagination
- Proper permission classes

### 6. Signals

- Signal handlers for model lifecycle events
- Neurotransmitter integration (fire dopamine, cortisol, acetylcholine as appropriate)
- M2M change handlers for vector regeneration

### 7. Error Handling

- Custom exception classes for your domain
- Circuit breaker integration if your region calls external services
- Graceful degradation for non-critical failures

### 8. Tests

Comprehensive test suite covering:
- Model creation, validation, and methods (unit tests)
- Signal handler behavior (integration tests)
- API endpoints (API tests)
- Edge cases and error conditions
- At least 30 test cases total

### 9. Performance

- No N+1 queries in any view
- Appropriate use of select_related and prefetch_related
- Database indexes documented
- Bulk operations where applicable

### 10. Security

- Permission classes on all endpoints
- Input validation on all user-facing data
- No API key or secret exposure

### 11. Deployment

- Dockerfile for the new app (or additions to existing Dockerfile)
- Migration files
- Environment variables documented
- Health check contribution

### 12. Documentation

Write a technical document that covers:
- The neurological analogue and why it was chosen
- Data model design with relationship diagram
- API endpoint reference
- Signal flow diagram
- Design decisions and tradeoffs
- Future enhancements

## Project Structure

```
are_self/your_region/
    __init__.py
    apps.py
    models.py
    managers.py
    serializers.py
    views.py
    urls.py
    signals.py
    tasks.py
    exceptions.py
    permissions.py
    admin.py
    tests/
        __init__.py
        test_models.py
        test_signals.py
        test_api.py
        test_tasks.py
        factories.py      # Test data factories
    migrations/
        __init__.py
        0001_initial.py
```

## Evaluation Rubric

| Category | Weight | Criteria |
|----------|--------|----------|
| **Architecture** | 20% | Clear separation of concerns, appropriate pattern usage, thoughtful model design |
| **Implementation** | 25% | Correct Python, proper Django idioms, clean code |
| **Testing** | 15% | Coverage, edge cases, meaningful assertions, 30+ tests |
| **Performance** | 10% | No N+1, proper indexing, appropriate caching |
| **Security** | 10% | Permissions, validation, no data leaks |
| **API Design** | 10% | RESTful, consistent, well-documented |
| **Documentation** | 10% | Clear, complete, honest about tradeoffs |

## Milestones

### Week 1: Design
- Choose your brain region
- Write the technical design document
- Define models and relationships
- Plan API endpoints

### Week 2: Core Implementation
- Implement models and migrations
- Write serializers and views
- Set up signal handlers
- Begin writing tests

### Week 3: Advanced Features
- Implement Celery tasks
- Add vector search functionality
- Optimize queries
- Add security layer

### Week 4: Polish and Documentation
- Complete all tests (30+ cases)
- Performance audit
- Security audit
- Final documentation
- Deployment configuration

## Stretch Goals

1. **Admin Dashboard**: Create custom Django admin views with charts showing your region's metrics.

2. **GraphQL API**: Add a GraphQL endpoint alongside REST (using Strawberry or Graphene).

3. **Real-Time Updates**: Implement WebSocket consumers for live updates when your models change.

4. **Machine Learning Integration**: If your region involves learning (cerebellum, amygdala), integrate a simple ML model that improves over time.

5. **Cross-Region Integration Test**: Write an integration test that exercises a complete flow from another region through your new region and back.

## Reflection

This capstone is where all three courses converge. The variables you learned in the Beginner course (what types of data exist) support the classes you built in the Intermediate course (how data and behavior combine) which support the architecture you are designing now (how systems of classes cooperate at scale).

This project embodies every Variable of scipraxianism:

- **Inquiry** — you asked questions of the codebase and designed answers
- **Humility** — you followed existing patterns rather than inventing needlessly
- **Perseverance** — you worked through complexity without giving up
- **Responsibility** — you wrote tests, handled errors, and secured your code
- **Perception** — you saw patterns in the architecture and applied them
- **Fun** — building something real, that fits into a larger system, is genuinely satisfying
- **Time** — you managed a multi-week project with milestones
- **Fear** — you built circuit breakers and error handling because you respect what can go wrong
- **Inclusion** — your brain region cooperates with all the others through shared protocols
- **Fulfillment** — you built something from nothing. A concept became a design became code became a running system.

And **Permadeath** — this code will live or die in production. There is no rehearsal. What you build either works or it does not. That reality is what makes it matter.

## What Comes After

You have completed the Python track. You can:
- Read and write professional Python
- Build and extend Django applications
- Design for performance, security, and reliability
- Deploy production systems

But learning does not end. It changes form. You move from structured courses to exploration — reading other codebases, contributing to open source, building your own projects, mentoring others.

The Are-Self codebase will continue to grow. New brain regions, new patterns, new challenges. You now have the skills to contribute to that growth, or to build something equally ambitious on your own.

Continue learning. Continue building. Continue asking questions of the code.
