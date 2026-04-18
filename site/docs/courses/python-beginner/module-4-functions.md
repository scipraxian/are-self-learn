---
title: "Module 4: Functions"
sidebar_position: 4
---

# Module 4: Functions

## Learning Objectives

By the end of this module, you will be able to:

- Define functions with `def`
- Call functions with arguments and receive return values
- Understand parameters, arguments, and default values
- Write functions that do one thing well
- Read Are-Self's helper functions in the common module and understand their structure

## Why Functions?

Imagine you need to check if an Engram's relevance score is "high" in five different places in your code. Without functions, you would copy the same `if` statement five times. If you later decided to change the threshold from 0.90 to 0.85, you would need to find and change all five copies.

Functions solve this. A function is a named, reusable block of code.

```python
def is_high_relevance(score):
    return score >= 0.90
```

Now you can use it anywhere:

```python
print(is_high_relevance(0.95))  # True
print(is_high_relevance(0.42))  # False
```

Change the threshold once in the function, and it changes everywhere.

## Defining Functions

A function definition has these parts:

```python
def function_name(parameter1, parameter2):
    """A short description of what this function does."""
    # body of the function
    result = parameter1 + parameter2
    return result
```

- `def` — the keyword that starts a function definition
- `function_name` — what you call it (follow the same rules as variable names)
- Parameters — the inputs the function expects, in parentheses
- Docstring — a description in triple quotes (optional but recommended)
- Body — the indented code that runs when the function is called
- `return` — sends a value back to the caller

## Calling Functions

```python
def calculate_cooldown(failure_count):
    """Calculate circuit breaker cooldown in seconds."""
    base = 60
    cooldown = base * (2 ** (failure_count - 1))
    if cooldown > 300:
        cooldown = 300
    return cooldown

# Call the function
wait_time = calculate_cooldown(1)   # 60
print("Wait:", wait_time, "seconds")

wait_time = calculate_cooldown(3)   # 240
print("Wait:", wait_time, "seconds")

wait_time = calculate_cooldown(5)   # 300 (capped)
print("Wait:", wait_time, "seconds")
```

When you call a function, the arguments you provide are assigned to the parameters. The function runs its body and `return` sends a value back.

## Parameters and Arguments

Parameters are the names in the function definition. Arguments are the values you pass when calling.

```python
def classify_neurotransmitter(signal_name):  # signal_name is the parameter
    """Return the meaning of a neurotransmitter signal."""
    if signal_name == "dopamine":
        return "success"
    elif signal_name == "cortisol":
        return "error"
    elif signal_name == "acetylcholine":
        return "entity update"
    else:
        return "unknown"

meaning = classify_neurotransmitter("cortisol")  # "cortisol" is the argument
print(meaning)  # "error"
```

## Default Parameters

You can give parameters default values. If the caller does not provide that argument, the default is used:

```python
def create_engram(name, relevance_score=0.0, is_active=True):
    """Create a dictionary representing an Engram."""
    return {
        "name": name,
        "relevance_score": relevance_score,
        "is_active": is_active,
    }

# Using defaults
memory1 = create_engram("User preference")
print(memory1)
# {"name": "User preference", "relevance_score": 0.0, "is_active": True}

# Overriding defaults
memory2 = create_engram("Critical reasoning chain", relevance_score=0.95)
print(memory2)
# {"name": "Critical reasoning chain", "relevance_score": 0.95, "is_active": True}
```

## Functions Without Return Values

Not every function returns something. Some just perform an action:

```python
def fire_neurotransmitter(signal_type, message):
    """Print a neurotransmitter signal (simulating WebSocket dispatch)."""
    print(f"[{signal_type.upper()}] {message}")

fire_neurotransmitter("dopamine", "Task completed successfully.")
fire_neurotransmitter("cortisol", "API call failed after 3 retries.")
```

Technically, these functions return `None`, but you do not usually care about that.

## Functions Calling Functions

Functions can call other functions. This is how you build up complex behavior from simple parts:

```python
def is_within_budget(model_cost, budget_remaining):
    """Check if a model's cost fits within the remaining budget."""
    return model_cost <= budget_remaining

def is_model_available(model_name, available_models):
    """Check if a model is in the list of available models."""
    return model_name in available_models

def select_model(model_name, model_cost, budget_remaining, available_models):
    """Attempt to select a model for use."""
    if not is_model_available(model_name, available_models):
        return f"{model_name} is not available."
    if not is_within_budget(model_cost, budget_remaining):
        return f"{model_name} exceeds budget ({model_cost} > {budget_remaining})."
    return f"{model_name} selected successfully."

available = ["claude-sonnet", "claude-haiku", "claude-opus"]
result = select_model("claude-opus", 0.75, 1.50, available)
print(result)  # "claude-opus selected successfully."
```

Each function does one thing. The `select_model` function orchestrates them. This is a core principle: small functions composed together.

## Scope: Where Variables Live

Variables created inside a function only exist inside that function:

