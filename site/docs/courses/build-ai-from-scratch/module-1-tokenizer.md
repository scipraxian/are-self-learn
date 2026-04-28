---
title: "Module 1 — Tokenizer From Scratch"
sidebar_position: 2
---

# Module 1: Tokenizer From Scratch

## Learning Objectives

By the end of this module, you will be able to:

- Explain why subword tokenization exists and what it does
- Implement a byte-pair-encoding (BPE) tokenizer in pure Python
- Train your tokenizer on a small corpus and inspect the learned vocabulary
- Encode arbitrary text into token IDs and decode back to text
- Reason about tokenizer choices: vocabulary size, special tokens, byte fallback

## Why Build a Tokenizer

Every transformer eats integers. Words are not integers. The tokenizer
is the bridge — and it is the first place a model's worldview is
fixed. Two models trained on the same data with different tokenizers
will produce different outputs, allocate cost differently, and have
different blind spots.

If you skip the tokenizer and import one, you are inheriting somebody
else's worldview. You will not know what edge cases it handles, what
languages it favors, or what it spends extra tokens on. By the end of
this module you will not just know what BPE is — you will have a
working BPE tokenizer with no surprises in it.

## The Algorithm in One Paragraph

Byte-pair encoding starts with a vocabulary of every byte (or every
character, depending on the variant). It scans a training corpus,
finds the most frequent pair of adjacent tokens, and merges that pair
into a new token. Repeat until you hit your target vocabulary size.
The list of merges, applied in order, becomes the encoding rule. The
inverse mapping is the decoder.

That is the whole algorithm. Everything else is bookkeeping.

## A Tiny Reference Implementation

Create `tokenizer.py`:

```python
from collections import Counter
from typing import Iterable

class BPETokenizer:
    def __init__(self) -> None:
        self.merges: list[tuple[bytes, bytes]] = []
        self.vocab: dict[bytes, int] = {}
        self.inv_vocab: dict[int, bytes] = {}

    def train(self, corpus: Iterable[str], vocab_size: int) -> None:
        # Start with byte-level vocabulary (256 tokens).
        self.vocab = {bytes([i]): i for i in range(256)}
        next_id = 256

        # Convert corpus to a list of byte sequences.
        sequences: list[list[bytes]] = [
            [bytes([b]) for b in s.encode("utf-8")] for s in corpus
        ]

        while next_id < vocab_size:
            pairs = Counter()
            for seq in sequences:
                for a, b in zip(seq, seq[1:]):
                    pairs[(a, b)] += 1
            if not pairs:
                break
            best_pair, _ = pairs.most_common(1)[0]
            merged = best_pair[0] + best_pair[1]
            self.merges.append(best_pair)
            self.vocab[merged] = next_id
            next_id += 1
            sequences = [_apply_merge(seq, best_pair, merged) for seq in sequences]

        self.inv_vocab = {v: k for k, v in self.vocab.items()}

    def encode(self, text: str) -> list[int]:
        seq: list[bytes] = [bytes([b]) for b in text.encode("utf-8")]
        for pair in self.merges:
            seq = _apply_merge(seq, pair, pair[0] + pair[1])
        return [self.vocab[t] for t in seq]

    def decode(self, ids: list[int]) -> str:
        chunks = b"".join(self.inv_vocab[i] for i in ids)
        return chunks.decode("utf-8", errors="replace")


def _apply_merge(seq: list[bytes], pair: tuple[bytes, bytes], merged: bytes) -> list[bytes]:
    out: list[bytes] = []
    i = 0
    while i < len(seq):
        if i + 1 < len(seq) and (seq[i], seq[i + 1]) == pair:
            out.append(merged)
            i += 2
        else:
            out.append(seq[i])
            i += 1
    return out
```

That is roughly fifty lines of Python and it is a complete BPE
tokenizer. No external libraries beyond the standard library.

## Try It

```python
corpus = [
    "the cat sat on the mat",
    "the dog sat on the mat",
    "the cat saw the dog",
] * 200

tok = BPETokenizer()
tok.train(corpus, vocab_size=300)

print(tok.encode("the cat"))
print(tok.decode(tok.encode("the cat")))
print(len(tok.vocab))
```

