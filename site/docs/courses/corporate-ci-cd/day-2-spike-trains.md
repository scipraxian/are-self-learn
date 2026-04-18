---
title: "Day 2 — Spike Trains"
sidebar_position: 3
---

# Day 2: Spike Trains

Today is Pre-Planning day. We trace execution paths and understand what it takes for a workflow to actually run. Yesterday you built static templates. Today you bring them to life. A Spike Train is a running instance of a Neural Pathway — the concrete execution that carries data, transitions through states, and produces results.

## Lecture: Execution Instances and Data Flow (60 minutes)

### What Is a Spike Train?

In neuroscience, a spike train is a sequence of electrical impulses traveling along a neural pathway. In Are-Self, a Spike Train is an execution instance of a Neural Pathway. When you "run" a Pathway, you create a Spike Train. The Pathway is the road; the Spike Train is the car driving on it.

A Spike Train has:

- A reference to the **Neural Pathway** it is executing
- A **status** — the current state of the execution
- A collection of **Spikes** — one per Neuron that has been reached
- **Axoplasm** — the context data flowing through the execution
- **Cerebrospinal fluid** — shared context accessible to every Neuron in the Pathway
- **Timestamps** — created, started, completed
- An **Identity** — the identity that triggered this execution (for budget tracking and permissions)

### Status Lifecycle

Every Spike Train moves through a defined set of states:

```
CREATED → PENDING → RUNNING → SUCCESS | FAILED | ABORTED
```

- **CREATED** — the Spike Train record exists but has not been queued for execution. This is the state immediately after creation.
- **PENDING** — the Spike Train has been submitted to the execution engine and is waiting for a worker to pick it up.
- **RUNNING** — at least one Spike is actively executing. The Spike Train remains in RUNNING until all reachable Neurons have completed.
- **SUCCESS** — every Neuron that was reached completed successfully. No failure Axons were followed that led to an unrecovered terminal state.
- **FAILED** — at least one Neuron failed and the failure was not recovered by downstream error handling. The Spike Train terminated with an error.
- **ABORTED** — the Spike Train was manually cancelled or killed by a timeout. Execution stopped wherever it was.

Status transitions are one-directional. A Spike Train that has reached SUCCESS cannot go back to RUNNING. A FAILED Spike Train does not retry automatically (though you can create a new Spike Train against the same Pathway).

### Spikes: Per-Neuron Execution Records

When a Spike Train reaches a Neuron, it creates a Spike — an execution record for that specific node. The Spike has its own status (mirroring the Spike Train statuses), its own timing data, and its own result.

Think of it this way: the Spike Train is the journey, and each Spike is a stop along the way. The Spike records what happened at that particular Neuron — did the Effector succeed? What data did it produce? How long did it take?

Spikes are created lazily. If a Neuron is never reached (because the routing went a different direction), no Spike is created for it. You can look at which Spikes exist to understand exactly which path the execution took through the DAG.

### Axoplasm: The Data Flow

In neuroscience, axoplasm is the cytoplasm within an axon. In Are-Self, axoplasm is the context JSON that flows from Neuron to Neuron through the Spike Train.

When a Spike Train starts, it begins with an initial axoplasm — a JSON object that you provide at launch time. This is the input data for the workflow.

As each Neuron fires, its Effector can read from and write to the axoplasm. The Effector receives the current axoplasm, does its work, and returns a modified axoplasm that is passed along the outgoing Axons to the next Neuron(s).

Key rules of axoplasm:

- **It is a JSON object** — keys are strings, values are any JSON-serializable type
- **It accumulates** — each Neuron adds to the axoplasm; it does not replace it (unless explicitly designed to)
- **It flows forward** — downstream Neurons see everything upstream Neurons have written
- **It branches** — when a DAG splits (one Neuron has multiple outgoing Axons), each branch receives a copy of the axoplasm at the split point
- **It merges** — when branches converge (multiple Axons point to the same Neuron), the merge strategy is configurable (typically "last write wins" or "deep merge")

### Cerebrospinal Fluid: Shared Context

Cerebrospinal fluid (CSF) is the shared context layer for an entire Spike Train. Unlike axoplasm, which flows forward through the graph and branches with the DAG, CSF is globally accessible to every Neuron at any time.

Use CSF for:

- Configuration that every Neuron needs (API keys, environment settings, user preferences)
- Accumulated state that should be visible everywhere (a running total, a list of errors encountered so far)
- Communication between branches that would otherwise be isolated

