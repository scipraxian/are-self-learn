---
title: "Module 4: Design Patterns in Production"
sidebar_position: 4
---

# Module 4: Design Patterns in Production

## Learning Objectives

By the end of this module, you will be able to:

- Identify and apply the Observer, Strategy, DAG, Circuit Breaker, and Repository patterns
- Explain why each pattern was chosen in Are-Self's architecture
- Recognize pattern tradeoffs and when to use alternatives
- Analyze a production codebase through the lens of design patterns
- Make informed architectural decisions when designing new features

## Patterns Are Solutions to Recurring Problems

Design patterns are not recipes to follow blindly. They are named solutions to problems that appear again and again in software. Knowing the pattern name lets you communicate architecture decisions efficiently and learn from others who have solved similar problems.

Are-Self uses several patterns. Each one exists because a specific problem demanded it.

## Observer Pattern: Django Signals

**Problem**: Multiple subsystems need to react when something changes, but the changing subsystem should not know about all of them.

**Solution**: Publish events. Let interested parties subscribe.

```python
# The Engram model does not know about the embedding service,
# the dashboard, the neurotransmitter system, or the search index.
# It just saves itself.
engram.save()

# But all of these respond:
@receiver(post_save, sender=Engram)
def update_search_index(sender, instance, **kwargs): ...

@receiver(post_save, sender=Engram)
def fire_acetylcholine(sender, instance, created, **kwargs): ...

@receiver(m2m_changed, sender=Engram.tags.through)
def regenerate_embedding(sender, instance, action, **kwargs): ...
```

**Why Are-Self uses it**: Brain regions need to communicate without being coupled. The hippocampus should not import from the synaptic cleft. Django signals provide the decoupling.

**Tradeoffs**:
- Signals make control flow harder to trace — you cannot simply read `save()` to know everything that happens
- Signal handlers can fail silently if not properly monitored
- Order of execution between handlers is not guaranteed

**When to avoid**: When there is only one subscriber, use a direct method call. Signals add indirection that is only justified when multiple independent systems need to respond.

## Strategy Pattern: Model Selection Failover

**Problem**: The system needs to choose between multiple algorithms (or services) at runtime based on conditions.

**Solution**: Define a family of interchangeable strategies. Select one based on context.

```python
class ModelSelectionStrategy:
    """Base class for model selection strategies."""
    
    def select(self, task_description, budget, available_models):
        raise NotImplementedError


class CheapestFirst(ModelSelectionStrategy):
    """Select the cheapest model that fits the budget."""
    
    def select(self, task_description, budget, available_models):
        affordable = [m for m in available_models if m.cost <= budget]
        if not affordable:
            return None
        return min(affordable, key=lambda m: m.cost)


class SemanticMatch(ModelSelectionStrategy):
    """Select the model most semantically suited to the task."""
    
    def select(self, task_description, budget, available_models):
        task_embedding = generate_embedding(task_description)
        affordable = [m for m in available_models if m.cost <= budget]
        if not affordable:
            return None
        return min(
            affordable,
            key=lambda m: cosine_distance(task_embedding, m.capability_embedding)
        )


class FailoverChain(ModelSelectionStrategy):
    """Try models in priority order, falling back on failure."""
    
    def __init__(self, primary_strategy, circuit_breakers):
        self.primary_strategy = primary_strategy
        self.circuit_breakers = circuit_breakers
    
    def select(self, task_description, budget, available_models):
        # Filter out models with open circuit breakers
        healthy_models = [
            m for m in available_models
            if self.circuit_breakers.get(m.name, CircuitBreaker(m.name)).can_execute()
        ]
        return self.primary_strategy.select(task_description, budget, healthy_models)
```

**Why Are-Self uses it**: The Hypothalamus needs to select models based on budget, capability, availability, and past performance. These criteria change based on context. The strategy pattern lets the selection algorithm be swapped without changing the calling code.

**Tradeoffs**:
- Adding a new strategy requires no changes to existing code (Open/Closed Principle)
- Strategies can be composed (FailoverChain wraps another strategy)
- More classes to maintain than a simple if/else chain

## DAG Pattern: Neural Pathways

