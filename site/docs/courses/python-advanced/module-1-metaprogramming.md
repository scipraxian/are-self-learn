---
title: "Module 1: Metaprogramming"
sidebar_position: 1
---

# Module 1: Metaprogramming

## Learning Objectives

By the end of this module, you will be able to:

- Write and compose decorators with arguments
- Implement descriptors for attribute access control
- Understand how Django model fields work as descriptors
- Use metaclasses and `__init_subclass__` for class registration
- Read and understand Are-Self's addon registry pattern
- Recognize when metaprogramming is appropriate and when it is overengineering

## What Is Metaprogramming?

Metaprogramming is code that writes or modifies other code. In Python, this takes several forms:

- **Decorators** modify functions or classes without changing their source
- **Descriptors** control what happens when attributes are accessed
- **Metaclasses** control how classes themselves are created

These are power tools. They can make code dramatically cleaner — or dramatically more confusing. Use them with intention.

## Decorators

You have used decorators throughout the Intermediate course — `@receiver`, `@property`, `@action`. Now you will build your own.

### Function Decorators

A decorator is a function that takes a function and returns a modified version:

```python
import time
import functools


def timing(func):
    """Measure execution time of a function."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper


@timing
def find_relevant_engrams(min_score=0.5):
    """Simulate finding relevant memories."""
    time.sleep(0.1)  # Simulate work
    return [{"name": "Memory", "score": 0.9}]

find_relevant_engrams()
# Output: find_relevant_engrams took 0.1003s
```

`@functools.wraps(func)` preserves the original function's name and docstring. Always use it.

### Decorators With Arguments

To create a decorator that accepts arguments, you need a factory — a function that returns a decorator:

```python
def retry(max_attempts=3, delay=1.0, backoff=2.0, exceptions=(Exception,)):
    """Retry a function on failure with exponential backoff."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            current_delay = delay
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts:
                        raise
                    print(f"Attempt {attempt} failed: {e}. "
                          f"Retrying in {current_delay}s...")
                    time.sleep(current_delay)
                    current_delay *= backoff
        return wrapper
    return decorator


@retry(max_attempts=3, delay=0.5, exceptions=(ConnectionError,))
def call_model_api(prompt):
    """Call an AI model API with retry logic."""
    import random
    if random.random() < 0.5:
        raise ConnectionError("API timeout")
    return f"Response to: {prompt}"
```

### Class Decorators

Decorators can modify classes too:

```python
def register_brain_region(cls):
    """Register a class as an Are-Self brain region."""
    if not hasattr(cls, '_registry'):
        cls._registry = {}
    cls._registry[cls.__name__] = cls
    return cls


@register_brain_region
class Hippocampus:
    region_name = "hippocampus"

@register_brain_region
class FrontalLobe:
    region_name = "frontal_lobe"

# Access the registry
print(Hippocampus._registry)
# {'Hippocampus': <class 'Hippocampus'>, 'FrontalLobe': <class 'FrontalLobe'>}
```

## Descriptors

Descriptors are objects that define `__get__`, `__set__`, or `__delete__` methods. They control attribute access on the classes that use them.

This is how Django model fields work. When you write:

```python
class Engram(models.Model):
    relevance_score = models.FloatField(default=0.0)
```

`models.FloatField(default=0.0)` creates a descriptor. When you access `engram.relevance_score`, Python calls the descriptor's `__get__` method. When you assign `engram.relevance_score = 0.85`, it calls `__set__`.

### Building a Descriptor

