---
title: "Module 6 — Training Loop"
sidebar_position: 7
---

# Module 6: Training Loop

## Learning Objectives

By the end of this module, you will be able to:

- Implement a complete training loop with cross-entropy loss and AdamW
- Explain gradient accumulation and when you need it
- Save and resume training from checkpoints
- Monitor loss curves and recognize healthy vs unhealthy training

## What "Training" Actually Means

Training is the process of updating the model's parameters so its
predicted next-token distribution matches the true next-token
distribution observed in the corpus. Concretely:

1. Feed the model a sequence of tokens.
2. Compute the model's predicted logits at every position.
3. Compare those logits to the *actual* next token at each position.
4. Compute a scalar loss capturing how wrong the prediction was.
5. Backpropagate the loss to compute a gradient for every parameter.
6. Take a small step in the direction that reduces loss.
7. Repeat several million times.

Each iteration of this loop nudges the model from random noise toward
a model that has internalized the statistical structure of your
corpus.

## Cross-Entropy Loss

For language modeling, the loss is **cross-entropy** between the
predicted distribution and the true next-token distribution (which is
a one-hot vector over the actual next token). PyTorch packages this
into a single function:

```python
import torch
import torch.nn.functional as F

# logits: [B, T, V]
# targets: [B, T]   (the next token at each position)
loss = F.cross_entropy(
    logits.view(-1, logits.size(-1)),  # [B*T, V]
    targets.view(-1),                  # [B*T]
)
```

`cross_entropy` internally applies a log-softmax to the logits and
computes the negative log-likelihood of the target. You should never
apply softmax yourself before this loss — PyTorch's implementation
is numerically stable in a way that a hand-written version is not.

## The Training Step

```python
def train_step(model, optimizer, batch):
    # batch: tensor of shape [B, T+1] — we use the first T as input
    # and shift to get the target T tokens.
    inputs = batch[:, :-1]
    targets = batch[:, 1:]

    logits = model(inputs)
    loss = F.cross_entropy(
        logits.view(-1, logits.size(-1)),
        targets.view(-1),
    )

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    return loss.item()
```

That is the inner loop. Five lines of PyTorch and a tensor reshape.

## The Optimizer

We use **AdamW** — Adam plus decoupled weight decay. It is the modern
default for transformer training:

```python
from torch.optim import AdamW

optimizer = AdamW(
    model.parameters(),
    lr=3e-4,
    betas=(0.9, 0.95),
    weight_decay=0.1,
)
```

The learning rate `3e-4` is the much-quoted "Karpathy constant" —
not magic, just a value that often works for models in our size
range. Larger models typically train at lower learning rates.
Smaller models can sometimes go higher.

## The Outer Loop

```python
def train(model, dataloader, num_steps: int):
    optimizer = AdamW(model.parameters(), lr=3e-4)
    model.train()
    losses = []

    for step, batch in enumerate(dataloader):
        if step >= num_steps:
            break
        loss = train_step(model, optimizer, batch)
        losses.append(loss)

        if step % 50 == 0:
            recent = sum(losses[-50:]) / max(1, len(losses[-50:]))
            print(f"step {step:>5d} | loss {recent:.4f}")

    return losses
```

That is a complete training loop. Pair it with a dataloader (Module 7)
and a model (Module 5), and you can train.

## Gradient Accumulation

Sometimes you want a larger effective batch size than fits in memory.
The trick is to accumulate gradients across several smaller batches
before stepping the optimizer:

```python
ACCUM = 4
optimizer.zero_grad()
for micro_step, micro_batch in enumerate(micro_batches):
    logits = model(micro_batch[:, :-1])
    loss = F.cross_entropy(
        logits.view(-1, logits.size(-1)),
        micro_batch[:, 1:].reshape(-1),
    ) / ACCUM
    loss.backward()
    if (micro_step + 1) % ACCUM == 0:
        optimizer.step()
        optimizer.zero_grad()
```

Effective batch size becomes `batch_size * ACCUM`. The cost is
`ACCUM` more forward and backward passes per optimizer step, so wall
time per effective step grows. The benefit is being able to train at
larger effective batch sizes than your memory allows.

## Checkpoints

Training a model takes hours or days. You need to be able to save
progress and resume:

```python
def save_checkpoint(path, model, optimizer, step, losses):
    torch.save(
        {
            "model_state": model.state_dict(),
            "optimizer_state": optimizer.state_dict(),
            "step": step,
            "losses": losses,
        },
        path,
    )

def load_checkpoint(path, model, optimizer):
    ckpt = torch.load(path, map_location="cpu")
    model.load_state_dict(ckpt["model_state"])
    optimizer.load_state_dict(ckpt["optimizer_state"])
    return ckpt["step"], ckpt["losses"]
```

Save a checkpoint every N steps. If training crashes, restart from
the last checkpoint instead of from scratch.

## Reading the Loss Curve

A healthy training run shows loss decreasing rapidly at first, then
slowing as the model approaches the entropy of the corpus. Common
shapes:

- **Steady decrease, slowly tapering** — healthy.
- **Loss explodes upward** — learning rate too high. Lower it.
- **Loss plateaus very early** — learning rate too low, or the model
  is too small for the corpus, or the data has structure the model
  cannot exploit.
- **Loss decreases on training data but increases on held-out data**
  — overfitting. Smaller model, more regularization, or more data.

Watch the curve. The model talks to you through the loss.

## Are-Self Connection

The training loop you write here is the same loop, structurally,
that produces every embedding model the Hippocampus uses for memory
search. It is also the same loop that tunes a Reasoning Identity's
behavior over time as XP accumulates and the system observes which
turns succeeded and which did not — though that loop, in Are-Self,
runs over evaluation outcomes rather than next-token loss.

The pattern is universal: forward pass, compare to target, backprop,
step. Everything else is the choice of target.

## Think About It

- Cross-entropy loss is the negative log-probability the model
  assigned to the correct next token. What does loss = 0 mean? What
  does loss = log(vocab_size) mean?
- Gradient accumulation gives you the same gradient as a larger batch
  would. What does it *not* give you?
- A model can show steadily decreasing training loss while getting
  worse on real-world generation. What does that say about the
  relationship between loss and quality?

## Exit Ticket

1. For `vocab_size=8000`, what is the cross-entropy loss of a totally
   untrained model that predicts uniformly over the vocabulary?
2. You start training with `lr=3e-4` and the loss explodes upward
   within twenty steps. What is the first thing you try?
3. If you set `weight_decay=0`, what would change about the model's
   tendency to overfit?

Module 7 is where the data comes from.

## Module Genome — Neural Modifier

The runnable deliverable from this module is a **NeuralModifier**
bundle named `bafs-training-loop` (`neuroplasticity/genomes/bafs-training-loop.zip`).
It adds the autoregressive training loop (Celery task) and
checkpoint I/O to your Are-Self instance, plus an Environment
configured with PyTorch.

| Field | Value |
|-------|-------|
| Bundle | `neuroplasticity/genomes/bafs-training-loop.zip` |
| Registers | `run_training_loop` Effector (long-running, Celery task); `save_checkpoint` / `load_checkpoint` Effectors; PyTorch Environment |
| Install via | `install_bundle_from_archive("neuroplasticity/genomes/bafs-training-loop.zip")` |
| Screenshot | *Modifier Garden after install — captured during play-through.* |

This modifier composes with the others in the course. The course-
level [pathway](./pathway) wires the Effectors registered here into
the rest of the build pipeline.
