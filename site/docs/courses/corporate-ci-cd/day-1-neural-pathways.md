---
title: "Day 1 — Neural Pathways as Workflow Templates"
sidebar_position: 2
---

# Day 1: Neural Pathways as Workflow Templates

Today is Sifting day. We examine the parts, understand how they relate, and build a mental model of the Central Nervous System's workflow engine. By the end of this session, you will be able to create a Neural Pathway from scratch, populate it with Neurons, connect them with Axons, and understand exactly what the visual graph editor is storing in `ui_json`.

## Lecture: The Central Nervous System as a Workflow Engine (60 minutes)

### What Is a Neural Pathway?

A Neural Pathway is a directed acyclic graph (DAG) stored as a Django model. It is a template — a blueprint for work that can be executed zero or many times. The Pathway itself never runs. What runs is a Spike Train (Day 2). Think of the Pathway as the recipe and the Spike Train as the meal.

Every Neural Pathway has:

- A **name** and **description** — human-readable identifiers
- A **collection of Neurons** — the nodes in the DAG, each representing a discrete unit of work
- A **collection of Axons** — the directed edges connecting Neurons, defining execution order and conditional routing
- A **`ui_json` field** — a JSON blob that stores the visual layout of the graph for the editor, including node positions, colors, and connection points

The Pathway does not store execution state. It does not know whether it has been run, how many times, or what happened. That separation between template and instance is foundational.

### Neurons: The Nodes

A Neuron is a single unit of work within a Pathway. Each Neuron has:

- A **name** — what this step does, in plain language
- An **Effector** — the callable that executes when this Neuron fires. Effectors are registered Python functions or classes that perform the actual work: calling an API, running a query, transforming data, sending a notification, or invoking an AI model through the Hypothalamus.
- **Configuration** — a JSON field that parameterizes the Effector. The same Effector can be reused across many Neurons with different configurations.
- A **position in the DAG** — determined by its incoming and outgoing Axons

A Neuron with no Effector is inert. It exists in the graph but does nothing when reached. This is sometimes useful for organizational purposes — a "start" node or a "join" node that serves as a structural landmark.

### Effectors: Where the Work Happens

Effectors are the bridge between the graph and the real world. An Effector is a registered callable that receives the Spike's context (its axoplasm) and produces a result. The Effector registry is a Django-managed catalog of available operations.

Common Effector types include:

- **AI Inference** — routes a prompt through the Hypothalamus for model selection, sends the request, and returns the response
- **HTTP Request** — calls an external API endpoint
- **Data Transform** — takes input from axoplasm, transforms it, and writes the result back
- **Notification** — sends a message through a channel (email, WebSocket, webhook)
- **Script Execution** — runs a Python function or shell command
- **Conditional** — evaluates a condition against the axoplasm and returns a result that downstream Axon routing can use

You do not write Effectors during this course (that is a separate topic). You configure and use existing ones.

### Axons: The Edges

An Axon connects one Neuron to another. It is a directed edge with a **type**:

- **flow** — the default. When the source Neuron completes (regardless of outcome), execution follows this Axon to the target Neuron.
- **success** — execution follows this Axon only if the source Neuron completed successfully.
- **failure** — execution follows this Axon only if the source Neuron failed.

A single Neuron can have multiple outgoing Axons. If a Neuron has both a success Axon and a failure Axon, the Spike Train's runtime evaluates the Neuron's result and routes accordingly. If a Neuron has only flow Axons, they all fire regardless of outcome.

This is the branching mechanism. There are no "if/else" blocks in the traditional programming sense. Instead, you wire your DAG so that success and failure route to different downstream Neurons. The graph IS the control flow.

### The Visual Graph Editor and `ui_json`

The graph editor is a browser-based tool that renders the Neural Pathway as a visual DAG. You drag Neurons onto a canvas, connect them with Axons, and configure each node's Effector and parameters through a sidebar panel.

Under the hood, the editor writes to the Pathway's `ui_json` field. This field stores:

