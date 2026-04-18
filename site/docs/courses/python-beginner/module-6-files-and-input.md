---
title: "Module 6: Files and Input"
sidebar_position: 6
---

# Module 6: Files and Input

## Learning Objectives

By the end of this module, you will be able to:

- Read text files using Python
- Write data to text files
- Handle user input with `input()`
- Use f-strings for string formatting
- Read and understand a Django settings file
- Work with file paths using `os.path`

## Reading Files

Python can read any text file on your computer. The basic pattern uses the `open()` function with a `with` statement:

```python
with open("example.txt", "r") as file:
    content = file.read()
    print(content)
```

The `"r"` means "read mode." The `with` statement ensures the file is properly closed when you are done, even if an error occurs.

You can also read line by line:

```python
with open("example.txt", "r") as file:
    for line in file:
        print(line.strip())  # .strip() removes trailing whitespace/newlines
```

Or read all lines into a list:

```python
with open("example.txt", "r") as file:
    lines = file.readlines()
    print(f"File has {len(lines)} lines.")
```

## Writing Files

To write to a file, use `"w"` mode (write) or `"a"` mode (append):

```python
# Write mode — creates or overwrites the file
with open("output.txt", "w") as file:
    file.write("Spike Train Report\n")
    file.write("==================\n")
    file.write("Status: completed\n")

# Append mode — adds to the end of an existing file
with open("output.txt", "a") as file:
    file.write("Total spikes: 4\n")
```

Be careful with `"w"` mode — it destroys whatever was in the file before.

## User Input

The `input()` function pauses the program and waits for the user to type something:

```python
name = input("Enter your name: ")
print(f"Hello, {name}!")
```

`input()` always returns a string. If you need a number, convert it:

```python
level = int(input("Enter your level: "))
score = float(input("Enter relevance score: "))
```

Be aware that if the user types something that cannot be converted, this will crash. You will learn how to handle that gracefully in the Intermediate course.

## String Formatting With f-strings

You have seen f-strings briefly. Let us cover them properly. An f-string is a string prefixed with `f` that lets you embed expressions inside curly braces:

```python
region = "hippocampus"
count = 42

# Basic embedding
print(f"Region: {region}")
print(f"Engram count: {count}")

# Expressions inside braces
print(f"Double count: {count * 2}")
print(f"Region upper: {region.upper()}")

# Formatting numbers
score = 0.8567
print(f"Score: {score:.2f}")       # "Score: 0.86" (2 decimal places)
print(f"Score: {score:.0%}")       # "Score: 86%" (as percentage)

# Padding and alignment
for name in ["identity", "hippocampus", "frontal_lobe"]:
    print(f"  {name:<25s} | are_self/{name}/models.py")
```

Formatting specifications:
- `:.2f` — float with 2 decimal places
- `:.0%` — percentage with no decimal places
- `:<25s` — left-aligned string, padded to 25 characters
- `:>10d` — right-aligned integer, padded to 10 characters

## Working With File Paths

Python's `os.path` module helps you construct file paths that work across operating systems:

```python
import os

# Join path components
models_path = os.path.join("are_self", "hippocampus", "models.py")
print(models_path)  # "are_self/hippocampus/models.py" (or backslashes on Windows)

# Check if a file exists
if os.path.exists(models_path):
    print("File found!")
else:
    print("File not found.")

# Get just the filename
print(os.path.basename(models_path))  # "models.py"

# Get just the directory
print(os.path.dirname(models_path))   # "are_self/hippocampus"
```

## Reading JSON Files

Combining file reading with the `json` module from Module 5:

```python
import json

# Read a JSON file
with open("config.json", "r") as file:
    config = json.load(file)  # Note: json.load(), not json.loads()

print(config["database"]["host"])

# Write a JSON file
data = {"brain_regions": 12, "active": True}
with open("output.json", "w") as file:
    json.dump(data, file, indent=2)  # Note: json.dump(), not json.dumps()
```

## Are-Self Connection: The Django Settings File

Every Django project has a settings file that configures the entire application. Are-Self's settings file might be at `are_self/settings.py` or a similar location. Here is what portions of it look like and what they mean:

