---
title: "Module 3: Loops and Lists"
sidebar_position: 3
---

# Module 3: Loops and Lists

## Learning Objectives

By the end of this module, you will be able to:

- Create and manipulate Python lists
- Use `for` loops to iterate over sequences
- Use `while` loops for condition-based repetition
- Access list elements by index
- Use common list methods: `append()`, `len()`, `in`
- Iterate through Are-Self Engram tags and brain region lists

## Lists: Ordered Collections

A list is a collection of values in a specific order. You create one with square brackets:

```python
brain_regions = ["identity", "hippocampus", "frontal_lobe", 
                 "prefrontal_cortex", "hypothalamus",
                 "central_nervous_system", "peripheral_nervous_system",
                 "thalamus", "temporal_lobe"]
```

That is Are-Self's nine primary brain regions, stored in a single variable.

You can access individual items by their index — their position in the list. Indices start at 0, not 1:

```python
print(brain_regions[0])   # "identity"
print(brain_regions[1])   # "hippocampus"
print(brain_regions[8])   # "temporal_lobe"
print(brain_regions[-1])  # "temporal_lobe" (last item)
```

You can check how many items are in a list:

```python
print(len(brain_regions))  # 9
```

And you can check if something is in a list:

```python
if "hippocampus" in brain_regions:
    print("Memory system is present.")
```

## Modifying Lists

Lists are mutable — they can be changed after creation.

```python
# Add to the end
brain_regions.append("parietal_lobe")

# Add more regions
brain_regions.append("occipital_lobe")
brain_regions.append("synaptic_cleft")

print(len(brain_regions))  # 12

# Remove an item
brain_regions.remove("synaptic_cleft")

# Check the last item
print(brain_regions[-1])  # "occipital_lobe"
```

## For Loops: Doing Something With Each Item

A `for` loop runs a block of code once for each item in a sequence:

```python
neurotransmitters = ["dopamine", "cortisol", "acetylcholine"]

for nt in neurotransmitters:
    print("Signal:", nt)
```

Output:
```
Signal: dopamine
Signal: cortisol
Signal: acetylcholine
```

The variable `nt` takes on each value from the list, one at a time. The indented block runs each time.

You can combine loops with conditionals:

```python
scores = [0.95, 0.42, 0.88, 0.12, 0.73, 0.91]

for score in scores:
    if score >= 0.90:
        print(score, "- HIGH relevance")
    elif score >= 0.50:
        print(score, "- MEDIUM relevance")
    else:
        print(score, "- LOW relevance")
```

## Looping With `range()`

Sometimes you need to loop a specific number of times or need the index:

```python
# Loop 5 times
for i in range(5):
    print("Attempt", i)

# Output: Attempt 0, Attempt 1, Attempt 2, Attempt 3, Attempt 4
```

`range(5)` generates the numbers 0 through 4. You can also specify a start and step:

```python
# range(start, stop, step)
for i in range(0, 60, 10):
    print(i, "seconds")
# Output: 0, 10, 20, 30, 40, 50
```

To loop over a list and also have the index, use `enumerate()`:

```python
regions = ["identity", "hippocampus", "frontal_lobe"]

for index, region in enumerate(regions):
    print(f"Region {index}: {region}")
```

The `f` before the string is an f-string — a way to embed variables directly in text. We will cover this more in Module 6, but it is handy to know now.

## While Loops: Repeat Until a Condition Changes

A `while` loop repeats as long as its condition is true:

```python
failures = 0
max_failures = 3

while failures < max_failures:
    print("Attempting request... failure", failures + 1)
    failures = failures + 1

print("Circuit breaker tripped after", failures, "failures.")
```

Be careful with `while` loops. If the condition never becomes false, the loop runs forever. This is called an infinite loop, and you will need to press Ctrl+C to stop it.

```python
# This would run forever — do NOT run this
# while True:
#     print("Still going...")
```

## Building Lists With Loops

A common pattern is building a new list from an existing one:

```python
scores = [0.95, 0.42, 0.88, 0.12, 0.73, 0.91]
high_scores = []

for score in scores:
    if score >= 0.90:
        high_scores.append(score)

print("High relevance memories:", high_scores)
# Output: High relevance memories: [0.95, 0.91]
```

## Are-Self Connection: Engram Tags

In Are-Self, each Engram (memory record) can have multiple tags — labels that categorize the memory. Tags are stored as a many-to-many relationship, but conceptually they work like a list.

