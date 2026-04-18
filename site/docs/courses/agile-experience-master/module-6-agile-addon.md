---
title: "Module 6 — The Agile Addon"
sidebar_position: 7
---

# Module 6: The Agile Addon

## How Are-Self Runs Experience Master as Software

Everything in Modules 1-5 describes how human teams operate under Experience Master. This module shows how Are-Self encodes that operating system in code. The `agile_addon.py` file does not just describe agile — it implements it. Are-Self's AI agents literally run Experience Master ceremonies as automated processes.

This module assumes familiarity with Python and Django.

## The Addon Registry

Are-Self uses an addon system to extend Identity capabilities. An Identity (a user or agent) can have addons attached to its IdentityDisc — modular components that add behavior, data, and capabilities.

The agile addon is one such component. When an Identity has the agile addon enabled, that Identity participates in the Experience Master operating system. The addon provides:

- **Shift management** — tracking which phase of the Iteration the Identity is currently in
- **Role assignment** — PM or Worker
- **Iteration tracking** — which Iteration is current, what work is committed, what is complete
- **Ceremony execution** — automated or semi-automated execution of Experience Master ceremonies

The addon registry is the mechanism by which addons are discovered and loaded. When an Identity's IdentityDisc includes the agile addon, the system loads the addon's code and data, making the agile functionality available to that Identity.

## Shifts

The most concrete expression of Experience Master in code is the shift system. A shift represents the current phase of the Iteration cycle. The agile addon defines six shifts:

### Sifting

The Identity is in Sifting mode. It is examining backlog items, evaluating their readiness, and preparing them for the next Iteration. In an AI context, this means the agent is reviewing pending tasks, assessing their DoR completeness, and flagging items that need clarification.

### Pre-Planning

The Identity is in Pre-Planning mode. It is selecting which Ready items to propose for the upcoming Iteration, estimating capacity, and sequencing work. An AI agent in Pre-Planning mode evaluates the team's velocity history, identifies dependencies between items, and produces a proposed Iteration plan.

### Planning

The Identity is in Planning mode. It is finalizing the Iteration commitment. In a human team, this is the Planning meeting. In an AI-driven context, Planning is the phase where the proposed plan is confirmed, Workers are assigned to items, and the Iteration clock starts.

### Executing

The Identity is in Executing mode. This is the main working phase. The agent is actively completing work — processing tasks, running Neural Pathways, generating outputs, and reporting progress. Most of the Iteration is spent in the Executing shift.

### Post-Execution

The Identity is in Post-Execution mode. Work is complete (or the Iteration deadline has arrived). The agent is evaluating results — checking assertions against deliverables, conducting QA verification, and preparing for the Demo.

### Sleeping

The Identity is in Sleeping mode. The Iteration is between cycles. The agent is idle with respect to Iteration work. This is the gap between the Retrospective and the next Sifting phase.

### Shift Transitions

Shifts transition according to the Iteration calendar and the state of the work:

```
Sleeping → Sifting → Pre-Planning → Planning → Executing → Post-Execution → Sleeping
```

The transitions can be:

- **Time-driven** — the shift changes automatically based on the Iteration calendar (e.g., Planning starts on Monday of Week 1)
- **Event-driven** — the shift changes in response to an event (e.g., all committed work is complete, triggering a transition from Executing to Post-Execution)
- **Manual** — a PM or administrator forces a shift transition

The current shift affects the Identity's behavior. An agent in Executing mode processes work. The same agent in Sifting mode evaluates backlog items. The shift is not just a label — it determines what the agent does.

## The PM and Worker Roles in Code

The agile addon assigns one of two roles to each Identity:

**PM role** — the Identity has access to backlog management, Planning facilitation, block tracking, and ceremony coordination. A PM-role Identity can create and modify DoR fields, assign work to Workers, and run Retrospective analysis.

**Worker role** — the Identity has access to task execution, assertion verification, and Demo presentation. A Worker-role Identity can pick up assigned work, report completion, and raise blocks.

The role determines which operations are available, not which data is visible. Both roles can see the Iteration plan. Only the PM can modify it.

## How Ceremonies Run as Software

Each Experience Master ceremony has a corresponding process in the agile addon:

### Sifting as Process

The Sifting process iterates over backlog items and evaluates DoR completeness. For each item, it checks:

- Does the perspective field exist and contain a valid who and why?
- Are there at least one assertion in Given/When/Then format?
- Is the outside field populated?
- Are dependencies identified and are they satisfiable?
- Are demo specifics described?

Items that pass all checks are marked Ready. Items that fail are flagged with the specific missing fields.

### Planning as Process

The Planning process selects from Ready items based on:

- Team velocity (items completed in previous Iterations)
- Worker availability (factoring in known absences or capacity constraints)
- Dependency ordering (items that depend on other items are sequenced after their dependencies)
- Priority (PM-assigned priority scores)

The output is a proposed Iteration plan: an ordered list of items with Worker assignments.

### Demo as Process

The Demo process evaluates completed work against its assertions. For each completed item:

- Each assertion is evaluated (automatically if the assertion is testable by code, or flagged for manual verification)
- QA sign-off is recorded
- The item is marked Done or Not Done

### Retrospective as Process

The Retrospective process analyzes Iteration data to identify patterns:

- Items completed vs. items committed (commitment reliability)
- Blocks encountered and time to resolution
- Shift transition timing (did the team spend too long in any phase?)
- Velocity trend over recent Iterations

The output is a structured retrospective report that the PM reviews and acts on.

## Integration with the Central Nervous System

The agile addon integrates with the Central Nervous System (the workflow engine) in a specific way: the shifts can be used as conditions in Neural Pathways.

A Neuron's Effector can check the executing Identity's current shift and branch accordingly. For example:

- A Pathway that should only execute during the Executing shift can have a conditional Neuron at the start that checks the shift and routes to an "abort" node if the Identity is not in Executing mode
- A Pathway designed for Sifting can only fire when the Identity is in Sifting mode

This creates a system where the Iteration calendar directly controls which workflows are available. The operating system literally runs the ceremonies.

## The Iteration as a Software Object

An Iteration in the agile addon is a Django model with:

- **Start and end dates** — defining the two-week window
- **Committed items** — the work the team committed to during Planning
- **Completed items** — the work that met the DoD
- **Velocity** — the count of completed items
- **Retrospective notes** — the three questions' answers and the commitments
- **Status** — Active, Completed, or Cancelled

Iterations link to each other chronologically. The system maintains a history of Iterations, enabling velocity trending, commitment reliability analysis, and long-term process improvement tracking.

## Think About It

- The agile addon gives AI agents shifts — phases that determine what the agent does. How is this different from (or similar to) a human Worker's mental state during different parts of the Iteration?

- Ceremonies running as software means the process is enforced, not just encouraged. What is gained by this enforcement? What is lost?

- The Retrospective is implemented as a data analysis process. Can a software-driven retrospective capture the same insights as a human conversation? What would it miss?

- The PM role in code has different permissions than the Worker role. How does this reflect (or differ from) the PM/Worker boundary described in Module 5?
