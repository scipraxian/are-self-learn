---
title: "Module 5 — The Fine-Tuning Loop"
sidebar_position: 6
---

# Module 5: The Fine-Tuning Loop

## Learning Objectives

By the end of this module, you will be able to:

- Format a dataset for instruction-style or completion-style
  fine-tuning
- Implement a fine-tuning loop that trains LoRA adapters while
  freezing the base model
- Apply gradient checkpointing and mixed precision to fit larger
  models in memory
- Monitor adapter training and recognize signs of overfitting

## What We Are Training For

For a base language model, the next-token loss is the universal
training signal. For a fine-tune, you are trying to push the model
toward outputs that match a desired style, format, or behavior on
specific kinds of inputs. The data you assemble is a curated
collection of (input, desired output) pairs that demonstrate the
behavior you want.

There are two common formats:

### Instruction format

```jsonl
{"instruction": "Translate to French: Hello, world.", "response": "Bonjour, monde."}
{"instruction": "Summarize: [long text]", "response": "[summary]"}
```

Used when you want the model to respond to a prompt in a
particular way. The training loss covers the response tokens only
— the instruction tokens are inputs the model conditions on, not
outputs to predict.

### Completion format

```jsonl
{"text": "Once upon a time, [story continues...]"}
{"text": "User: hello\nBot: greetings, traveler"}
```

Used when you want the model to internalize a style or pattern
across a domain. The training loss covers all tokens.

For this course we will use the instruction format — it is more
common in production fine-tuning and the loss masking introduces a
useful detail.

## Dataset Class

```python
import json
import torch
from pathlib import Path
from torch.utils.data import Dataset

class InstructionDataset(Dataset):
    def __init__(self, path: str, tokenizer, max_seq_len: int = 1024):
        self.examples = [
            json.loads(line) for line in Path(path).open()
        ]
        self.tokenizer = tokenizer
        self.max_seq_len = max_seq_len

    def __len__(self) -> int:
        return len(self.examples)

    def __getitem__(self, idx: int) -> dict:
        ex = self.examples[idx]
        prompt = f"### Instruction:\n{ex['instruction']}\n\n### Response:\n"
        full_text = prompt + ex["response"] + self.tokenizer.eos_token

        prompt_ids = self.tokenizer.encode(prompt)
        full_ids = self.tokenizer.encode(full_text)[: self.max_seq_len]

        # Loss is computed only on response tokens.
        labels = full_ids.copy()
        labels[: len(prompt_ids)] = [-100] * len(prompt_ids)

        return {
            "input_ids": torch.tensor(full_ids),
            "labels": torch.tensor(labels),
        }
```

The `-100` label is PyTorch's `cross_entropy` convention for "skip
this position." This is how we mask the prompt tokens out of the
loss.

## A Padding Collator

Sequences in a batch will be different lengths. We pad to the
longest in the batch:

```python
import torch.nn.functional as F

def pad_collate(batch, pad_token_id: int = 0):
    max_len = max(len(ex["input_ids"]) for ex in batch)
    input_ids = torch.stack([
        F.pad(ex["input_ids"], (0, max_len - len(ex["input_ids"])), value=pad_token_id)
        for ex in batch
    ])
    labels = torch.stack([
        F.pad(ex["labels"], (0, max_len - len(ex["labels"])), value=-100)
        for ex in batch
    ])
    return {"input_ids": input_ids, "labels": labels}
```

`-100` in the labels slot, `pad_token_id` in the input slot. The
loss skips `-100`. The forward pass computes attention over the
pad tokens — wasted work but harmless. (For larger fine-tunes you
would add an attention mask. We keep it simple here.)

## The Training Step

```python
import torch
import torch.nn.functional as F
from torch.optim import AdamW

def fine_tune_step(model, optimizer, batch):
    logits = model(batch["input_ids"])
    loss = F.cross_entropy(
        logits[:, :-1].reshape(-1, logits.size(-1)),
        batch["labels"][:, 1:].reshape(-1),
        ignore_index=-100,
    )
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    return loss.item()
```

The shift by one (`[:, :-1]` and `[:, 1:]`) is autoregressive: at
each position, predict the *next* token. The `ignore_index=-100`
is what makes the prompt-token mask take effect.

## The Outer Loop

```python
from torch.utils.data import DataLoader

def fine_tune(
    model,
    train_dataset,
    val_dataset,
    num_epochs: int = 3,
    batch_size: int = 4,
    lr: float = 1e-4,
):
    # Only LoRA adapter parameters are trainable; AdamW will only
    # update those.
    optimizer = AdamW(
        [p for p in model.parameters() if p.requires_grad],
        lr=lr,
        weight_decay=0.0,
    )

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, collate_fn=pad_collate)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, collate_fn=pad_collate)

    for epoch in range(num_epochs):
        model.train()
        for step, batch in enumerate(train_loader):
            loss = fine_tune_step(model, optimizer, batch)
            if step % 50 == 0:
                print(f"epoch {epoch} step {step:>5d} | train loss {loss:.4f}")

        # Validation pass.
        model.eval()
        val_losses = []
        with torch.no_grad():
            for batch in val_loader:
                logits = model(batch["input_ids"])
                v_loss = F.cross_entropy(
                    logits[:, :-1].reshape(-1, logits.size(-1)),
                    batch["labels"][:, 1:].reshape(-1),
                    ignore_index=-100,
                )
                val_losses.append(v_loss.item())
        print(f"epoch {epoch} | val loss {sum(val_losses) / len(val_losses):.4f}")
```

