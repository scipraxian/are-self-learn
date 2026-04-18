---
title: "Day 3 — Branching and Error Handling"
sidebar_position: 4
---

# Day 3: Branching and Error Handling

Today is Planning day. We design strategies for when things go right, when things go wrong, and when things go sideways. The Central Nervous System does not pretend that workflows always succeed. It was built from the ground up with failure as a first-class concept — and so must your Pathways be.

## Lecture: Axon Types, Routing, and Recovery (60 minutes)

### The Three Axon Types Revisited

On Day 1 you learned that Axons have types: flow, success, and failure. Today we go deeper into what this means for real-world workflow design.

**Flow Axons** fire regardless of the source Neuron's outcome. They are unconditional edges. Use flow Axons when the next step must always happen — logging, cleanup, notification of completion regardless of result.

**Success Axons** fire only when the source Neuron's Spike completes with a SUCCESS status. This is the happy path. Use success Axons when the next step depends on the previous step having worked correctly.

**Failure Axons** fire only when the source Neuron's Spike completes with a FAILED status. This is the recovery path. Use failure Axons to route to error handling, fallback logic, alerting, or graceful degradation.

A single Neuron can have any combination of outgoing Axon types. Common patterns:

- **Success + Failure** — the most common branching pattern. Success goes forward; failure goes to recovery.
- **Success + Failure + Flow** — success and failure each go to specialized handlers, and a flow Axon goes to a logging/audit node regardless.
- **Multiple Success Axons** — fan-out pattern. A successful result triggers several downstream actions in parallel.
- **Flow only** — the Neuron is a waypoint. Whatever happens, we keep going.

### Conditional Routing

Beyond the three Axon types, you can build conditional routing using Neurons with conditional Effectors. A conditional Effector evaluates an expression against the axoplasm and produces a SUCCESS or FAILURE result based on the evaluation. This lets you create "if/else" logic in the DAG:

```
[Check Condition] --success--> [Path A]
[Check Condition] --failure--> [Path B]
```

The condition Effector might check:

- Whether a key exists in the axoplasm
- Whether a value exceeds a threshold
- Whether an external system is available
- Whether the current time falls within a window

The condition itself is configured in the Neuron's configuration JSON. The Effector reads the axoplasm, evaluates the condition, and returns SUCCESS or FAILURE. The Axon routing takes it from there.

This is how you build complex decision trees without leaving the DAG paradigm. Every decision is a Neuron. Every outcome is an Axon. The graph is the logic.

### Retry Patterns

When a Neuron fails, the simplest recovery is to try again. Are-Self supports retry at two levels:

**Effector-level retry:** Some Effectors have built-in retry logic. An HTTP Effector might retry a failed request three times with exponential backoff before reporting failure. This is invisible to the DAG — the Neuron either eventually succeeds or fails after exhausting its retries.

**DAG-level retry:** You can design a retry loop in the graph itself:

```
[Do Work] --failure--> [Wait] --flow--> [Do Work Again] --success--> [Continue]
                                        [Do Work Again] --failure--> [Give Up]
```

Here, `Do Work Again` is a separate Neuron with the same Effector and configuration as `Do Work`, but it is wired to a different failure path (Give Up instead of retry). This gives you explicit control over how many retries happen and what happens when retries are exhausted.

For more sophisticated retry patterns, you can use a counter in the axoplasm:

1. `Do Work` fails
2. Failure Axon routes to `Increment Retry Counter`
3. `Increment Retry Counter` reads `retry_count` from axoplasm, increments it, and writes it back
4. Conditional Neuron checks `retry_count < 3`
5. If true (success), route back to a fresh `Do Work` Neuron
6. If false (failure), route to `Give Up`

Remember: the DAG must remain acyclic. You cannot route back to the same Neuron. You create separate Neuron instances for each retry attempt, or you design the retry logic to launch a new Spike Train.

### Circuit Breaker Integration

The Hypothalamus provides circuit breakers that protect against cascading failures. When you use an AI inference Effector, the request passes through the Hypothalamus, which maintains circuit breaker state for each model and provider.

Circuit breaker timeouts escalate: 60 seconds on the first trip, then 2 minutes, then 4 minutes, then a 5-minute cap. When a circuit breaker is open, requests to that model fail immediately rather than timing out.

For your Neural Pathways, this means:

- A Neuron using an AI Effector might fail not because the work is wrong, but because the model's circuit breaker is open
- The failure Axon fires, and your recovery logic can route to a fallback model or a manual review queue
- The Hypothalamus handles model failover internally (via FailoverStrategy chains), but your Pathway should still handle the case where all models are unavailable

Design your Pathways to distinguish between "the work failed" and "the infrastructure failed." These require different recovery strategies.

### Error Context in Axoplasm

When a Neuron fails, the Spike's axoplasm is updated with error information:

