---
title: "Module 3: Error Handling"
sidebar_position: 3
---

# Module 3: Error Handling

## Learning Objectives

By the end of this module, you will be able to:

- Use `try`, `except`, `else`, and `finally` blocks
- Catch specific exception types
- Raise exceptions intentionally
- Create custom exception classes
- Implement retry logic with backoff
- Understand Are-Self's circuit breaker error handling pattern in depth

## Errors Are Inevitable

Every non-trivial program encounters errors. Networks fail. Files go missing. Users provide unexpected input. APIs return garbage. The question is not whether errors will happen, but how your code responds when they do.

Python uses exceptions to handle errors. When something goes wrong, Python raises an exception. If you do not handle it, the program crashes.

```python
# This crashes the program
result = 10 / 0  # ZeroDivisionError

# This crashes too
data = {"name": "test"}
print(data["nonexistent"])  # KeyError
```

## Try/Except

The `try/except` block catches exceptions before they crash the program:

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero.")
    result = 0

print(f"Result: {result}")  # Result: 0
```

Python runs the `try` block. If an exception occurs, it jumps to the matching `except` block instead of crashing.

### Catching Specific Exceptions

Always catch specific exception types. Different errors need different responses:

```python
def get_model_config(config, model_name):
    """Safely retrieve a model configuration."""
    try:
        model = config[model_name]
        cost = float(model["cost_per_request"])
        return {"name": model_name, "cost": cost}
    except KeyError:
        print(f"Model '{model_name}' not found in configuration.")
        return None
    except ValueError:
        print(f"Invalid cost value for model '{model_name}'.")
        return None
    except TypeError:
        print("Configuration data is not in the expected format.")
        return None
```

### The `else` and `finally` Clauses

```python
try:
    file = open("engrams.json", "r")
    data = json.load(file)
except FileNotFoundError:
    print("Engram file not found.")
    data = []
except json.JSONDecodeError:
    print("Engram file contains invalid JSON.")
    data = []
else:
    # Runs only if NO exception occurred
    print(f"Loaded {len(data)} engrams successfully.")
finally:
    # ALWAYS runs, whether or not an exception occurred
    print("File operation complete.")
```

`else` is for code that should only run on success. `finally` is for cleanup that must happen regardless — closing files, releasing resources, logging completion.

## Raising Exceptions

You can raise exceptions intentionally when something is wrong:

```python
def set_relevance_score(engram, score):
    """Set a relevance score, validating the range."""
    if not isinstance(score, (int, float)):
        raise TypeError(f"Score must be a number, got {type(score).__name__}")
    if not 0.0 <= score <= 1.0:
        raise ValueError(f"Score must be between 0.0 and 1.0, got {score}")
    engram["relevance_score"] = score
```

The caller can then handle these exceptions:

```python
try:
    set_relevance_score(my_engram, 1.5)
except ValueError as e:
    print(f"Invalid score: {e}")
```

The `as e` captures the exception object so you can read its message.

## Custom Exceptions

For complex systems, define your own exception types:

```python
class AreException(Exception):
    """Base exception for all Are-Self errors."""
    pass


class CircuitBreakerOpen(AreException):
    """Raised when a request is blocked by an open circuit breaker."""
    
    def __init__(self, model_name, cooldown_remaining):
        self.model_name = model_name
        self.cooldown_remaining = cooldown_remaining
        super().__init__(
            f"Circuit breaker open for '{model_name}'. "
            f"Retry in {cooldown_remaining} seconds."
        )


class BudgetExceeded(AreException):
    """Raised when a model request would exceed the budget."""
    
    def __init__(self, model_name, cost, budget_remaining):
        self.model_name = model_name
        self.cost = cost
        self.budget_remaining = budget_remaining
        super().__init__(
            f"Model '{model_name}' costs ${cost:.2f} but only "
            f"${budget_remaining:.2f} remains."
        )


class DuplicateEngram(AreException):
    """Raised when attempting to store a duplicate memory."""
    
    def __init__(self, existing_name, similarity):
        self.existing_name = existing_name
        self.similarity = similarity
        super().__init__(
            f"Duplicate detected: '{existing_name}' "
            f"(similarity: {similarity:.0%})"
        )
```

Custom exceptions make error handling precise and informative:

```python
try:
    select_model("claude-opus", budget=0.50)
except CircuitBreakerOpen as e:
    print(f"Waiting {e.cooldown_remaining}s for {e.model_name}")
    use_fallback_model()
except BudgetExceeded as e:
    print(f"Over budget by ${e.cost - e.budget_remaining:.2f}")
    select_cheaper_model()
```

## Are-Self Connection: Circuit Breaker With Error Handling

Here is the circuit breaker pattern implemented with proper error handling:

```python
from datetime import datetime, timedelta


