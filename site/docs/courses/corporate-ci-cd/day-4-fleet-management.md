---
title: "Day 4 — Fleet Management"
sidebar_position: 5
---

# Day 4: Fleet Management

Today is Executing day. We take the Pathways we have built and distribute them across a fleet of workers. Until now, everything has run locally. Today we connect the Peripheral Nervous System, distribute work to NerveTerminals, monitor health via heartbeat, and use neurotransmitter signals to observe the entire system in real time.

## Lecture: The Peripheral Nervous System and Neurotransmitters (60 minutes)

### The Peripheral Nervous System (PNS)

In human anatomy, the peripheral nervous system connects the brain to the rest of the body — to your limbs, organs, and sensory organs. In Are-Self, the Peripheral Nervous System connects the Central Nervous System (where Pathways live) to the fleet of workers that execute them.

The PNS is a Django app that manages:

- **NerveTerminals** — registered workers that can execute Spikes
- **Heartbeat monitoring** — periodic health checks via Celery Beat
- **Distribution modes** — policies for how work is assigned to workers
- **Worker status** — online, offline, busy, degraded

### NerveTerminals

A NerveTerminal is a registered worker in the fleet. Each NerveTerminal has:

- A **unique identifier** — typically the hostname or container ID
- A **status** — ONLINE, OFFLINE, BUSY, DEGRADED
- A **last heartbeat timestamp** — when the worker last reported in
- **Capabilities** — what Effectors this worker can execute (not all workers have all Effectors available)
- **Load metrics** — current CPU, memory, active Spike count

NerveTerminals register themselves on startup. When a Celery worker comes online and connects to the Are-Self broker, it registers as a NerveTerminal and begins sending heartbeats.

### Heartbeat Monitoring

Celery Beat runs a periodic task that checks every registered NerveTerminal. The heartbeat cycle:

1. **NerveTerminal sends heartbeat** — a lightweight message containing status, load metrics, and timestamp
2. **PNS receives heartbeat** — updates the NerveTerminal record
3. **PNS evaluates health** — if a NerveTerminal has not sent a heartbeat within the expected interval, it is marked DEGRADED; if it misses multiple intervals, it is marked OFFLINE
4. **PNS broadcasts status change** — fires a Norepinephrine neurotransmitter signal if a worker changes status

The heartbeat interval is configurable. The default is 30 seconds. A NerveTerminal that misses two consecutive heartbeats (60 seconds of silence) transitions to DEGRADED. After three misses (90 seconds), it transitions to OFFLINE.

Workers marked OFFLINE do not receive new Spike assignments. Any Spikes that were assigned to an OFFLINE worker and have not completed are reassigned to another available worker.

### Distribution Modes

When a Spike Train is ready to execute a Neuron and needs a worker, the PNS selects one based on the Pathway's configured distribution mode:

**LOCAL_SERVER** — the Spike executes on the same server that hosts the Central Nervous System. No distribution. This is the default for development and single-server deployments.

**ALL_ONLINE_AGENTS** — the Spike is broadcast to every online NerveTerminal. All of them execute it. This is useful for tasks that must run everywhere: deploying a configuration update, clearing a cache, running a health check across the fleet.

**ONE_AVAILABLE_AGENT** — the PNS selects the best available NerveTerminal and assigns the Spike to it alone. Selection considers: load metrics (prefer the least busy worker), capabilities (the worker must support the required Effector), and locality (prefer workers on the same network segment if applicable).

**SPECIFIC_TARGETS** — the Spike is assigned to one or more named NerveTerminals. The Pathway configuration specifies which workers should execute which Neurons. This is useful when specific Neurons require specific hardware (a GPU node for inference, a high-memory node for data processing).

Distribution mode is set per Pathway, but can be overridden per Neuron. A Pathway might use ONE_AVAILABLE_AGENT as its default, but a specific Neuron that requires GPU access might be configured with SPECIFIC_TARGETS pointing to GPU-equipped NerveTerminals.

### Worker Health and Reassignment

When a NerveTerminal goes OFFLINE while executing a Spike, the PNS handles it:

1. The Spike's status is set to PENDING (back in the queue)
2. The PNS selects a new NerveTerminal using the distribution mode
3. The Spike is reassigned to the new worker
4. A Norepinephrine signal is fired to notify monitoring systems
5. The axoplasm from the failed worker is preserved — the new worker picks up where things left off (if the Effector supports idempotent resume) or starts the Neuron over

This reassignment is automatic. No manual intervention is required. The Spike Train's overall execution continues with minimal delay — just the time it takes to detect the failure (via missed heartbeats) and reassign.

### Neurotransmitter Signals

The neurotransmitter system is Are-Self's real-time notification layer. Signals are fired through WebSocket via the Synaptic Cleft and can be consumed by any connected client — the admin interface, monitoring dashboards, external integrations, or other Are-Self components.

The five neurotransmitter types, and when they fire during fleet operations:

**Dopamine** — fired when good things happen. A Spike completes successfully. A Spike Train finishes with SUCCESS status. A NerveTerminal comes back online after being OFFLINE. Dopamine signals are your success indicators.

**Cortisol** — fired when bad things happen. A Spike fails. A Spike Train finishes with FAILED status. A circuit breaker trips. An Effector throws an unhandled exception. Cortisol signals are your error alerts.

