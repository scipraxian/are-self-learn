---
title: "Pathway — Tune a Pretrained Model"
sidebar_position: 10
---

# Pathway: Tune a Pretrained Model

This is the **neural pathway companion** to the *Tune Pretrained
Models* course. It describes the same eight-step pipeline as a
NeuralPathway inside Are-Self.

The course is the human-facing version. The pathway is the machine-
facing version: a graph of Effectors that performs the same work,
shipped as a Genome that loads into a running Are-Self instance.

## How the Course's Modifiers Compose Into This Pathway

Each module of the course ships its own **NeuralModifier** bundle —
one zip in `neuroplasticity/genomes/`, registered via the Modifier
Garden. Module 2's bundle (`tune-load-checkpoint`) registers the
checkpoint-loader Effector. Module 4's bundle (`tune-lora`) registers
the LoRA-injection Effector. And so on for each of the eight modules.

This pathway does not redefine those Effectors. It *composes* them
into the seven-step fine-tune-and-register pipeline below. The
Neurons reference Effectors that the per-module modifiers register;
this pathway wires them together with Axons (including the
CONDITIONAL gate) into a working pipeline.

## Pathway Overview

**Name:** `TunePretrainedModel`
**Purpose:** Take a downloaded base model checkpoint, evaluate it,
inject LoRA adapters, fine-tune the adapters on a curated dataset,
re-evaluate, serve the result, and register it with the
Hypothalamus.
**Trigger:** A Begin Play neuron, fired manually for a one-off
fine-tune or by a Temporal Lobe iteration in the `Executing` shift
for a scheduled retraining job.
**Result:** A registered model in the Hypothalamus catalog with a
documented capability profile, plus an engram in the Hippocampus
recording the eval report.

## Neurons

| Neuron | Effector | Reads | Writes | Course Module |
|--------|----------|-------|--------|---------------|
| `BeginPlay` | `Effector.BEGIN_PLAY` | — | `base_model_path`, `dataset_path`, `lora_config`, `eval_set_path` | — |
| `LoadBase` | `effectors.load_safetensors_checkpoint` | `base_model_path` | `model_handle` | Module 2 |
| `EvalBaseline` | `effectors.run_eval_harness` | `model_handle`, `eval_set_path` | `base_eval_run_id` | Modules 3, 6 |
| `InjectLoRA` | `effectors.inject_lora_adapters` | `model_handle`, `lora_config` | `adapter_handle` | Module 4 |
| `FineTune` | `effectors.run_lora_fine_tune` | `adapter_handle`, `dataset_path` | `tuned_adapter_path`, `loss_curve` | Module 5 |
| `EvalTuned` | `effectors.run_eval_harness` | `model_handle`, `tuned_adapter_path`, `eval_set_path` | `tuned_eval_run_id` | Module 6 |
| `CompareRuns` | `effectors.compare_eval_runs` | `base_eval_run_id`, `tuned_eval_run_id` | `comparison_report`, `capability_profile` | Module 6 |
| `ServeAndRegister` | `effectors.serve_and_register` | `tuned_adapter_path`, `capability_profile` | `model_id_in_catalog` | Module 7 |
| `RecordOutcome` | `effectors.save_engram` | `comparison_report`, `model_id_in_catalog` | `engram_id` | — |
| `Done` | `Effector.DONE` | `engram_id` | — | — |

## Axons

| From | To | AxonType | Notes |
|------|-----|----------|-------|
| `BeginPlay` | `LoadBase` | `SEQUENTIAL` | initial config |
| `LoadBase` | `EvalBaseline` | `SEQUENTIAL` | load completes before eval |
| `EvalBaseline` | `InjectLoRA` | `SEQUENTIAL` | baseline must exist for later compare |
| `InjectLoRA` | `FineTune` | `SEQUENTIAL` | adapters injected, then trained |
| `FineTune` | `EvalTuned` | `SEQUENTIAL` | training completes before eval |
| `EvalTuned` | `CompareRuns` | `SEQUENTIAL` | eval data ready |
| `CompareRuns` | `ServeAndRegister` | `CONDITIONAL` | only fires if comparison report meets quality bar |
| `CompareRuns` | `RecordOutcome` | `SEQUENTIAL` | report saved either way |
| `ServeAndRegister` | `RecordOutcome` | `SEQUENTIAL` | catalog registration noted in engram |
| `RecordOutcome` | `Done` | `TERMINAL` | terminal node |

