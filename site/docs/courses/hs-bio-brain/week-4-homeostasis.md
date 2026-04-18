---
title: "Week 4 — How Brains Survive"
sidebar_position: 6
---

# Week 4: How Brains Survive

The Hypothalamus — tiny, ancient, non-negotiable. Students study how this region maintains homeostasis: temperature, hunger, thirst, hormonal balance, circadian rhythms. Then they open the Are-Self hypothalamus app and see a radically different interpretation of the same idea: model selection, cost management, circuit breakers, and failover. The parallel is surprisingly deep — both are about keeping a complex system alive within resource constraints.

## Week Overview

**Theme:** Homeostasis — biological survival vs. computational cost management

**Primary Variables:** Fear + Perseverance — resource scarcity is real, and the system has to keep going anyway.

<!-- Definition of Ready — perspective -->

**Why This Week Matters:**
Every student in this room will, at some point, make decisions about technology costs — personally or professionally. The Hypothalamus is the region that teaches them to think about resources as a design constraint, not an afterthought. In biology, running out of resources means death. In software, it means an OpenAI bill that shuts down the project. The parallel is real.

<!-- Definition of Ready — assertions -->

**Learning Goals:**
- Describe the hypothalamus's role in maintaining homeostasis (temperature, hunger, thirst, circadian rhythm)
- Explain feedback loops as a biological control mechanism
- Compare biological homeostasis to Are-Self's cost management and model selection system
- Analyze how resource constraints shape both biological and computational behavior
- Design an experiment testing how Are-Self's hypothalamus responds to resource pressure

<!-- Definition of Ready — outside -->

**What This Week Is Not:**
- This week does NOT cover the endocrine system in full — only hypothalamic regulation
- Students are NOT expected to understand LLM pricing models — only the concept that different models cost different amounts
- This is not an economics lesson, though the parallels will be obvious

---

## Day 1: The Body's Thermostat

### Objective

Students will describe how the hypothalamus maintains homeostasis through negative feedback loops, using temperature regulation as the primary example.

### Materials Needed

- Thermometers (one per pair, if available)
- [Week 4 Worksheet A: Feedback Loops](./worksheets/week-4-worksheet-a.md)

### Prerequisites for This Day

- Students have completed Weeks 1–3

### Warm-Up (5 minutes)

"Everyone stand up. Jog in place for 30 seconds." After they stop: "What's happening to your body right now? Who's sweating? Who feels warm? Something in your brain just noticed you were overheating and started cooling you down. What region do you think did that?"

### Main Activity (35 minutes)

#### Part 1: The Hypothalamus — Biology's Resource Manager (15 minutes)

Teach the core functions: temperature regulation, hunger/satiety, thirst, circadian rhythm, hormonal signaling. Emphasize:
- The hypothalamus is tiny — about the size of an almond
- It's ancient — present in nearly all vertebrates
- It doesn't think. It reacts. It measures and adjusts.
- It uses **negative feedback loops**: detect deviation → trigger correction → return to set point

Walk through temperature regulation in detail: sensors detect temperature change → hypothalamus receives signal → triggers sweating (or shivering) → temperature returns to 98.6°F → response stops.

#### Part 2: Feedback Loops as a Pattern (10 minutes)

Draw the generic feedback loop on the board: **Sensor → Controller → Effector → Result → back to Sensor.**

Show that this same pattern applies to hunger (blood sugar drops → hypothalamus signals hunger → you eat → blood sugar rises → hunger signal stops) and thirst and circadian rhythm.

Ask: "What happens when the feedback loop breaks?" (Fever, diabetes, insomnia — real consequences of hypothalamic dysfunction.)

#### Part 3: Worksheet (10 minutes)

Students complete [Worksheet A](./worksheets/week-4-worksheet-a.md) — diagram a feedback loop for temperature and one other homeostatic function.

### Reflection / Wrap-Up (5 minutes)

"The hypothalamus keeps you alive by managing resources your body needs — heat, energy, water, sleep. Tomorrow: what does resource management look like when the body is software and the resource is money?"

### Exit Ticket

"A negative feedback loop works by ___. If the loop breaks, the result is ___."

---

## Day 2: The Software Thermostat

### Objective

Students will explore Are-Self's hypothalamus app and compare computational resource management (model selection, cost budgets, circuit breakers) to biological homeostasis.

### Materials Needed

- Computer running Are-Self, projected
- [Week 4 Worksheet B: Cost as Homeostasis](./worksheets/week-4-worksheet-b.md)

