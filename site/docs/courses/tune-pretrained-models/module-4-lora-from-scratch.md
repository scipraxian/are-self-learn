---
title: "Module 4 — LoRA From Scratch"
sidebar_position: 5
---

# Module 4: LoRA From Scratch

## Learning Objectives

By the end of this module, you will be able to:

- Explain the LoRA decomposition and why it works
- Implement a LoRA adapter as a thin PyTorch wrapper around a
  `nn.Linear`
- Inject LoRA adapters into a pretrained transformer without
  modifying the base model
- Save and load adapter weights independently of the base model

## The Idea, in One Paragraph

Full fine-tuning means updating every weight in a model. For a 7B
parameter model, that is 14GB of float16 weights, plus 14GB of
gradients, plus 28GB of Adam optimizer state — well past the
memory of any consumer GPU. **Low-Rank Adaptation (LoRA)** observes
that during fine-tuning, the *update* to each weight matrix is
empirically low-rank — it can be factored into the product of two
much smaller matrices. So instead of training the full update,
train the two small factors. For a typical 4096×4096 layer with
rank 8, you replace 16M trainable parameters with about 65k. The
base model is frozen. Only the small adapter matrices learn.

Total memory cost for the adapters on a 7B model: a few hundred MB.
A LoRA fine-tune fits on a single 24GB GPU comfortably.

## The Math

For a base linear layer `y = x @ W`, LoRA adds a low-rank update:

```
y = x @ W + alpha * (x @ A @ B)
```

Where `W` is `[in_dim, out_dim]` (frozen), `A` is `[in_dim, r]`
(trainable, initialized to a small random value), `B` is
`[r, out_dim]` (trainable, initialized to zero), and `alpha` is a
scalar that controls how much the adapter influences the layer.
The rank `r` is typically 4, 8, 16, or 32.

At the start of training, `B = 0`, so the adapter contributes
zero — the model behaves identically to the base model. As
training progresses, `B` (and `A`) update, and the adapter starts
to nudge the layer's behavior.

## A Reference Implementation

```python
import torch
import torch.nn as nn
import math

class LoRAAdapter(nn.Module):
    def __init__(self, base_layer: nn.Linear, r: int = 8, alpha: float = 16.0):
        super().__init__()
        self.base = base_layer
        for p in self.base.parameters():
            p.requires_grad = False  # freeze the base

        in_dim, out_dim = base_layer.in_features, base_layer.out_features
        self.r = r
        self.alpha = alpha
        self.scaling = alpha / r

        self.lora_a = nn.Parameter(torch.empty(in_dim, r))
        self.lora_b = nn.Parameter(torch.zeros(r, out_dim))

        # Kaiming-uniform init for A; B starts at zero by design.
        nn.init.kaiming_uniform_(self.lora_a, a=math.sqrt(5))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        base_out = self.base(x)
        lora_out = (x @ self.lora_a) @ self.lora_b
        return base_out + lora_out * self.scaling
```

That is the entire adapter. About thirty lines including blank
lines and docstrings if you add them. Compare against any
production LoRA implementation — the math is identical.

## Where to Inject

You do not need to add LoRA to every linear layer in the model.
Empirically, LoRA on the **attention projection layers** (Q, K, V,
O) gives most of the benefit. Optionally extend to the MLP layers
for a stronger fine-tune at a small parameter cost.

A simple injection function:

```python
def inject_lora(model: nn.Module, target_names: list[str], r: int = 8, alpha: float = 16.0):
    """
    Replace every nn.Linear layer in `model` whose qualified name
    ends with one of `target_names` with a LoRAAdapter wrapping it.
    """
    for name, parent in model.named_modules():
        for child_name, child in list(parent.named_children()):
            if isinstance(child, nn.Linear):
                full_name = f"{name}.{child_name}" if name else child_name
                if any(full_name.endswith(t) for t in target_names):
                    setattr(parent, child_name, LoRAAdapter(child, r=r, alpha=alpha))
    return model

# Usage:
model = inject_lora(
    model,
    target_names=["q_proj", "k_proj", "v_proj", "o_proj"],
    r=8,
    alpha=16.0,
)
```

After injection, `model.parameters()` includes both the frozen base
parameters (which will not update because their `requires_grad` is
False) and the new LoRA parameters (which will).

