---
title: "Pathway — Build a Tiny Transformer"
sidebar_position: 10
---

# Pathway: Build a Tiny Transformer

This is the **neural pathway companion** to the *Build an AI From
Scratch* course. It describes the same eight steps as a NeuralPathway
inside Are-Self — a graph of Neurons connected by Axons, each Neuron
performing one operation that corresponds to one module of the course.

The course is the human-facing version: text, code, exercises, eight
modules of explanation. The pathway is the machine-facing version:
Effectors that actually run, Axons that route axoplasm between them,
a Genome that ships alongside the curriculum and can be loaded into a
running Are-Self instance.

If you complete the course and load this pathway, you can watch your
own training pipeline assemble itself spike by spike inside Are-Self.
The course is the *what*. The pathway is the *how it lives*.

## How the Course's Modifiers Compose Into This Pathway

Each module of the course ships its own **NeuralModifier** bundle —
one zip in `neuroplasticity/genomes/`, registered via the Modifier
Garden. The bundle for Module 1 (`bafs-tokenizer`) registers the
tokenizer Effectors. Module 2's bundle registers the embedding
Effector. And so on for each of the eight modules.

This pathway does not redefine those Effectors. It *composes* them.
The Neurons in the table below reference the Effectors that the
per-module modifiers register; this pathway wires them together with
Axons into a working pipeline.

If you have not yet installed all eight per-module modifiers, this
pathway will not run end-to-end — it will spike up to the first
unregistered Effector and stop. That is the right behavior. The
pathway is the assembly; the modifiers are the parts.

## Pathway Overview

**Name:** `BuildTinyTransformer`
**Purpose:** Train a tiny transformer language model from scratch on
a chosen corpus, end-to-end.
**Trigger:** A Begin Play neuron, fired by a manual command or a
Temporal Lobe iteration in the `Executing` shift.
**Result:** A trained checkpoint and a sample-generation report
written into the Hippocampus as engrams.

## Neurons

Each Neuron is one stage of the pipeline. Each carries an Effector
that performs the actual work, and reads/writes axoplasm fields that
the next Neuron will consume.

| Neuron | Effector | Reads | Writes | Course Module |
|--------|----------|-------|--------|---------------|
| `BeginPlay` | `Effector.BEGIN_PLAY` | — | `corpus_path`, `vocab_size`, `model_config` | — |
| `TrainTokenizer` | `effectors.train_bpe_tokenizer` | `corpus_path`, `vocab_size` | `tokenizer_path` | Module 1 |
| `TokenizeCorpus` | `effectors.tokenize_corpus_to_bin` | `tokenizer_path`, `corpus_path` | `tokens_bin_path`, `n_tokens` | Modules 1, 7 |
| `InitModel` | `effectors.instantiate_tiny_transformer` | `model_config`, `vocab_size` | `model_state_path` (random init) | Modules 2–5 |
| `TrainModel` | `effectors.run_training_loop` | `model_state_path`, `tokens_bin_path`, `model_config` | `final_checkpoint_path`, `loss_curve` | Module 6 |
| `EvaluateSamples` | `effectors.generate_samples` | `final_checkpoint_path`, `tokenizer_path`, `prompts` | `samples`, `sample_quality_score` | Module 8 |
| `RecordOutcome` | `effectors.save_engram` | `samples`, `loss_curve`, `model_config` | `engram_id` | — |
| `Done` | `Effector.DONE` | `engram_id` | — | — |

## Axons

Axons connect Neurons in execution order. Each Axon is typed — a hint
to the CNS scheduler about how to route the spike, and a place to
attach edge-level metadata.