### Prerequisites for This Day

- Are-Self running with hypothalamus configuration visible

### Warm-Up (5 minutes)

"Your hypothalamus manages heat, food, and sleep. What resources does a software system need to manage?" Let them speculate. (Answers: processing power, memory, time, and — critically — money.)

### Main Activity (35 minutes)

#### Part 1: Inside the Hypothalamus App (15 minutes)

Navigate through Are-Self's hypothalamus:
- **Model selection** — the system picks which AI model to use for each task. Bigger models cost more. The hypothalamus picks the smallest model that can do the job.
- **Cost budgeting** — every reasoning session has a focus budget. When the budget runs low, the system switches to cheaper strategies.
- **Circuit breakers** — if a model fails, the system doesn't crash. It falls back to another model, then another, then another.

Draw the parallel explicitly: **Sensor** (cost tracking) → **Controller** (hypothalamus app) → **Effector** (model selection) → **Result** (task completed within budget) → back to **Sensor**.

Ask: "Is this a feedback loop? Is it the same kind of feedback loop as temperature regulation?"

#### Part 2: The Parallel Map (15 minutes)

Build a class table:

| Biological Homeostasis | Computational Homeostasis |
|---|---|
| Set point: 98.6°F | Set point: cost budget per session |
| Sensor: temperature receptors | Sensor: token/cost counters |
| Effector: sweat glands, shivering | Effector: model selection, fallback |
| Failure mode: fever, hypothermia | Failure mode: overspending, timeout |
| Circuit breaker: fainting (extreme) | Circuit breaker: failover chain |

Students copy and extend the table on [Worksheet B](./worksheets/week-4-worksheet-b.md).

#### Part 3: Discussion (5 minutes)

"The biological hypothalamus evolved over hundreds of millions of years to keep organisms alive with limited resources. The software hypothalamus was designed in 2025 to keep AI affordable. Are they solving the same problem?"

### Reflection / Wrap-Up (5 minutes)

"Resource management isn't glamorous. Nobody writes sci-fi about the hypothalamus. But without it, nothing else works. That's true in biology, and it turns out it's true in software."

### Exit Ticket

"The strongest parallel between biological and software homeostasis is ___. The weakest is ___."

---

## Day 3: When Resources Run Out

### Objective

Students will investigate what happens when homeostatic systems fail — biologically (disease states) and computationally (cost overruns, model failures) — and connect failure modes to system design.

### Materials Needed

- Case studies: diabetes (Type 1), hypothermia, and a real-world AI cost blowup story
- [Week 4 Worksheet C: Failure Modes](./worksheets/week-4-worksheet-c.md)

### Prerequisites for This Day

- Students have completed Days 1–2

### Warm-Up (5 minutes)

"What happens when your thermostat at home breaks in the middle of winter? What happens when a company's AI budget runs out in the middle of a project?"

### Main Activity (35 minutes)

#### Part 1: Biological Failure (15 minutes)

Walk through two failure modes:
- **Diabetes (Type 1)** — the feedback loop for blood sugar breaks because the pancreas (responding to hypothalamic signals) can't produce insulin. The set point exists but the effector is gone.
- **Hypothermia** — the body can't generate enough heat to match the environment. The feedback loop is intact but the resources aren't sufficient.

Key question: "Is the loop broken, or are the resources insufficient? Those are different problems with different solutions."

#### Part 2: Computational Failure (10 minutes)

Show (or describe) a real scenario: a company deploys an AI system, costs spiral because every request uses the most expensive model, there's no fallback strategy, and the project gets shut down. This is hypothalamic failure in software — no resource management.

Connect to Are-Self's design: "This is exactly why the hypothalamus app exists. It's not exciting, but it's the difference between a system that survives and one that doesn't."

#### Part 3: Worksheet (10 minutes)

Students complete [Worksheet C](./worksheets/week-4-worksheet-c.md) — analyze failure modes in both systems and identify the root cause (broken loop vs. insufficient resources).

### Reflection / Wrap-Up (5 minutes)

"The hypothalamus doesn't prevent all problems. It prevents the *preventable* ones. Good design — biological or computational — is about knowing which failures you can control and which you can't."

### Exit Ticket

"The difference between a broken feedback loop and insufficient resources is ___. This matters because ___."

---

## Day 4: The Homeostasis Experiment — Design and Run

### Objective

Students will design and execute an experiment testing how Are-Self's hypothalamus responds to resource pressure (e.g., restricted model access, reduced focus budget).