```python
# Simulating an Engram's tags
engram_tags = ["reasoning", "planning", "user-preference", "context"]

# Count tags
print("This engram has", len(engram_tags), "tags.")

# Check for a specific tag
if "reasoning" in engram_tags:
    print("This is a reasoning-related memory.")

# Filter engrams by tag
engrams = [
    {"name": "User prefers concise answers", "tags": ["user-preference", "context"]},
    {"name": "Previous reasoning chain", "tags": ["reasoning", "planning"]},
    {"name": "Error during API call", "tags": ["error", "cortisol"]},
    {"name": "Successful task completion", "tags": ["success", "dopamine"]},
]

# Find all engrams tagged with "reasoning"
reasoning_memories = []
for engram in engrams:
    if "reasoning" in engram["tags"]:
        reasoning_memories.append(engram["name"])

print("Reasoning memories:", reasoning_memories)
```

This pattern — looping through a collection and filtering based on criteria — is one of the most common patterns in all of programming. Are-Self uses it extensively when searching for relevant memories.

## Are-Self Connection: Brain Region Listing

Here is a practical loop that mirrors how you might explore the Are-Self codebase:

```python
brain_regions = [
    ("identity", "Identity management and IdentityDisc"),
    ("hippocampus", "Memory storage with Engrams"),
    ("frontal_lobe", "Neural Pathways and workflow DAGs"),
    ("prefrontal_cortex", "Higher-order planning and strategy"),
    ("hypothalamus", "Model selection and circuit breakers"),
    ("central_nervous_system", "Core coordination and routing"),
    ("peripheral_nervous_system", "External I/O and heartbeat"),
    ("thalamus", "Signal relay and filtering"),
    ("temporal_lobe", "Pattern recognition and sequencing"),
]

print("Are-Self Brain Regions")
print("=" * 50)

for name, description in brain_regions:
    module_path = "are_self/" + name + "/models.py"
    print(f"  {name:35s} -> {module_path}")
```

The `{name:35s}` in the f-string means "pad this string to 35 characters." It makes the output line up neatly.

## Exercises

### Exercise 1: Tag Counter

Given a list of Engrams with tags, count how many times each tag appears:

```python
engrams = [
    {"name": "Memory 1", "tags": ["reasoning", "planning"]},
    {"name": "Memory 2", "tags": ["error", "reasoning"]},
    {"name": "Memory 3", "tags": ["planning", "context"]},
    {"name": "Memory 4", "tags": ["reasoning", "context", "planning"]},
]

# For each unique tag, count how many engrams have it.
# Hint: you can use a separate list to track tags you have already counted.
```

### Exercise 2: Score Filter

Write a script that takes a list of relevance scores and separates them into three lists: high (>= 0.90), medium (>= 0.50), and low (< 0.50).

```python
scores = [0.95, 0.42, 0.88, 0.12, 0.73, 0.91, 0.55, 0.03, 0.67, 0.99]
```

Print each list and how many items it contains.

### Exercise 3: Circuit Breaker Cooldown Sequence

Use a `while` loop to simulate escalating circuit breaker cooldowns:

Start with `failure = 1` and `cooldown = 60`. Each iteration:
- Print the failure number and cooldown
- Double the cooldown
- If cooldown exceeds 300, cap it at 300
- Stop after 7 failures

### Exercise 4: Build a Brain Region Directory

Create a list of all Are-Self brain regions (the nine primary ones plus parietal_lobe, occipital_lobe, and synaptic_cleft). Write a loop that:

1. Numbers each region starting from 1
2. Converts underscores to spaces for display
3. Prints in the format: `1. Identity` (capitalized, no underscores)

Hint: strings have a `.replace()` method — `"frontal_lobe".replace("_", " ")` returns `"frontal lobe"`. They also have a `.title()` method that capitalizes each word.

### Exercise 5: Neurotransmitter Signal Log

Simulate a log of neurotransmitter signals and produce a summary:

```python
signal_log = [
    "dopamine", "dopamine", "cortisol", "acetylcholine",
    "dopamine", "cortisol", "cortisol", "dopamine",
    "acetylcholine", "dopamine", "cortisol", "dopamine"
]

# Count the total number of each type
# Print a summary like:
# dopamine: 6 signals (success)
# cortisol: 4 signals (error)
# acetylcholine: 2 signals (update)
```

## Reflection

Loops and lists are where programming starts to feel powerful. Instead of writing one instruction for one piece of data, you write one instruction for any amount of data. A loop that processes 10 items works identically for 10,000 items.

This connects to the Variable of **Time**. A loop is a way of compressing time — doing in milliseconds what would take a human hours to do by hand. Respect that power. When you write a loop, you are creating a small machine that will repeat your intention as many times as needed. Make sure the intention is correct.

In the next module, you will learn about functions — reusable blocks of code that let you organize your programs and avoid writing the same thing twice.
