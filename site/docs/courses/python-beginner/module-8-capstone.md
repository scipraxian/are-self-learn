---
title: "Module 8: Capstone Project"
sidebar_position: 8
---

# Module 8: Capstone Project

## Learning Objectives

By the end of this module, you will be able to:

- Design and build a complete Python script from scratch
- Combine variables, conditionals, loops, functions, dictionaries, and file I/O
- Process structured data representing Are-Self components
- Produce formatted reports from raw data
- Evaluate your own code for clarity and correctness

## The Project: Are-Self Data Processor

You will build a Python script called `are_self_analyzer.py` that processes a JSON file containing simulated Are-Self operational data and produces a comprehensive report.

This project uses every concept from Modules 1 through 7. There are no new concepts — only the challenge of combining what you know into something that works.

## The Data

Create a file called `are_self_data.json` with the following content:

```json
{
  "system_name": "Are-Self",
  "version": "6.0",
  "brain_regions": [
    {"name": "identity", "status": "active", "model_count": 2},
    {"name": "hippocampus", "status": "active", "model_count": 3},
    {"name": "frontal_lobe", "status": "active", "model_count": 4},
    {"name": "prefrontal_cortex", "status": "active", "model_count": 2},
    {"name": "hypothalamus", "status": "active", "model_count": 3},
    {"name": "central_nervous_system", "status": "active", "model_count": 2},
    {"name": "peripheral_nervous_system", "status": "degraded", "model_count": 2},
    {"name": "thalamus", "status": "active", "model_count": 2},
    {"name": "temporal_lobe", "status": "active", "model_count": 2}
  ],
  "engrams": [
    {"id": "e1", "name": "User prefers concise answers", "relevance": 0.95, "tags": ["preference", "context"]},
    {"id": "e2", "name": "Previous reasoning chain", "relevance": 0.88, "tags": ["reasoning", "planning"]},
    {"id": "e3", "name": "Error during API call", "relevance": 0.45, "tags": ["error", "api"]},
    {"id": "e4", "name": "Successful Python tutorial", "relevance": 0.92, "tags": ["success", "python", "teaching"]},
    {"id": "e5", "name": "User timezone is EST", "relevance": 0.30, "tags": ["context", "metadata"]},
    {"id": "e6", "name": "Complex multi-step plan", "relevance": 0.91, "tags": ["planning", "reasoning"]},
    {"id": "e7", "name": "Failed model selection", "relevance": 0.55, "tags": ["error", "hypothalamus"]},
    {"id": "e8", "name": "User asked about Django", "relevance": 0.78, "tags": ["context", "python", "django"]},
    {"id": "e9", "name": "Duplicate memory detected", "relevance": 0.15, "tags": ["duplicate", "cleanup"]},
    {"id": "e10", "name": "Successful task completion", "relevance": 0.89, "tags": ["success", "dopamine"]}
  ],
  "spike_trains": [
    {
      "id": "st1",
      "pathway": "query_processing",
      "status": "completed",
      "spikes": [
        {"neuron": "Receive Query", "status": "completed", "duration": 0.12},
        {"neuron": "Analyze Intent", "status": "completed", "duration": 1.35},
        {"neuron": "Retrieve Memory", "status": "completed", "duration": 0.89},
        {"neuron": "Generate Response", "status": "completed", "duration": 2.45}
      ]
    },
    {
      "id": "st2",
      "pathway": "memory_storage",
      "status": "failed",
      "spikes": [
        {"neuron": "Hash Content", "status": "completed", "duration": 0.05},
        {"neuron": "Check Duplicates", "status": "completed", "duration": 0.34},
        {"neuron": "Generate Embedding", "status": "failed", "duration": 3.20},
        {"neuron": "Store Engram", "status": "skipped", "duration": 0.0}
      ]
    },
    {
      "id": "st3",
      "pathway": "model_selection",
      "status": "completed",
      "spikes": [
        {"neuron": "Parse Requirements", "status": "completed", "duration": 0.08},
        {"neuron": "Filter by Budget", "status": "completed", "duration": 0.15},
        {"neuron": "Check Circuit Breakers", "status": "completed", "duration": 0.03},
        {"neuron": "Select Model", "status": "completed", "duration": 0.22}
      ]
    }
  ],
  "neurotransmitter_log": [
    {"type": "dopamine", "target": "frontal_lobe", "message": "Query processed successfully"},
    {"type": "acetylcholine", "target": "hippocampus", "message": "New engram stored"},
    {"type": "cortisol", "target": "hypothalamus", "message": "Model API timeout"},
    {"type": "dopamine", "target": "identity", "message": "Identity disc updated"},
    {"type": "cortisol", "target": "peripheral_nervous_system", "message": "Heartbeat check failed"},
    {"type": "dopamine", "target": "frontal_lobe", "message": "Pathway execution complete"},
    {"type": "acetylcholine", "target": "hippocampus", "message": "Engram relevance updated"},
    {"type": "cortisol", "target": "hippocampus", "message": "Embedding generation failed"},
    {"type": "dopamine", "target": "thalamus", "message": "Signal relay successful"},
    {"type": "dopamine", "target": "frontal_lobe", "message": "Task completed"}
  ]
}
```

