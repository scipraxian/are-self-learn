---
title: "Module 3 — Baseline Evaluation"
sidebar_position: 4
---

# Module 3: Baseline Evaluation

## Learning Objectives

By the end of this module, you will be able to:

- Build an evaluation set that represents your target task
- Run baseline inference on a pretrained model and capture outputs
- Compare two models' outputs on the same prompts in a fair way
- Distinguish between automatic metrics and human judgment, and know
  when each one is enough

## Why Baseline First

Before you change anything about a model, you measure what it
already does. Without a baseline, you cannot tell whether
fine-tuning improved the model, made it worse, or had no measurable
effect. The most common failure mode in fine-tuning projects is not
"the fine-tune did not work" — it is "we never measured what
working would look like, so we shipped a fine-tune that we now
cannot defend."

This module is about doing the work that gets skipped.

## Building an Evaluation Set

Your evaluation set is a fixed list of prompts, with optional
reference answers, that represents the task you are trying to
improve. Properties of a good evaluation set:

- **Representative.** The prompts look like real workload, not
  edge cases or adversarial probes (those go in a separate
  hardened set).
- **Fixed.** The set does not change between runs. Once you commit
  to a set, you keep it. You can grow it, but you do not retroactively
  edit prompts that already have measurements against them.
- **Sized.** Big enough to be statistically meaningful, small
  enough to evaluate without burning a day. For most fine-tuning
  projects, **200 to 500 prompts** is the right zone.
- **Stratified.** Group by difficulty, by topic, or by intent so
  you can spot regressions in one stratum even if overall metrics
  improve.
- **Held out.** Never train on your eval set. If a prompt appears
  in your training data, you cannot use it for evaluation.

Save the set as JSONL:

```jsonl
{"id": "001", "prompt": "Summarize this in three bullets:\n\n[long text]", "category": "summarize", "reference": "..."}
{"id": "002", "prompt": "Translate to French:\n\nHello, world.", "category": "translate", "reference": "Bonjour, monde."}
```

The format is simple. You should be able to read it without tools.

## A Simple Evaluation Harness

```python
import json
import torch
from pathlib import Path

class EvalHarness:
    def __init__(self, model, tokenizer, eval_path: str, output_dir: str):
        self.model = model
        self.tokenizer = tokenizer
        self.eval_set = [json.loads(line) for line in Path(eval_path).open()]
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def run(self, run_name: str, max_new_tokens: int = 256, temperature: float = 0.0):
        outputs = []
        self.model.eval()
        for ex in self.eval_set:
            ids = torch.tensor([self.tokenizer.encode(ex["prompt"])])
            with torch.no_grad():
                generated = generate_until(
                    self.model, ids, max_new_tokens, temperature, eos_id=self.tokenizer.eos_id
                )
            text = self.tokenizer.decode(generated[0].tolist())
            outputs.append({
                "id": ex["id"],
                "prompt": ex["prompt"],
                "category": ex["category"],
                "reference": ex.get("reference"),
                "output": text,
                "run": run_name,
            })
        out_path = self.output_dir / f"{run_name}.jsonl"
        with out_path.open("w") as f:
            for row in outputs:
                f.write(json.dumps(row) + "\n")
        return out_path
```

`generate_until` is a small helper around the generation routine
from Module 5 of *Build an AI From Scratch*, extended to stop at
`eos_id`. The harness writes one JSONL file per run. You can diff
runs by ID after the fact.

## Comparing Two Runs

```python
def compare_runs(run_a_path: str, run_b_path: str):
    a = {row["id"]: row for row in (json.loads(line) for line in open(run_a_path))}
    b = {row["id"]: row for row in (json.loads(line) for line in open(run_b_path))}
    for ex_id in sorted(a.keys() & b.keys()):
        if a[ex_id]["output"] != b[ex_id]["output"]:
            yield {
                "id": ex_id,
                "category": a[ex_id]["category"],
                "prompt": a[ex_id]["prompt"],
                "a_output": a[ex_id]["output"],
                "b_output": b[ex_id]["output"],
            }
```

This produces a stream of differences. For each one, a human can
look at A and B and decide which is better. (Automated grading is
covered later in this module.)

## Automatic Metrics

For tasks where there is a reference answer, you can compute
automatic metrics:

- **Exact match.** Did the output match the reference? Useful for
  classification, structured output.
- **Token overlap (F1).** What fraction of tokens in the reference
  appear in the output? Useful for short-answer extraction.
- **Edit distance.** How many character edits transform output
  into reference? Useful when format matters.
- **BLEU / ROUGE.** N-gram overlap measures, originally from
  translation. Useful for summarization.
- **Perplexity.** The model's average loss on a held-out corpus.
  Useful for language modeling but unreliable as a proxy for
  user-visible quality.

For tasks where there is no clean reference (open-ended
generation, creative writing, reasoning), automatic metrics will
mislead you. Use human judgment.

## Pairwise Human Evaluation

The cheapest, most reliable evaluation for open-ended tasks: take
the same prompt, the output from model A, the output from model B.
Show them to a human (or to a panel of humans, anonymized and
randomized). Ask: which one is better, by your best judgment, for
this task?

You do not need many comparisons to get a reliable signal. Around
**100 paired comparisons** with two or three reviewers is usually
enough to detect a meaningful quality difference between models.

A simple pairwise sheet:

```
Prompt: [prompt text]

Output A: [model A output]
Output B: [model B output]

Better: [ ] A   [ ] B   [ ] Tie
Notes: ___________________
```

Tally the results. If A wins more than B by a margin larger than
chance variation, A is better. If neither wins clearly, the
fine-tune is not making a measurable difference and you should
question whether to ship it.

## LLM-as-Judge

A middle path between automatic metrics and human review: prompt a
strong model (Claude, GPT-4, Llama 70B) to compare the two outputs
and pick a winner. Cheaper than humans, more flexible than
automatic metrics, more biased than either if you do not control
for it.

Use it when:

- You have many comparisons to do
- The task is well-defined enough for a competent reader to judge
- You can validate the judge against a small set of human
  judgments first

Do not use it when:

- The judge is the same family of model as one of the candidates
  (it will favor itself in subtle ways)
- Stylistic nuance matters in ways the judge may not catch
- Stakes are high enough that bias risk is unacceptable

## Are-Self Connection

The Hypothalamus selects models in part on a capability score.
That score is, structurally, a result of evaluation: a record of
how each model performed on representative tasks. After this
module, you can populate that score with real measurement, not
guesswork.

A model in the catalog with no evaluation record is a model the
Hypothalamus cannot reason about. Adding evaluation results — even
small ones — turns a guess into a routing decision.

## Think About It

- An evaluation set "freezes" your definition of success. What
  happens to the integrity of your measurements if you edit the
  set after measurements exist?
- Automatic metrics correlate with quality less than people
  expect. What does this say about evaluation as a discipline,
  versus evaluation as a workflow?
- Pairwise human evaluation is more sensitive than rating each
  output independently. Why might that be?

## Exit Ticket

1. You build a 200-prompt eval set and measure your baseline
   model. After fine-tuning, the new model produces *different*
   outputs on 80% of prompts. What does this tell you?
2. Why might pairwise human comparison detect quality differences
   that automatic metrics miss?
3. You want to use an LLM-as-judge to compare two fine-tunes of
   Llama-7B. Which model should you not use as the judge, and why?

Once you have a baseline, you are ready to inject LoRA.
