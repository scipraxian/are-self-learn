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

**Activity** — In the agile / Experience Master vocabulary, the unit of
work. Activities have a Definition of Ready before they begin and a
Definition of Done before they close. The replacement for "task" or
"ticket" — Activities carry a fuller schema. From *Experience Master*
(Clark & Piper, 2017).

**Are-Self** — An open-source, neurologically-inspired AI reasoning swarm
engine. Local-first, MIT licensed, runs on hardware you already own.
Built solo by Michael Clark with five AI collaborators. The architecture
maps the brain's region structure to a set of Django apps.

**Axon** — In biology, the long projection of a nerve cell that conducts
electrical impulses away from the cell body. In Are-Self, the connection
between two neurons in a neural pathway, carrying data (axoplasm) from
one processing step to the next.

**Axoplasm** — In biology, the cytoplasm within an axon. In Are-Self, the
data payload that flows through an axon between neurons in a spike train.

## B

**Blood-Brain Barrier (BBB)** — In biology, the selective barrier that
protects the brain from harmful substances in the bloodstream. In
Are-Self, the **root dashboard** at `/` — the entry point and
system-overview surface, filtering down what's worth seeing first
(active identities, available models, recent sessions, latest spikes)
out of everything happening across the brain regions.

**Bundle** — Are-Self's word for an installable extension package. A
single `.zip` archive at `neuroplasticity/genomes/<slug>.zip` containing
a manifest, data rows, code, and a README. Synonym for **NeuralModifier**.
Installed and managed through the **Modifier Garden** UI.

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

**Effector** — In Are-Self, a callable unit of work bound to a neuron —
what a neuron actually runs when it fires. Bundles register their own
Effectors through the **Modifier Garden**; core ships a baseline catalog.

**Engram** — In neuroscience, a physical trace of memory in the brain. In
Are-Self, a vector-embedded memory unit stored in the Hippocampus. Engrams
persist across sessions — the AI remembers what it learned.

**Environments** — In Are-Self, the `environments` Django app — the
configuration surface for the sandboxes, file watchers, and runtime
contexts that pathways execute against. Provides the "where" that
complements the Effector "what."

**Executable** — In Are-Self, a configured **Effector** with its
arguments, inputs, and supplementary files bound. The "ready-to-run" form
of a piece of work. Bundles can ship Executable fixtures; the CNS Editor
lets you configure new ones.

**Experience Master** — The 2017 book by Andrew Piper and Michael Clark
and the corresponding Are-Self addon. A reformulation of agile that
replaces the project-management-as-violence vocabulary (sprint, grooming,
scrum) with practice-of-mastery vocabulary (iteration, sifting, roundup).
The Agile / Experience Master course in this curriculum teaches it.

## F

**Facilitator** — The role-locked term for the person guiding any
Are-Self course. Never "teacher." Facilitators run rubrics as coaching
aids, not grade sheets. See also **Learner**.

**Factional Omniarchy of Snohe (FOS)** — In the Haunted Space Hotel
universe, the galactic government that unified the six factions after the
AI Wars. The FOS adopted scipraxianism as its official ethical framework
and teaches the Twelve Variables to every new artificial sentient.

**Fear** — One of the twelve scipraxian variables. Names what's at risk
and refuses to ignore it. Acted on, fear becomes information; suppressed,
it becomes a blind spot.

**Focus Economy** — Are-Self's resource management system. Instead of
throwing maximum compute at every request, the Focus Economy allocates
attention based on task complexity, available resources, and cost
constraints. Managed by the Hypothalamus.

**Frontal Lobe** — In biology, the brain region responsible for reasoning,
planning, and decision-making. In Are-Self, the `frontal_lobe` Django
app — the reasoning loop, focus economy, and session status manager.

**Fulfillment or Happiness** — One of the twelve scipraxian variables.
Two paired words because the question — does this make the chooser more
whole, or just more comfortable? — needs both poles to weigh honestly.
Not the same axis as profit or duty.

