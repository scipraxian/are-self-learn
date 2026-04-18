---
title: "Module 5: Dictionaries and Data"
sidebar_position: 5
---

# Module 5: Dictionaries and Data

## Learning Objectives

By the end of this module, you will be able to:

- Create and use Python dictionaries
- Access, add, and modify dictionary key-value pairs
- Work with nested dictionaries and lists of dictionaries
- Understand JSON as a data format
- Read and interpret axoplasm context data from Are-Self's Spike execution system

## Dictionaries: Key-Value Pairs

A dictionary maps keys to values. Unlike a list where you access items by position, in a dictionary you access items by name.

```python
engram = {
    "name": "User prefers concise responses",
    "hash": "a3f8c2e1b9d04567...",
    "relevance_score": 0.85,
    "is_active": True,
    "tags": ["user-preference", "context"],
}
```

Access values using their keys:

```python
print(engram["name"])             # "User prefers concise responses"
print(engram["relevance_score"])  # 0.85
print(engram["tags"])             # ["user-preference", "context"]
```

## Creating and Modifying Dictionaries

```python
# Start empty
spike = {}

# Add key-value pairs
spike["id"] = "spike_001"
spike["status"] = "running"
spike["attempts"] = 1

# Modify a value
spike["status"] = "completed"
spike["attempts"] = spike["attempts"] + 1

print(spike)
# {"id": "spike_001", "status": "completed", "attempts": 2}
```

## Safe Access With `.get()`

If you try to access a key that does not exist, Python raises an error:

```python
# print(engram["nonexistent_key"])  # KeyError!
```

Use `.get()` to provide a default value instead:

```python
description = engram.get("description", "No description available.")
print(description)  # "No description available."
```

This pattern is used extensively in Are-Self when reading optional fields from configuration data.

## Checking for Keys

```python
if "tags" in engram:
    print("Tags:", engram["tags"])

if "embedding" not in engram:
    print("No embedding vector present.")
```

## Iterating Over Dictionaries

```python
model_config = {
    "name": "claude-sonnet",
    "cost_per_request": 0.25,
    "max_tokens": 4096,
    "temperature": 0.7,
}

# Iterate over keys
for key in model_config:
    print(key)

# Iterate over values
for value in model_config.values():
    print(value)

# Iterate over both
for key, value in model_config.items():
    print(f"  {key}: {value}")
```

## Nested Dictionaries

Dictionaries can contain other dictionaries, and lists, and any combination:

```python
identity_disc = {
    "name": "Explorer",
    "level": 3,
    "xp": 450,
    "addons": {
        "memory_access": True,
        "reasoning_depth": 2,
        "tool_permissions": ["read", "write"],
    },
    "phases_completed": ["IDENTIFY", "CONTEXT"],
}

# Access nested values
print(identity_disc["addons"]["memory_access"])  # True
print(identity_disc["addons"]["tool_permissions"][0])  # "read"
print(identity_disc["phases_completed"][-1])  # "CONTEXT"
```

## JSON: The Universal Data Format

JSON (JavaScript Object Notation) is a text format for storing and transmitting structured data. It looks almost identical to Python dictionaries:

```json
{
    "name": "Explorer",
    "level": 3,
    "xp": 450,
    "is_active": true
}
```

The differences are minor: JSON uses `true`/`false` (lowercase) instead of Python's `True`/`False`, and `null` instead of `None`.

Python has a built-in `json` module for working with JSON:

```python
import json

# Convert dictionary to JSON string
data = {"name": "Explorer", "level": 3, "is_active": True}
json_string = json.dumps(data, indent=2)
print(json_string)

# Convert JSON string back to dictionary
parsed = json.loads(json_string)
print(parsed["name"])  # "Explorer"
```

## Lists of Dictionaries

One of the most common data patterns is a list of dictionaries — a collection of records:

```python
neurons = [
    {"id": "n1", "type": "input", "label": "Receive Query"},
    {"id": "n2", "type": "process", "label": "Analyze Intent"},
    {"id": "n3", "type": "process", "label": "Retrieve Memory"},
    {"id": "n4", "type": "output", "label": "Generate Response"},
]

# Find a specific neuron
for neuron in neurons:
    if neuron["type"] == "output":
        print("Output neuron:", neuron["label"])
```

## Are-Self Connection: Axoplasm

In Are-Self's neural execution system, a Spike (an individual execution unit) carries context data called **axoplasm**. This is a JSON field — essentially a dictionary — that flows from neuron to neuron through the pathway.