To verify only the adapters are trainable:

```python
trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
total = sum(p.numel() for p in model.parameters())
print(f"trainable: {trainable:,} / total: {total:,} ({100 * trainable / total:.2f}%)")
```

For a 7B model with LoRA at rank 8 on attention projections, you
should see about 0.05% trainable. Fifty thousand parameters out of
seven billion. That is the entire trick.

## Saving and Loading Adapters

Adapters can be saved separately from the base model. This is
useful — one base model, many specialized adapters, swap as needed.

```python
def save_lora(model: nn.Module, path: str):
    state = {
        name: param.detach().cpu()
        for name, param in model.named_parameters()
        if "lora_" in name
    }
    torch.save(state, path)

def load_lora(model: nn.Module, path: str):
    state = torch.load(path, map_location="cpu")
    own_state = dict(model.named_parameters())
    for name, tensor in state.items():
        if name in own_state:
            own_state[name].data.copy_(tensor)
```

Save: a few MB. Load: a fraction of a second. Versioning a fleet
of specialized adapters is much simpler than versioning a fleet of
full-fine-tuned 7B models.

## QLoRA, Briefly

A common extension: load the base model in 4-bit quantization
(saving memory) while keeping the LoRA adapters in full precision.
This pushes fine-tuning of larger models onto smaller GPUs at the
cost of some quality. The technique is called **QLoRA**. We will
not implement quantized loading from scratch in this module — it
involves bit-packing tricks that go beyond fine-tuning per se —
but the LoRA adapter you wrote works *unchanged* on a quantized
base model, because the adapter only sees the layer's input and
output, never its internal weights.

If you ever need QLoRA, the adapter code in this module is the
right starting point. Add a quantization wrapper around the base
layer; the adapter does not need to know.

## Are-Self Connection

When the Hippocampus encodes memories, the embedding model that
produced its vectors was itself trained with techniques in this
family. When the Hypothalamus chooses among models, several of
those models may be a single base model with different LoRA
adapters loaded — same base weights, different specializations,
swapped at routing time. The savings are dramatic: store one base
model on disk, swap a few MB of adapter weights as needed,
specialize per request.

The pathway companion to this course shows how a NeuralPathway
loads a base model, injects LoRA, and registers the resulting
specialized model with the Hypothalamus.

## Think About It

- LoRA assumes the optimal weight update is low-rank. Why might
  that be true in practice? What kind of fine-tune would *not*
  fit this assumption?
- The adapter starts as zero (`B = 0`). What is the equivalent
  state of a full fine-tune at the start of training, and why does
  LoRA's zero-init matter for stable training?
- A LoRA adapter is small enough that you could plausibly ship
  one alongside the user's request itself. What would that enable?

## Exit Ticket

1. For a `nn.Linear(4096, 4096)` layer fine-tuned at LoRA rank 16,
   how many trainable parameters does the adapter add? How does
   that compare to a full fine-tune of the same layer?
2. Why does the adapter start with `B` initialized to zero rather
   than a small random value?
3. You apply LoRA at rank 8 to the attention projections of a 7B
   model. Roughly what fraction of the model's parameters are
   trainable? What does this imply about the GPU memory required
   for fine-tuning?

Module 5 is the actual training loop.

## Module Genome — Neural Modifier

The runnable deliverable from this module is a **NeuralModifier**
bundle named `tune-lora` (`neuroplasticity/genomes/tune-lora.zip`).
It adds Low-Rank Adaptation as a thin PyTorch wrapper —
`LoRAAdapter`, `inject_lora`, and the save/load helpers — to your
Are-Self instance.

| Field | Value |
|-------|-------|
| Bundle | `neuroplasticity/genomes/tune-lora.zip` |
| Registers | `inject_lora_adapters` Effector; `save_lora_adapters` / `load_lora_adapters` Effectors; `LoRAAdapter` (importable PyTorch module) |
| Install via | `install_bundle_from_archive("neuroplasticity/genomes/tune-lora.zip")` |
| Screenshot | *Modifier Garden after install — captured during play-through.* |

This modifier composes with the others in the course. The course-
level [pathway](./pathway) calls `inject_lora_adapters` after the
baseline eval and before fine-tuning.