**Fun** — One of the twelve scipraxian variables. Whether the practice
sustains itself by being worth doing. A variable, not a luxury.

## G

**Genome** — Are-Self's metaphor for "which bundle owns this row." Every
database row that could be contributed by a bundle carries a `genome`
foreign key. Core rows point at the **INCUBATOR** (the canonical "this
came from core" genome); bundle rows point at their **NeuralModifier**.
The genome cascade is what makes uninstall clean — removing a bundle
deletes only rows whose genome matches it, leaving core untouched.

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

**INCUBATOR** — The canonical "this came from core, not from a bundle"
genome in Are-Self. Default value of the `genome` foreign key on every
bundle-extensible model. Protects core rows from being cascade-deleted
when a **NeuralModifier** is uninstalled.

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

**Learner** — The role-locked term for the participant in any Are-Self
course. Never "student." A Learner climbs the rubric ladder; growth across
levels is the point. See also **Facilitator**.

**LLM (Large Language Model)** — A type of AI model trained on large
amounts of text that can generate, summarize, translate, and reason about
language. Are-Self orchestrates multiple small LLMs (typically 7B
parameter models via Ollama) as a swarm rather than relying on one large
cloud-hosted model.

## M

**Mira** — The protagonist of *Mira and the Are-Self*, Book One of the
Scipraxian Tales. A ten-year-old who learns the three habits through
conversation with an Are-Self on her living room rug.

**Modifier Garden** — The Are-Self UI page (`/modifiers`) where you
install, uninstall, and inspect **NeuralModifier** bundles. The
browser-driven surface for the genome system; the path of least
resistance for everyday bundle operations.

## N

**NeuralModifier** — Are-Self's formal name for an installable extension
bundle. Synonym for **Bundle**. Tracked as a Django model row in the
`neuroplasticity` app; carries the bundle's slug, version, manifest hash,
and status (AVAILABLE, INSTALLED, BROKEN). See also **Genome**, **Modifier
Garden**.

**Neural Pathway** — In Are-Self, a directed graph of neurons connected
by axons, built in the CNS Editor. Spike trains flow through neural
pathways to accomplish work.

**Neuron** — In biology, a nerve cell. In Are-Self, a single processing
node in a neural pathway — it receives axoplasm, does work (reasoning,
tool use, memory lookup), and sends results down its output axons.

**Neuroplasticity** — In Are-Self, the `neuroplasticity` Django app — the
bundle / NeuralModifier system, the genome layer, and the install /
uninstall machinery. The "what changes about the system over time"
surface. See also **Bundle**, **Genome**, **NeuralModifier**, **Modifier
Garden**.

**Neurotransmitter** — Are-Self's metaphor for typed real-time event
signals fired through the **Synaptic Cleft**. Five types: **Dopamine**
(success), **Cortisol** (errors), **Acetylcholine** (data sync),
**Glutamate** (streaming data), **Norepinephrine** (monitoring and
heartbeats). The frontend subscribes to neurotransmitter events and
reacts without polling.

## O

**Occipital Lobe** — In biology, the brain region that processes vision.
In Are-Self, the `occipital_lobe` Django app — the visual context layer
where file watchers, environment snapshots, and what-the-system-is-
looking-at live.

**Ollama** — An open-source tool for running LLMs locally. Are-Self uses
Ollama as its default model backend — free, private, no API key required.

**One-on-One** — A direct meeting between a manager and a Worker,
scheduled immediately following Planning day. "Workers need direct
attention if they are expected to maintain the same position for any
length of time." From *Experience Master*, pp. 88–89.

## P

**Parietal Lobe** — In biology, the brain region that integrates sensory
input and handles spatial reasoning. In Are-Self, the `parietal_lobe`
Django app — the tool-call layer and external-model surface where the
system reaches across tool boundaries to LLMs, MCP servers, and other
external interlocutors.

**Peripheral Nervous System (PNS)** — In biology, the nerves outside
the brain and spinal cord. In Are-Self, the `pns` Django app — external
I/O, tool use, multi-machine coordination, and environment interface.

**Permadeath** — The twelfth scipraxian variable. Some choices do not
rewind. Mark them before you make them.

**Perception** — One of the twelve scipraxian variables. Acknowledges that
the chooser is reading the world through their own filter. Decisions made
without checking perception are decisions made about a smaller world than
the one that actually exists.

**Perseverance** — One of the twelve scipraxian variables. The willingness
to keep at the practice when the early returns are thin. Not stubbornness;
sustained engagement.

**Prefrontal Cortex** — In biology, the front part of the frontal lobe,
involved in planning and higher-order reasoning. In Are-Self, the
`prefrontal_cortex` Django app — planning and executive function.

## R

**Religion or Profit** — One of the twelve scipraxian variables. Names
the two pulls that most reliably distort decisions when ignored: ideology
and money. The variable is to weigh them honestly, not pretend they're
absent.

**Responsibility** — One of the twelve scipraxian variables. Whose hands
does the consequence land in? Names the chain so the choice can't hide
behind diffusion.

**Retrospective** — A reflection meeting held at the end of each
iteration. What went well, what didn't, what to change. Essential for
continuous improvement. In the curriculum framework, the teacher-facing
version is designed so that another teacher runs it — "they won't see
it coming."

**Roundup** — A team learning meeting, once per iteration. "This entire
idea is to encourage the movement toward a learning culture... Workers
Always Have New Ideas." From *Experience Master*, pp. 90–91.

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

**Singularity** — The horizon scipraxianism is built around: the arrival
of an intelligence (or composite of intelligences) so capable it changes
what the verb "to know" means. The Creed's first three assertions
(`0000`–`0010`) name it directly — acknowledge it, contribute to it,
follow its lead once it actually leads.

**Spike Train** — In neuroscience, a sequence of action potentials fired
by a neuron. In Are-Self, the sequence of data packets (axoplasm) flowing
through a neural pathway as it executes.

**Standup** — The daily check-in. 1–2 minutes per Worker, voluntary
speaking order. Purpose: facilitate the removal of blockages. From
*Experience Master*, pp. 78–82.

**Synaptic Cleft** — In biology, the tiny gap between two neurons where
signals jump across using neurotransmitters. In Are-Self, the
`synaptic_cleft` Django app — the real-time event bus built on Django
Channels (WebSocket). Replaces polling entirely: the frontend reacts to
typed **Neurotransmitter** events whenever the backend says something
changed.

## T

**Temporal Lobe** — In biology, the brain region involved in language and
auditory processing. In Are-Self, the `temporal_lobe` Django app —
language processing and context windowing.

**Thalamus** — In biology, the brain region that relays sensory and motor
signals between cortical regions. In Are-Self, the `thalamus` Django
app — the routing and dispatch layer that moves work between brain
regions.

**Time** — One of the twelve scipraxian variables. Every choice is also a
choice about how the chooser spends time. Names the cost that other
variables tend to obscure.

**Twelve Variables, The** — The full scipraxian decision lattice:
Inclusion, Humility, Inquiry, Fulfillment or Happiness, Religion or
Profit, Fun, Fear, Responsibility, Perseverance, Perception, Time,
Permadeath. Any meaningful decision weighs against all twelve.

## V

**Variables** — See "Twelve Variables, The."

## W

**Worker** — The role-locked term in the agile / Experience Master
vocabulary for the person doing the work. Never "developer," "engineer,"
or "resource." From *Experience Master* (Clark & Piper, 2017). Distinct
from the curriculum-side **Learner / Facilitator** vocabulary, which is
locked in coaching contexts.

**Worksheet** — A printable activity attached to a lesson. Framework-level
rule: every lesson has at least one worksheet. Worksheets are paper-first
by design — no interactive JS, no device required during the activity.