```python
def calculate_xp(level):
    base_xp = 100
    total = base_xp * level
    return total

result = calculate_xp(5)
print(result)     # 500
# print(base_xp) # This would cause an ERROR — base_xp does not exist here
```

This is called scope. Variables inside a function have local scope. Variables outside functions have global scope. This keeps functions self-contained and predictable.

## Are-Self Connection: Common Helpers

Are-Self's `common/` module contains utility functions used across the entire codebase. These are perfect examples of well-structured helper functions.

Consider functions that might exist in such a module:

```python
def generate_hash(content):
    """Generate a SHA-256 hash for content deduplication."""
    import hashlib
    return hashlib.sha256(content.encode()).hexdigest()

def calculate_similarity(score_a, score_b):
    """Calculate a simple similarity ratio between two scores."""
    if score_a == 0 and score_b == 0:
        return 1.0
    maximum = max(abs(score_a), abs(score_b))
    difference = abs(score_a - score_b)
    return 1.0 - (difference / maximum)

def truncate_string(text, max_length=100):
    """Truncate a string with ellipsis if it exceeds max_length."""
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."
```

Notice the patterns:
- Each function has a docstring explaining what it does
- Each function does exactly one thing
- Default parameters provide sensible fallbacks
- The function names clearly describe their purpose

## Are-Self Connection: Model Structure as Functions

When you look at an Are-Self model method, you are looking at a function attached to a class (which you will learn about in the Intermediate course). But the principles are the same:

```python
# This is a simplified version of what you might find in a model
def get_display_name(name, level, max_length=50):
    """Format a display name for an IdentityDisc."""
    display = f"{name} (Level {level})"
    return truncate_string(display, max_length)

print(get_display_name("Explorer", 5))
# "Explorer (Level 5)"
```

## Exercises

### Exercise 1: Neurotransmitter Dispatcher

Write a function `dispatch_signal(signal_type, target, message)` that:
- Takes a signal type ("dopamine", "cortisol", or "acetylcholine")
- Takes a target name (e.g., "frontal_lobe")
- Takes a message string
- Returns a formatted string like: `"[DOPAMINE] -> frontal_lobe: Task completed"`
- If the signal type is not recognized, returns `"[UNKNOWN] -> target: message"`

Test it with at least three different calls.

### Exercise 2: Budget Calculator

Write two functions:
1. `estimate_cost(num_requests, cost_per_request)` — returns the total cost
2. `can_afford(total_cost, budget)` — returns `True` or `False`

Then write a third function `check_feasibility(num_requests, cost_per_request, budget)` that uses the first two to return a message like "Feasible: 10 requests at $0.25 each = $2.50 (budget: $5.00)" or "Not feasible: would cost $7.50 but budget is $5.00".

### Exercise 3: Engram Processor

Write a function `filter_engrams(engrams, min_score, required_tag=None)` that takes:
- A list of engram dictionaries (each with "name", "relevance_score", and "tags")
- A minimum relevance score
- An optional required tag

And returns a new list containing only engrams that meet the criteria.

```python
engrams = [
    {"name": "Memory A", "relevance_score": 0.95, "tags": ["reasoning"]},
    {"name": "Memory B", "relevance_score": 0.42, "tags": ["context"]},
    {"name": "Memory C", "relevance_score": 0.88, "tags": ["reasoning", "planning"]},
    {"name": "Memory D", "relevance_score": 0.91, "tags": ["planning"]},
]

result = filter_engrams(engrams, 0.85)
# Should return Memory A, C, and D

result = filter_engrams(engrams, 0.85, required_tag="reasoning")
# Should return Memory A and C only
```

### Exercise 4: Cooldown Calculator (Refactored)

Take the circuit breaker cooldown logic from Module 2 and refactor it into functions:

1. `calculate_cooldown(failure_count, base=60, cap=300)` — returns the cooldown in seconds
2. `format_cooldown(seconds)` — returns a human-readable string like "2 minutes" or "4 minutes 30 seconds"
3. `report_circuit_status(failure_count)` — uses both functions to print a status report

### Exercise 5: Helper Function Library

Create a file called `are_self_helpers.py` with at least four utility functions that could be useful when working with Are-Self data. Ideas:

- `is_valid_brain_region(name)` — checks if a name is one of the known regions
- `format_module_path(region_name)` — converts a region name to a module path
- `score_to_label(score)` — converts a float score to "high"/"medium"/"low"
- `count_by_type(items, type_key)` — counts items grouped by a key value

Write a small test section at the bottom that calls each function and prints the results.

## Reflection

Functions are about **Responsibility**. Each function takes responsibility for one task. It promises: "Give me these inputs, and I will give you this output." It does not reach into other parts of the program and change things unexpectedly. It does not try to do everything. It does one thing, does it well, and reports the result.

This is a principle that extends far beyond programming. When responsibility is clear and bounded, systems work. When it is vague and overlapping, they break.

You now have the four foundational tools of programming: variables, conditionals, loops, and functions. Everything else you learn will build on these. In the next module, you will learn about dictionaries — Python's most versatile data structure, and the format that Are-Self's spike execution system uses to pass context between neurons.
