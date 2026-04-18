---
title: "Module 2: Making Decisions"
sidebar_position: 2
---

# Module 2: Making Decisions

## Learning Objectives

By the end of this module, you will be able to:

- Write conditional statements using `if`, `elif`, and `else`
- Use comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`)
- Combine conditions with `and`, `or`, and `not`
- Understand truthy and falsy values in Python
- Trace through Are-Self's circuit breaker logic and explain how it makes decisions

## The Fundamental Choice

Every interesting program makes decisions. Should this email be flagged as spam? Is the user logged in? Has the circuit breaker tripped?

In Python, decisions are made with `if` statements.

```python
relevance_score = 0.85

if relevance_score > 0.5:
    print("This memory is relevant.")
```

The structure is: `if` followed by a condition, followed by a colon, followed by an indented block of code that runs only when the condition is true.

Indentation matters in Python. The code that belongs to the `if` block must be indented — typically four spaces. This is not a suggestion; it is a rule.

## Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `==` | Equal to | `level == 5` |
| `!=` | Not equal to | `status != "failed"` |
| `<` | Less than | `xp < 100` |
| `>` | Greater than | `score > 0.9` |
| `<=` | Less than or equal to | `attempts <= 3` |
| `>=` | Greater than or equal to | `budget >= cost` |

Note the double equals `==` for comparison. A single `=` is assignment (giving a name to a value). A double `==` is comparison (asking if two values are the same).

```python
neurotransmitter = "dopamine"

if neurotransmitter == "dopamine":
    print("Success signal detected.")
```

## `else` and `elif`

What if you want to do something when the condition is false?

```python
circuit_open = True

if circuit_open:
    print("Circuit breaker is OPEN. Requests are blocked.")
else:
    print("Circuit breaker is CLOSED. Requests flow normally.")
```

What if there are more than two possibilities? Use `elif` (short for "else if"):

```python
neurotransmitter = "cortisol"

if neurotransmitter == "dopamine":
    print("Success — things went well.")
elif neurotransmitter == "cortisol":
    print("Error — something went wrong.")
elif neurotransmitter == "acetylcholine":
    print("Update — an entity changed.")
else:
    print("Unknown neurotransmitter type.")
```

Python checks each condition from top to bottom. The first one that is true runs its block. The rest are skipped. If none are true, `else` runs (if it exists).

## Combining Conditions

You can combine conditions with `and`, `or`, and `not`.

```python
score = 0.92
is_active = True

if score > 0.9 and is_active:
    print("High-relevance active memory.")

if score < 0.1 or not is_active:
    print("This memory can be archived.")
```

- `and` — both conditions must be true
- `or` — at least one condition must be true
- `not` — reverses a boolean (true becomes false, false becomes true)

## Truthy and Falsy

In Python, every value can be treated as a boolean in an `if` statement. Some values are "falsy" — they act like `False`:

- `False`
- `0` (zero)
- `0.0` (zero float)
- `""` (empty string)
- `None`
- `[]` (empty list)
- `{}` (empty dictionary)

Everything else is "truthy" — it acts like `True`.

```python
description = ""

if description:
    print("Description:", description)
else:
    print("No description provided.")
```

This is a common pattern in Python. Instead of writing `if description != ""`, you simply write `if description`. It is more concise and more readable once you get used to it.

## Nested Conditions

Conditions can be nested inside other conditions:

```python
model_available = True
budget_remaining = 0.50
model_cost = 0.25

if model_available:
    if budget_remaining >= model_cost:
        print("Model selected. Proceeding with request.")
    else:
        print("Model available but over budget.")
else:
    print("Model unavailable. Trying failover.")
```

However, deeply nested conditions become hard to read. Experienced programmers try to keep nesting shallow.

## Are-Self Connection: The Circuit Breaker

Are-Self's Hypothalamus app manages model selection — choosing which AI model to use for a given task. It includes a circuit breaker pattern, which is a way to temporarily stop sending requests to a model that keeps failing.

Here is the logic, simplified to the Python you know so far:

```python
# Circuit breaker state
failures = 3
circuit_open = False
cooldown_seconds = 60
time_since_last_failure = 45

