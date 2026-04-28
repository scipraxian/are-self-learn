---
title: "Module 2 — Loading Checkpoints"
sidebar_position: 3
---

# Module 2: Loading Checkpoints

## Learning Objectives

By the end of this module, you will be able to:

- Download a pretrained model checkpoint from a stable open source
- Load the weights into a transformer architecture you wrote yourself
- Verify the load by running a forward pass and inspecting outputs
- Reason about checkpoint formats (safetensors, GGUF, raw PyTorch)
  and which one fits which use case

## What a Checkpoint Is

A checkpoint is a serialized snapshot of a trained model's
parameters — every weight matrix, every bias, every layer norm scale
factor. It is just a dictionary mapping layer names to tensors.

The architectural information (number of layers, attention heads,
hidden dimension) lives in a small JSON config file alongside the
checkpoint. Together, config + weights are everything you need to
reconstruct the model.

## Where to Get Models

Stable, open sources of pretrained model weights:

- **Meta** publishes Llama checkpoints (subject to their license)
  via direct download from their site.
- **Mistral** releases Mistral 7B and friends with permissive
  licensing.
- **Microsoft** releases the Phi family openly.
- **Allen AI** releases OLMo with full open-source training data
  and code.
- **TII** releases the Falcon family.

Each of these can be downloaded as a directory of files: a config
JSON, a tokenizer (sometimes JSON, sometimes a SentencePiece
binary), and one or more weight files.

For this course we will use a small open-licensed model. Specific
choice will vary by year — pick something in the 1B–3B parameter
range that runs on a consumer GPU. Phi-2 (2.7B) and TinyLlama
(1.1B) are both reasonable starting points. Avoid anything that
requires hub authentication.

## Checkpoint File Formats

Three formats you will encounter:

### `pytorch_model.bin` (legacy)

Pickle-based format. Loads with `torch.load`. Convenient but unsafe
to load from untrusted sources — Pickle can execute arbitrary code
during loading.

### `model.safetensors` (modern default)

A safer, faster format introduced specifically to address the
Pickle issue. Loads with the `safetensors` library:

```python
from safetensors.torch import load_file

state_dict = load_file("model.safetensors")
```

`safetensors` is small, MIT-licensed, and has no hub dependency.
This is what you should prefer.

### `.gguf` (llama.cpp ecosystem)

A quantization-friendly format used by `llama.cpp` and similar
projects. Useful for running models in C++ runtimes with low memory.
Less convenient for fine-tuning. We will revisit GGUF in Module 7
when we discuss serving.

## Loading Weights Into Your Model

Here is the architecture from *Build an AI From Scratch* extended
to a slightly more realistic shape (rotary embeddings, RMSNorm,
SwiGLU MLP — the modern Llama-family standard). The architectural
specifics are not the point of this module — the point is that
once you have a model class that *matches* the checkpoint's
architecture, loading is mechanical.

```python
import torch
from safetensors.torch import load_file

class LlamaLikeTransformer(torch.nn.Module):
    """
    A small transformer in the Llama family — rotary embeddings,
    RMSNorm, SwiGLU MLP, no learned biases. Architecture matches
    a Llama-family checkpoint we are about to load.
    """
    def __init__(self, config: dict):
        super().__init__()
        # ... layer modules go here, named to match the checkpoint
        # We omit the implementation here for brevity; the previous
        # course covers the building blocks.
        ...

    def forward(self, token_ids: torch.Tensor) -> torch.Tensor:
        ...


def load_llama_like(checkpoint_path: str, config_path: str) -> LlamaLikeTransformer:
    import json
    with open(config_path) as f:
        config = json.load(f)
    model = LlamaLikeTransformer(config)
    state_dict = load_file(checkpoint_path)
    missing, unexpected = model.load_state_dict(state_dict, strict=False)
    print(f"missing keys: {len(missing)}")
    print(f"unexpected keys: {len(unexpected)}")
    return model
```