Note the LoRA-specific detail: `[p for p in model.parameters() if
p.requires_grad]`. AdamW only allocates state (which is the largest
memory consumer in training) for parameters with `requires_grad =
True`. Since we froze the base model, AdamW only sees the LoRA
parameters — a few hundred MB of optimizer state instead of tens of
GB. This is the memory win that makes LoRA practical.

## Mixed Precision

For larger models, training in pure float32 is wasteful. PyTorch's
automatic mixed precision uses float16 (or bfloat16) for the
forward and backward pass and float32 only for the optimizer
update:

```python
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()

def fine_tune_step_amp(model, optimizer, batch, scaler):
    optimizer.zero_grad()
    with autocast(dtype=torch.bfloat16):
        logits = model(batch["input_ids"])
        loss = F.cross_entropy(
            logits[:, :-1].reshape(-1, logits.size(-1)),
            batch["labels"][:, 1:].reshape(-1),
            ignore_index=-100,
        )
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
    return loss.item()
```

Roughly half the memory, roughly twice the speed. For most fine-
tuning workflows this is essentially free quality.

## Gradient Checkpointing

If memory is still tight, gradient checkpointing trades compute for
memory by recomputing activations during the backward pass instead
of storing them. For LoRA fine-tuning this is rarely needed
(adapter memory is small). For full fine-tuning it is essential.
The technique is supported natively in PyTorch via
`torch.utils.checkpoint.checkpoint`.

## Monitoring

Watch:

- **Train loss** decreases monotonically (with noise). If it goes
  up, lower the learning rate.
- **Val loss** decreases initially, then may plateau. If it starts
  rising while train loss continues falling, you are overfitting.
- **Output samples** — every few hundred steps, generate a sample
  on a held-out prompt and read it. Loss numbers can mask
  qualitative regression.

Save the adapter every epoch, not just at the end. The best
adapter is often from epoch 2 or 3 of a 5-epoch run, not the final
epoch.

## How Many Examples

Practical guidelines for adapter fine-tuning:

- **Style transfer:** 500–2,000 in-style examples is often enough.
- **Domain adaptation:** 5,000–50,000 examples; more is better up
  to a point.
- **Behavioral changes (refusals, formatting):** 200–1,000 carefully
  curated examples can lock in surprisingly strong patterns.

Quality matters more than quantity. Five hundred carefully written
examples beat fifty thousand auto-generated ones.

## Are-Self Connection

The fine-tuning loop in this module is structurally identical to
how Are-Self could one day fine-tune the embedding model in the
Hippocampus on user-specific memory patterns, or fine-tune a
domain-routing model in the Hypothalamus. The pattern is general:
freeze the expensive base model, train cheap adapters, swap
adapters per use case.

## Think About It

- The masking convention (`-100` for prompt tokens) means the model
  is trained only on response tokens. Why does this matter for
  what the model learns?
- Why is AdamW's optimizer state several times larger than the
  parameters it manages? (Hint: think about what gets stored per
  parameter.)
- A fine-tune that improves train loss while degrading val loss is
  overfitting. What would you change first to address this — the
  data, the model, or the optimizer?

## Exit Ticket

1. For a 7B model fine-tuned with LoRA at rank 8 on attention
   projections, what is roughly the GPU memory consumed by AdamW
   optimizer state? (Hint: count adapter params, multiply by ~8
   bytes per param.)
2. Why is `requires_grad = False` on the base model parameters
   load-bearing for both memory and correctness?
3. After three epochs, train loss is 0.4 and val loss is 0.7,
   trending in opposite directions. What is happening, and what
   are two things you could try?

Module 6 is where you compare your fine-tune to the baseline.

## Module Genome — Neural Modifier

The runnable deliverable from this module is a **NeuralModifier**
bundle named `tune-fine-tune-loop`
(`neuroplasticity/genomes/tune-fine-tune-loop.zip`). It adds the
LoRA-aware fine-tuning loop (Celery task) and the instruction-
formatted dataset loader to your Are-Self instance.

| Field | Value |
|-------|-------|
| Bundle | `neuroplasticity/genomes/tune-fine-tune-loop.zip` |
| Registers | `run_lora_fine_tune` Effector (long-running, Celery task); `make_instruction_dataloader` Effector; PyTorch+CUDA Environment with bfloat16 AMP support |
| Install via | `install_bundle_from_archive("neuroplasticity/genomes/tune-fine-tune-loop.zip")` |
| Screenshot | *Modifier Garden after install — captured during play-through.* |

This modifier composes with the others in the course. The course-
level [pathway](./pathway) calls `run_lora_fine_tune` after
`inject_lora_adapters` and before the post-tune eval.