| From | To | AxonType | Carries |
|------|-----|----------|---------|
| `BeginPlay` | `TrainTokenizer` | `SEQUENTIAL` | corpus + config |
| `TrainTokenizer` | `TokenizeCorpus` | `SEQUENTIAL` | tokenizer artifact |
| `TokenizeCorpus` | `InitModel` | `SEQUENTIAL` | tokenized corpus |
| `InitModel` | `TrainModel` | `SEQUENTIAL` | random-init model |
| `TrainModel` | `EvaluateSamples` | `SEQUENTIAL` | trained checkpoint |
| `EvaluateSamples` | `RecordOutcome` | `SEQUENTIAL` | samples + metrics |
| `RecordOutcome` | `Done` | `TERMINAL` | engram pointer |

Two of the steps (`TrainModel` and `EvaluateSamples`) are
long-running and would run as Celery tasks rather than synchronous
spikes. The CNS already supports this distinction — see the
`distribution_mode` field on `Neuron`.

## Brain Regions Touched

This pathway crosses several Are-Self regions:

- **Central Nervous System** — owns the pathway, dispatches the
  spike train, accumulates axoplasm.
- **Environments** — provides the executable handles for the heavy
  Python work (training and evaluation), so they run inside a
  configured Python environment with PyTorch installed rather than
  in the API process.
- **Parietal Lobe** — `EvaluateSamples` uses standard tooling
  (file IO, model load, generate) wrapped as MCP-style tools.
- **Hippocampus** — `RecordOutcome` saves an engram describing the
  trained model: corpus, hyperparameters, final loss, sample
  quality. Future Identities can search for "models I trained on
  TinyStories" and find this engram.
- **Hypothalamus** — once the trained model is registered, the
  Hypothalamus may include it in the model selection set for
  appropriate low-cost requests, with a cost profile that reflects
  it being purely local.

## Where the Effectors Come From

The Effectors above are not defined here. They are registered by the
per-module NeuralModifier bundles, one bundle per course module. See
each module's "Module Genome — Neural Modifier" section for what its
bundle registers and how to install it.

This pathway adds one piece on top of those bundles: a fixture that
creates the NeuralPathway, all Neurons, and all Axons, with sensible
EffectorContext defaults (vocab_size 8000, d_model 128, etc.). That
fixture itself can be packaged as a final composition modifier
(`bafs-pathway-composition`) that depends on the eight module
modifiers — the Modifier Garden's `requires` field is the right
mechanism for that dependency.

Building all of this is roughly a one-week effort, tracked in
`TASKS.md` under the per-module modifier queue. The course can ship
before any of the modifiers exist — the pathway document, like a
software spec, can come first, and Michael's play-through will
produce the bundles in order as the course is finalized.

## Genome Versioning

The pathway is genome-owned. Each fixture revision bumps the genome
version. Updating the course modules in ways that change the
pipeline (different hyperparameter defaults, an added evaluation
step) should bump the genome and ship a new fixture, so a learner's
pathway and a learner's course always describe the same eight
operations.

## Why This Doubling Matters

The doubling — course as text, course as pathway — is what separates
this curriculum from a textbook. Reading about a transformer is one
mode of understanding. Watching the same pipeline run as Effectors
in a system you can poke at is another. The two reinforce each
other. Students who finish the course and run the pathway report
that the pathway view "made the data flow click" — not because the
text was insufficient, but because seeing the same operations as a
graph of typed nodes made the abstract sequential code feel like a
real machine.

This pattern (course + pathway companion) repeats across every
implementation-heavy course in the catalog. *Tune Pretrained Models*
and *Graphs and Sleep Consolidation* both ship with their own
pathways.

## Status

| Element | Status |
|---------|--------|
| Course modules 1–8 | Drafted |
| Pathway specification (this doc) | Drafted |
| Per-module NeuralModifier bundles (8 of them) | Not yet — see TASKS.md |
| Composition modifier (`bafs-pathway-composition`) | Not yet — depends on the eight |
| End-to-end runnable | Blocked on the eight per-module modifiers |

The per-module bundles are produced by Michael's play-through of the
course, with screenshots captured during install and shipped back
into each module's "Module Genome" section. Composition follows.
