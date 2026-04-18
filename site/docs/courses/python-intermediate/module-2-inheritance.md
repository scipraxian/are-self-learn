---
title: "Module 2: Inheritance and Mixins"
sidebar_position: 2
---

# Module 2: Inheritance and Mixins

## Learning Objectives

By the end of this module, you will be able to:

- Use inheritance to create specialized classes from general ones
- Override methods in child classes
- Call parent methods with `super()`
- Design and use mixin classes for reusable behavior
- Understand Are-Self's CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin, and VectorMixin pattern
- Apply the Method Resolution Order (MRO) to predict behavior

## Why Inheritance?

Look at Are-Self's model definitions:

```python
class Engram(CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin, VectorMixin):
    ...

class Tag(CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin):
    ...

class NeuralPathway(CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin):
    ...

class Neuron(CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin):
    ...
```

Every model uses the same base mixins. Without inheritance, you would have to copy the UUID field, the name field, and the timestamp fields into every single model. That is dozens of duplicated lines across dozens of models. Change the UUID format once, and you would need to update every model individually.

Inheritance solves this: define the shared behavior once, and every class that needs it inherits it.

## Basic Inheritance

```python
class BaseModel:
    """Base class for all Are-Self models."""
    
    def __init__(self):
        self.created_at = None
        self.modified_at = None
    
    def touch(self):
        """Update the modification timestamp."""
        from datetime import datetime
        now = datetime.now()
        if self.created_at is None:
            self.created_at = now
        self.modified_at = now
    
    def age_display(self):
        """Return a human-readable age string."""
        if self.created_at is None:
            return "Not yet created"
        from datetime import datetime
        delta = datetime.now() - self.created_at
        seconds = int(delta.total_seconds())
        if seconds < 60:
            return f"{seconds} seconds ago"
        elif seconds < 3600:
            return f"{seconds // 60} minutes ago"
        else:
            return f"{seconds // 3600} hours ago"


class Engram(BaseModel):
    """A memory record — inherits from BaseModel."""
    
    def __init__(self, name, relevance_score=0.0):
        super().__init__()  # Call parent's __init__
        self.name = name
        self.relevance_score = relevance_score
        self.tags = []
    
    def __str__(self):
        return f"Engram: {self.name} ({self.relevance_score:.2f})"
```

The `Engram` class inherits from `BaseModel`. This means every Engram automatically has `created_at`, `modified_at`, `touch()`, and `age_display()` — without redefining them.

```python
memory = Engram("User prefers brevity", 0.92)
memory.touch()
print(memory.age_display())  # "0 seconds ago"
print(memory)                # "Engram: User prefers brevity (0.92)"
```

## The `super()` Function

`super()` calls the parent class's version of a method:

```python
class Engram(BaseModel):
    def __init__(self, name, relevance_score=0.0):
        super().__init__()  # Calls BaseModel.__init__()
        self.name = name
        self.relevance_score = relevance_score
```

Without `super().__init__()`, the Engram would not have `created_at` or `modified_at` — the parent's initialization would be skipped.

## Method Overriding

A child class can replace a parent's method:

```python
class BaseModel:
    def validate(self):
        return True


class Engram(BaseModel):
    def validate(self):
        """Engrams require a name and valid relevance score."""
        if not self.name:
            return False
        if not (0.0 <= self.relevance_score <= 1.0):
            return False
        return True
```

When you call `engram.validate()`, Python uses the Engram's version, not BaseModel's. This is polymorphism — different classes responding to the same method name in different ways.

## Mixins: Reusable Behavior Modules

A mixin is a class designed to be inherited alongside other classes. It provides specific, focused functionality. Are-Self uses four core mixins.

### UUIDIdMixin

```python
import uuid

class UUIDIdMixin:
    """Provides a UUID primary key."""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = str(uuid.uuid4())
```

Every model that inherits from `UUIDIdMixin` automatically gets a unique identifier.

### NameMixin

```python
class NameMixin:
    """Provides a name field with validation."""
    
    def __init__(self, name="", **kwargs):
        super().__init__(**kwargs)
        self.name = name
    
    def slug(self):
        """Return a URL-safe version of the name."""
        return self.name.lower().replace(" ", "-")
```

### CreatedAndModifiedWithDelta

```python
from datetime import datetime

class CreatedAndModifiedWithDelta:
    """Tracks creation time, modification time, and the delta between them."""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.created_at = datetime.now()
        self.modified_at = self.created_at
    
    @property
    def delta(self):
        """Time elapsed between creation and last modification."""
        return self.modified_at - self.created_at
    
    def save(self):
        """Simulate a save operation — updates modified_at."""
        self.modified_at = datetime.now()
```

The `@property` decorator lets you access `delta` like an attribute (`engram.delta`) rather than calling it like a method (`engram.delta()`).

### VectorMixin

