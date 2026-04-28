---
title: "Module 3 — Attention"
sidebar_position: 4
---

# Module 3: Attention

## Learning Objectives

By the end of this module, you will be able to:

- Explain attention as a query-key-value lookup
- Implement single-head causal self-attention from primitives
- Implement multi-head attention by reshape and parallel computation
- Reason about why we scale by the square root of head dimension
- Identify causal masking and explain why an autoregressive model needs it

## The One-Line Definition

Attention is a soft, content-addressed lookup. Every output position
asks a *query* of every other position; each position offers a *key*
to be matched against; once a query is matched to a key, the
corresponding *value* is what gets returned. The "soft" part is that
instead of picking the single best match, we take a weighted average
across all matches, where the weights are how well each key matched
the query.

Read that paragraph three times. Then write the code.

## The Math, Concretely

Given an input sequence `x` of shape `[batch, seq_len, d_model]`,
attention computes:

1. Three projections: `Q = x @ W_q`, `K = x @ W_k`, `V = x @ W_v`,
   each of shape `[batch, seq_len, d_head]`.
2. A score matrix: `scores = Q @ K.transpose(-2, -1) / sqrt(d_head)`,
   shape `[batch, seq_len, seq_len]`.
3. A causal mask applied to scores so position `i` cannot attend to
   any position `j > i`.
4. A softmax over the last dimension: `weights = softmax(scores)`.
5. A weighted sum of values: `output = weights @ V`, shape
   `[batch, seq_len, d_head]`.

The whole operation is differentiable end-to-end because every step
is a matrix multiplication, an elementwise scaling, a softmax, or a
mask.

## Single-Head Implementation

```python
import math
import torch
import torch.nn as nn
import torch.nn.functional as F

class SingleHeadAttention(nn.Module):
    def __init__(self, d_model: int, d_head: int):
        super().__init__()
        self.W_q = nn.Linear(d_model, d_head, bias=False)
        self.W_k = nn.Linear(d_model, d_head, bias=False)
        self.W_v = nn.Linear(d_model, d_head, bias=False)
        self.d_head = d_head

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: [batch, seq_len, d_model]
        B, T, _ = x.shape
        q = self.W_q(x)
        k = self.W_k(x)
        v = self.W_v(x)

        scores = q @ k.transpose(-2, -1) / math.sqrt(self.d_head)

        mask = torch.triu(
            torch.ones(T, T, device=x.device, dtype=torch.bool), diagonal=1
        )
        scores = scores.masked_fill(mask, float("-inf"))

        weights = F.softmax(scores, dim=-1)
        return weights @ v
```

That is one head of attention. Forty lines of Python including blanks.
You can run it on a fake input and watch shapes flow through.

## Why the Scale Factor

Without the `/ sqrt(d_head)` divisor, the dot products in `scores`
grow with the dimension of `d_head`. Larger scores push softmax into
saturation — most of the probability mass concentrates on a single
position, gradients shrink, training stalls. Dividing by
`sqrt(d_head)` keeps the magnitude of `scores` roughly constant
regardless of how large `d_head` becomes. This is one of the most
load-bearing little details in the whole transformer architecture.

## Causal Masking

The triangular mask sets every entry above the diagonal to negative
infinity. After softmax, those entries become zero. The effect is
that position `i` can only attend to positions `0..i`, never to
positions ahead of it.

Why? Because we are training the model to predict the next token
given the previous tokens. If position `i` could see position `i+1`,
predicting `i+1` from position `i`'s output would be trivial — the
answer is right there. The mask removes that shortcut and forces the
model to learn the actual next-token distribution.

This is what makes our model **autoregressive**. Encoder-style
transformers (used for classification, embedding generation, masked
language modeling) drop the causal mask and let every position attend
to every other position. We are building a generator, so we keep it.

## Multi-Head Attention

A single head learns one way of routing information. Multi-head
attention learns several in parallel, then concatenates the outputs.
Empirically, several specialized heads do better than one wide one
with the same total parameter count.

The trick is to reshape rather than to instantiate `n_heads` separate
modules:

```python
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model: int, n_heads: int):
        super().__init__()
        assert d_model % n_heads == 0
        self.n_heads = n_heads
        self.d_head = d_model // n_heads
        self.W_qkv = nn.Linear(d_model, 3 * d_model, bias=False)
        self.W_o = nn.Linear(d_model, d_model, bias=False)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, T, C = x.shape
        qkv = self.W_qkv(x)                       # [B, T, 3C]
        q, k, v = qkv.split(C, dim=-1)            # [B, T, C] each

        # Reshape into [B, n_heads, T, d_head]
        q = q.view(B, T, self.n_heads, self.d_head).transpose(1, 2)
        k = k.view(B, T, self.n_heads, self.d_head).transpose(1, 2)
        v = v.view(B, T, self.n_heads, self.d_head).transpose(1, 2)

        scores = q @ k.transpose(-2, -1) / math.sqrt(self.d_head)
        mask = torch.triu(
            torch.ones(T, T, device=x.device, dtype=torch.bool), diagonal=1
        )
        scores = scores.masked_fill(mask, float("-inf"))
        weights = F.softmax(scores, dim=-1)

        out = weights @ v                         # [B, n_heads, T, d_head]
        out = out.transpose(1, 2).contiguous().view(B, T, C)
        return self.W_o(out)
```

The single `W_qkv` linear projects to all three (Q, K, V) at once,
which is a real performance win. The reshape into a head dimension
lets all heads compute in parallel via batched matrix multiplication.
The final `W_o` mixes the heads' outputs.

This is the attention block that goes into the transformer. We will
not improve on it.

## Are-Self Connection

When the Frontal Lobe runs a Reasoning Session and the LLM produces a
turn, this is the operation that produced every token of the
response. Every token of every model Are-Self routes to ran through
multi-head attention — typically dozens of layers of it, on a model
that is many orders of magnitude bigger than the one you are
building. The mechanism is identical. The scale is the only thing
that differs.

## Think About It

- The query, key, and value projections all start from the same
  input. What is each one *for*? Why do we need all three rather than
  one?
- Causal masking is what makes a generator a generator. What would
  change about your model if you trained it without the mask?
- Multi-head attention has the same parameter count as single-head
  attention with the same `d_model`. Why is it nonetheless useful?

## Exit Ticket

1. Given `d_model=128`, `n_heads=8`, what is `d_head`? How many total
   parameters in `MultiHeadAttention`? (Hint: count `W_qkv` and
   `W_o`.)
2. The score matrix has shape `[B, n_heads, T, T]`. Why is the second
   `T` dimension the *key* dimension rather than the *query*
   dimension? (Hint: which axis does softmax sum over?)
3. If you removed the causal mask and trained the model to predict
   the next token anyway, what would the model learn?

Ready to wrap this up into a transformer block.
