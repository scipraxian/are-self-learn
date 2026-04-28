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

## Effector Authoring Notes

The Effectors named above are **proposed** — they do not exist in
`are-self-api/central_nervous_system/effectors/` yet. Building this
pathway means:

1. Adding the four new Effectors (`train_bpe_tokenizer`,
   `tokenize_corpus_to_bin`, `instantiate_tiny_transformer`,
   `run_training_loop`, `generate_samples`) under
   `central_nervous_system/effectors/build_from_scratch/`.
2. Wiring an `Environment` that has PyTorch in its requirements so
   the heavy Effectors can run.
3. Producing a fixture that creates the NeuralPathway, all Neurons
   and Axons, and the EffectorContext with sensible defaults
   (vocab_size 8000, d_model 128, etc.).
4. Adding a `boot.py`-style genome promotion path so the pathway
   ships as part of an Are-Self installation that opts into the
   curriculum.

This is roughly a one-week effort, scoped as a separate task in
`TASKS.md`. The course can ship before the pathway implementation
exists — the pathway document, like a software spec, can come first.

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
| Effectors implemented in `are-self-api` | Not yet |
| Genome fixture in `are-self-api` | Not yet |
| End-to-end runnable | Blocked on Effector + Environment work |

The Effector and fixture work are tracked separately as P2 tasks in
the `are-self-learn` and `are-self-api` repos.