```python
# This is real Python code that Django reads on startup

DEBUG = True  # Boolean — is the server in debug mode?

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "rest_framework",
    # Are-Self brain regions
    "are_self.identity",
    "are_self.hippocampus",
    "are_self.frontal_lobe",
    "are_self.prefrontal_cortex",
    "are_self.hypothalamus",
    "are_self.central_nervous_system",
    "are_self.peripheral_nervous_system",
    "are_self.thalamus",
    "are_self.temporal_lobe",
    "are_self.parietal_lobe",
    "are_self.synaptic_cleft",
    "are_self.occipital_lobe",
    "are_self.common",
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "are_self_db",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 25,
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
}
```

Look at what you already understand:
- `DEBUG = True` — a boolean variable
- `INSTALLED_APPS` — a list of strings
- `DATABASES` — a nested dictionary
- `REST_FRAMEWORK` — a dictionary with mixed value types

A Django settings file is just Python. There is no special syntax — it uses the exact same variables, lists, and dictionaries you have been learning.

## Are-Self Connection: Reading Model Files

Here is a practical exercise in reading Python files as text:

```python
import os

def find_model_files(base_path):
    """Find all models.py files in the Are-Self project."""
    model_files = []
    
    brain_regions = [
        "identity", "hippocampus", "frontal_lobe",
        "prefrontal_cortex", "hypothalamus",
        "central_nervous_system", "peripheral_nervous_system",
        "thalamus", "temporal_lobe", "parietal_lobe",
        "synaptic_cleft", "occipital_lobe", "common",
    ]
    
    for region in brain_regions:
        path = os.path.join(base_path, "are_self", region, "models.py")
        if os.path.exists(path):
            model_files.append(path)
            
    return model_files

def count_classes_in_file(filepath):
    """Count lines starting with 'class ' in a Python file."""
    count = 0
    with open(filepath, "r") as file:
        for line in file:
            if line.strip().startswith("class "):
                count += 1
    return count
```

This shows how Python can read its own source code as text — a useful technique for understanding large codebases.

## Exercises

### Exercise 1: Settings Reader

Write a script that reads a text file called `settings_sample.txt` and:
1. Counts total lines
2. Counts non-empty lines
3. Counts comment lines (lines starting with `#` after stripping whitespace)
4. Prints each non-comment, non-empty line

First, create the sample file with a few lines mimicking Django settings.

### Exercise 2: Engram File Writer

Write a function `save_engrams(engrams, filepath)` that takes a list of engram dictionaries and writes them to a JSON file. Then write `load_engrams(filepath)` that reads them back. Verify the round-trip works.

```python
engrams = [
    {"name": "Memory 1", "relevance_score": 0.95, "tags": ["reasoning"]},
    {"name": "Memory 2", "relevance_score": 0.42, "tags": ["context"]},
]

save_engrams(engrams, "engrams.json")
loaded = load_engrams("engrams.json")
print(loaded == engrams)  # Should be True
```

### Exercise 3: Interactive Brain Region Explorer

Write an interactive script that:
1. Lists all Are-Self brain regions (numbered)
2. Asks the user to pick one by number
3. Prints information about that region (description, module path)
4. Asks if they want to explore another one
5. Continues until they say no

### Exercise 4: Log File Generator

Write a function that simulates and logs a Spike Train execution:

```python
def simulate_spike_train(spikes, log_file):
    """Simulate spike execution and write a log file."""
    # For each spike, write a timestamped log entry
    # Include the neuron name, status, and duration
    # At the end, write a summary section
```

### Exercise 5: Model File Scanner

Write a script that, given a directory path, finds all `.py` files and for each one reports:
- File path
- Number of lines
- Number of lines containing the word "class"
- Number of lines containing the word "def"

This is a simple version of what code analysis tools do.

## Reflection

Files are the bridge between your program and the world. When a program ends, its variables vanish. Files persist. This connects to the Variable of **Permadeath** — in the world of running programs, every variable dies when the process ends. Files are how we create permanence.

Are-Self's Engrams are, in a sense, the system's way of fighting permadeath. They persist memories to a database so that knowledge survives beyond any single execution. When you write data to a file, you are doing the same thing at a simpler scale.

In the next module, you will take your first guided tour through Are-Self's actual model files, previewing the object-oriented concepts that the Intermediate course will teach you in depth.
