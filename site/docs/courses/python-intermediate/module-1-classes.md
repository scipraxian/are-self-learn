---
title: "Module 1: Classes and Objects"
sidebar_position: 1
---

# Module 1: Classes and Objects

## Learning Objectives

By the end of this module, you will be able to:

- Define Python classes with `__init__`, attributes, and methods
- Create instances (objects) from classes
- Understand the difference between a class and an instance
- Use `self` correctly to refer to instance data
- Read and understand Are-Self's model class definitions for Engram, SpikeTrain, and IdentityDisc

## From Dictionaries to Classes

In the Beginner course, you represented Are-Self data as dictionaries:

```python
engram = {
    "name": "User prefers concise answers",
    "relevance_score": 0.85,
    "is_active": True,
    "tags": ["preference", "context"],
}
```

This works, but dictionaries have limitations. Nothing prevents you from misspelling a key or assigning an invalid value. There is no built-in behavior — dictionaries are just data, not data plus logic.

A class solves both problems. It defines what data an object has and what it can do:

```python
class Engram:
    """A memory record in the hippocampus."""
    
    def __init__(self, name, relevance_score=0.0, is_active=True):
        self.name = name
        self.relevance_score = relevance_score
        self.is_active = is_active
        self.tags = []
    
    def add_tag(self, tag):
        """Add a tag to this engram."""
        if tag not in self.tags:
            self.tags.append(tag)
    
    def is_relevant(self, threshold=0.5):
        """Check if this engram meets a relevance threshold."""
        return self.relevance_score >= threshold
    
    def __str__(self):
        return f"{self.name} (relevance: {self.relevance_score:.2f})"
```

## Anatomy of a Class

### The `class` Statement

```python
class Engram:
```

This declares a new type. Just as `int` and `str` are types, `Engram` is now a type you have defined. By convention, class names use CamelCase (capitalized words, no underscores).

### The `__init__` Method

```python
def __init__(self, name, relevance_score=0.0, is_active=True):
    self.name = name
    self.relevance_score = relevance_score
    self.is_active = is_active
    self.tags = []
```

`__init__` is the initializer — it runs automatically when you create a new instance. The `self` parameter refers to the instance being created. Every method in a class receives `self` as its first parameter.

`self.name = name` means: "On this specific instance, set the attribute `name` to the value of the parameter `name`."

### Creating Instances

```python
memory1 = Engram("User prefers concise answers", relevance_score=0.95)
memory2 = Engram("Error during API call", relevance_score=0.45)

print(memory1.name)             # "User prefers concise answers"
print(memory2.relevance_score)  # 0.45
```

`memory1` and `memory2` are instances — specific objects created from the `Engram` class template. They each have their own data.

### Methods

Methods are functions that belong to a class. They always take `self` as their first parameter:

```python
memory1.add_tag("preference")
memory1.add_tag("context")
memory1.add_tag("preference")  # Will not add duplicate

print(memory1.tags)  # ["preference", "context"]
print(memory1.is_relevant(0.9))  # True
print(memory2.is_relevant(0.9))  # False
```

### The `__str__` Method

```python
def __str__(self):
    return f"{self.name} (relevance: {self.relevance_score:.2f})"
```

`__str__` is a special method Python calls when it needs a string representation of your object — for example, in `print()`:

```python
print(memory1)  # "User prefers concise answers (relevance: 0.95)"
```

## Classes vs Instances

The class is the blueprint. The instance is the building.

```python
# Engram is the class (the blueprint)
# memory1, memory2 are instances (the buildings)

print(type(memory1))  # <class '__main__.Engram'>
print(isinstance(memory1, Engram))  # True
```

You can create any number of instances from a single class. Each has its own data but shares the same methods.

## Building a SpikeTrain Class

Let us model another Are-Self concept:

```python
class Spike:
    """An individual execution unit in a spike train."""
    
    def __init__(self, neuron_name, status="pending"):
        self.neuron_name = neuron_name
        self.status = status
        self.duration = 0.0
        self.axoplasm = {}
    
    def execute(self, duration, result_data=None):
        """Mark this spike as executed."""
        self.status = "completed"
        self.duration = duration
        if result_data:
            self.axoplasm.update(result_data)
    
    def fail(self, duration, error_message):
        """Mark this spike as failed."""
        self.status = "failed"
        self.duration = duration
        self.axoplasm["error"] = error_message
    
    def __str__(self):
        return f"Spike({self.neuron_name}: {self.status}, {self.duration:.2f}s)"


class SpikeTrain:
    """A sequence of spikes executing a neural pathway."""
    
    def __init__(self, pathway_name):
        self.pathway_name = pathway_name
        self.spikes = []
        self.status = "pending"
    
    def add_spike(self, spike):
        """Add a spike to this train."""
        self.spikes.append(spike)
    
    def total_duration(self):
        """Calculate total execution duration."""
        return sum(spike.duration for spike in self.spikes)
    
    def success_rate(self):
        """Calculate the percentage of completed spikes."""
        if not self.spikes:
            return 0.0
        completed = sum(1 for s in self.spikes if s.status == "completed")
        return completed / len(self.spikes)
    
    def finalize(self):
        """Set the train's final status based on its spikes."""
        if any(s.status == "failed" for s in self.spikes):
            self.status = "failed"
        elif all(s.status == "completed" for s in self.spikes):
            self.status = "completed"
        else:
            self.status = "partial"
    
    def __str__(self):
        return (f"SpikeTrain({self.pathway_name}: {self.status}, "
                f"{len(self.spikes)} spikes, {self.total_duration():.2f}s)")
```

Using it:

