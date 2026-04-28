---
title: "Module 4 — The Transformer Block"
sidebar_position: 5
---

# Module 4: The Transformer Block

## Learning Objectives

By the end of this module, you will be able to:

- Explain the role of residual connections, layer normalization, and the MLP
- Implement a transformer block by composing the pieces from Module 3
- Reason about the pre-norm vs post-norm decision
- Stack blocks into a deeper model and predict where the parameter count goes

## What a Block Does

A transformer block is the unit you stack to make the model deeper.
The standard block has two sub-layers: multi-head self-attention,
followed by a position-wise feed-forward network (the "MLP"). Each
sub-layer is wrapped in a residual connection and a layer
normalization.

Pseudocode:

```
x = x + Attention(LayerNorm(x))
x = x + MLP(LayerNorm(x))
```

That is the whole block. Twelve characters of math. The difficulty
is in why each piece is there.

## Layer Normalization

Layer normalization rescales each token's vector so it has mean zero
and unit variance, then applies learned scale and shift parameters.
It stabilizes training by keeping vector magnitudes from drifting as
gradients flow through many layers.

```python
import torch
import torch.nn as nn

ln = nn.LayerNorm(d_model)
x = ln(x)
```

Two trainable parameters per dimension (`gamma` and `beta`), applied
elementwise after normalization. Cheap, effective, ubiquitous.

## Residual Connections

A residual connection is `output = input + sublayer(input)`. The
sublayer learns a *correction* to the input rather than a full
replacement. This has two large effects:

1. **Gradient flow.** During backprop, gradients flow through the
   addition unchanged, in addition to flowing through the sublayer.
   Deep networks without residuals struggle with vanishing gradients.
2. **Identity initialization.** If you initialize the sublayer's
   weights small, the block starts as approximately the identity
   function. Training nudges it away from identity in useful
   directions, rather than starting from random chaos.

Stack twelve blocks and the residuals are what make the optimization
even possible.

## The MLP

The position-wise feed-forward network is two linear layers with a
nonlinearity in between, applied independently at each position.
Standard practice is to expand the dimension by a factor of four in
the middle:

```python
class MLP(nn.Module):
    def __init__(self, d_model: int):
        super().__init__()
        self.fc1 = nn.Linear(d_model, 4 * d_model)
        self.act = nn.GELU()
        self.fc2 = nn.Linear(4 * d_model, d_model)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.fc2(self.act(self.fc1(x)))
```

The MLP is where most of the parameters in a transformer live. The
attention layer is `4 * d_model^2` parameters (Q, K, V, O); the MLP
is `8 * d_model^2` parameters (two 4x linears). About two-thirds of
the per-block parameter count is MLP.

## Pre-Norm vs Post-Norm

The original transformer paper used **post-norm**: layer
normalization came *after* the residual addition.

```
x = LayerNorm(x + Attention(x))
x = LayerNorm(x + MLP(x))
```

Modern practice has shifted to **pre-norm**: normalization happens
*inside* each sub-layer, before the operation that uses it.

```
x = x + Attention(LayerNorm(x))
x = x + MLP(LayerNorm(x))
```

Pre-norm trains more stably, especially for deep models, because the
residual stream is not normalized — gradients can flow through it
unmodified. We will use pre-norm.

## The Block, In Code

```python
class TransformerBlock(nn.Module):
    def __init__(self, d_model: int, n_heads: int):
        super().__init__()
        self.ln_1 = nn.LayerNorm(d_model)
        self.attn = MultiHeadAttention(d_model, n_heads)
        self.ln_2 = nn.LayerNorm(d_model)
        self.mlp = MLP(d_model)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = x + self.attn(self.ln_1(x))
        x = x + self.mlp(self.ln_2(x))
        return x
```

That is the transformer. Everything else in the architecture is
embedding, output projection, or repetition of this block.

## Stacking

A "two-layer transformer" means two blocks stacked. A "twelve-layer
transformer" means twelve. Each block has the same architecture but
its own independent parameters.

```python
class TransformerStack(nn.Module):
    def __init__(self, d_model: int, n_heads: int, n_layers: int):
        super().__init__()
        self.blocks = nn.ModuleList([
            TransformerBlock(d_model, n_heads) for _ in range(n_layers)
        ])

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        for block in self.blocks:
            x = block(x)
        return x
```

For our tiny model in Module 5 we will use four to six layers. For a
real-world model, twelve to ninety-six.

## Counting Parameters

For a transformer block with `d_model = 128`:

- Attention: `4 * 128^2 = 65,536` parameters (Q, K, V, O combined)
- MLP: `2 * (128 * 512 + 512) + (512 * 128 + 128) = ~131,712`
  parameters
- Two LayerNorms: `2 * 2 * 128 = 512` parameters

Per block: roughly **198,000** parameters.

A four-layer stack at this size is roughly 800,000 parameters, plus
the embedding table (`8000 * 128 = ~1M`), giving a model just under
2M parameters total. Tiny, but big enough to learn. We will train
this in Module 6 and beyond.

## Are-Self Connection

The Reasoning Sessions in the Frontal Lobe call out to LLMs that are
made of stacks of these blocks. When the Hypothalamus picks a model
based on cost and capability, the cost is essentially proportional to
the parameter count of the stack you are about to invoke. The
capability comes mostly from the depth and width of these blocks.

Once you understand the block, you understand the unit of price.

## Think About It

- The MLP is where most of the parameters live. What does this say
  about *where* a transformer's learned knowledge is stored?
- Layer normalization rescales activations to unit variance. What
  goes wrong if you remove it from a deep model?
- Pre-norm and post-norm are mathematically different but
  expressively similar. Why would the *training dynamics* prefer
  pre-norm?

## Exit Ticket

1. For `d_model=256`, `n_heads=8`, how many parameters are in a
   single transformer block?
2. Why does the residual connection bypass the sub-layer rather than
   being applied to its output directly (as in `output =
   sublayer(input + previous_residual)`)?
3. If you doubled the MLP expansion factor from 4x to 8x, what would
   change about training? About inference cost?

Onward to assembling a model.