**Problem**: A workflow has multiple steps with dependencies. Some steps can run in parallel. Some steps branch based on results.

**Solution**: Represent the workflow as a Directed Acyclic Graph where nodes are tasks and edges define execution order and branching.

```python
class DAGExecutor:
    """Executes a neural pathway as a DAG."""
    
    def __init__(self, pathway):
        self.pathway = pathway
        self.neurons = {n.id: n for n in pathway.neurons.all()}
        self.axons = list(pathway.axons.all())
        self.results = {}
    
    def get_entry_neurons(self):
        """Find neurons with no incoming axons — the starting points."""
        targets = {a.target_id for a in self.axons}
        return [n for n in self.neurons.values() if n.id not in targets]
    
    def get_next_neurons(self, current_neuron, result_status):
        """Find the next neurons based on branching logic."""
        outgoing = [a for a in self.axons if a.source_id == current_neuron.id]
        
        next_neurons = []
        for axon in outgoing:
            if axon.branch_type == "flow":
                next_neurons.append(self.neurons[axon.target_id])
            elif axon.branch_type == result_status:
                next_neurons.append(self.neurons[axon.target_id])
        
        return next_neurons
    
    def get_ready_neurons(self):
        """Find neurons whose dependencies are all satisfied."""
        ready = []
        for neuron in self.neurons.values():
            if neuron.id in self.results:
                continue  # Already executed
            
            incoming = [a for a in self.axons if a.target_id == neuron.id]
            if not incoming:
                if neuron.id not in self.results:
                    ready.append(neuron)
            elif all(a.source_id in self.results for a in incoming):
                ready.append(neuron)
        
        return ready
    
    async def execute(self, axoplasm):
        """Execute the entire DAG."""
        while True:
            ready = self.get_ready_neurons()
            if not ready:
                break
            
            # Execute ready neurons in parallel
            tasks = [
                self.execute_neuron(neuron, axoplasm) 
                for neuron in ready
            ]
            await asyncio.gather(*tasks)
        
        return axoplasm
```

**Why Are-Self uses it**: Reasoning workflows are not linear. A query might need memory retrieval AND context analysis simultaneously, then branch based on whether relevant memories were found. The DAG captures this complexity.

**Tradeoffs**:
- DAGs can represent complex workflows that linear sequences cannot
- Cycle detection is required (hence "acyclic")
- More complex to build and debug than simple pipelines

## Circuit Breaker Pattern

**Problem**: A remote service is failing. Continuing to call it wastes time and may worsen the failure. But you need to detect when it recovers.

**Solution**: Track failures. After a threshold, stop calling (open). After a cooldown, try one call (half-open). If it succeeds, resume (close). If it fails, extend the cooldown.

```
        ┌─────────────────────────────────────┐
        │                                     │
        v                                     │
    ┌────────┐    failures >= threshold    ┌──────┐
    │ CLOSED │ ─────────────────────────> │ OPEN │
    │        │                            │      │
    └────────┘                            └──────┘
        ^                                     │
        │                                     │ cooldown elapsed
        │                                     v
        │          success               ┌───────────┐
        └─────────────────────────────── │ HALF-OPEN │
                                         │           │
                   failure               └───────────┘
                   ────────────────────────> back to OPEN
```

**Why Are-Self uses it**: AI model APIs fail. Network issues, rate limits, service degradation — these are not rare events. Without circuit breakers, the system would waste time and budget on calls that will fail. The escalating cooldown (60s, 2m, 4m, 5m cap) gives failing services time to recover.

**Tradeoffs**:
- Prevents cascading failures across the system
- The half-open state allows automatic recovery detection
- Threshold and cooldown values require tuning — too aggressive and you give up too soon, too lenient and you waste resources

## Repository Pattern: Encapsulated Data Access

**Problem**: Data access logic is scattered throughout the codebase. Different views write slightly different queries for the same purpose.

**Solution**: Centralize data access behind a repository interface.

