---
title: "Week 5 — How Brains Talk"
sidebar_position: 7
---

# Week 5: How Brains Talk

Four systems in one week: CNS, PNS, Thalamus, and Synaptic Cleft. This is the communication infrastructure — how 86 billion neurons coordinate across a body, and how distributed software services coordinate across a network. Students study signal transmission (action potentials, neurotransmitters, synaptic plasticity) alongside Are-Self's neural pathways, spike trains, WebSocket events, and worker fleet management. The question this week: is coordination the same as communication?

## Week Overview

**Theme:** Signal transmission and coordination — biological and computational

**Primary Variables:** Inclusion + Perception — who's in the network, and what signals do they receive?

<!-- Definition of Ready — perspective -->

**Why This Week Matters:**
No brain region works alone. No software service works alone. The communication layer is what turns nine separate systems into one coordinated mind. Students who understand how signals propagate — and how signal failures cause system-wide problems — understand something fundamental about networks of all kinds.

<!-- Definition of Ready — assertions -->

**Learning Goals:**
- Describe how neurons transmit signals (action potential, synapse, neurotransmitter release)
- Explain the roles of the CNS, PNS, thalamus, and synaptic cleft in biological communication
- Map each biological communication system to its Are-Self counterpart
- Analyze how signal failure in one region cascades to affect the whole system
- Compare biological signal propagation to computational message passing

<!-- Definition of Ready — outside -->

**What This Week Is Not:**
- This week does NOT cover the full complexity of neurotransmitter chemistry
- Students are NOT expected to understand WebSocket protocols — only the concept of real-time messaging
- This is not a networking course — the biology is the primary subject

---

## Day 1: How Neurons Talk to Each Other

### Objective

Students will describe the mechanism of neural signal transmission: action potential, synapse, neurotransmitter release and reception.

### Materials Needed

- Neural signal diagram (action potential, synapse detail)
- [Week 5 Worksheet A: Signal Transmission](./worksheets/week-5-worksheet-a.md)

### Prerequisites for This Day

- Students have completed Weeks 1–4

### Warm-Up (5 minutes)

"Touch your desk. How long did it take for you to feel it? Less than a hundredth of a second. That signal traveled from your fingertip to your brain and back. How?"

### Main Activity (35 minutes)

#### Part 1: The Action Potential (12 minutes)

Walk through signal transmission: resting potential → stimulus → depolarization → action potential → propagation along the axon. Keep it conceptual — ions flow, voltage changes, the signal moves.

Key point: action potentials are all-or-nothing. A neuron fires or it doesn't. There's no "sort of" signal.

#### Part 2: The Synapse (12 minutes)

When the signal reaches the end of the axon: vesicles release neurotransmitters into the synaptic cleft → they cross the gap → they bind to receptors on the next neuron → the signal continues (or is inhibited).

