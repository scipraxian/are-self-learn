---
title: "Module 7: Your First Are-Self Exploration"
sidebar_position: 7
---

# Module 7: Your First Are-Self Exploration

## Learning Objectives

By the end of this module, you will be able to:

- Navigate a Django project's directory structure
- Read a `models.py` file and understand its high-level structure
- Identify classes, fields, and methods (without needing to write them yet)
- Map Are-Self's brain regions to their code files
- Preview the concept of classes and objects that you will learn in the Intermediate course

## The Shape of a Django Project

A Django project is organized into apps — self-contained modules that each handle a specific responsibility. Are-Self's structure looks like this:

```
are_self/
    identity/
        __init__.py
        models.py
        views.py
        serializers.py
        urls.py
        admin.py
    hippocampus/
        __init__.py
        models.py
        views.py
        serializers.py
        urls.py
        admin.py
    frontal_lobe/
        ...
    prefrontal_cortex/
        ...
    hypothalamus/
        ...
    central_nervous_system/
        ...
    peripheral_nervous_system/
        ...
    thalamus/
        ...
    temporal_lobe/
        ...
    parietal_lobe/
        ...
    synaptic_cleft/
        ...
    occipital_lobe/
        ...
    common/
        ...
    settings.py
    urls.py
```

Each brain region is a Django app. Each app follows the same file structure:

| File | Purpose |
|------|---------|
| `__init__.py` | Marks this directory as a Python package (often empty) |
| `models.py` | Defines the data structures (database tables) |
| `views.py` | Handles HTTP requests and responses |
| `serializers.py` | Converts data between Python objects and JSON |
| `urls.py` | Maps URLs to views |
| `admin.py` | Configures the Django admin interface |

For now, we are focusing on `models.py` — the file that defines what data each brain region stores.

## Reading a Model File

Here is what you would see if you opened `are_self/hippocampus/models.py`:

```python
from django.db import models
from are_self.common.models import (
    CreatedAndModifiedWithDelta,
    UUIDIdMixin,
    NameMixin,
    VectorMixin,
)


class Engram(CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin, VectorMixin):
    """A memory record in the hippocampus."""
    
    hash = models.CharField(max_length=64, unique=True, db_index=True)
    description = models.TextField(blank=True, default="")
    relevance_score = models.FloatField(default=0.0)
    is_active = models.BooleanField(default=True)
    tags = models.ManyToManyField("Tag", blank=True, related_name="engrams")
    
    class Meta:
        ordering = ["-relevance_score"]
    
    def __str__(self):
        return f"{self.name} ({self.relevance_score:.2f})"


class Tag(CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin):
    """A categorization label for Engrams."""
    
    class Meta:
        ordering = ["name"]
    
    def __str__(self):
        return self.name
```

Let us break down what you can already understand:

### The Imports

```python
from django.db import models
from are_self.common.models import (
    CreatedAndModifiedWithDelta,
    UUIDIdMixin,
    NameMixin,
    VectorMixin,
)
```

This loads tools from other files. `models` comes from Django. The mixins come from Are-Self's `common` module. You have seen `import` before with `json` and `os`.

### The Class Line

```python
class Engram(CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin, VectorMixin):
```

Think of a class as a template for creating things. An `Engram` is a template for creating memory records. The items in parentheses are mixins — reusable pieces of functionality that the Engram inherits. You will learn all about this in the Intermediate course.

For now, understand:
- `CreatedAndModifiedWithDelta` — gives every Engram automatic creation and modification timestamps
- `UUIDIdMixin` — gives every Engram a unique identifier
- `NameMixin` — gives every Engram a `name` field
- `VectorMixin` — gives every Engram a 768-dimensional embedding vector for semantic search

### The Fields

```python
hash = models.CharField(max_length=64, unique=True, db_index=True)
description = models.TextField(blank=True, default="")
relevance_score = models.FloatField(default=0.0)
is_active = models.BooleanField(default=True)
tags = models.ManyToManyField("Tag", blank=True, related_name="engrams")
```

Each line defines a piece of data the Engram stores. You already know the types:
- `CharField` → string (with a maximum length)
- `TextField` → string (unlimited length)
- `FloatField` → float
- `BooleanField` → bool
- `ManyToManyField` → a relationship to another model (one Engram can have many Tags, and one Tag can belong to many Engrams)

### The `__str__` Method

```python
def __str__(self):
    return f"{self.name} ({self.relevance_score:.2f})"
```

This is a function attached to the class. The `self` parameter refers to the specific Engram instance. When Python needs to display an Engram as text (like in `print()`), it calls this method.

## Mapping the Brain Regions

Here is your guide to what each brain region does and what models it contains:

### Identity
The self-awareness system. Contains `IdentityDisc` — a record of who the AI is in a given context, with level, XP, and addon capabilities. Phases: IDENTIFY, CONTEXT, HISTORY, TERMINAL.

### Hippocampus
The memory system. Contains `Engram` (memory records with hash deduplication at 90% similarity threshold, relevance scoring, and 768-dim embeddings) and `Tag` (categorization labels).

### Frontal Lobe
The planning and execution system. Contains `NeuralPathway` (DAG workflow templates), `Neuron` (individual processing nodes), and `Axon` (directed edges with flow/success/failure branching).

### Prefrontal Cortex
Higher-order reasoning and strategy. Works with the frontal lobe to plan complex multi-step operations.