```python
class VectorMixin:
    """Provides a 768-dimensional embedding vector for semantic search."""
    
    VECTOR_DIMENSIONS = 768
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.embedding = [0.0] * self.VECTOR_DIMENSIONS
    
    def set_embedding(self, vector):
        """Set the embedding vector, validating dimensions."""
        if len(vector) != self.VECTOR_DIMENSIONS:
            raise ValueError(
                f"Expected {self.VECTOR_DIMENSIONS} dimensions, "
                f"got {len(vector)}"
            )
        self.embedding = vector
    
    def cosine_similarity(self, other_vector):
        """Calculate cosine similarity with another vector."""
        dot_product = sum(a * b for a, b in zip(self.embedding, other_vector))
        magnitude_a = sum(a ** 2 for a in self.embedding) ** 0.5
        magnitude_b = sum(b ** 2 for b in other_vector) ** 0.5
        if magnitude_a == 0 or magnitude_b == 0:
            return 0.0
        return dot_product / (magnitude_a * magnitude_b)
```

## Composing With Multiple Inheritance

Now the full picture — combining all mixins, just like Are-Self does:

```python
class Engram(CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin, VectorMixin):
    """A memory record in the hippocampus."""
    
    def __init__(self, name, relevance_score=0.0, **kwargs):
        super().__init__(name=name, **kwargs)
        self.relevance_score = relevance_score
        self.hash = ""
        self.description = ""
        self.is_active = True
        self.tags = []
    
    def __str__(self):
        return f"{self.name} ({self.relevance_score:.2f})"
```

One line of inheritance gives this class: a UUID, a name with slugification, creation and modification timestamps with delta tracking, and a 768-dimensional embedding vector with cosine similarity. That is the power of mixins.

```python
engram = Engram("User prefers concise answers", relevance_score=0.95)
print(engram.id)          # "a3f8c2e1-..."
print(engram.name)        # "User prefers concise answers"
print(engram.created_at)  # 2026-04-18 ...
print(engram.slug())      # "user-prefers-concise-answers"
print(len(engram.embedding))  # 768
```

## Method Resolution Order (MRO)

When a class inherits from multiple parents, Python needs a rule for which method to call. The MRO defines this order:

```python
print(Engram.__mro__)
# (<class 'Engram'>, <class 'CreatedAndModifiedWithDelta'>, 
#  <class 'UUIDIdMixin'>, <class 'NameMixin'>, <class 'VectorMixin'>,
#  <class 'object'>)
```

Python searches left to right through this list. If `Engram` defines a method, that one is used. If not, it checks `CreatedAndModifiedWithDelta`, then `UUIDIdMixin`, and so on.

The `**kwargs` pattern in each mixin's `__init__` is critical — it passes unrecognized keyword arguments to the next class in the MRO chain. This is called cooperative multiple inheritance.

## Are-Self Connection: Why This Pattern Matters

Are-Self has over a dozen model classes across its brain regions. Every single one uses these mixins. The benefits:

1. **Consistency** — every model has a UUID, timestamps, and a name in the same format
2. **Maintainability** — change the UUID generation logic once in `UUIDIdMixin`, and all models update
3. **Composability** — models that need vector search include `VectorMixin`; those that do not, simply leave it out
4. **Readability** — seeing `class Engram(CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin, VectorMixin)` immediately tells you what capabilities this model has

This is not accidental. This is a deliberate architectural choice.

## Exercises

### Exercise 1: Build the Mixin Stack

Implement all four mixins (`CreatedAndModifiedWithDelta`, `UUIDIdMixin`, `NameMixin`, `VectorMixin`) from scratch based on the descriptions above. Then create a `Tag` class that uses three of them (no VectorMixin) and verify all inherited behavior works.

### Exercise 2: NeuralPathway With Mixins

Create a `NeuralPathway` class that inherits from the mixins and adds:
- `description` attribute
- `is_active` attribute (default True)
- A list of neurons
- `add_neuron()` and `get_neuron_count()` methods

Then create a `Neuron` class that also uses the mixins and belongs to a pathway.

### Exercise 3: Specialized Engrams

Create subclasses of Engram for specific memory types:

- `ReasoningEngram` — has an additional `reasoning_chain` attribute (a list of steps)
- `PreferenceEngram` — has a `preference_type` and `preference_value`
- `ErrorEngram` — has an `error_code` and `stack_trace`

Each should override `__str__` to include its specific information.

### Exercise 4: MRO Detective

Given the following class hierarchy, predict the MRO and verify with `__mro__`:

```python
class A:
    def identify(self):
        return "A"

class B(A):
    def identify(self):
        return "B"

class C(A):
    def identify(self):
        return "C"

class D(B, C):
    pass
```

What does `D().identify()` return? Why?

### Exercise 5: Custom Mixin

Design and implement a `SlugMixin` that:
- Generates a URL-safe slug from the object's name
- Handles special characters (replace them with hyphens)
- Lowercases everything
- Has a `slug` property

Then create an `AuditMixin` that:
- Tracks a `created_by` user string
- Tracks a `change_log` list of `(timestamp, description)` tuples
- Has a `log_change(description)` method

Combine both new mixins with the existing ones in a model class.

## Reflection

Inheritance and mixins embody the Variable of **Inclusion**. Each mixin contributes its capability to the whole without erasing or conflicting with the others. UUIDIdMixin does not need to know about VectorMixin. NameMixin does not care about timestamps. Yet they all cooperate through the `super()` chain, each doing its part and passing along to the next.

This is a model for collaboration — individual expertise combined through a shared protocol. No single contributor needs to do everything. Each does its part well, trusts the others to do theirs, and the result is greater than any individual component.
