---
title: "Module 7 — Serving"
sidebar_position: 8
---

# Module 7: Serving

## Learning Objectives

By the end of this module, you will be able to:

- Serve a fine-tuned model from a simple local HTTP endpoint
- Apply post-training quantization to reduce memory and latency
- Reason about the latency-quality-cost trade-off space
- Register a locally-served model with Are-Self's Hypothalamus

## Why Serving Is Its Own Problem

A trained model on disk is not useful. A served model — exposed
behind an interface that other parts of your system can call — is.
Serving introduces concerns that training does not: latency,
concurrency, memory residency, deployment shape, observability.

This module is short by design. The point is to get a tuned model
serving real requests with no third-party hosting and no
HuggingFace-anything in the loop.

## The Minimal Server

A tuned model + a tokenizer + an HTTP framework = a serving
endpoint. Using FastAPI:

```python
import torch
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Load once at startup.
tokenizer = load_sentencepiece("tokenizer.model")
model = load_llama_like("base.safetensors", "config.json")
load_lora(model, "adapter.pt")
model.eval()

class GenerateRequest(BaseModel):
    prompt: str
    max_new_tokens: int = 256
    temperature: float = 0.0

class GenerateResponse(BaseModel):
    text: str
    input_tokens: int
    output_tokens: int

@app.post("/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest) -> GenerateResponse:
    ids = torch.tensor([tokenizer.encode(req.prompt)])
    input_tokens = ids.size(1)
    with torch.no_grad():
        out_ids = generate_until(
            model, ids, req.max_new_tokens, req.temperature, eos_id=tokenizer.eos_id
        )
    text = tokenizer.decode(out_ids[0].tolist())
    return GenerateResponse(
        text=text,
        input_tokens=input_tokens,
        output_tokens=out_ids.size(1) - input_tokens,
    )
```

Run with `uvicorn server:app --host 0.0.0.0 --port 8001`. Now any
HTTP client can hit your tuned model. No hub. No proxy. No
remote dependency.

## Latency Concerns

A naive autoregressive generator computes the full forward pass
for the entire sequence on every new token. This is wasteful — most
of the work was done on the previous token. The fix is **KV
caching**: store the key and value tensors from each attention
layer, and on the next token only compute the new query.

KV caching cuts inference time from O(n²) to O(n) and is essential
for any serving setup. Implementations are not trivial but the
core idea fits in a paragraph: every attention layer maintains a
growing buffer of past keys and values, the new query attends
against that buffer plus the new key, the new value is appended
to the buffer.

For the capstone, a careful implementation of KV caching is
expected. For a short serving demo without KV caching, generation
will work but be roughly N times slower than necessary.

## Quantization

A 7B model in float16 occupies about 14GB on disk and 14GB in
memory. **Post-training quantization** converts those weights to
lower precision (8-bit, 4-bit) for storage and inference. Memory
shrinks proportionally. Inference speed often improves because
memory bandwidth is the typical bottleneck.

Quantization schemes vary:

- **int8.** Halves memory. Quality cost: very small. Easy to
  implement.
- **int4 with grouped scales (q4_k_m, q4_0).** Quarters memory.
  Quality cost: moderate but well-characterized. Used widely in
  the llama.cpp ecosystem (the `.gguf` format).
- **3-bit and below.** Aggressive savings, larger quality cost.
  Domain-specific judgment call.

A naive int8 quantization implementation in PyTorch:

```python
def quantize_int8(weight: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
    scale = weight.abs().max(dim=-1, keepdim=True).values / 127.0
    q = (weight / scale).round().clamp(-128, 127).to(torch.int8)
    return q, scale

def dequantize_int8(q: torch.Tensor, scale: torch.Tensor) -> torch.Tensor:
    return q.to(torch.float32) * scale
```

For a serving system, you would replace each `nn.Linear` with a
quantized variant that stores the int8 weights and dequantizes on
the fly during the forward pass. Small libraries like `bitsandbytes`
do this; for the sovereignty stance of this course you would
implement it yourself in twenty or thirty lines.

## The Trade-Off Space

Three knobs at serving time:

- **Quality.** Higher quality = larger model, full precision, longer
  reasoning.
- **Latency.** Lower latency = smaller model, KV caching,
  quantization, batched requests.
- **Cost.** Lower cost = local hardware, smaller models,
  quantization.

You cannot maximize all three. You pick a point in the triangle
that fits your application:

- **Interactive chat:** prioritize latency. Quantize. Use a smaller
  fine-tuned model. Serve with KV caching.
- **Batch processing:** prioritize quality. Run the full-precision
  model overnight on a queue. Pay attention to throughput, not
  per-request latency.
- **Real-time decisions:** prioritize latency *and* deterministic
  cost. Use a small model, quantized, on dedicated hardware.

The Hypothalamus's catalog should reflect these trade-offs: each
served model has a recorded latency, quality score, and cost. The
routing policy reads them.

## Registering With Are-Self

To make your served model usable from inside Are-Self, register it
with the Hypothalamus:

```python
# Pseudocode — exact API surface varies. See the are-self-api docs.
from hypothalamus.client import register_model

register_model(
    name="my-tuned-llama-1b",
    route="http://localhost:8001/generate",
    context_window=4096,
    cost_per_input_token=0.0,
    cost_per_output_token=0.0,
    capability_profile={
        "summarization": 0.85,
        "translation": 0.40,
        "code-generation": 0.30,
        "in-house-style": 0.95,
    },
)
```

The capability_profile comes directly from your evaluation report
in Module 6. Are-Self does not need a separate measurement — your
eval is the measurement.

## Observability

A served model should produce telemetry:

- Per-request input and output token counts
- Per-request latency (TTFT — time to first token — and total)
- Per-request output (sampled, for spot-checking)
- Error rates (timeouts, OOMs, malformed inputs)

The simplest implementation is a structured log line per request,
forwarded to your existing log aggregator. A more elaborate
implementation exports metrics (Prometheus, OpenTelemetry) and
sample traces. Either way, observability is what lets you notice
quality regressions in production before users do.

## A Note on Concurrency

A single-threaded serving loop blocks on each generation. For low
traffic, this is fine. For higher traffic, you batch concurrent
requests together: when several prompts arrive at roughly the same
time, run them through the model in a single forward pass with
padding. This amortizes the model's per-token work across requests.

True production serving does this with sophisticated batching
schemes. For this course, a simple per-request loop is adequate.

## Are-Self Connection

The Hypothalamus catalogs the routes, costs, latencies, and
capabilities of every model it knows about. A locally-served fine-
tune with a documented capability profile becomes a first-class
member of that catalog — routed to when its profile fits the
request, with a known latency and a $0 marginal cost. This is the
end-state that makes fine-tuning *worth* the effort: a model in a
catalog, doing useful work, on hardware you own, every day.

## Think About It

- KV caching turns O(n²) inference into O(n). What does this
  imply about the relationship between context length and serving
  cost?
- Quantization saves memory and often speeds up inference. What
  is the case where it would *slow* inference down?
- A served fine-tune with $0 marginal cost is on the cost frontier.
  What is the implicit cost that does not appear in that number?

## Exit Ticket

1. Why is KV caching essential for any serious serving setup?
2. You quantize a 7B fine-tune from float16 to int8. What roughly
   happens to disk size, memory use, and inference speed?
3. Your fine-tune has a strong target-task profile and weak OOD
   profile. How should the Hypothalamus's routing policy use that
   information?

Module 8 is the capstone — pick a model, pick a domain, ship the
whole thing.
