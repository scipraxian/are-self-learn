---
title: "Tune Pretrained Models"
sidebar_position: 1
tags:
  - audience:self-learner
  - audience:corporate
  - audience:community-college
  - subject:ai-literacy
  - subject:python
  - subject:software-engineering
  - level:advanced
  - duration:6-week-unit
  - format:self-paced
  - interactive:live-coding
  - interactive:projects
---

# Tune Pretrained Models

**Eight modules. Take a model that already exists. Specialize it.
Without surrendering control to anybody else's hub.**

By the time you reach this course, somebody else has already trained
a model that is much bigger and better than anything you would build
in *Build an AI From Scratch*. That is not a defeat. It is an
opportunity. The model exists. It works. You can specialize it for
your domain, your style, your task — and you can do this on your own
hardware, without uploading anything, without depending on a third-
party hub, and without giving up the autonomy that the rest of the
Are-Self stack is built around.

This course is the practical sibling of *Build an AI From Scratch*.
You bring the understanding from that course (or from equivalent
study). This course teaches you to apply it — efficiently — to
existing pretrained checkpoints.

## What This Course Is Not

It is not a HuggingFace tutorial. We will not import `transformers`,
`peft`, `accelerate`, `datasets`, or `tokenizers`. The point is not
that those libraries are bad — most of them are excellent — but that
relying on a hub for models, datasets, and trainer abstractions
introduces a dependency on a third party who can change governance,
licensing, or API surface at any time. Are-Self is sovereign by
design. This course teaches you to fine-tune sovereignly.

The trade-off is real: you will write a few hundred more lines of
code than a HuggingFace user would. The benefit is that those lines
of code belong to you, run on your hardware, and have no upstream
dependency that can disappear or charge you.

## Prerequisites

- ***Build an AI From Scratch*** — you must understand transformers
  from the inside. This course assumes you already know what
  attention does, what a transformer block looks like, and how a
  training loop works. If you do not, take that course first.
- *Python Intermediate* — comfort with classes, decorators, and
  PyTorch's general idiom.
- A machine with a GPU. The full course runs on CPU only as a
  hardship project. A single consumer GPU (8GB+) makes life much
  easier. A 24GB GPU lets you fine-tune meaningfully sized models.

## Course Modules

| Module | Title | What You Build |
|--------|-------|---------------|
| [Module 1](./module-1-build-vs-tune) | Build vs Tune | Decision framework for which approach fits which problem |
| [Module 2](./module-2-loading-checkpoints) | Loading Checkpoints | Load weights from disk into a transformer you understand |
| [Module 3](./module-3-baseline-evaluation) | Baseline Evaluation | Measure what the model already does, before you change it |
| [Module 4](./module-4-lora-from-scratch) | LoRA From Scratch | Implement Low-Rank Adaptation as a thin PyTorch wrapper |
| [Module 5](./module-5-fine-tuning-loop) | The Fine-Tuning Loop | Train only the LoRA adapters; freeze the base model |
| [Module 6](./module-6-evaluation) | Evaluation | Held-out sets, regression vs base, qualitative review |
| [Module 7](./module-7-serving) | Serving | Quantization, local serving, latency vs cost |
| [Module 8](./module-8-capstone) | Capstone | Pick a base model, pick a domain, fine-tune, evaluate, serve |

## The Sovereignty Stance, Explicitly

We download base model weights from sources that have a stable open
license — Meta's Llama checkpoints (when their license permits),
Mistral's open releases, Microsoft's Phi family, and similar — and
we save those weights to disk. From there on, everything happens
locally:

- Weights live on your filesystem, not in a hub cache the library
  manages opaquely.
- Datasets are files you control, in formats you understand
  (JSONL, plain text, your own database).
- Training runs in your Python process, on your machine, with
  PyTorch you installed yourself.
- Evaluation runs against held-out data you own.
- Serving exposes an HTTP endpoint or runs as a process inside your
  Are-Self installation.

If your network is severed during training, training continues. If
HuggingFace goes down, your model is unaffected. If a license
changes, your already-downloaded weights are not retroactively
revoked. This is what autonomy looks like in practice.

## What You Will Be Able to Do

After this course, you can:

- Take a 1B–7B parameter pretrained model and specialize it on a
  domain corpus of a few thousand to a few million tokens
- Implement LoRA, QLoRA, and prompt-tuning approaches as PyTorch
  modules you wrote
- Evaluate a fine-tune against the base model with rigor — held-out
  sets, paired comparisons, regression checks
- Serve a tuned model locally via a simple HTTP endpoint suitable
  for routing from Are-Self's Hypothalamus
- Decide, for a given problem, whether fine-tuning is the right
  answer at all (often it is not — Module 1 is partly about that)

## How This Course Connects to Are-Self

When the Hypothalamus picks a model for a request, it picks from a
catalog of models the system knows about. Some are remote (Claude,
GPT, Llama on a hosted endpoint). Some are local (Llama running on
your hardware). After this course, you will be able to add a
**locally tuned, domain-specific model** to that catalog — one that
the Hypothalamus can reach for when a request matches its
specialization, with a cost profile that reflects "free, except for
electricity."

This course also ships as a set of **Neural Modifiers** — one
installable bundle per module (`tune-decision-rubric`,
`tune-load-checkpoint`, `tune-eval-harness`, `tune-lora`,
`tune-fine-tune-loop`, `tune-eval-compare`, `tune-serve`) plus a
composition modifier (`tune-pathway-composition`) that wires them
into the `TunePretrainedModel` neural pathway. See each module's
"Module Genome — Neural Modifier" section for what its bundle
registers, and the [pathway companion](./pathway) for how the modules
compose into an end-to-end fine-tune-evaluate-serve pipeline.

## Why Skip HuggingFace, Really

Two reasons, both serious:

1. **Dependency surface.** Every library that loads a model from a
   hub introduces an opinion about how models are organized, named,
   versioned, configured, and licensed. Those opinions can change.
   They have changed. They will change again. A pipeline that
   depends on them is fragile in proportion to the size of that
   surface.

2. **Educational dilution.** It is genuinely too easy to call
   `Trainer.train()` with twelve lines of configuration and feel
   that you have fine-tuned a model. You have not — you have
   instructed a library to fine-tune a model on your behalf. If the
   library has a bug, you cannot debug it. If the library does
   something silently you would not have wanted, you cannot stop
   it. By writing the LoRA wrapper, the training step, and the
   evaluation harness yourself, you become an engineer who can
   actually reason about what is happening.

Done well, the LoRA implementation in Module 4 is roughly seventy
lines of PyTorch. The training loop in Module 5 is roughly thirty
lines on top of what you already wrote in *Build an AI From
Scratch*. Total cost of avoiding HuggingFace: small. Total benefit:
a pipeline you actually own.

## Going Deeper

After this course you have most of the skills for serious applied
work. Natural next steps:

- *Graphs and Sleep Consolidation* — the structural-math layer of
  Are-Self memory
- *CS Frameworks: Django, DRF, Are-Self* — wrap your tuned model in
  a real production service
- The *Hypothalamus Cost Management* corporate course — the economics
  of routing among many tuned models at scale

If you want one outside reference for further depth, the original
LoRA paper (Hu et al., 2021, *LoRA: Low-Rank Adaptation of Large
Language Models*) is short, readable, and the foundation of nearly
every parameter-efficient fine-tuning method in current use.