# Circuit breaker decision logic
if failures >= 3:
    circuit_open = True
    print("Circuit breaker OPENED after", failures, "failures.")

if circuit_open:
    if time_since_last_failure >= cooldown_seconds:
        # Try again — the cooldown has passed
        circuit_open = False
        print("Circuit breaker CLOSED. Attempting half-open probe.")
    else:
        print("Circuit breaker still OPEN.", 
              cooldown_seconds - time_since_last_failure, 
              "seconds until retry.")
else:
    print("Circuit operating normally.")
```

The real Are-Self circuit breaker uses escalating cooldowns: 60 seconds after the first trip, then 2 minutes, then 4 minutes, capping at 5 minutes. Each successive failure extends the wait.

```python
failure_count = 4
base_cooldown = 60  # seconds

if failure_count == 1:
    cooldown = base_cooldown          # 60 seconds
elif failure_count == 2:
    cooldown = base_cooldown * 2      # 120 seconds
elif failure_count == 3:
    cooldown = base_cooldown * 4      # 240 seconds
else:
    cooldown = 300                    # 300 seconds (5 minute cap)

print("Cooldown for failure", failure_count, "is", cooldown, "seconds.")
```

This is a real design pattern used in production systems everywhere. You are learning it in Module 2. That is the power of learning in context.

## Exercises

### Exercise 1: Neurotransmitter Classifier

Write a script that:
1. Sets a variable `signal_type` to one of: `"dopamine"`, `"cortisol"`, `"acetylcholine"`
2. Uses `if/elif/else` to print a message explaining what each signal means:
   - Dopamine: "Success signal — the operation completed successfully."
   - Cortisol: "Error signal — something went wrong during execution."
   - Acetylcholine: "Update signal — an entity was created or modified."
   - Anything else: "Unknown signal type."

Test it with each value.

### Exercise 2: Budget Filter

Are-Self's Hypothalamus filters AI models by budget. Write a script that simulates this:

```python
budget = 1.50  # dollars remaining
model_cost = 0.75  # cost per request
model_name = "claude-opus"
is_available = True

# Your code here:
# Check if the model is available AND within budget
# Print whether the model can be used or why it cannot
```

Handle three cases: model unavailable, model over budget, model selected.

### Exercise 3: Trace the Circuit Breaker

Copy the escalating cooldown code from the Are-Self Connection section. Modify it to:
1. Accept any `failure_count` from 0 to 10
2. For `failure_count` of 0, print "No failures. Circuit closed."
3. For all other counts, calculate and print the cooldown
4. Add a variable `max_cooldown = 300` and make sure the cooldown never exceeds it

### Exercise 4: Engram Deduplication Check

Are-Self checks if two Engrams are too similar before storing a new one. The threshold is 90% similarity. Write a script that:

```python
similarity_score = 0.93  # How similar two memories are
threshold = 0.90

# If similarity >= threshold, print "Duplicate detected. Skipping storage."
# If similarity >= 0.70 but < threshold, print "Similar memory found. Storing with note."
# If similarity < 0.70, print "Unique memory. Storing normally."
```

### Exercise 5: Identity Disc Phase

An IdentityDisc in Are-Self goes through phases: IDENTIFY, CONTEXT, HISTORY, TERMINAL. Write a script that takes a `current_phase` variable and prints what happens in that phase:

- `"IDENTIFY"`: "Establishing identity. Who are you?"
- `"CONTEXT"`: "Gathering context. What do you need?"
- `"HISTORY"`: "Reviewing history. What has happened before?"
- `"TERMINAL"`: "Terminal phase. Direct interaction."
- Anything else: "Unknown phase."

## Reflection

You now know how programs make decisions. This is fundamental — without conditionals, programs would be nothing more than sequential calculators.

Notice the circuit breaker pattern. It embodies the Variable of **Fear** used constructively. The system is afraid of overwhelming a failing service, so it backs off. Fear, in this context, is not weakness — it is wisdom. It is the system saying: "Something is wrong. Let me wait and try again later." That is a pattern worth carrying beyond code.

In the next module, you will learn about repetition — how to do things over and over without writing the same code a hundred times.
