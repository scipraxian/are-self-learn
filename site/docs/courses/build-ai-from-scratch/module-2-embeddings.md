---
title: "Module 2 — Embeddings and Positions"
sidebar_position: 3
---

# Module 2: Embeddings and Positions

## Learning Objectives

By the end of this module, you will be able to:

- Explain what an embedding is and why a token ID is not enough
- Implement a token embedding lookup with PyTorch
- Implement learned positional embeddings and sinusoidal positional encodings
- Explain why the transformer needs positional information at all
- Reason about embedding dimensionality as a capacity choice

## From Token ID to Vector

After Module 1 you have a tokenizer that turns text into a list of
integers. Those integers are not yet useful to a neural network. The
network does not know that token 47 is `the` and token 312 is `cat`.
It just sees integers.

The job of an **embedding** is to map every token ID to a vector in a
high-dimensional space, where the geometry of the space encodes
something about meaning. Tokens that play similar roles end up near
each other. Tokens that play different roles end up far apart. The
vectors start as random noise and the training process pulls them
into useful positions over many gradient steps.

In code:

```python
import torch
import torch.nn as nn

vocab_size = 8000
d_model = 128

embed = nn.Embedding(vocab_size, d_model)

token_ids = torch.tensor([47, 312, 9, 5])
vectors = embed(token_ids)
print(vectors.shape)  # torch.Size([4, 128])
```

That is it. `nn.Embedding` is essentially a lookup table — a matrix of
shape `[vocab_size, d_model]` where row `i` is the embedding of token
`i`. The lookup is differentiable, which means gradient flows back
into the matrix during training and the rows update.

## Why d_model

`d_model` is the embedding dimension and the working dimension of the
whole transformer. Every layer in the model passes around vectors of
this size. A larger `d_model` means more capacity per token and a
bigger model overall (the embedding table alone is `vocab_size *
d_model` parameters).

For a tiny model: 64 to 256.
For a small model: 256 to 768.
For a real-world LLM: 2,048 to 12,288 or more.

We will use `d_model = 128` for most of this course because it trains
fast on a CPU and the math is easy to inspect.

## The Position Problem

A transformer processes tokens in parallel — every position attends to
every other position simultaneously. This is great for speed but
disastrous for word order. The sentences "the cat saw the dog" and
"the dog saw the cat" produce identical token *sets*. Without extra
information, a transformer cannot tell them apart.

Positional encoding is the fix. Each position in the sequence gets its
own vector, and that vector is added to the token embedding before the
attention layers see it. Now the model sees `the` at position 0 as a
different vector than `the` at position 4.

## Two Common Approaches

### Learned Positional Embeddings

Treat position as just another vocabulary, with one entry per position
up to your max sequence length:

```python
max_seq_len = 512
pos_embed = nn.Embedding(max_seq_len, d_model)

positions = torch.arange(0, 4)            # [0, 1, 2, 3]
pos_vectors = pos_embed(positions)        # [4, 128]

combined = vectors + pos_vectors          # token + position
```

Simple. Trainable. Works well. The downside is that the model has no
way to extrapolate to sequence lengths longer than `max_seq_len` it
saw during training.

### Sinusoidal Positional Encoding

The original *Attention Is All You Need* paper used a fixed (not
trainable) encoding based on sines and cosines of varying frequencies:

```python
import math

def sinusoidal_position_encoding(seq_len: int, d_model: int) -> torch.Tensor:
    pe = torch.zeros(seq_len, d_model)
    position = torch.arange(0, seq_len).unsqueeze(1).float()
    div_term = torch.exp(
        torch.arange(0, d_model, 2).float() * -(math.log(10000.0) / d_model)
    )
    pe[:, 0::2] = torch.sin(position * div_term)
    pe[:, 1::2] = torch.cos(position * div_term)
    return pe
```

This produces a smooth, deterministic vector for every position. The
clever trick is that the *relative* position of two tokens is encoded
in a way that is roughly translation-invariant — adding a constant
offset to both positions changes their absolute encodings but not
their relative geometry. Modern variants (rotary embeddings,
attention with linear biases) build on this idea.

## Putting It Together

Combining both:

```python
class TokenAndPositionEmbedding(nn.Module):
    def __init__(self, vocab_size: int, max_seq_len: int, d_model: int):
        super().__init__()
        self.token_embed = nn.Embedding(vocab_size, d_model)
        self.pos_embed = nn.Embedding(max_seq_len, d_model)

    def forward(self, token_ids: torch.Tensor) -> torch.Tensor:
        # token_ids: [batch, seq_len]
        seq_len = token_ids.size(1)
        positions = torch.arange(seq_len, device=token_ids.device)
        return self.token_embed(token_ids) + self.pos_embed(positions)
```

This is a building block we will reuse in every later module.

## Are-Self Connection

The Hippocampus stores memories — engrams — as vectors in a 768-
dimensional space, produced by an embedding model called
`nomic-embed-text`. The arithmetic is the same as what you have
written above: tokens go in, vectors come out, vectors get compared
by similarity. The difference between a token embedding (per token)
and a sentence embedding (per sentence) is just where you stop and
how you pool. The principle is identical.

When you finish this course you will know exactly what is happening
when the Hippocampus says "this engram is 91% similar to that
engram." It is a cosine of two vectors that started life as token
embeddings and got compressed by a transformer.

## Think About It

- Embedding spaces are *learned*. They start random. By the end of
  training they encode useful structure. What does this say about the
  difference between a token and a meaning?
- Positional encoding adds a vector to the token embedding. Why
  addition rather than concatenation? (Hint: parameter cost.)
- If you trained a model on sequences up to length 512 and then
  fed it a sequence of length 600, what would happen with each kind
  of positional encoding?

## Exit Ticket

1. Given `vocab_size = 8000`, `max_seq_len = 512`, and
   `d_model = 128`, how many parameters does the combined
   token-and-position embedding module have?
2. Why must positional encoding be added before, not after, the
   attention layers?
3. What changes if `d_model` doubles? What gets bigger, what gets
   slower, what stays the same?

If those land cleanly, on to attention.

## Module Genome — Neural Modifier

The runnable deliverable from this module is a **NeuralModifier**
bundle named `bafs-embeddings` (`neuroplasticity/genomes/bafs-embeddings.zip`).
It adds the token-and-position embedding builder to your Are-Self
instance.

| Field | Value |
|-------|-------|
| Bundle | `neuroplasticity/genomes/bafs-embeddings.zip` |
| Registers | `build_token_position_embedding` Effector |
| Install via | `install_bundle_from_archive("neuroplasticity/genomes/bafs-embeddings.zip")` |
| Screenshot | *Modifier Garden after install — captured during play-through.* |

This modifier composes with the others in the course. The course-
level [pathway](./pathway) wires the Effector registered here into
the rest of the build pipeline.