```python
class ValidatedFloat:
    """A descriptor that validates float values within a range."""
    
    def __init__(self, min_value=None, max_value=None, default=0.0):
        self.min_value = min_value
        self.max_value = max_value
        self.default = default
    
    def __set_name__(self, owner, name):
        """Called when the descriptor is assigned to a class attribute."""
        self.name = name
        self.storage_name = f"_validated_{name}"
    
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self  # Accessed from the class, not an instance
        return getattr(obj, self.storage_name, self.default)
    
    def __set__(self, obj, value):
        if not isinstance(value, (int, float)):
            raise TypeError(f"{self.name} must be a number, got {type(value).__name__}")
        if self.min_value is not None and value < self.min_value:
            raise ValueError(f"{self.name} must be >= {self.min_value}, got {value}")
        if self.max_value is not None and value > self.max_value:
            raise ValueError(f"{self.name} must be <= {self.max_value}, got {value}")
        setattr(obj, self.storage_name, float(value))


class Engram:
    relevance_score = ValidatedFloat(min_value=0.0, max_value=1.0, default=0.0)
    
    def __init__(self, name, relevance_score=0.0):
        self.name = name
        self.relevance_score = relevance_score  # Goes through __set__


engram = Engram("Test", 0.85)
print(engram.relevance_score)  # 0.85

engram.relevance_score = 1.5   # Raises ValueError
engram.relevance_score = "bad" # Raises TypeError
```

`__set_name__` is called automatically when the descriptor is used as a class attribute. It receives the class and the attribute name, which is invaluable for error messages.

## Metaclasses

Metaclasses control how classes are created. A class is an instance of its metaclass, just as an object is an instance of its class.

```python
class ModelRegistry(type):
    """A metaclass that automatically registers model classes."""
    
    _registry = {}
    
    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        if name != "BaseModel":  # Do not register the base class itself
            mcs._registry[name] = cls
        return cls
    
    @classmethod
    def get_model(mcs, name):
        return mcs._registry.get(name)
    
    @classmethod
    def all_models(mcs):
        return dict(mcs._registry)


class BaseModel(metaclass=ModelRegistry):
    """Base for all registered models."""
    pass


class Engram(BaseModel):
    pass


class NeuralPathway(BaseModel):
    pass


class SpikeTrain(BaseModel):
    pass


print(ModelRegistry.all_models())
# {'Engram': <class 'Engram'>, 'NeuralPathway': ..., 'SpikeTrain': ...}
```

Django's `models.Model` uses a metaclass (`ModelBase`) that inspects all the field descriptors on the class and creates the database table mapping. When you define `class Engram(models.Model)`, the metaclass reads every `models.CharField`, `models.FloatField`, etc. and builds the SQL schema.

### `__init_subclass__`: The Modern Alternative

Python 3.6 introduced `__init_subclass__` as a simpler alternative to metaclasses for many use cases:

```python
class AddonRegistry:
    """Base class that auto-registers addon subclasses."""
    
    _addons = {}
    
    def __init_subclass__(cls, addon_name=None, **kwargs):
        super().__init_subclass__(**kwargs)
        name = addon_name or cls.__name__.lower()
        AddonRegistry._addons[name] = cls
    
    @classmethod
    def get_addon(cls, name):
        return cls._addons.get(name)
    
    @classmethod
    def list_addons(cls):
        return list(cls._addons.keys())


class MemoryAccess(AddonRegistry, addon_name="memory_access"):
    """Addon that grants memory read/write capabilities."""
    
    def execute(self, identity_disc):
        return identity_disc.access_memories()


class ReasoningDepth(AddonRegistry, addon_name="reasoning_depth"):
    """Addon that controls reasoning chain depth."""
    
    def execute(self, identity_disc, depth=2):
        return identity_disc.reason(depth=depth)


print(AddonRegistry.list_addons())
# ['memory_access', 'reasoning_depth']

addon_class = AddonRegistry.get_addon("memory_access")
addon = addon_class()
```

This is how Are-Self's addon system works conceptually: addon classes register themselves by inheriting from a base class. The system discovers available addons at runtime without hardcoding them.

## Are-Self Connection: How Django Model Fields Work

When you write `relevance_score = models.FloatField(default=0.0)`, here is what happens:

1. `models.FloatField(default=0.0)` creates a descriptor instance
2. The `ModelBase` metaclass finds all descriptor instances on the class
3. It calls `contribute_to_class()` on each one, which registers the field
4. It builds the database table schema from the collected fields
5. When you access `engram.relevance_score`, the descriptor returns the stored value
6. When you assign `engram.relevance_score = 0.85`, the descriptor validates and stores it