The `CONDITIONAL` axon from `CompareRuns` to `ServeAndRegister` is
the interesting one. The CNS scheduler reads a predicate on the
axoplasm — for example, `comparison_report["target_winrate"] > 0.6
and comparison_report["max_regression"] < 0.10` — and only fires
the spike if the predicate holds. A fine-tune that fails the bar
gets its eval report saved (so you know what happened) but does not
get served or registered. This is a one-line invariant that
prevents bad fine-tunes from leaking into the catalog.

## Brain Regions Touched

- **Central Nervous System** — owns the pathway, dispatches the
  spike train, accumulates axoplasm. Holds the `CONDITIONAL` axon
  predicate.
- **Environments** — provides the executable handles for the heavy
  Python work (load, eval, fine-tune). The training Effector runs
  inside an Environment configured with PyTorch + CUDA.
- **Parietal Lobe** — provides the eval-running tool and the
  registration tool as MCP-style operations.
- **Hippocampus** — `RecordOutcome` saves an engram with corpus
  description, hyperparameters, base eval results, tuned eval
  results, comparison report, and the catalog ID. Future Identities
  can search for "what fine-tunes have we run on customer-support
  data" and find this engram.
- **Hypothalamus** — `ServeAndRegister` adds the tuned model to
  the Hypothalamus catalog with the capability profile produced
  in `CompareRuns`. From this moment, the Hypothalamus considers
  the new model when scoring requests.

## Where the Effectors Come From

The Effectors above are not defined here. They are registered by the
per-module NeuralModifier bundles, one bundle per course module. See
each module's "Module Genome — Neural Modifier" section for what its
bundle registers.

The roster:

1. `load_safetensors_checkpoint` — registered by `tune-load-checkpoint`
   (Module 2)
2. `inject_lora_adapters` — registered by `tune-lora` (Module 4)
3. `run_lora_fine_tune` — registered by `tune-fine-tune-loop` (Module 5)
4. `run_eval_harness` — registered by `tune-eval-harness` (Modules 3 + 6)
5. `compare_eval_runs` — registered by `tune-eval-compare` (Module 6)
6. `serve_and_register` — registered by `tune-serve` (Module 7)

The eval and fine-tune Effectors run inside Environments with GPU
support — that Environment configuration is itself part of the
modifier bundle for Module 5. The serve Effector launches a long-
lived process; the CNS should treat it as a managed service rather
than a single Celery task. This may require a small extension to
the Environments app (or to a new `services/` region) — flagged for
the are-self-api roadmap and tracked in TASKS.md.

A composition modifier (`tune-pathway-composition`) wraps this
pathway fixture and depends on the seven module bundles via the
Modifier Garden's `requires` field.

## Genome Versioning

The pathway is genome-owned. Updates to course modules that change
the pipeline (different default hyperparameters, an added
intermediate step, a stronger CONDITIONAL predicate) bump the genome
version and ship a new fixture, so the course and the pathway stay
in lockstep.

## Status

| Element | Status |
|---------|--------|
| Course modules 1–8 | Drafted |
| Pathway specification (this doc) | Drafted |
| Per-module NeuralModifier bundles (7 of them; M1 + M8 are decision/composition) | Not yet — see TASKS.md |
| `services/` region for long-lived serve processes | Open question |
| Composition modifier (`tune-pathway-composition`) | Not yet — depends on the seven |
| End-to-end runnable | Blocked on the seven per-module modifiers + services/ region |

The per-module bundles are produced by Michael's play-through of the
course, with screenshots captured during install. The `services/`
region is a real architectural decision that needs to land in
`are-self-api` before the serve modifier can ship.