```python
class EngramRepository:
    """Centralized data access for Engrams."""
    
    @staticmethod
    def get_active(min_relevance=0.0):
        return (
            Engram.objects
            .filter(is_active=True, relevance_score__gte=min_relevance)
            .prefetch_related("tags")
            .order_by("-relevance_score")
        )
    
    @staticmethod
    def search_semantic(query_embedding, limit=10):
        return (
            Engram.objects
            .filter(is_active=True)
            .annotate(distance=CosineDistance("embedding", query_embedding))
            .order_by("distance")
            [:limit]
        )
    
    @staticmethod
    def find_duplicates(embedding, threshold=0.90):
        candidates = (
            Engram.objects
            .filter(is_active=True)
            .annotate(distance=CosineDistance("embedding", embedding))
            .filter(distance__lte=1 - threshold)
            .order_by("distance")
        )
        return candidates
    
    @staticmethod
    def deactivate_stale(days=30, min_relevance=0.1):
        from django.utils import timezone
        cutoff = timezone.now() - timedelta(days=days)
        return (
            Engram.objects
            .filter(
                is_active=True,
                relevance_score__lt=min_relevance,
                modified_at__lt=cutoff,
            )
            .update(is_active=False)
        )
```

**Why**: Every view and task that needs engrams goes through `EngramRepository`. Query optimization happens in one place. Prefetch strategies are consistent. If the query logic changes, it changes everywhere at once.

## Pattern Composition in Are-Self

The real power emerges when patterns combine:

1. A **DAG** (NeuralPathway) defines the workflow
2. Each neuron uses the **Strategy** pattern to select its approach
3. The model selection uses **Circuit Breakers** for resilience
4. Results are stored through the **Repository** pattern
5. Changes trigger **Observer** signals (neurotransmitters)

This is not accidental. Each pattern addresses a different concern, and together they create a system that is flexible, resilient, and maintainable.

## Exercises

### Exercise 1: Pattern Identification

Read through Are-Self's codebase and identify at least two additional instances of each pattern discussed. Document where you found them and why that pattern was chosen.

### Exercise 2: Strategy for Embedding Models

Implement a Strategy pattern for choosing embedding models:
- `FastEmbedding` — uses a smaller, faster model for low-priority content
- `PreciseEmbedding` — uses the full model for high-priority content
- `CachedEmbedding` — checks a cache first, falls back to generation
- `CompositeEmbedding` — tries strategies in order

### Exercise 3: Event Bus

Implement a more powerful Observer pattern — an event bus with:
- Named events with typed payloads
- Priority-ordered handlers
- Async handler support
- Error isolation (one handler's failure does not affect others)

### Exercise 4: Workflow Builder

Create a fluent API for building Neural Pathways:

```python
pathway = (
    PathwayBuilder("query_processing")
    .add_neuron("receive", type="input")
    .add_neuron("analyze", type="process")
    .add_neuron("respond", type="output")
    .add_neuron("error_handler", type="error")
    .connect("receive", "analyze", branch="flow")
    .connect("analyze", "respond", branch="success")
    .connect("analyze", "error_handler", branch="failure")
    .build()
)
```

Validate the result is a valid DAG (no cycles).

### Exercise 5: Pattern Tradeoff Analysis

For each of the following scenarios, recommend which pattern(s) to use and explain why:
1. A notification system that sends alerts via email, SMS, and push notifications
2. A data pipeline that processes CSV files through validation, transformation, and loading
3. A caching layer that can use Redis, Memcached, or in-memory storage
4. A rate-limiting system for API endpoints with different limits per user tier

## Reflection

Design patterns connect to the Variable of **Inquiry** at its deepest level. Each pattern is an answer to a question: "How do we handle multiple interchangeable algorithms?" (Strategy). "How do we decouple event producers from consumers?" (Observer). "How do we protect against cascading failures?" (Circuit Breaker).

But they also connect to **Humility**. These patterns were not invented in a vacuum. They emerged from decades of collective experience — from systems that failed, from architectures that crumbled, from bugs that could have been prevented. When you use a design pattern, you are standing on the accumulated wisdom of thousands of engineers who learned these lessons the hard way.

Do not use patterns to show off. Use them because they solve your problem. And when no existing pattern fits, have the courage to design something new — knowing that it might become the next pattern someone else learns from.
