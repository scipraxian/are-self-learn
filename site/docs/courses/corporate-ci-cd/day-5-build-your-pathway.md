---
title: "Day 5 — Build Your First Pathway"
sidebar_position: 6
---

# Day 5: Build Your First Pathway

Today is Demo day. Everything you have learned this week — Neural Pathways, Spike Trains, branching, error handling, fleet distribution, and neurotransmitter monitoring — comes together in a single project. You will design, build, test, and present a complete Neural Pathway that solves a real problem.

## Morning: Design Session (60 minutes)

### Choose Your Scenario

Select one of the following scenarios, or propose your own (subject to instructor approval):

**Scenario A: Content Review Pipeline**
Design a Pathway that takes a document, runs it through AI analysis for quality and compliance, routes it for human review if flagged, and publishes it if approved. Requirements:

- At least one AI inference Neuron (using the Hypothalamus)
- A conditional branch based on the analysis result
- A failure path for when AI models are unavailable
- Parallel analysis (quality check and compliance check running simultaneously)
- A fan-in Neuron that collects both results before the publish decision

**Scenario B: Incident Response Workflow**
Design a Pathway that receives an alert, classifies its severity, notifies the appropriate team, and tracks resolution. Requirements:

- An alert intake Neuron that parses the incoming payload
- A severity classifier (conditional Effector)
- Different notification paths for different severity levels (fan-out)
- A timeout watchdog — if resolution is not confirmed within a threshold, escalate
- Fleet distribution — notifications should go to specific NerveTerminals

**Scenario C: Data Synchronization Pipeline**
Design a Pathway that pulls data from an external source, validates it, transforms it, and pushes it to a destination. Requirements:

- HTTP Effector for the source pull
- Validation Neuron with success/failure branching
- A retry pattern for transient failures (at least two retry attempts)
- A Transform Neuron that enriches the data using cerebrospinal_fluid configuration
- Error reporting to a monitoring channel via neurotransmitter signals

**Scenario D: Your Own Workflow**
Propose a workflow from your actual work. It must include at least:

- Six Neurons
- At least two different Axon types
- At least one branching point
- At least one error-handling path
- Use of both axoplasm and cerebrospinal_fluid

### Design Phase

For your chosen scenario:

1. **Sketch the DAG on paper first** — draw the Neurons as circles and the Axons as arrows, labeling each with its type (flow, success, failure). This takes five minutes and saves thirty.

2. **Identify the Effectors you need** — consult the Effector registry. List each Neuron and its Effector. Write the configuration JSON for each.

3. **Map the data flow** — what is in the initial axoplasm? What does each Neuron add? Where does cerebrospinal_fluid carry shared configuration?

4. **Plan for failure** — for each Neuron, ask: "What if this fails?" Wire the failure Axons. Decide on retry strategy. Identify where circuit breakers might trip.

5. **Choose the distribution mode** — will this Pathway run locally, or across the fleet? Do any Neurons need specific workers?

6. **Write the design document** — one page. The DAG diagram, the Effector list, the data flow map, and the failure strategy. This is what you will present alongside the live demo.

### Design Review

Pair up with another participant. Walk them through your design. They are looking for:

- Dead ends — Neurons with no outgoing Axons that should have them
- Missing failure paths — Neurons where failure is ignored
- Data gaps — Neurons that read axoplasm keys that no upstream Neuron writes
- Overly complex structure — can any Neurons be combined or eliminated?

Incorporate their feedback. Revise your design.

## Afternoon: Build and Test (45 minutes)

### Build Phase (25 minutes)

1. Open the graph editor and create your Pathway
2. Add each Neuron, configure its Effector, and set its configuration JSON
3. Wire the Axons — pay attention to types
4. Set the distribution mode
5. Populate the cerebrospinal_fluid template
6. Save and review the visual layout — arrange it for clarity

Build tips:

- Start with the happy path. Get the main flow working first.
- Add failure Axons second. Test each one individually.
- Fan-out/fan-in is where visual clarity matters most. Arrange parallel branches vertically.
- Label everything clearly. Your audience during the demo has not read your design document.