### Hypothalamus
The model selection and resource management system. Contains model configurations with budget filtering, circuit breakers (60s, 2m, 4m, 5m cap), failover chains, and vector-based semantic matching for choosing the right model for a task.

### Central Nervous System
The core coordination hub. Routes requests between brain regions and manages system-wide state.

### Peripheral Nervous System
The external interface. Handles heartbeat monitoring, external API interactions, and I/O operations. Contains the PNS heartbeat that monitors system health.

### Thalamus
The signal relay station. Filters and routes incoming signals to the appropriate brain region, acting as a gatekeeper for sensory input.

### Temporal Lobe
Pattern recognition and sequencing. Identifies temporal patterns in data and sequences of events.

### Additional Regions

- **Parietal Lobe** — spatial and relational reasoning
- **Synaptic Cleft** — the communication layer, handling WebSocket connections for real-time neurotransmitter dispatch (dopamine, cortisol, acetylcholine)
- **Occipital Lobe** — visual and structural processing
- **Common** — shared utilities, mixins, and base classes used by all other regions

## Reading More Model Files

Here is what the Frontal Lobe's models might look like:

```python
class NeuralPathway(CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin):
    """A DAG workflow template — a plan for execution."""
    
    description = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name


class Neuron(CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin):
    """A single processing node in a Neural Pathway."""
    
    pathway = models.ForeignKey(
        NeuralPathway, on_delete=models.CASCADE, related_name="neurons"
    )
    neuron_type = models.CharField(max_length=50)
    configuration = models.JSONField(default=dict, blank=True)
    position_x = models.FloatField(default=0.0)
    position_y = models.FloatField(default=0.0)


class Axon(CreatedAndModifiedWithDelta, UUIDIdMixin):
    """A directed edge between two Neurons."""
    
    source = models.ForeignKey(Neuron, on_delete=models.CASCADE, related_name="outgoing_axons")
    target = models.ForeignKey(Neuron, on_delete=models.CASCADE, related_name="incoming_axons")
    branch_type = models.CharField(
        max_length=20,
        choices=[("flow", "Flow"), ("success", "Success"), ("failure", "Failure")],
        default="flow",
    )
```

Notice the patterns:
- Every model uses the same mixins
- `ForeignKey` creates a one-to-many relationship (one pathway has many neurons)
- `JSONField` stores arbitrary JSON data (like the axoplasm)
- Fields have descriptive names and sensible defaults

## Exercises

### Exercise 1: Brain Region Map

Create a Python script that stores all Are-Self brain regions in a list of dictionaries. Each entry should have:
- `name` — the region name
- `module_path` — the path to its `models.py`
- `description` — a one-sentence description
- `key_models` — a list of model names it contains

Print a formatted directory of all regions.

### Exercise 2: Field Type Counter

Write a script that, given a list of model field definitions as strings, counts how many of each field type appear:

```python
fields = [
    "models.CharField(max_length=64)",
    "models.TextField(blank=True)",
    "models.FloatField(default=0.0)",
    "models.BooleanField(default=True)",
    "models.CharField(max_length=50)",
    "models.FloatField(default=0.0)",
    "models.JSONField(default=dict)",
    "models.BooleanField(default=False)",
]

# Expected output:
# CharField: 2
# TextField: 1
# FloatField: 2
# BooleanField: 2
# JSONField: 1
```

Hint: use `.split("(")[0].split(".")[1]` to extract the field type from the string.

### Exercise 3: Model Relationship Diagram

Using the Frontal Lobe models described above, create a dictionary structure that represents the relationships:

```python
relationships = {
    "NeuralPathway": {
        "has_many": ["Neuron"],
        "belongs_to": [],
    },
    "Neuron": {
        "has_many": ["Axon (as source)", "Axon (as target)"],
        "belongs_to": ["NeuralPathway"],
    },
    # ... continue for Axon
}
```

Write a function that prints this as a readable diagram.

### Exercise 4: Mixin Inventory

The common mixins add fields to every model that uses them. Create a dictionary describing what each mixin provides:

```python
mixins = {
    "CreatedAndModifiedWithDelta": {
        "fields": ["created_at", "modified_at", "delta"],
        "types": ["DateTimeField", "DateTimeField", "DurationField"],
        "purpose": "Tracks when a record was created and last modified",
    },
    # Add UUIDIdMixin, NameMixin, VectorMixin
}
```

Then write a function `describe_model(model_name, model_mixins)` that lists all the fields a model would have — both from its explicit fields and from its mixins.

### Exercise 5: Are-Self Explorer Script

Combine everything from this module into a single interactive script:

1. Show a menu of brain regions
2. Let the user select one
3. Display that region's description, key models, and model fields
4. Ask if they want to see another region
5. When they are done, print a summary of how many models and fields total they explored

## Reflection

You have now walked through a real codebase. You did not understand everything — and that is exactly right. The classes, the mixins, the metaclass configurations — these are things you will learn. But you saw them in context. You know where they live. You know what they look like.

This is the Variable of **Perception**. You cannot understand what you cannot see. By reading real code — even code that is beyond your current skill level — you are training your perception. Each time you revisit these files, you will see more. Things that were opaque will become translucent, then transparent.

In the next module, you will build your capstone project — a complete Python script that brings together everything you have learned to process and analyze Are-Self data.