This is three layers of metaprogramming working together: descriptors for field behavior, a metaclass for class construction, and decorators (like `@property`) for computed attributes.

## Are-Self Connection: Phased Identity Addons

Are-Self's IdentityDisc goes through phases (IDENTIFY, CONTEXT, HISTORY, TERMINAL), and addons are granted based on the phase. The addon registry pattern allows new addons to be added without modifying the core IdentityDisc code:

```python
class PhaseGatedAddon(AddonRegistry):
    """An addon that only activates during specific phases."""
    
    required_phase = None  # Subclasses set this
    
    def __init_subclass__(cls, phase=None, **kwargs):
        super().__init_subclass__(**kwargs)
        if phase:
            cls.required_phase = phase
    
    def is_available(self, identity_disc):
        if self.required_phase is None:
            return True
        phases = ["IDENTIFY", "CONTEXT", "HISTORY", "TERMINAL"]
        current_idx = phases.index(identity_disc.current_phase)
        required_idx = phases.index(self.required_phase)
        return current_idx >= required_idx


class ToolAccess(PhaseGatedAddon, addon_name="tools", phase="CONTEXT"):
    """Grants tool access starting from the CONTEXT phase."""
    pass


class HistoryReview(PhaseGatedAddon, addon_name="history", phase="HISTORY"):
    """Grants history review starting from the HISTORY phase."""
    pass
```

## Exercises

### Exercise 1: Logging Decorator

Write a `@log_calls` decorator that:
- Logs the function name, arguments, and return value
- Optionally logs to a file (parameter: `log_file=None`)
- Includes a timestamp
- Can be applied to both regular functions and class methods

### Exercise 2: Validated Fields

Build a set of descriptor classes:
- `ValidatedString(max_length, min_length=0, blank=False)`
- `ValidatedFloat(min_value, max_value)`
- `ValidatedChoice(choices)` — accepts only values from a predefined list

Use them to build a model class with fully validated attributes.

### Exercise 3: Plugin System

Using `__init_subclass__`, build a plugin system where:
- Plugins register themselves by inheriting from `BasePlugin`
- Each plugin declares a `name`, `version`, and `dependencies` list
- The registry can resolve dependencies and determine load order
- Plugins can be enabled/disabled at runtime

### Exercise 4: Auto-Serializer

Write a metaclass or `__init_subclass__` hook that automatically generates a `to_dict()` method for any model class, based on its declared fields:

```python
class AutoSerializable:
    _fields = []
    
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        # Inspect cls for ValidatedFloat, ValidatedString, etc.
        # Build _fields list automatically
        # Generate to_dict() method

class Engram(AutoSerializable):
    name = ValidatedString(max_length=255)
    relevance_score = ValidatedFloat(0.0, 1.0)
    # to_dict() should be auto-generated
```

### Exercise 5: Decorator Composition

Build a `@are_self_endpoint` decorator that combines multiple behaviors:
- Authentication check
- Rate limiting (max N calls per minute)
- Timing (log execution duration)
- Error handling (catch and format exceptions as JSON)

Compose it from individual decorators that can also be used independently.

## Reflection

Metaprogramming is the Variable of **Perception** taken to its extreme. You are not just reading code — you are reading the code that generates code. You are seeing the machinery behind the machinery.

This brings a responsibility. Metaprogramming can make systems elegant or incomprehensible. Django's metaclass-based model system is brilliant because it follows a clear pattern: define fields as class attributes, and the metaclass handles everything else. Are-Self's addon registry is clean because it uses a simple, well-understood protocol.

The test for good metaprogramming: can someone unfamiliar with it read the code that uses it and understand what it does, even if they do not understand how it works? `class Engram(models.Model)` is readable to anyone. The metaclass behind it is not — but it does not need to be, because the abstraction is good.

Build abstractions that are easy to use. Let the complexity live where users do not need to see it.
