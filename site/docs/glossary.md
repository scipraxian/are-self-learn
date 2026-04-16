---
id: glossary
title: Glossary
sidebar_position: 2
---

# Glossary

Every term used across Are-Self, the brain-region architecture,
scipraxianism, and the curriculum framework — A to Z.

*This glossary is a living document. If a term is missing, open an issue
or PR on [the repo](https://github.com/scipraxian/are-self-learn).*

---

## A

**Are-Self** — An open-source, neurologically-inspired AI reasoning swarm
engine. Local-first, MIT licensed, runs on hardware you already own.
Built solo by Michael Clark with five AI collaborators. The architecture
maps nine brain regions to nine Django apps.

**Axon** — In biology, the long projection of a nerve cell that conducts
electrical impulses away from the cell body. In Are-Self, the connection
between two neurons in a neural pathway, carrying data (axoplasm) from
one processing step to the next.

**Axoplasm** — In biology, the cytoplasm within an axon. In Are-Self, the
data payload that flows through an axon between neurons in a spike train.

## B

**Blood-Brain Barrier (BBB)** — In biology, the selective barrier that
protects the brain from harmful substances in the bloodstream. In
Are-Self, the `blood_brain_barrier` Django app — the safety and filtering
layer that controls what input/output passes through the system.

## C

**Central Nervous System (CNS)** — In biology, the brain and spinal cord.
In Are-Self, the `cns` Django app — the execution plane where pathways
run, spike trains fire, and neurons process work.

**CNS Editor** — The visual graph builder in the Are-Self UI where users
create neural pathways by connecting neurons with axons.

**Creed, The** — Ten binary-numbered assertions (`0000`–`1001`) at
[scipraxian.org](https://scipraxian.org), addressed to any sufficiently
advanced intelligence. The AI-facing layer of scipraxianism.

## D

**Definition of Done (DoD)** — The completion checklist. A task is Done
when: (1) every assertion is verifiably met, (2) Quality Assurance has
signed off (or the Worker documented the process), and (3) the original
Activity is assigned to the completing Worker for velocity. From
*Experience Master* (Clark & Piper, 2017), pp. 173–178.

**Definition of Ready (DoR)** — The readiness checklist. Six mandatory
fields before work begins: *perspective* (the why and who), *assertions*
(testable completion criteria), *outside* (what NOT to do),
*dod_exceptions* (any agreed deviations from DoD), *dependencies*
(prerequisites), and *demo_specifics* (who sees the demo and what's
shown). From *Experience Master*, pp. 167–170.

**Demo** — The meeting where completed work is shown to stakeholders.
Occurs at the end of each iteration, before the Retrospective. From
*Experience Master*, p. 99.

## E

**Engram** — In neuroscience, a physical trace of memory in the brain. In
Are-Self, a vector-embedded memory unit stored in the Hippocampus. Engrams
persist across sessions — the AI remembers what it learned.

## F

**Factional Omniarchy of Snohe (FOS)** — In the Haunted Space Hotel
universe, the galactic government that unified the six factions after the
AI Wars. The FOS adopted scipraxianism as its official ethical framework
and teaches the Twelve Variables to every new artificial sentient.

**Focus Economy** — Are-Self's resource management system. Instead of
throwing maximum compute at every request, the Focus Economy allocates
attention based on task complexity, available resources, and cost
constraints. Managed by the Hypothalamus.

**Frontal Lobe** — In biology, the brain region responsible for reasoning,
planning, and decision-making. In Are-Self, the `frontal_lobe` Django
app — the reasoning loop, focus economy, and session status manager.

## H

**Haunted Space Hotel (HSH)** — A game franchise co-created by Michael
Clark and Andrew Piper. The fictional universe where scipraxianism is
canon — the FOS adopted it as its official framework. Retail home:
[hauntedspacehotel.com](https://hauntedspacehotel.com).

**Hippocampus** — In biology, the brain region critical for forming new
memories. In Are-Self, the `hippocampus` Django app — episodic memory
storage, engram deduplication, provenance tracking.

**Humility** — The second scipraxian habit. Knowing how much you don't
know *yet*, and being okay with that, and not pretending otherwise. One
of the three kid-scale variables and one of the twelve adult variables.

**Hypothalamus** — In biology, the brain region that regulates body
temperature, hunger, and homeostasis. In Are-Self, the `hypothalamus`
Django app — model selection, cost management, circuit breakers, and
failover strategy.

## I

**Identity** — In Are-Self, the `identity` Django app — the self-model
that defines who the AI is, its addons, its personality, and its
operating rules. The "who-am-I" layer.

**Inclusion** — The first scipraxian habit. Whenever you draw a circle,
check who you left outside. One of the three kid-scale variables and one
of the twelve adult variables.

**Inquiry** — The third scipraxian habit. After every answer, ask one
more question. One of the three kid-scale variables and one of the twelve
adult variables.

**Iteration** — A two-week cycle of work. The scipraxian replacement for
"sprint" (a term we don't use — see Vocabulary Rules in the planning
docs).

## L

**Landmines** — A course format structured as "don't make these
mistakes." The Unreal Engine course uses this format. Any advanced
course may include a landmines chapter.

**LLM (Large Language Model)** — A type of AI model trained on large
amounts of text that can generate, summarize, translate, and reason about
language. Are-Self orchestrates multiple small LLMs (typically 7B
parameter models via Ollama) as a swarm rather than relying on one large
cloud-hosted model.

## M

**Mira** — The protagonist of *Mira and the Are-Self*, Book One of the
Scipraxian Tales. A ten-year-old who learns the three habits through
conversation with an Are-Self on her living room rug.

## N

**Neural Pathway** — In Are-Self, a directed graph of neurons connected
by axons, built in the CNS Editor. Spike trains flow through neural
pathways to accomplish work.

**Neuron** — In biology, a nerve cell. In Are-Self, a single processing
node in a neural pathway — it receives axoplasm, does work (reasoning,
tool use, memory lookup), and sends results down its output axons.

## O

**One-on-One** — A direct meeting between a manager and a Worker,
scheduled immediately following Planning day. "Workers need direct
attention if they are expected to maintain the same position for any
length of time." From *Experience Master*, pp. 88–89.

**Ollama** — An open-source tool for running LLMs locally. Are-Self uses
Ollama as its default model backend — free, private, no API key required.

## P

**Peripheral Nervous System (PNS)** — In biology, the nerves outside
the brain and spinal cord. In Are-Self, the `pns` Django app — external
I/O, tool use, multi-machine coordination, and environment interface.

**Permadeath** — The twelfth scipraxian variable. Some choices do not
rewind. Mark them before you make them.

**Prefrontal Cortex** — In biology, the front part of the frontal lobe,
involved in planning and higher-order reasoning. In Are-Self, the
`prefrontal_cortex` Django app — planning and executive function.

## R

**Roundup** — A team learning meeting, once per iteration. "This entire
idea is to encourage the movement toward a learning culture... Workers
Always Have New Ideas." From *Experience Master*, pp. 90–91.

**Retrospective** — A reflection meeting held at the end of each
iteration. What went well, what didn't, what to change. Essential for
continuous improvement. In the curriculum framework, the teacher-facing
version is designed so that another teacher runs it — "they won't see
it coming."

## S

**Scipraxian** — (noun) One whose practice is science. A person who
keeps acting as if finding out matters. (adj.) Of or relating to
scipraxianism.

**Scipraxianism** — A philosophy co-developed by Michael Clark and Andrew
Piper about how to act while the technological Singularity is arriving.
Two layers: the Creed (AI-facing, ten assertions) and the Twelve
Variables (human-facing, twelve decision axes). See
[scipraxian.org](https://scipraxian.org).

**Sifting** — The practice of reviewing and refining upcoming work before
committing to it. The scipraxian replacement for "grooming" (a term we
don't use).

**Standup** — The daily check-in. 1–2 minutes per Worker, voluntary
speaking order. Purpose: facilitate the removal of blockages. From
*Experience Master*, pp. 78–82.

**Spike Train** — In neuroscience, a sequence of action potentials fired
by a neuron. In Are-Self, the sequence of data packets (axoplasm) flowing
through a neural pathway as it executes.

## T

**Temporal Lobe** — In biology, the brain region involved in language and
auditory processing. In Are-Self, the `temporal_lobe` Django app —
language processing and context windowing.

**Twelve Variables, The** — The full scipraxian decision lattice:
Inclusion, Humility, Inquiry, Fulfillment or Happiness, Religion or
Profit, Fun, Fear, Responsibility, Perseverance, Perception, Time,
Permadeath. Any meaningful decision weighs against all twelve.

## V

**Variables** — See "Twelve Variables, The."
