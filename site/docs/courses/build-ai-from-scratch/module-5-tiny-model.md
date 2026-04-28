---
title: "Module 5 — A Tiny Transformer"
sidebar_position: 6
---

# Module 5: A Tiny Transformer

## Learning Objectives

By the end of this module, you will be able to:

- Assemble a complete transformer language model from the parts you
  built in Modules 1–4
- Implement weight tying between the input embedding and output
  projection
- Implement greedy and temperature-sampled generation
- Run a forward pass on real input and inspect the output logits

## Putting It All Together

You have a tokenizer (Module 1). You have token-and-position
embeddings (Module 2). You have multi-head attention (Module 3). You
have a transformer block (Module 4). The last piece is the *language
modeling head* — a linear layer that projects the transformer's
final hidden states back into vocabulary space, producing one score
per possible next token.

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

from module_1 import BPETokenizer
from module_4 import TransformerStack
from module_2 import TokenAndPositionEmbedding


class TinyTransformer(nn.Module):
    def __init__(
        self,
        vocab_size: int,
        max_seq_len: int = 512,
        d_model: int = 128,
        n_heads: int = 4,
        n_layers: int = 4,
    ):
        super().__init__()
        self.embed = TokenAndPositionEmbedding(vocab_size, max_seq_len, d_model)
        self.blocks = TransformerStack(d_model, n_heads, n_layers)
        self.ln_f = nn.LayerNorm(d_model)
        self.lm_head = nn.Linear(d_model, vocab_size, bias=False)

        # Weight tying: share the embedding matrix with the output projection.
        self.lm_head.weight = self.embed.token_embed.weight

    def forward(self, token_ids: torch.Tensor) -> torch.Tensor:
        # token_ids: [batch, seq_len]
        x = self.embed(token_ids)             # [B, T, d_model]
        x = self.blocks(x)                    # [B, T, d_model]
        x = self.ln_f(x)                      # final layer norm
        logits = self.lm_head(x)              # [B, T, vocab_size]
        return logits
```

That is a complete transformer language model. The pieces fit
together exactly as you would expect from the previous modules. Read
the forward pass three times — every transformer in the world is a
variation on these lines.

## Weight Tying

The line `self.lm_head.weight = self.embed.token_embed.weight` is
worth pausing on. The input embedding is a `[vocab_size, d_model]`
matrix that turns token IDs into vectors. The output projection is a
`[d_model, vocab_size]` linear layer (transpose) that turns vectors
back into per-token logits. They have the same shape.

Tying them means we share parameters: the model uses the same matrix
to encode and to decode. This roughly halves the parameter count of
those layers, often improves quality, and matches the original
practice from *Attention Is All You Need*.

## A Forward Pass

Once the model is constructed, you can pass real tokenized text
through it and inspect what comes out:

```python
tok = BPETokenizer()
# (assume tokenizer trained as in Module 1 with vocab_size=8000)

model = TinyTransformer(vocab_size=8000)
model.eval()

text = "the cat sat on the"
ids = torch.tensor([tok.encode(text)])
logits = model(ids)
print(logits.shape)             # [1, T, 8000]
print(logits[0, -1].argmax())   # predicted next token id
```

The model is untrained, so the prediction will be nonsense. That is
expected — we have not run a single gradient step yet. We have
verified that the shapes flow correctly end-to-end and that the
model can produce a logit distribution over the vocabulary.

## Generation

A trained autoregressive model generates one token at a time by:

1. Running a forward pass on the current sequence
2. Looking at the logits at the last position
3. Sampling (or argmax-ing) a next token
4. Appending the new token to the sequence
5. Repeating until you hit a stop condition

```python
def generate(
    model: TinyTransformer,
    tok: BPETokenizer,
    prompt: str,
    max_new_tokens: int = 64,
    temperature: float = 1.0,
) -> str:
    ids = torch.tensor([tok.encode(prompt)])
    model.eval()
    for _ in range(max_new_tokens):
        with torch.no_grad():
            logits = model(ids)
        next_logits = logits[0, -1] / temperature
        probs = F.softmax(next_logits, dim=-1)
        next_id = torch.multinomial(probs, num_samples=1)
        ids = torch.cat([ids, next_id.unsqueeze(0)], dim=1)
    return tok.decode(ids[0].tolist())
```

`temperature = 1.0` is the natural distribution.
`temperature < 1.0` makes the model more confident (and more boring).
`temperature > 1.0` makes the model more random (and more chaotic).
At `temperature = 0` you would do argmax instead of sampling — pure
greedy decoding.

These are the same knobs you use when you call any modern chat API.

## Counting the Whole Model

For our default sizes:

- Embedding: `8000 * 128 = 1,024,000` parameters
  (positional adds `512 * 128 = 65,536`)
- Four transformer blocks at `~198,000` each = `~792,000`
- Final layer norm: `256` parameters
- LM head: tied with embedding, so 0 new parameters

Total: roughly **1.88M parameters**. A model you can train on a
laptop. A model whose every parameter you can locate by reading your
own code.

## Are-Self Connection

Are-Self does not, today, train its own LLMs from scratch — it routes
to existing ones via the Hypothalamus. But the Hippocampus does train
its own embedding model (`nomic-embed-text` style), and the
methodology is the same as what you have just built: a transformer
stack with a different head on top (a pooling layer plus an
embedding-objective loss instead of a next-token loss).

If you wanted to train a small custom model that runs entirely
inside your Are-Self installation — for a domain-specific use, or
simply to keep more inference local — this module is the foundation.

## Think About It

- Weight tying halves the parameter cost of the output projection
  while *improving* quality. What does this say about the geometric
  relationship between encoding and decoding?
- Generation samples one token at a time. What does this imply about
  inference cost as a function of output length?
- The model is untrained at the end of this module. What is it doing
  when you pass tokens through it?

## Exit Ticket

1. With `d_model=128`, `n_heads=4`, `n_layers=4`, `vocab_size=8000`,
   what is the total parameter count? (Show your work.)
2. The forward pass returns logits of shape `[B, T, vocab_size]`.
   For autoregressive generation, which slice of these logits do
   you actually use, and why?
3. What is the difference between `temperature=0` generation and
   `temperature=1.0` generation, in terms of the probability
   distribution being sampled from?

Module 6 is where we make this thing actually learn.

## Module Genome — Neural Modifier

The runnable deliverable from this module is a **NeuralModifier**
bundle named `bafs-tiny-model` (`neuroplasticity/genomes/bafs-tiny-model.zip`).
It adds the end-to-end tiny-transformer assembly (embedding +
transformer stack + LM head with weight tying) to your Are-Self
instance.

| Field | Value |
|-------|-------|
| Bundle | `neuroplasticity/genomes/bafs-tiny-model.zip` |
| Registers | `instantiate_tiny_transformer` Effector; `generate_from_model` Effector |
| Install via | `install_bundle_from_archive("neuroplasticity/genomes/bafs-tiny-model.zip")` |
| Screenshot | *Modifier Garden after install — captured during play-through.* |

This modifier composes with the others in the course. The course-
level [pathway](./pathway) wires the Effectors registered here into
the rest of the build pipeline.