```python
train = SpikeTrain("query_processing")

s1 = Spike("Receive Query")
s1.execute(0.12)
train.add_spike(s1)

s2 = Spike("Analyze Intent")
s2.execute(1.35, {"intent": "question", "confidence": 0.92})
train.add_spike(s2)

s3 = Spike("Generate Response")
s3.fail(3.20, "Model timeout after 3 seconds")
train.add_spike(s3)

train.finalize()
print(train)
# SpikeTrain(query_processing: failed, 3 spikes, 4.67s)
print(f"Success rate: {train.success_rate():.0%}")
# Success rate: 67%
```

## Are-Self Connection: The IdentityDisc

In Are-Self, an IdentityDisc represents the AI's identity in a given context. Here is a simplified version:

```python
class IdentityDisc:
    """The AI's identity record — who it is in this context."""
    
    PHASES = ["IDENTIFY", "CONTEXT", "HISTORY", "TERMINAL"]
    
    def __init__(self, name, level=1, xp=0):
        self.name = name
        self.level = level
        self.xp = xp
        self.current_phase = "IDENTIFY"
        self.addons = {}
    
    def advance_phase(self):
        """Move to the next phase in the identity lifecycle."""
        current_index = self.PHASES.index(self.current_phase)
        if current_index < len(self.PHASES) - 1:
            self.current_phase = self.PHASES[current_index + 1]
            return True
        return False
    
    def grant_addon(self, addon_name, config=None):
        """Grant an addon capability to this identity."""
        self.addons[addon_name] = config or {}
    
    def has_addon(self, addon_name):
        """Check if this identity has a specific addon."""
        return addon_name in self.addons
    
    def award_xp(self, amount):
        """Award experience points. Level up every 100 XP."""
        self.xp += amount
        while self.xp >= self.level * 100:
            self.xp -= self.level * 100
            self.level += 1
    
    def __str__(self):
        return f"IdentityDisc({self.name}, L{self.level}, phase={self.current_phase})"
```

Notice the class variable `PHASES` — it is shared across all instances, unlike instance variables which belong to individual objects. This is a common pattern for constants.

## Are-Self Connection: Reading Real Model Code

When you open `are_self/hippocampus/models.py`, you see Django model classes. These are regular Python classes with some Django-specific features:

```python
class Engram(CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin, VectorMixin):
    hash = models.CharField(max_length=64, unique=True, db_index=True)
    description = models.TextField(blank=True, default="")
    relevance_score = models.FloatField(default=0.0)
    is_active = models.BooleanField(default=True)
    tags = models.ManyToManyField("Tag", blank=True, related_name="engrams")
```

The fields (`models.CharField`, etc.) are descriptors — a Python feature where assigning a class-level attribute controls how instance-level attribute access works. Django uses this to map Python classes to database tables. Each field becomes a column in the database.

You do not need to understand descriptors yet. What matters is: this is a Python class. The same `class` keyword. The same structure. The production code follows the same rules you are learning.

## Exercises

### Exercise 1: Neuron Class

Create a `Neuron` class with:
- Attributes: `name`, `neuron_type` (e.g., "input", "process", "output"), `configuration` (a dictionary)
- A method `describe()` that returns a formatted description
- A `__str__` method

Create at least three Neuron instances and print them.

### Exercise 2: NeuralPathway Class

Create a `NeuralPathway` class that:
- Has a `name`, `description`, and an empty list of neurons
- Has an `add_neuron(neuron)` method
- Has a `get_neurons_by_type(neuron_type)` method that returns filtered neurons
- Has a `neuron_count()` method
- Has a `__str__` that shows the pathway name and neuron count

### Exercise 3: CircuitBreaker Class

Model Are-Self's circuit breaker as a class:

```python
class CircuitBreaker:
    def __init__(self, name, failure_threshold=3, base_cooldown=60, max_cooldown=300):
        # Initialize state: closed, failure count = 0, etc.
        pass
    
    def record_success(self):
        # Reset failure count, close the circuit
        pass
    
    def record_failure(self):
        # Increment failures, possibly open the circuit
        pass
    
    def can_execute(self):
        # Return True if the circuit allows execution
        pass
    
    def get_cooldown(self):
        # Calculate current cooldown based on failure count
        pass
```

Test it by simulating a sequence of successes and failures.

### Exercise 4: IdentityDisc Extensions

Extend the IdentityDisc class from the Are-Self Connection section:
1. Add a `to_dict()` method that returns the disc as a dictionary
2. Add a `from_dict(data)` class method (use `@classmethod`) that creates a disc from a dictionary
3. Add a `summary()` method that returns a multi-line string with all the disc's information

### Exercise 5: Memory System

Build a `MemorySystem` class that manages a collection of Engram objects:
- `store(engram)` — adds an engram (but check for duplicates by name)
- `search(query)` — returns all engrams whose name contains the query string
- `get_relevant(threshold=0.5)` — returns engrams above the threshold
- `remove_stale(threshold=0.2)` — removes engrams below the threshold
- `stats()` — returns a dictionary with count, average relevance, and tag counts

## Reflection

Classes are about modeling the world. When you define an `Engram` class, you are saying: "A memory has these properties and can do these things." When you define a `CircuitBreaker`, you are saying: "A protection mechanism has this state and follows these rules."

This is the Variable of **Perception** at a deeper level. You are not just seeing code — you are seeing structure. You are learning to look at a system and ask: what are the things in this system? What properties do they have? What can they do? How do they relate to each other?

That way of seeing does not stop at code. It is how you understand any complex system — biological, social, or computational. The brain has regions. Each region has a role. The regions communicate through signals. Are-Self mirrors this. Your code can mirror it too.