The interesting line is `load_state_dict(state_dict, strict=False)`.
With `strict=False`, PyTorch will tell you which keys in the
checkpoint do not match keys in your model, and vice versa. The
goal is `missing == [] and unexpected == []`. If you have either,
the architecture-to-checkpoint mapping is wrong somewhere — usually
a layer naming mismatch.

## Architecture Matching

The single biggest pain in this module is making your model's
parameter names match the checkpoint's. Pretrained checkpoints are
often saved with names like:

```
model.layers.0.self_attn.q_proj.weight
model.layers.0.self_attn.k_proj.weight
model.layers.0.self_attn.v_proj.weight
model.layers.0.self_attn.o_proj.weight
model.layers.0.mlp.gate_proj.weight
model.layers.0.mlp.up_proj.weight
model.layers.0.mlp.down_proj.weight
model.layers.0.input_layernorm.weight
model.layers.0.post_attention_layernorm.weight
```

Your model's submodules need to be named the same way. This is
unglamorous bookkeeping that pays off the moment the load succeeds.

When in doubt, inspect the checkpoint:

```python
state_dict = load_file("model.safetensors")
for k in sorted(state_dict.keys())[:30]:
    print(k, tuple(state_dict[k].shape))
```

This is your map. Use it to align your model's `__init__` to the
checkpoint's structure.

## Verifying the Load

Once `load_state_dict` returns with no missing or unexpected keys,
verify with a forward pass:

```python
import torch

model.eval()
ids = torch.tensor([[1, 2, 3, 4, 5]])  # whatever your tokenizer produces
with torch.no_grad():
    logits = model(ids)
print(logits.shape)
print(logits[0, -1].topk(5))
```

The top predicted next-token IDs should be sensible — probably some
common token in the model's vocabulary. If they are random, your
load did not actually populate the weights.

For a stronger test, compare against a reference implementation
running on the same model. Pick a prompt, run both implementations,
compare the logit distributions. If they agree to a few decimal
places, your load is correct.

## Tokenizers

The pretrained model's tokenizer is part of the checkpoint
distribution. Llama-family models typically ship with a
SentencePiece tokenizer model file. You can load it with the
`sentencepiece` library (a small, MIT-licensed Python package with
no hub dependencies):

```python
import sentencepiece as spm

sp = spm.SentencePieceProcessor()
sp.Load("tokenizer.model")
ids = sp.encode_as_ids("Hello, world.")
text = sp.decode_ids(ids)
```

Like the model weights themselves, you save the tokenizer file
locally and never touch a hub again.

## Are-Self Connection

The Hypothalamus represents each model in its catalog as a record
with: model name, route (local file path or remote endpoint),
context window, cost-per-token, capability vector. Loading a
pretrained model with the technique in this module gives you the
file path. The cost-per-token for a local model is essentially
zero (electricity only). The capability vector is the embedding of
a description of what the model is good at — a prompt engineering
problem, not a fine-tuning one.

Once registered, the Hypothalamus can route to your locally-loaded
model the same way it routes to a remote API.

## Think About It

- Why is `.safetensors` preferred over the legacy `.bin` format?
  What does this tell you about the security model of model
  distribution?
- Architecture matching is where most loading errors happen. What
  does this say about the implicit contract between a checkpoint
  and a code repository?
- A 7B-parameter model in float16 is roughly 14GB on disk. What
  does this imply about download cost and storage planning for
  several models?

## Exit Ticket

1. You load a checkpoint and `load_state_dict` reports 50 missing
   keys and 0 unexpected keys. What is going wrong?
2. You load a checkpoint and the forward pass returns logits whose
   `argmax` looks random. What is going wrong, given that
   `load_state_dict` reported no errors?
3. You want to fine-tune a 7B model on a 24GB GPU. The float16
   weights alone are 14GB. What problem are you about to have, and
   what techniques (to be covered in Modules 4–5) address it?

Onward — let's see what the model already knows.