- Node positions (x, y coordinates on the canvas)
- Node display properties (color, size, label positioning)
- Edge connection points (which port on which node)
- Layout metadata (zoom level, viewport position)

The `ui_json` field is purely presentational. The actual graph topology is determined by the Neuron and Axon model relationships. If you delete `ui_json`, the Pathway still works — you just lose the visual layout. If you build a Pathway entirely through the Django admin or the API, you can generate `ui_json` afterward to visualize it.

Understanding this separation matters: the graph editor is a convenience layer over the Django ORM. Everything it does, you can do programmatically.

### The DAG Constraint

Neural Pathways must be acyclic. A Neuron cannot be its own ancestor. The system enforces this at save time — if you create an Axon that would introduce a cycle, the save will fail with a validation error.

This constraint exists because Spike Trains execute forward through the graph. A cycle would create an infinite loop. If you need repeating behavior, you design it at a higher level: a Pathway that triggers itself, or an external scheduler that launches new Spike Trains.

## Hands-On Lab: Build Your First Pathway (60 minutes)

### Lab Setup

Confirm you have access to your Are-Self instance's admin panel and the graph editor. Navigate to the Central Nervous System section. You should see sections for Neural Pathways, Neurons, Axons, and Effectors.

### Exercise 1: Create a Pathway via the Admin (15 minutes)

1. Open the Django admin and navigate to **Neural Pathways**
2. Click **Add Neural Pathway**
3. Name it `training-hello-world` with description "A simple three-step pathway for training purposes"
4. Save the Pathway — note the ID assigned
5. Create three Neurons in the admin:
   - `Start` — no Effector (structural node)
   - `Greet` — assign the `echo` Effector with configuration `{"message": "Hello from the Central Nervous System"}`
   - `Log Result` — assign the `log_to_console` Effector with default configuration
6. Create two Axons:
   - `Start` → `Greet` (type: flow)
   - `Greet` → `Log Result` (type: success)
7. Navigate to the graph editor and load your Pathway. Verify the three nodes and two edges appear. Arrange them visually and save.

### Exercise 2: Create a Pathway via the Graph Editor (15 minutes)

1. Open the graph editor and create a new Pathway called `training-data-pipeline`
2. Drag four Neurons onto the canvas:
   - `Fetch Data` — assign an HTTP Effector pointed at a test endpoint
   - `Validate` — assign a data validation Effector
   - `Transform` — assign a data transform Effector
   - `Store` — assign a storage Effector
3. Connect them in sequence with flow Axons
4. Save and inspect the resulting `ui_json` in the admin — note the structure
5. Switch to the admin view and verify that the Neuron and Axon records were created

### Exercise 3: Inspect the `ui_json` (15 minutes)

1. Open the `training-hello-world` Pathway in the admin
2. Examine the `ui_json` field — identify node positions, edge definitions, and metadata
3. Manually edit a node's position in the JSON (change an x coordinate by 100 pixels)
4. Save and reload the graph editor — verify the node moved
5. Delete the `ui_json` field entirely, save, and reload the graph editor — observe what happens
6. Re-save from the graph editor to regenerate the layout

### Exercise 4: Explore Effectors (15 minutes)

1. Navigate to the Effector registry in the admin
2. List all available Effectors — read the description and configuration schema for each
3. Pick two Effectors you have not used yet
4. Create a new Pathway with five Neurons that uses at least three different Effector types
5. Save and verify in the graph editor

### Lab Deliverable

By the end of this lab, you should have at least three Neural Pathways in your instance. Screenshot the graph editor view of your most complex Pathway — you will reference it tomorrow when we launch Spike Trains against it.

## Key Takeaways

- A Neural Pathway is a DAG template, not an execution instance
- Neurons are nodes with Effectors; Axons are typed edges (flow, success, failure)
- The graph editor writes to `ui_json`, which is purely visual — topology lives in the ORM
- Everything the graph editor does can be done programmatically through the admin or API
- The DAG must be acyclic; cycles are rejected at save time