### Materials Needed

- Computer access
- [Week 4 Worksheet D: Homeostasis Experiment](./worksheets/week-4-worksheet-d.md)

### Prerequisites for This Day

- Students have completed Days 1–3
- Teacher has prepared Are-Self with adjustable hypothalamus settings (or can demonstrate the effects)

### Warm-Up (3 minutes)

"Today you stress-test the software's survival system. What happens when you take resources away?"

### Main Activity (40 minutes)

#### Part 1: Design (10 minutes)

Quick experiment design: What will you restrict? What will you measure? What do you predict?

#### Part 2: Run (20 minutes)

Students (or teacher, depending on setup) adjust hypothalamus settings and run tasks under different resource constraints. Record: which model was selected, response quality, time taken, whether circuit breakers fired.

#### Part 3: Record (10 minutes)

Complete [Worksheet D](./worksheets/week-4-worksheet-d.md) with data and initial observations.

### Reflection / Wrap-Up (5 minutes)

"Did the system degrade gracefully, or did it fall apart? That's the question every engineer asks about every system — and every biologist asks about every organism."

### Exit Ticket

"Under resource pressure, Are-Self ___. My body under resource pressure (e.g., skipping lunch) ___. The difference is ___."

---

## Day 5: Analysis, Presentation, and the Cost Question

### Objective

Students will analyze their homeostasis experiment, present findings, and engage with the real-world question: who decides what resources an AI system gets?

### Materials Needed

- Completed data from Day 4
- [Week 4 Worksheet E: Analysis and the Big Question](./worksheets/week-4-worksheet-e.md)

### Prerequisites for This Day

- Day 4 experiments completed

### Warm-Up (3 minutes)

"Data in hand. Let's make sense of it."

### Main Activity (37 minutes)

#### Part 1: Analysis (10 minutes)

Students complete analysis on [Worksheet E](./worksheets/week-4-worksheet-e.md).

#### Part 2: Presentations (15 minutes)

2 minutes per pair: constraint, prediction, result, one insight about homeostasis.

#### Part 3: The Big Question (12 minutes)

Class discussion: "Your hypothalamus didn't choose its resource constraints — evolution did. Are-Self's hypothalamus didn't choose its constraints either — the person who configured it did. Who should decide what resources an AI gets? The company? The user? The government? The AI itself?"

This is where Fear, Responsibility, and Perseverance come alive. Don't resolve it. Let it sit.

### Reflection / Wrap-Up (5 minutes)

"Homeostasis is about surviving within limits. Every system has limits. The interesting question is who sets them and why."

---

## Looking Ahead

"Next week: communication. How do 86 billion neurons coordinate? How do distributed software systems talk to each other? The CNS, PNS, Thalamus, and Synaptic Cleft — the messaging infrastructure of brains and machines."

---

<!-- Retrospective -->

## Week 4 Reflection for Teachers

*Fill this in after you teach the week. Then share it with a colleague — ask them what worked in their classroom. You'll both be better for it.*

### What Worked Well

-

### What Didn't Work

-

### What to Change Next Time

-

### Common Questions & Troubleshooting

**Q: Students don't see why cost management matters.**
A: Ask them: "How much does your phone plan cost? What happens when you hit the data cap?" Resource constraints are personal. Make it personal.

**Q: I don't have access to adjust Are-Self's hypothalamus settings.**
A: Run the experiment as a demonstration. Describe different configurations and show the results. The concepts transfer even without hands-on access.

### Assets to Prepare Before This Week Starts

- Thermometers (if available)
- Diabetes and hypothermia case study summaries
- Real-world AI cost overrun example
- Are-Self with adjustable hypothalamus settings (or prepared demonstration)
- Copies of Worksheets A through E

<!-- Definition of Ready — demo_specifics -->

### Demo

**Who sees the work:** Classmates (Day 5 presentations + class discussion)

**What students show:** Homeostasis experiment results + position on "who decides?"

**How long:** 2 minutes per pair + 12 minutes class discussion

---

## Summary

Week 4 teaches students that survival — biological or computational — depends on resource management. The hypothalamus is evolution's answer to scarcity. Are-Self's hypothalamus app is a software engineer's answer to the same problem. Both use feedback loops. Both fail when resources are insufficient or when the loop breaks. The week ends with a question that has no clean answer: who decides what resources an AI system gets? That's Fear and Responsibility and Perseverance all at once.
