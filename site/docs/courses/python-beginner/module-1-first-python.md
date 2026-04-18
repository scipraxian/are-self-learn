---
title: "Module 1: Your First Python"
sidebar_position: 1
---

# Module 1: Your First Python

## Learning Objectives

By the end of this module, you will be able to:

- Write and run a Python script
- Create variables and assign values to them
- Use the `print()` function to display output
- Identify and work with Python's basic data types: strings, integers, floats, and booleans
- Read a line of Are-Self model code and identify what types of data it uses

## What Is Python?

Python is a programming language — a way to give instructions to a computer. When you write Python, you are writing text that the computer will read and execute, line by line, from top to bottom.

Here is the simplest possible Python program:

```python
print("Hello, world.")
```

This tells the computer to display the text `Hello, world.` on screen. That is it. One instruction, one result.

## Variables: Giving Names to Things

A variable is a name that refers to a value. Think of it as a label you stick on a piece of data so you can use it later.

```python
name = "Are-Self"
version = 6
is_running = True
```

Here, `name` is a variable that holds the text `"Are-Self"`. The `version` variable holds the number `6`. And `is_running` holds a boolean value — either `True` or `False`.

The `=` sign in Python does not mean "equals" in the mathematical sense. It means "assign." You are telling Python: take the value on the right and attach the name on the left to it.

```python
brain_regions = 9
brain_regions = brain_regions + 3
print(brain_regions)  # Output: 12
```

Variables can change. That is why they are called variables.

## Data Types

Every value in Python has a type. The type determines what you can do with that value.

### Strings (`str`)

Strings are text. They are surrounded by quotes — single or double, it does not matter as long as they match.

```python
app_name = "hippocampus"
description = 'Memory storage and retrieval'
full_name = "are_self." + app_name  # "are_self.hippocampus"
```

You can combine strings with `+`. This is called concatenation.

### Integers (`int`)

Integers are whole numbers. No decimal point.

```python
xp_points = 150
level = 3
total = xp_points * level  # 450
```

### Floats (`float`)

Floats are numbers with decimal points.

```python
relevance_score = 0.85
dedup_threshold = 0.90
```

In Are-Self, Engram memories have a relevance score — a float between 0 and 1 that indicates how important a memory is.

### Booleans (`bool`)

Booleans are either `True` or `False`. They represent yes/no decisions.

```python
is_active = True
circuit_open = False
```

### None

There is one more special type: `None`. It represents the absence of a value.

```python
parent_neuron = None
```

This means "there is no parent neuron assigned yet."

## The `print()` Function

`print()` displays values on screen. It is your primary tool for seeing what your code is doing.

```python
print("Brain region:", app_name)
print("XP:", xp_points)
print("Active:", is_active)
```

You can pass multiple values to `print()` separated by commas. Python will put spaces between them automatically.

## Checking Types

You can ask Python what type a value is using the `type()` function:

```python
print(type("hippocampus"))   # <class 'str'>
print(type(42))              # <class 'int'>
print(type(0.85))            # <class 'float'>
print(type(True))            # <class 'bool'>
print(type(None))            # <class 'NoneType'>
```

## Are-Self Connection

Open the file `are_self/hippocampus/models.py` in the Are-Self repository. You will see code that looks something like this:

```python
class Engram(CreatedAndModifiedWithDelta, UUIDIdMixin, NameMixin, VectorMixin):
    hash = models.CharField(max_length=64, unique=True, db_index=True)
    description = models.TextField(blank=True, default="")
    relevance_score = models.FloatField(default=0.0)
    is_active = models.BooleanField(default=True)
```

Even though this is more advanced code than what you know so far, you can already identify the data types:

| Field | Default Value | Python Type |
|-------|--------------|-------------|
| `hash` | (no default) | `str` — it is a CharField, which stores text |
| `description` | `""` | `str` — an empty string |
| `relevance_score` | `0.0` | `float` — a decimal number |
| `is_active` | `True` | `bool` — a boolean |

You are already reading production code. That is not a small thing.

## Exercises

### Exercise 1: Variable Practice

Create a file called `my_first_script.py` and write the following:

```python
# Information about an Are-Self brain region
region_name = "frontal_lobe"
num_models = 4
is_active = True
description = "Executive function, planning, and reasoning"

print("Region:", region_name)
print("Number of models:", num_models)
print("Active:", is_active)
print("Description:", description)
```

Run it with `python my_first_script.py` and verify the output.

### Exercise 2: Type Detective

For each of the following values from Are-Self, write down what Python type it would be:

1. `"spike_train_001"` — an identifier for an execution run
2. `768` — the number of dimensions in a vector embedding
3. `0.90` — the deduplication threshold for Engrams
4. `True` — whether a circuit breaker is open
5. `None` — an unassigned parent pathway
6. `"dopamine"` — a neurotransmitter type name

Write a script that creates variables for each and uses `type()` to confirm your answers.

### Exercise 3: String Building

Are-Self's nine primary brain regions are: identity, hippocampus, frontal_lobe, prefrontal_cortex, hypothalamus, central_nervous_system, peripheral_nervous_system, thalamus, and temporal_lobe.

Write a script that:
1. Stores the name of your favorite brain region in a variable
2. Creates a full module path by concatenating `"are_self."` with the region name
3. Prints a sentence like: `"The module path is: are_self.hippocampus"`

### Exercise 4: Are-Self Model Reader

Open `are_self/identity/models.py` and find the `IdentityDisc` model. List every field you can find and guess its Python type based on the field class name (CharField = str, IntegerField = int, FloatField = float, BooleanField = bool). Write your answers as comments in a Python script:

```python
# IdentityDisc field types
# name - CharField - str
# level - IntegerField - int
# (continue for each field you find)
```

## Reflection

You have taken the first step. You know what variables are, how Python's basic types work, and you have looked at real code in a real codebase.

Notice what happened here: you did not just learn Python in the abstract. You learned it in context — the context of a system that does something. This is the difference between studying vocabulary lists and reading a book in a new language. Both have their place, but reading real text is where fluency begins.

In the next module, you will learn how programs make decisions — and you will trace through one of Are-Self's most interesting decision-making systems.