- `_error_type` — the class of error (timeout, validation, permission, external_service, etc.)
- `_error_message` — a human-readable description
- `_error_neuron` — the name of the Neuron that failed
- `_error_timestamp` — when the failure occurred

Downstream failure-handling Neurons can read these fields to make informed decisions. A `Triage Error` Neuron might route timeout errors to a retry path and validation errors to a manual review queue.

### Fan-Out and Fan-In

**Fan-out** is when one Neuron has multiple outgoing Axons of the same type. All target Neurons execute in parallel (subject to worker availability). This is how you parallelize work in a Pathway.

**Fan-in** is when multiple Axons converge on a single Neuron. The target Neuron waits until all incoming Axons have been satisfied before firing. This is how you synchronize parallel branches.

Fan-in behavior is configurable:

- **All** — the target Neuron fires only when every incoming Axon has been satisfied (all upstream Neurons have completed)
- **Any** — the target Neuron fires as soon as any one incoming Axon is satisfied
- **Quorum** — the target Neuron fires when a specified number of incoming Axons have been satisfied

The merge strategy for axoplasm at fan-in points is also configurable. When three branches converge, their axoplasm must be combined. Options include deep merge, last-write-wins, or a custom merge Effector.

### The Responsibility Variable

Every error-handling decision is an exercise in Responsibility. When you wire a failure Axon, you are deciding what happens when things go wrong. Silence? Alerting? Retry? Graceful degradation? Each choice carries consequences for the users, the infrastructure, and the team.

The Fear Variable is relevant here too. It is tempting to build only the happy path and assume errors will not happen. Circuit breakers, failure Axons, and retry patterns exist because fear of failure — acknowledged and designed for — is healthier than pretending failure away.

## Hands-On Lab: Error Handling Patterns (60 minutes)

### Exercise 1: Success and Failure Branching (15 minutes)

1. Create a Pathway called `training-branch-demo` with the following structure:
   - `Call API` — HTTP Effector pointed at a URL that will return a 500 error
   - `Process Result` — connected from `Call API` via a success Axon
   - `Handle Error` — connected from `Call API` via a failure Axon
   - `Log Outcome` — connected from both `Process Result` and `Handle Error` via flow Axons
2. Launch a Spike Train and observe which path was taken
3. Change the API URL to one that succeeds and launch again
4. Compare the two Spike Trains — which Spikes were created in each?

### Exercise 2: Retry Pattern (20 minutes)

1. Create a Pathway called `training-retry-demo` with the following structure:
   - `Attempt 1` — an Effector configured to fail (use a test endpoint or a deliberately misconfigured call)
   - `Attempt 1` --failure--> `Delay 1` --flow--> `Attempt 2`
   - `Attempt 2` --failure--> `Delay 2` --flow--> `Attempt 3`
   - `Attempt 3` --failure--> `Report Failure`
   - Each attempt has a success Axon to `Continue Pipeline`
2. Launch a Spike Train and observe all three attempts failing in sequence
3. Fix the Effector configuration on `Attempt 2` so it succeeds
4. Launch again — observe that `Attempt 1` fails, `Attempt 2` succeeds, and `Attempt 3` is never reached

### Exercise 3: Fan-Out and Fan-In (15 minutes)

1. Create a Pathway called `training-parallel-demo`:
   - `Start` --flow--> `Worker A`, `Worker B`, `Worker C` (three flow Axons)
   - `Worker A` --success--> `Collect Results`
   - `Worker B` --success--> `Collect Results`
   - `Worker C` --success--> `Collect Results`
   - `Collect Results` configured with fan-in mode "All"
2. Each Worker writes a unique key to axoplasm
3. Launch a Spike Train and verify:
   - All three Workers executed in parallel
   - `Collect Results` waited for all three
   - The final axoplasm contains keys from all three Workers

### Exercise 4: Error Triage (10 minutes)

1. Add to `training-branch-demo`:
   - Modify `Handle Error` to be a conditional Effector that checks `_error_type`
   - `Handle Error` --success--> `Retry Path` (if error type is "timeout")
   - `Handle Error` --failure--> `Escalate` (if error type is anything else)
2. Launch with a timeout-producing endpoint and verify the retry path is taken
3. Launch with a 403-producing endpoint and verify the escalation path is taken

### Lab Deliverable

Export the graph editor screenshot of your `training-retry-demo` Pathway. Write a brief design document (one page) describing the error-handling strategy for a real workflow you use at work. Identify which Neurons would have success Axons, which would have failure Axons, and where you would place retry logic.

## Key Takeaways

- The three Axon types (flow, success, failure) are the entire control-flow mechanism
- Conditional routing uses Neurons with conditional Effectors — the graph IS the logic
- Retry patterns are built as DAG structures, not loops (the graph must remain acyclic)
- Circuit breakers protect against cascading failures at the infrastructure level
- Failed Spikes write error context to axoplasm for downstream triage
- Fan-out parallelizes work; fan-in synchronizes it with configurable merge strategies
