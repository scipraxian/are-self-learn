---
title: "Build an AI From Scratch"
sidebar_position: 1
tags:
  - audience:self-learner
  - audience:university
  - subject:ai-literacy
  - subject:python
  - subject:computer-science
  - level:advanced
  - duration:quarter
  - format:self-paced
  - interactive:live-coding
  - interactive:projects
---

# Build an AI From Scratch

**Eight modules. One tiny transformer. No magic.**

You have heard about AI. You may have used AI. You may even have taken
*What Is AI* and learned what tokens, models, vectors, and training
actually mean. This course is the next step. You build the thing.

By the end of this course, you will have written — line by line, in
plain PyTorch, on your own machine — a working transformer language
model. Not a toy. A small but real one. You will tokenize a corpus you
chose. You will train the model on it. You will generate samples from
it. And because you wrote every layer yourself, you will know exactly
why each part is there and what would change if you removed it.

This is the course skeptical reviewers, curious students, and
self-respecting engineers should take when they want to stop trusting AI
and start understanding it.

## Who This Is For

You should take this course if:

- You can read and write Python comfortably (functions, classes,
  list/dict comprehensions, basic file I/O)
- You have a passing familiarity with NumPy or you are willing to pick
  it up alongside this course
- You have a machine that can run PyTorch (CPU is fine for the early
  modules; a single consumer GPU will speed things up dramatically by
  Module 5)
- You believe — or are willing to believe — that the only way to truly
  understand a transformer is to build one

You should *not* take this course if you are looking for a "use the API"
or "fine-tune somebody else's model" experience. That is the next
course in the catalog: *Tune Pretrained Models*. This course is upstream
of that one.

## Prerequisites

- *What Is AI* (or equivalent conceptual fluency with tokens, models,
  vectors, training, and inference)
- *Python Intermediate* (classes, decorators, generators, basic
  asyncio, virtual environments)

You do not need a deep math background. You need enough linear algebra
to recognize a matrix multiplication when you see one and enough
calculus to know that gradients flow downhill. Anything beyond that, we
introduce when we need it.

## Course Modules

| Module | Title | What You Build |
|--------|-------|---------------|
| [Module 1](./module-1-tokenizer) | Tokenizer From Scratch | A byte-pair-encoding tokenizer in pure Python |
| [Module 2](./module-2-embeddings) | Embeddings and Positions | Token embeddings + positional encoding |
| [Module 3](./module-3-attention) | Attention | Single-head attention, then multi-head |
| [Module 4](./module-4-transformer-block) | The Transformer Block | Residuals, layer norm, MLP, the sandwich |
| [Module 5](./module-5-tiny-model) | A Tiny Transformer | Assemble a 1–5M-parameter end-to-end model |
| [Module 6](./module-6-training-loop) | Training Loop | Loss, optimizer, gradient accumulation, checkpoints |
| [Module 7](./module-7-data) | Data | A small corpus, a real dataloader, and packing |
| [Module 8](./module-8-capstone) | Capstone | Train your own tiny model on a corpus you chose |

Every module ends with a runnable artifact. Every module's artifact
becomes an ingredient in the next one. By Module 5 you assemble the
whole model out of the parts you wrote in Modules 1–4. By Module 8 you
train it.

## What This Course Refuses to Do

This course does not import a pretrained model. It does not import a
tokenizer from a model hub. It does not call a remote inference API.
The point is to know what is inside the box, and you cannot know what
is inside the box if a third party assembles the box for you.

This stance is consistent with Are-Self's broader sovereignty
posture: every dependency is a future failure mode. The fewer
dependencies, the more autonomy.

We use:

- **Python 3.11+** — the language
- **PyTorch** — for tensors, autograd, and a few well-understood neural
  primitives
- **NumPy** — occasionally, for plotting and inspection
- That is it.

We do not use HuggingFace `transformers`. We do not use HuggingFace
`tokenizers`. We do not use HuggingFace `datasets`. We do not use
`accelerate`. Not because those libraries are bad — most of them are
excellent — but because importing them would let you skip the
understanding this course is supposed to give you.

If you finish this course and *then* decide to use those libraries,
that is a fine choice. You will use them as a more capable engineer
than you would have been without this course.

## How This Course Connects to Are-Self

Every concept you build in this course corresponds to something that
runs inside Are-Self. The tokenizer in Module 1 mirrors the token
counting the Hypothalamus does for cost management. The attention
mechanism in Module 3 is the same mechanism the LLMs Are-Self routes
to are running inside. The training loop in Module 6 is the same loop
that produced the embeddings the Hippocampus uses for memory search.

This course also ships as a set of **Neural Modifiers** — one
installable bundle per module (`bafs-tokenizer`, `bafs-embeddings`,
…, `bafs-data`) plus a composition modifier
(`bafs-pathway-composition`) that wires them into the
`BuildTinyTransformer` neural pathway. See each module's "Module
Genome — Neural Modifier" section for what its bundle registers,
and the [pathway companion](./pathway) for how the eight modules
compose into an end-to-end pipeline you can run inside Are-Self.

## A Note on Difficulty

This is the hardest course in the Are-Self catalog. It is not hard
because the math is impossible — it is not. It is hard because there
is a lot of it, and each piece matters. If you are stuck on a module,
the answer is almost always to read the module again, slowly, with a
notebook open and your hands on the keyboard.

The reward for finishing this course is that no future explanation of
how AI works will mystify you again. Worth the work.

## Going Deeper

After this course, the natural next steps are:

- *Tune Pretrained Models* — apply what you know to existing models,
  using LoRA, fine-tuning, and evaluation
- *Graphs and Sleep Consolidation* — the structural-math layer behind
  Are-Self's memory system
- *CS Frameworks: Django, DRF, Are-Self* — wrap your model in a
  production-shaped service

If you want one outside reference for further depth, Andrej Karpathy's
*Let's build GPT* video series and the *nanoGPT* repository are the
best companion material in the world. This course's structure was
deliberately chosen to be compatible with that material so you can
cross-reference freely.