CSF is set at Spike Train creation time and can be modified by any Effector during execution. Changes to CSF are immediately visible to all subsequent Neuron executions, even on other branches.

The distinction matters: axoplasm is the river flowing through the canyon (it follows the path). CSF is the atmosphere — it is everywhere at once.

### Status Propagation

When a Spike (a single Neuron's execution) completes, the Spike Train evaluates what to do next:

1. **Determine the Spike's result** — SUCCESS or FAILED
2. **Find outgoing Axons** — look at the source Neuron's Axons
3. **Filter by type** — if the Spike succeeded, follow `success` and `flow` Axons; if it failed, follow `failure` and `flow` Axons
4. **Create new Spikes** — for each target Neuron reached by a matching Axon, create a new Spike and queue it for execution
5. **Check for completion** — if no new Spikes were created and no Spikes are still running, the Spike Train is complete. Evaluate overall status.

Overall status is determined by the terminal Spikes (those at the leaves of the execution path). If all terminal Spikes succeeded, the Spike Train succeeds. If any terminal Spike failed without a downstream recovery path, the Spike Train fails.

### Launching a Spike Train

You can launch a Spike Train through:

- **The Django admin** — navigate to the Pathway, click "Create Spike Train," provide initial axoplasm and CSF
- **The API** — POST to the Spike Train endpoint with the Pathway ID, axoplasm, and CSF
- **Programmatically** — from within an Effector (a Neuron can launch sub-workflows)
- **The graph editor** — click "Run" on a loaded Pathway

Each launch creates a fresh Spike Train. Multiple Spike Trains can execute the same Pathway concurrently — they are completely independent instances.

## Hands-On Lab: Running Spike Trains (60 minutes)

### Exercise 1: Launch and Trace (20 minutes)

1. Open the `training-hello-world` Pathway you built yesterday
2. Create a Spike Train with empty axoplasm (`{}`) and empty CSF (`{}`)
3. Submit it for execution
4. Watch the status transition: CREATED → PENDING → RUNNING → SUCCESS
5. Open the Spike Train detail view — examine each Spike created
6. Verify that only the expected Neurons have Spikes (all three in a linear flow)
7. Check the timing data — how long did each Spike take?

### Exercise 2: Axoplasm Flow (20 minutes)

1. Create a new Pathway called `training-axoplasm-demo` with three Neurons:
   - `Inject` — Effector that writes `{"greeting": "Hello"}` to axoplasm
   - `Transform` — Effector that reads `greeting` and writes `{"greeting": "Hello, World!"}`
   - `Read` — Effector that logs the final value of `greeting` from axoplasm
2. Connect them in sequence with flow Axons
3. Launch a Spike Train with initial axoplasm `{"source": "training"}`
4. After completion, inspect each Spike's axoplasm snapshot:
   - After `Inject`: should contain both `source` and `greeting`
   - After `Transform`: `greeting` should be updated
   - After `Read`: final axoplasm should have all accumulated keys
5. Verify that the initial axoplasm was preserved and accumulated

### Exercise 3: Cerebrospinal Fluid (20 minutes)

1. Create a new Pathway called `training-csf-demo` with a branching structure:
   - `Start` → `Branch A` and `Branch B` (two flow Axons from Start)
   - `Branch A` → `End`
   - `Branch B` → `End`
2. Configure `Branch A` to write a value to CSF: `{"branch_a_was_here": true}`
3. Configure `Branch B` to read CSF and log whether `branch_a_was_here` exists
4. Launch a Spike Train with CSF `{"experiment": "csf-visibility"}`
5. Observe: Can Branch B see what Branch A wrote to CSF? (It depends on execution order)
6. Launch the Spike Train three times and compare results — discuss the implications of shared mutable state

### Lab Deliverable

Document the axoplasm contents at each Spike in your `training-axoplasm-demo` Pathway. Write a one-paragraph explanation of when you would use axoplasm versus cerebrospinal fluid. You will need this understanding for tomorrow's branching exercises.

## Key Takeaways

- A Spike Train is a running instance of a Neural Pathway — the template never changes
- Status lifecycle: CREATED → PENDING → RUNNING → SUCCESS / FAILED / ABORTED
- Spikes are per-Neuron execution records, created lazily as the DAG is traversed
- Axoplasm flows forward through the graph, accumulating context at each node
- Cerebrospinal fluid is globally shared context, visible to all Neurons at any time
- Multiple Spike Trains can execute the same Pathway concurrently and independently