### Test Phase (20 minutes)

1. **Happy path test** — launch a Spike Train with valid input. Verify it completes with SUCCESS. Check every Spike's axoplasm to confirm data flowed correctly.

2. **Failure test** — modify the input or the Effector configuration to trigger a failure at each branch point. Verify the failure Axons fire correctly. Check that error context appears in axoplasm.

3. **Edge case test** — what happens with empty axoplasm? What if cerebrospinal_fluid is missing a required key? What if the fleet has only one worker? Test at least one edge case.

4. **Fleet test** (if applicable) — if your Pathway uses fleet distribution, launch a Spike Train with multiple workers running. Verify the Spikes are distributed as expected. Kill a worker mid-execution and verify reassignment.

5. **Signal test** — subscribe to neurotransmitter signals for your Spike Train. Verify Dopamine, Cortisol, and Norepinephrine signals fire at the expected moments.

Document any issues you find and fix them. Your demo should run cleanly.

## Afternoon: Demo (15 minutes per participant)

### Demo Format

Each participant presents to the group. You have fifteen minutes:

- **Minutes 1-3:** Present your design document. Explain the problem, the DAG structure, and the key design decisions.
- **Minutes 3-5:** Walk through the graph editor view. Point out the branching structure, the Effectors, and the Axon types.
- **Minutes 5-10:** Live demo. Launch a Spike Train with the group watching. Narrate what is happening at each step. Show the neurotransmitter signals arriving in real time. Run at least one failure scenario.
- **Minutes 10-13:** Show the Spike Train detail view. Walk through the Spikes, their statuses, and the axoplasm at each step.
- **Minutes 13-15:** Questions from the group and the instructor.

### Evaluation Criteria

Your Pathway will be evaluated on:

| Criterion | What We Are Looking For |
|-----------|------------------------|
| **Correctness** | The Pathway executes as designed. Spikes fire in the right order. Axon routing works. |
| **Error Handling** | Failure paths exist and work. The Pathway does not silently swallow errors. |
| **Data Flow** | Axoplasm and CSF are used appropriately. No missing data at any Neuron. |
| **Clarity** | The graph editor layout is readable. Neurons and Axons are clearly labeled. |
| **Fleet Awareness** | Distribution mode is chosen and justified. Worker failure is accounted for. |
| **Presentation** | The design document is clear. The live demo runs. The participant can answer questions. |

### After the Demo

Congratulations. You have designed, built, tested, and presented a Neural Pathway using Are-Self's Central Nervous System. You understand the full lifecycle: from DAG template to running Spike Train, from happy path to failure recovery, from single server to distributed fleet.

## Course Summary

| Day | What You Learned | Experience Master Phase |
|-----|-----------------|----------------------|
| Day 1 | Neural Pathways, Neurons, Axons, Effectors, the graph editor | Sifting |
| Day 2 | Spike Trains, status lifecycle, axoplasm, cerebrospinal_fluid | Pre-Planning |
| Day 3 | Axon types, conditional routing, retry patterns, circuit breakers | Planning |
| Day 4 | PNS, NerveTerminals, heartbeat, distribution modes, neurotransmitters | Executing |
| Day 5 | Design, build, test, demo a complete Pathway | Demo |

### What Comes Next

- **Advanced Effector Development** — writing custom Effectors and registering them
- **Hypothalamus Deep Dive** — model selection, budget management, and cost optimization (see the [AI Cost Management course](../corporate-ai-cost-management/))
- **Identity and Permissions** — controlling who can launch which Pathways with what budgets
- **Pathway Composition** — Neurons that launch sub-Pathways, creating hierarchical workflows

### The Perseverance Variable

Building workflows is iterative. Your first Pathway will not be your best. The failures you encountered this week — the misconfigured Effectors, the missing failure Axons, the data flow gaps — are not mistakes to be embarrassed about. They are the process. Perseverance is not the absence of failure. It is the decision to keep designing after the Spike Train turns red.