class CircuitBreaker:
    """Protects against cascading failures with escalating cooldowns."""
    
    STATES = ("closed", "open", "half_open")
    
    def __init__(self, name, failure_threshold=3, base_cooldown=60, max_cooldown=300):
        self.name = name
        self.failure_threshold = failure_threshold
        self.base_cooldown = base_cooldown
        self.max_cooldown = max_cooldown
        self.failure_count = 0
        self.state = "closed"
        self.last_failure_time = None
    
    def _calculate_cooldown(self):
        """Escalating cooldown: 60s, 120s, 240s, capped at 300s."""
        cooldown = self.base_cooldown * (2 ** (self.failure_count - 1))
        return min(cooldown, self.max_cooldown)
    
    def _cooldown_elapsed(self):
        """Check if enough time has passed since the last failure."""
        if self.last_failure_time is None:
            return True
        elapsed = (datetime.now() - self.last_failure_time).total_seconds()
        return elapsed >= self._calculate_cooldown()
    
    def execute(self, func, *args, **kwargs):
        """Execute a function through the circuit breaker."""
        if self.state == "open":
            if self._cooldown_elapsed():
                self.state = "half_open"
            else:
                cooldown = self._calculate_cooldown()
                raise CircuitBreakerOpen(self.name, cooldown)
        
        try:
            result = func(*args, **kwargs)
        except Exception as e:
            self._record_failure()
            raise  # Re-raise the original exception
        else:
            self._record_success()
            return result
    
    def _record_failure(self):
        """Record a failure and potentially open the circuit."""
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        if self.failure_count >= self.failure_threshold:
            self.state = "open"
    
    def _record_success(self):
        """Record a success and reset the circuit."""
        self.failure_count = 0
        self.state = "closed"
        self.last_failure_time = None
```

Usage:

```python
breaker = CircuitBreaker("claude-opus", failure_threshold=3)

def call_model(prompt):
    """Simulate a model API call that might fail."""
    import random
    if random.random() < 0.4:
        raise ConnectionError("Model API timeout")
    return f"Response to: {prompt}"

# Try to call through the circuit breaker
for i in range(10):
    try:
        result = breaker.execute(call_model, f"Query {i}")
        print(f"  Success: {result}")
    except CircuitBreakerOpen as e:
        print(f"  BLOCKED: {e}")
    except ConnectionError as e:
        print(f"  FAILED: {e} (failures: {breaker.failure_count})")
```

## Are-Self Connection: Failover Chains

Are-Self's Hypothalamus does not just give up when a model fails. It maintains failover chains — ordered lists of alternative models:

```python
class ModelSelector:
    """Selects AI models with failover support."""
    
    def __init__(self):
        self.circuit_breakers = {}
        self.failover_chains = {}
    
    def register_model(self, name, failovers=None):
        """Register a model with its failover chain."""
        self.circuit_breakers[name] = CircuitBreaker(name)
        self.failover_chains[name] = failovers or []
    
    def select(self, model_name, func, *args, **kwargs):
        """Try the requested model, then fall through failovers."""
        chain = [model_name] + self.failover_chains.get(model_name, [])
        
        last_error = None
        for candidate in chain:
            breaker = self.circuit_breakers.get(candidate)
            if breaker is None:
                continue
            try:
                return breaker.execute(func, candidate, *args, **kwargs)
            except CircuitBreakerOpen:
                last_error = f"Circuit open for {candidate}"
                continue
            except Exception as e:
                last_error = str(e)
                continue
        
        raise AreException(
            f"All models exhausted for '{model_name}'. "
            f"Last error: {last_error}"
        )
```

This is error handling at its most sophisticated: each failure is caught, logged, and the system gracefully degrades to the next option. Only when all options are exhausted does it raise a final error.

## Exercises

### Exercise 1: Safe Engram Storage

Write a function `store_engram(memory_system, name, description, relevance_score)` that:
- Validates all inputs (name must be non-empty, score must be 0.0-1.0)
- Raises appropriate custom exceptions for each validation failure
- Catches duplicate detection (similarity >= 0.90)
- Returns the stored engram on success

Write a test script that calls it with valid and invalid data, catching each exception type.

### Exercise 2: Resilient File Loader

Write a function `load_config(filepath, fallback_path=None, default=None)` that:
- Tries to load JSON from `filepath`
- If FileNotFoundError, tries `fallback_path`
- If both fail, returns `default`
- If the JSON is invalid, logs the error and returns `default`
- Uses `finally` to print which path was attempted

### Exercise 3: Retry Decorator

Write a function `retry(func, max_attempts=3, delay=1.0, backoff=2.0)` that:
- Calls `func()`
- If it raises an exception, waits `delay` seconds and tries again
- Each retry doubles the delay (exponential backoff)
- After `max_attempts`, raises the last exception
- Prints each attempt and result

### Exercise 4: Custom Exception Hierarchy

Design an exception hierarchy for Are-Self:

```
AreException
├── ModelError
│   ├── CircuitBreakerOpen
│   ├── BudgetExceeded
│   └── ModelUnavailable
├── MemoryError
│   ├── DuplicateEngram
│   ├── InvalidRelevanceScore
│   └── EmbeddingDimensionError
└── PathwayError
    ├── CyclicPathwayError
    └── OrphanNeuronError
```

Implement all classes with meaningful messages and attributes. Write code that demonstrates catching at different levels (e.g., catching `ModelError` catches all three subtypes).

### Exercise 5: Circuit Breaker Test Suite

Write a comprehensive test of the CircuitBreaker class:
1. Test that it starts closed
2. Test that failures below threshold keep it closed
3. Test that reaching the threshold opens it
4. Test that `CircuitBreakerOpen` is raised when open
5. Test that a success resets the counter
6. Test the escalating cooldown values

## Reflection

Error handling is about the Variable of **Fear** — not paralyzing fear, but productive fear. The fear that says "what if this fails?" and builds a safety net in response.

The circuit breaker is a beautiful example. It does not pretend failures cannot happen. It does not crash when they do. Instead, it acknowledges the reality of failure and builds a structured response: back off, wait, try again. If it keeps failing, wait longer. Protect the system from cascading damage.

This is wisdom. Not the absence of problems, but a measured, disciplined response to them. Your code should be the same way. Not optimistic (assuming nothing will go wrong) and not paranoid (wrapping everything in try/except) but realistic — handling the errors that can happen, with clear responses for each one.