## Requirements

Your script must:

### 1. Load the Data
Read `are_self_data.json` and parse it into Python data structures.

### 2. System Overview
Print the system name, version, total brain regions, and how many are active vs degraded.

### 3. Brain Region Report
For each brain region, print its name, status, and model count. Highlight any regions that are not active. Print the total model count across all regions.

### 4. Engram Analysis
- Count total engrams
- Calculate average relevance score
- List high-relevance engrams (>= 0.85) and low-relevance engrams (< 0.30)
- Collect all unique tags and count how many engrams use each tag
- Identify the most common tag

### 5. Spike Train Report
For each spike train:
- Print the pathway name and overall status
- List each spike with its neuron, status, and duration
- Calculate total duration
- Identify any failed or skipped spikes

Print summary statistics: total spike trains, completed, failed, average duration.

### 6. Neurotransmitter Summary
- Count signals by type (dopamine, cortisol, acetylcholine)
- List which brain regions received the most signals
- Flag any regions that received cortisol signals (error signals)

### 7. Save the Report
Write the complete report to a file called `are_self_report.txt`.

## Scaffolding

Here is a suggested function structure to get you started:

```python
import json


def load_data(filepath):
    """Load and return data from a JSON file."""
    pass


def print_header(title):
    """Print a formatted section header."""
    print()
    print("=" * 60)
    print(f"  {title}")
    print("=" * 60)


def analyze_brain_regions(regions):
    """Analyze and report on brain region status."""
    pass


def analyze_engrams(engrams):
    """Analyze engram data and print statistics."""
    pass


def analyze_spike_trains(spike_trains):
    """Analyze spike train execution data."""
    pass


def analyze_neurotransmitters(signals):
    """Analyze neurotransmitter signal log."""
    pass


def main():
    """Main function — orchestrates the analysis."""
    data = load_data("are_self_data.json")
    
    print_header("ARE-SELF SYSTEM REPORT")
    print(f"  System: {data['system_name']} v{data['version']}")
    
    print_header("BRAIN REGIONS")
    analyze_brain_regions(data["brain_regions"])
    
    print_header("ENGRAM ANALYSIS")
    analyze_engrams(data["engrams"])
    
    print_header("SPIKE TRAIN REPORT")
    analyze_spike_trains(data["spike_trains"])
    
    print_header("NEUROTRANSMITTER SUMMARY")
    analyze_neurotransmitters(data["neurotransmitter_log"])


# Run the program
main()
```

Fill in each function. Use the concepts from every module:
- Variables and types (Module 1)
- Conditionals (Module 2)
- Loops and lists (Module 3)
- Functions (Module 4)
- Dictionaries and JSON (Module 5)
- File I/O (Module 6)
- Are-Self knowledge (Module 7)

## Stretch Goals

If you finish the main project and want to push further:

1. **Interactive mode** — Let the user choose which sections to view instead of printing everything at once.

2. **Comparison mode** — Load two JSON files and compare them, highlighting differences (useful for before/after analysis).

3. **Health score** — Calculate an overall system health score based on:
   - Percentage of brain regions that are active
   - Average engram relevance
   - Spike train success rate
   - Ratio of dopamine to cortisol signals

4. **Filter by tag** — Let the user specify a tag and show only engrams with that tag.

5. **Export to CSV** — Write the engram data as a CSV file that could be opened in a spreadsheet.

## Evaluation Criteria

Review your own code against these criteria:

| Criterion | What to Check |
|-----------|---------------|
| **Correctness** | Does it produce accurate results? Test with the sample data. |
| **Completeness** | Does it cover all seven requirements? |
| **Readability** | Could someone else read your code and understand it? |
| **Functions** | Is the logic organized into clear, focused functions? |
| **Naming** | Are variable and function names descriptive? |
| **Output** | Is the report well-formatted and easy to read? |

## Reflection

You have built something real. A script that loads data, analyzes it, and produces a report — this is the kind of work that professional programmers do every day. The data was simulated, but the techniques are genuine.

Think about what was hard and what was easy. The hard parts are where your learning is happening. The easy parts are where your learning has already happened.

This capstone embodies the Variable of **Fulfillment**. You started this course not knowing what a variable was. Now you have written a multi-function program that processes structured data from a complex system. That gap between where you were and where you are — that is real. Acknowledge it.

## What Comes Next

The Python Intermediate course picks up where this one ends. You will learn:
- Classes and objects — the system that makes Are-Self's models work
- Inheritance and mixins — how Are-Self reuses code across all its brain regions
- Error handling — how to write code that fails gracefully
- APIs — how to talk to Are-Self's REST endpoints
- Database queries — how Django talks to PostgreSQL
- Testing — how to verify your code works correctly
- Signals — how Are-Self's neurotransmitter system really works

You are ready. Continue when you are ready to begin.
