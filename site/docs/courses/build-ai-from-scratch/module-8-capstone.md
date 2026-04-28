---
title: "Module 8 — Capstone"
sidebar_position: 9
---

# Module 8: Capstone

## Learning Objectives

By the end of this module, you will have:

- Trained a tiny transformer from scratch on a corpus you chose
- Generated text samples and evaluated them by eye
- Reflected on the experience of doing it without external models
- Produced a runnable artifact that another person could pick up and
  reproduce

## The Brief

Build and train a tiny language model. Anything from 1M to 10M
parameters. Train on a corpus of your choice. Generate samples.
Document what you did and what you learned.

That is the entire assignment. Everything you need has been
introduced in Modules 1–7. The capstone is where you assemble the
parts into a complete project, on your own, in the order that makes
sense to you.

## Suggested Project Shapes

If you want concrete options:

### Project A — TinyStories Reproducer

Train a 1.88M-parameter model on TinyStories. Aim for loss below 2.0
on a held-out validation slice. Generate ten short stories and
include them in your writeup. This is the most direct path and
produces the best-quality output for the smallest investment.

### Project B — Single-Author Mimic

Pick an author whose work is in the public domain (Project Gutenberg
is a good source) and train a model on their entire bibliography. A
small model trained on, say, the complete works of Mark Twain will
produce eerily Twain-like sentences after a few thousand training
steps. Include side-by-side samples: real Twain, your model's
attempt.

### Project C — Domain Specialist

Train on a single technical domain — Are-Self's own documentation,
Django's docs, the Python language reference. The model will not
understand any topic outside that domain, but within it the
sentences will be plausible. This is closest to the workflow a
real-world domain specialist would use to evaluate "is fine-tuning
worth it for my use case" before stepping up to a bigger model.

### Project D — Are-Self Pathway

Build the same model, but expose it as an Effector inside Are-Self.
Use the pathway specified in [`pathway.md`](./pathway). The Frontal
Lobe can now route certain low-cost requests to your local tiny
model instead of an external LLM. The quality will be lower; the
sovereignty and cost profile will be very different.

## Required Deliverables

Your capstone repository should contain:

1. `tokenizer.py` — your BPE tokenizer (Module 1)
2. `model.py` — the full TinyTransformer (Modules 2–5)
3. `train.py` — the training loop (Module 6)
4. `data.py` — the dataloader (Module 7)
5. `generate.py` — a generation script that loads a checkpoint and
   produces samples
6. `README.md` — corpus choice, hyperparameters, training time, final
   loss, observations
7. `samples.md` — at least ten generated samples, with the prompt
   that produced each
8. The final checkpoint file (or a script that downloads it)

The final checkpoint should be small enough to share — a 2M-parameter
model in float16 is roughly 4MB.

## Hyperparameters: A Starting Point

For TinyStories, with a single consumer GPU or a fast CPU:

| Hyperparameter | Value |
|----------------|-------|
| `vocab_size` | 8,000 |
| `d_model` | 128 |
| `n_heads` | 4 |
| `n_layers` | 4 |
| `max_seq_len` | 256 |
| `batch_size` | 32 |
| `lr` | 3e-4 |
| `weight_decay` | 0.1 |
| `num_steps` | 50,000 |

You should reach loss ≈ 2.0 within a few hours on a consumer GPU, or
overnight on a fast CPU. Generated samples become coherent (though
imperfect) somewhere around step 10,000.

## Evaluation

There is no automatic grader for this capstone. The evaluation is:

- Does the model train without crashing?
- Does the loss curve look healthy?
- Do generated samples produce something recognizable as text in
  your corpus's domain?
- Could another person, given only your repository, reproduce your
  result?
- Did you learn something about transformers that you did not know
  before this course?

If yes to all five, you have done the work.

## A Note on Patience

The first time you run `train.py` and watch the loss drop and
generate the first coherent sentence the model has ever produced is
one of the more rewarding experiences in software engineering. The
moment is tucked behind a few weeks of patience. Trust the process.

## Sharing What You Built

If you finish a model you are proud of, please consider:

- Open-sourcing the repository under MIT (the same license this
  course uses)
- Writing up what you learned as a blog post or short paper
- Submitting a contribution to this course — the next student would
  benefit from a worked example with another corpus, another set of
  hyperparameters, another set of mistakes

The Are-Self project page accepts submissions of student-trained
models for inclusion in a community gallery. We would like to see
yours.

## What Comes Next

Two natural next courses, depending on direction:

- ***Tune Pretrained Models*** — apply what you know to existing,
  larger models. LoRA, fine-tuning, evaluation. (You will not need
  HuggingFace there either.)
- ***Graphs and Sleep Consolidation*** — the structural-math layer
  of how Are-Self organizes memory across many of these models in
  concert.

Either way, you are now an engineer who has built an AI from
scratch. The next time someone says "the AI knows things," you will
know exactly what is in the box, because you put it there.

## Final Reflection

When you submit your capstone, include a one-page reflection
answering:

1. What was the most surprising thing you learned in this course?
2. What part of the transformer architecture do you now think is
   over-emphasized in popular explanations?
3. What part of the transformer architecture do you now think is
   under-emphasized?
4. Will you use what you learned here in your work? How?

That reflection is the real deliverable. The model is the proof you
did the work. The reflection is what the work produced in *you*.