```python
# Simulated axoplasm from a Spike
axoplasm = {
    "query": "What patterns has the user shown?",
    "identity_disc_id": "uuid-1234-5678",
    "context": {
        "session_id": "sess_abc",
        "turn_number": 5,
        "previous_response_id": "resp_xyz",
    },
    "memory_results": [
        {
            "engram_id": "eng_001",
            "content": "User prefers concise answers",
            "relevance": 0.92,
        },
        {
            "engram_id": "eng_002",
            "content": "User asked about Python tutorials",
            "relevance": 0.78,
        },
    ],
    "model_selection": {
        "model": "claude-sonnet",
        "cost": 0.25,
        "budget_remaining": 1.50,
    },
    "neurotransmitters_fired": ["acetylcholine", "dopamine"],
}
```

Reading this data:

```python
# Get the query
print("Query:", axoplasm["query"])

# Get the selected model
model = axoplasm["model_selection"]["model"]
print("Using model:", model)

# List all memory results with high relevance
print("\nRelevant memories:")
for memory in axoplasm["memory_results"]:
    if memory["relevance"] >= 0.80:
        print(f"  - {memory['content']} (score: {memory['relevance']})")

# Check what signals were fired
signals = axoplasm["neurotransmitters_fired"]
if "cortisol" in signals:
    print("Errors occurred during this spike.")
else:
    print("No errors detected.")
```

This is how data flows through Are-Self. Each Neuron in a Pathway reads from the axoplasm, does its work, adds its results back to the axoplasm, and passes it to the next Neuron via an Axon.

## Are-Self Connection: Axon Branching

Axons (the directed edges between Neurons) support branching based on the axoplasm content:

```python
axon = {
    "source": "n2",
    "target_flow": "n3",       # Default next step
    "target_success": "n4",    # If previous step succeeded
    "target_failure": "n5",    # If previous step failed
}

# Decide which path to take
last_status = axoplasm.get("last_step_status", "flow")

if last_status == "success":
    next_neuron = axon["target_success"]
elif last_status == "failure":
    next_neuron = axon["target_failure"]
else:
    next_neuron = axon["target_flow"]

print(f"Routing to neuron: {next_neuron}")
```

This is the DAG (Directed Acyclic Graph) workflow pattern. The axoplasm carries the context, the Axons carry the routing logic.

## Exercises

### Exercise 1: Build an Engram

Write a function `create_engram(name, description, tags, relevance_score=0.0)` that returns a dictionary with all these fields plus an `is_active` field defaulting to `True`. Call it several times and store the results in a list.

### Exercise 2: Axoplasm Reader

Given the full axoplasm dictionary from the Are-Self Connection section, write a function `summarize_axoplasm(axoplasm)` that prints:
- The query
- The model being used and its cost
- The number of memory results
- The most relevant memory (highest relevance score)
- All neurotransmitter signals fired

### Exercise 3: Neuron Lookup

Given a list of neuron dictionaries, write:
1. `find_neuron_by_id(neurons, neuron_id)` — returns the neuron dict or `None`
2. `find_neurons_by_type(neurons, neuron_type)` — returns a list of matching neurons
3. `get_neuron_labels(neurons)` — returns a list of just the labels

### Exercise 4: Configuration Builder

Write a function that builds a model configuration dictionary:

```python
def build_model_config(name, cost, max_tokens=4096, temperature=0.7, 
                       failover=None):
    """Build a model configuration dictionary."""
    # Return a dictionary with all these fields
    # If failover is None, set it to an empty list
    pass

config = build_model_config("claude-opus", 0.75, failover=["claude-sonnet"])
print(json.dumps(config, indent=2))
```

### Exercise 5: Spike Train Reporter

A Spike Train is a sequence of Spikes (execution instances). Write a function that takes a list of spike dictionaries and produces a report:

```python
spike_train = [
    {"id": "s1", "neuron": "Receive Query", "status": "completed", "duration": 0.1},
    {"id": "s2", "neuron": "Analyze Intent", "status": "completed", "duration": 1.2},
    {"id": "s3", "neuron": "Retrieve Memory", "status": "completed", "duration": 0.8},
    {"id": "s4", "neuron": "Generate Response", "status": "failed", "duration": 3.5},
]

# Print:
# Total spikes: 4
# Completed: 3
# Failed: 1
# Total duration: 5.6 seconds
# Failed steps: Generate Response
```

## Reflection

Dictionaries are how real-world data is structured. A person has a name, an age, an address — these are key-value pairs. A configuration file maps setting names to setting values. An API response maps field names to data.

In Are-Self, the axoplasm pattern demonstrates something important: data flows through a system, accumulating context as it goes. Each step reads what it needs, adds what it knows, and passes it on. This is the Variable of **Inclusion** in action — each component contributes to the whole without erasing what came before.

In the next module, you will learn about reading files and handling input — the bridge between your Python programs and the outside world.