Ask: "Why a gap? Why not just connect the neurons directly?" (Answer: the gap allows modulation — the signal can be amplified, dampened, or blocked. It's a control point.)

#### Part 3: The Four Communication Systems (11 minutes)

Quick overview connecting to Are-Self:
- **CNS (brain + spinal cord)** → the central command. Software: neural pathways and spike trains.
- **PNS (all nerves outside CNS)** → the distributed fleet. Software: worker management and heartbeat monitoring.
- **Thalamus** → the relay station routing input to the right region. Software: chat interface and session routing.
- **Synaptic Cleft** → the gap where chemical signals cross. Software: real-time WebSocket events.

Students begin [Worksheet A](./worksheets/week-5-worksheet-a.md).

### Reflection / Wrap-Up (5 minutes)

"Your body sends millions of signals per second through this infrastructure. Tomorrow we'll see what the software version looks like — and whether 'signals' in code mean the same thing as signals in neurons."

### Exit Ticket

"A neuron sends a signal by ___. The synaptic cleft exists because ___."

---

## Day 2: How Software Systems Talk to Each Other

### Objective

Students will observe Are-Self's communication infrastructure and compare it to biological signal transmission.

### Materials Needed

- Computer running Are-Self, projected
- [Week 5 Worksheet B: Communication Comparison](./worksheets/week-5-worksheet-b.md)

### Prerequisites for This Day

- Are-Self running with visible spike train or pathway execution

### Warm-Up (5 minutes)

"Yesterday: neurons use electricity and chemicals. Today: software uses messages and events. Same job, different materials. Your job: figure out where the translation works and where it doesn't."

### Main Activity (35 minutes)

#### Part 1: Live Demonstration (15 minutes)

Run a reasoning session and narrate the communication:
- "This is a spike train — data flowing through a neural pathway, neuron to neuron"
- "See the CNS coordinating? It's the execution engine — like your spinal cord routing signals"
- "The thalamus is routing this chat input to the right brain region"
- "These WebSocket events are like neurotransmitters — broadcasting state changes in real time"

Show the neurotransmitter-inspired signals if visible: Dopamine (reward), Cortisol (stress/cost alert).

#### Part 2: The Communication Map (15 minutes)

Students build a four-row comparison on [Worksheet B](./worksheets/week-5-worksheet-b.md):

| System | Biology | Software | Same? | Different? |
|---|---|---|---|---|
| CNS | Brain + spinal cord | Neural pathways + spike trains | | |
| PNS | Peripheral nerves | Worker fleet + heartbeat | | |
| Thalamus | Sensory relay | Chat routing | | |
| Synaptic Cleft | Neurotransmitters | WebSocket events | | |

#### Part 3: Discussion (5 minutes)

"Is a WebSocket event the same thing as a neurotransmitter? They both carry information across a gap. But does the software version have anything like excitatory vs. inhibitory signals?"

### Reflection / Wrap-Up (5 minutes)

"Communication infrastructure is invisible until it breaks. That's true in your body and in software. Tomorrow we break it."

### Exit Ticket

"The strongest communication parallel is ___. The weakest is ___."

---

## Day 3: When Communication Fails

### Objective

Students will investigate what happens when biological and computational communication systems fail, and trace how local failures cascade into system-wide problems.

### Materials Needed

- Case studies: multiple sclerosis, peripheral neuropathy
- [Week 5 Worksheet C: Cascade Failures](./worksheets/week-5-worksheet-c.md)

### Prerequisites for This Day

- Students have completed Days 1–2

### Warm-Up (5 minutes)

"Have you ever had your foot fall asleep? What happened to the signals from your foot to your brain?"

### Main Activity (35 minutes)

#### Part 1: Biological Communication Failure (15 minutes)

Two case studies:
- **Multiple sclerosis** — the myelin sheath (insulation around axons) degrades. Signals slow, scatter, or stop. The neurons are fine. The wiring is damaged.
- **Peripheral neuropathy** — nerves in the PNS are damaged. The brain can't sense or control the extremities. The CNS is fine. The network is shrunk.

Key insight: the failure isn't in the processing — it's in the communication. The brain regions still work. They just can't hear each other.

#### Part 2: Computational Communication Failure (10 minutes)

What happens in Are-Self when:
- A worker goes offline (PNS failure)
- WebSocket disconnects (synaptic cleft failure)
- The thalamus routes to the wrong region (relay failure)

Discuss: "The software version of MS would be degraded connections between services. The system doesn't crash — it gets confused. Same pattern?"

#### Part 3: Cascade Analysis (10 minutes)

Using [Worksheet C](./worksheets/week-5-worksheet-c.md), students trace a single communication failure through the system: what breaks first, what breaks next, what's the system-wide effect?

### Reflection / Wrap-Up (5 minutes)

"When communication fails, it doesn't matter how smart the individual parts are. A brilliant frontal lobe that can't hear the hippocampus is just as lost as a powerful reasoning engine that can't reach its memory store."

### Exit Ticket

"A communication failure is different from a processing failure because ___."

---

## Day 4: Network Experiments

### Objective

Students will design and run experiments testing Are-Self's communication behavior — how information flows between regions and what happens when flow is disrupted.

### Materials Needed

- Computer access
- [Week 5 Worksheet D: Network Experiment](./worksheets/week-5-worksheet-d.md)

### Prerequisites for This Day

- Students have completed Days 1–3

### Warm-Up (3 minutes)

"Can you make the software miscommunicate? Can you find a prompt that reveals the seams between its brain regions? Try."

### Main Activity (40 minutes)

Students design and run experiments testing:
- Does information from one reasoning session reach another? (Memory isolation)
- What happens when a prompt requires coordination between multiple regions?
- Can you find evidence of the routing layer (thalamus) making choices?

Record on [Worksheet D](./worksheets/week-5-worksheet-d.md).

### Reflection / Wrap-Up (5 minutes)

Quick share: "Who found a seam? What did it reveal?"

### Exit Ticket

"The communication behavior that surprised me most was ___."

---

## Day 5: Presentations and the Network Question

### Objective

Students will present network experiment findings and discuss: is a network of specialized parts the same thing as a unified mind?

### Materials Needed

- [Week 5 Worksheet E: Analysis](./worksheets/week-5-worksheet-e.md)

### Prerequisites for This Day

- Day 4 experiments completed

### Warm-Up (2 minutes)

"Last experiment presentations before the capstone."

### Main Activity (38 minutes)

#### Part 1: Analysis (8 minutes)

Complete [Worksheet E](./worksheets/week-5-worksheet-e.md).

#### Part 2: Presentations (15 minutes)

2 minutes each.

#### Part 3: The Binding Problem (15 minutes)

Class discussion: "Your brain has 86 billion neurons in specialized regions. Are-Self has nine Django apps. Both coordinate through messaging systems. But your brain produces a unified conscious experience — you don't perceive your hippocampus and frontal lobe as separate things. Are-Self doesn't have that. Is that the gap that matters most?"

This is the deepest question of the course. Don't resolve it. Surface it. Name it: the **binding problem** — how does a brain produce unified experience from distributed processing?

### Reflection / Wrap-Up (5 minutes)

"Next week is the capstone. You've tested memory, reasoning, homeostasis, and communication. You've found where the metaphor holds and where it breaks. Now you put it all together and tell us: what can real brains do that software cannot?"

---

## Looking Ahead

"Week 6. The capstone. Where the metaphor breaks. You choose the gap, you defend the hypothesis, you present to the class. Everything you've learned leads here."

---

<!-- Retrospective -->

## Week 5 Reflection for Teachers

*Fill this in after you teach the week. Then share it with a colleague — ask them what worked in their classroom. You'll both be better for it.*

### What Worked Well

-

### What Didn't Work

-

### What to Change Next Time

-

### Common Questions & Troubleshooting

**Q: The binding problem is too abstract for my students.**
A: Make it concrete: "Close your eyes. Imagine a red apple. You're combining color (occipital lobe), shape (parietal lobe), taste memory (hippocampus), and the word 'apple' (temporal lobe) into one experience. How?" That's the binding problem.

**Q: I can't demonstrate communication failures in Are-Self.**
A: Use thought experiments: "What would happen if..." The concept transfers even without live demonstration.

### Assets to Prepare Before This Week Starts

- Neural signal diagrams
- MS and neuropathy case study summaries
- Are-Self running (ideally with visible spike trains or pathway execution)
- Copies of Worksheets A through E

<!-- Definition of Ready — demo_specifics -->

### Demo

**Who sees the work:** Classmates (Day 5 presentations + binding problem discussion)

**What students show:** Network experiment results + position on the binding problem

**How long:** 2 minutes per pair + 15 minutes discussion

---

## Summary

Week 5 is about infrastructure — the unsexy, essential layer that makes everything else possible. Students learn that brains and software both solve the coordination problem through specialized messaging systems. Both fail in the same pattern: local communication failures cascade into system-wide dysfunction. The week ends with the binding problem — the deepest question in neuroscience and the clearest gap in the metaphor.