You should see a vocabulary that has learned `the`, ` cat`, ` dog`,
` sat`, ` on`, ` mat` as merged tokens. The encoding round-trips. The
vocabulary has 300 entries. Everything makes sense, because you wrote
all of it.

## Special Tokens

Real tokenizers reserve a handful of token IDs for purposes that have
nothing to do with the corpus:

- `<bos>` — beginning of sequence
- `<eos>` — end of sequence
- `<pad>` — padding for batching
- `<unk>` — unknown (less needed with byte fallback, but conventional)

In our implementation these would be added before the byte vocabulary,
shifting the byte IDs to start at, say, 4 instead of 0. The capstone
module covers this addition.

## Vocabulary Size: A Real Decision

Vocabulary size is one of the most consequential hyperparameters in the
entire pipeline. Smaller vocabularies mean longer sequences (because
words break into more pieces) and smaller embedding tables. Larger
vocabularies mean shorter sequences and bigger embedding tables.

For a tiny transformer trained on a small corpus, **2,000 to 8,000**
tokens is a reasonable starting range. For production-scale models,
vocabularies in the **30,000 to 100,000** range are common. There is
no single correct answer. There is a trade-off.

In Are-Self, the Hypothalamus tracks token counts per request as a cost
input. Different models have different vocabularies, which means the
same text produces different token counts under different models. The
Hypothalamus accounts for this when comparing prices.

## Are-Self Connection

The tokenizer you build in this module is the same kind of object that
counts tokens for the Hypothalamus's budget gating logic. When the
Hypothalamus receives a request, it uses the active model's tokenizer
to estimate cost before the request leaves the host. Yours is simpler,
but the architectural role is identical.

The pathway companion to this course (`pathway.md`) wires this
tokenizer into a Neuron whose Effector trains and saves a vocabulary,
making the tokenizer a first-class piece of the executable pathway,
not just a Python script.

## Think About It

- A tokenizer is a *decision* about what counts as a unit of meaning.
  What other systems in your life make those decisions for you, and
  how would your understanding change if you wrote those tokenizers
  yourself?
- The most frequent merges in a BPE tokenizer are the most frequent
  *patterns* in your data. What does this say about what your model
  will be good at and what it will struggle with?
- BPE is one tokenization algorithm. Others (WordPiece, Unigram,
  SentencePiece) make different trade-offs. Why might a multilingual
  model prefer a different scheme?

## Going Deeper

The original BPE paper for NLP is Sennrich, Haddow, and Birch (2016),
*Neural Machine Translation of Rare Words with Subword Units*. It is
short, clear, and worth reading once you have a working
implementation in your hands.

For implementation efficiency, real-world BPE training does not scan
the entire corpus on every iteration. It maintains a frequency table
of pairs and updates only the entries near a merge. We will revisit
this optimization briefly in Module 8 when we train on a corpus large
enough that naive training becomes painful.

## Exit Ticket

Before moving on, you should be able to answer:

1. Why does BPE start at the byte level rather than the character or
   word level?
2. What happens when you call `encode` on text that contains a byte
   sequence the tokenizer has never seen?
3. If you doubled your vocabulary size, what would you expect to
   happen to the average length of an encoded sequence?

If those answers are crisp, you are ready for Module 2.

## Module Genome — Neural Modifier

The runnable deliverable from this module is a **NeuralModifier**
bundle named `bafs-tokenizer` (`neuroplasticity/genomes/bafs-tokenizer.zip`).
It adds BPE tokenizer training to your Are-Self instance.

| Field | Value |
|-------|-------|
| Bundle | `neuroplasticity/genomes/bafs-tokenizer.zip` |
| Registers | `train_bpe_tokenizer` Effector; `tokenize_text` and `detokenize_ids` Parietal tools |
| Install via | `install_bundle_from_archive("neuroplasticity/genomes/bafs-tokenizer.zip")` |
| Screenshot | *Modifier Garden after install — captured during play-through.* |

This modifier composes with the others in the course. The course-
level [pathway](./pathway) wires the Effectors registered here into
the rest of the build pipeline.