**Norepinephrine** — fired for fleet events. A NerveTerminal changes status (ONLINE, OFFLINE, DEGRADED). A Spike is reassigned to a different worker. The fleet composition changes. Norepinephrine is your fleet-awareness channel.

**Acetylcholine** — fired when entities are updated. A Pathway is modified. A Neuron's configuration changes. A NerveTerminal's capabilities are updated. Acetylcholine keeps connected clients aware of structural changes.

**Glutamate** — fired for chat and communication events. When a Spike Train is launched by a user through a chat interface, Glutamate signals carry the conversational context. Less relevant for fleet management, but important for interactive workflows.

### The Synaptic Cleft

All neurotransmitter signals flow through the Synaptic Cleft — a WebSocket layer that handles:

- Channel management (subscribing to specific signal types or specific Spike Trains)
- Authentication (only authorized clients receive signals)
- Buffering (signals fired while a client is disconnected can be replayed on reconnect)
- Routing (a Cortisol signal for Spike Train #47 goes to clients subscribed to that Spike Train)

For fleet monitoring, you typically subscribe to Norepinephrine (fleet events) and Cortisol (errors) on a dashboard, and Dopamine (successes) for summary metrics.

### Putting It All Together

Here is the complete flow when a Spike Train executes across a fleet:

1. A Spike Train is created and transitions to PENDING
2. The PNS checks the distribution mode and selects a NerveTerminal for the first Neuron
3. The Spike is assigned to the worker — a Norepinephrine signal fires (assignment)
4. The worker executes the Effector — Spike status goes to RUNNING
5. The Effector completes — a Dopamine (success) or Cortisol (failure) signal fires
6. The Spike Train evaluates outgoing Axons and queues the next Neuron(s)
7. The PNS selects workers for the next Neuron(s) — possibly different workers
8. Steps 4-7 repeat until all reachable Neurons have been processed
9. The Spike Train transitions to SUCCESS or FAILED — final Dopamine or Cortisol signal fires

At every step, connected clients see real-time updates through the Synaptic Cleft.

## Hands-On Lab: Distributing Work (60 minutes)

### Lab Prerequisites

For this lab, you need at least two Celery workers running against your Are-Self instance. If your training environment has multiple machines, each should be running a worker. If you are on a single machine, start two worker processes with different names.

### Exercise 1: Register and Monitor NerveTerminals (15 minutes)

1. Start your Celery workers and verify they appear as NerveTerminals in the Django admin
2. Open the NerveTerminal list — note the status, last heartbeat, and capabilities of each
3. Stop one worker — watch the heartbeat timestamps go stale
4. After 60 seconds, verify the NerveTerminal transitions to DEGRADED
5. After 90 seconds, verify it transitions to OFFLINE
6. Restart the worker — verify it returns to ONLINE
7. If you have WebSocket access, subscribe to Norepinephrine signals and observe the status-change notifications in real time

### Exercise 2: Distribution Modes (20 minutes)

1. Take your `training-parallel-demo` Pathway from Day 3
2. Set its distribution mode to LOCAL_SERVER — launch a Spike Train and observe all Spikes executing on the same worker
3. Change to ONE_AVAILABLE_AGENT — launch again and observe Spikes distributed across workers
4. Change to ALL_ONLINE_AGENTS — launch again and observe all workers executing all Neurons (note: this creates duplicate work — understand when this is appropriate)
5. Change to SPECIFIC_TARGETS — assign Worker A to one Neuron and Worker B to another. Launch and verify the assignments.

### Exercise 3: Failover Under Load (15 minutes)

1. Create a Pathway called `training-fleet-failover` with five sequential Neurons, each using a slow Effector (2-second sleep)
2. Set distribution mode to ONE_AVAILABLE_AGENT
3. Launch a Spike Train
4. While the Spike Train is RUNNING, kill one of your workers
5. Observe:
   - The NerveTerminal transitions to DEGRADED then OFFLINE
   - Any Spike assigned to the killed worker is reassigned
   - The Spike Train completes successfully despite the worker loss
6. Check the Norepinephrine signals — you should see the status changes and reassignment events

### Exercise 4: Neurotransmitter Dashboard (10 minutes)

1. Open a WebSocket client (or the Are-Self admin's real-time panel if available)
2. Subscribe to all neurotransmitter channels
3. Launch your `training-fleet-failover` Spike Train again
4. Watch the signals arrive in real time:
   - Norepinephrine for worker assignments
   - Dopamine for successful Spike completions
   - Cortisol if any Spikes fail
5. Count the signals — how many were fired for a five-Neuron Pathway?

### Lab Deliverable

Document the distribution mode you would choose for three real workflows in your organization, and why. For each, identify which Neurons (if any) would need a different distribution mode than the Pathway default.

## Key Takeaways

- The PNS connects the Central Nervous System to the fleet via NerveTerminals
- Heartbeat monitoring detects worker failures automatically (30-second cycle, 60s degraded, 90s offline)
- Four distribution modes: LOCAL_SERVER, ALL_ONLINE_AGENTS, ONE_AVAILABLE_AGENT, SPECIFIC_TARGETS
- Worker failures trigger automatic Spike reassignment with no manual intervention
- Neurotransmitters (Dopamine, Cortisol, Norepinephrine, Acetylcholine, Glutamate) provide real-time visibility
- The Synaptic Cleft delivers signals via WebSocket to any connected client
