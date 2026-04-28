---
title: "Module 6 — Evaluation"
sidebar_position: 7
---

# Module 6: Evaluation

## Learning Objectives

By the end of this module, you will be able to:

- Run a rigorous comparison between a fine-tuned model and its base
- Identify and quantify regressions on tasks the fine-tune was not
  trained for
- Apply pairwise human evaluation in a way that produces defensible
  conclusions
- Decide whether the fine-tune is shippable based on the evaluation

## What This Module Is For

Module 3 built the baseline. This module compares the fine-tune
against that baseline. The structure is similar; the focus shifts
from *measuring* to *deciding*.

## Three Questions to Answer

A fine-tune evaluation should produce a defensible answer to each:

1. **Does the fine-tune improve performance on the target task?**
2. **Does the fine-tune regress on tasks it was not trained for?**
3. **Is the change worth the cost of training, serving, and
   maintenance?**

A "yes" on (1), "no" on (2), and "yes" on (3) is shippable. Anything
else demands a closer look.

## Running the Comparison

You already have an evaluation harness from Module 3. Run it twice:
once with the base model, once with the fine-tuned model.

```python
harness = EvalHarness(model=base_model, tokenizer=tok, eval_path="eval.jsonl", output_dir="runs/")
base_run = harness.run("base")

harness = EvalHarness(model=tuned_model, tokenizer=tok, eval_path="eval.jsonl", output_dir="runs/")
tuned_run = harness.run("tuned")
```

You now have two JSONL files. Comparing them is the next step.

## Stratified Comparison

Group your eval examples by category (you tagged them in Module 3).
Compute per-category metrics and report each. The reason: fine-
tuning rarely improves uniformly. It often improves the target
category strongly while regressing on adjacent ones. A single
overall number averages those changes and hides the regression.

A simple report:

```python
from collections import defaultdict, Counter

def compare_by_category(base_run, tuned_run, judge):
    """
    For each category, count how many examples the judge prefers
    from base vs tuned vs ties.
    """
    by_cat = defaultdict(Counter)
    base_by_id = {row["id"]: row for row in base_run}
    tuned_by_id = {row["id"]: row for row in tuned_run}
    for ex_id in sorted(base_by_id.keys() & tuned_by_id.keys()):
        cat = base_by_id[ex_id]["category"]
        winner = judge(base_by_id[ex_id], tuned_by_id[ex_id])
        by_cat[cat][winner] += 1
    return dict(by_cat)
```

`judge` is a function that takes two output dicts and returns
`"base"`, `"tuned"`, or `"tie"`. It can be a human, an automatic
metric, or an LLM-as-judge as covered in Module 3.

The report you produce should look something like:

```
Category: target-style    →  tuned wins 78, base wins 12, ties 10  (76% tuned)
Category: factual-qa      →  tuned wins 22, base wins 41, ties 17  (28% tuned)
Category: code-generation →  tuned wins 18, base wins 35, ties 27  (23% tuned)
Category: creative-writing→  tuned wins 30, base wins 30, ties 40  (30% tuned)
```

The story this report tells is clear: the fine-tune does what it
was trained to do (target-style) and *measurably hurts* unrelated
capabilities (factual-qa, code-generation). Whether this trade-off
is acceptable depends on what your model is going to be used for.

## Catastrophic Forgetting

The drop in unrelated capabilities is **catastrophic forgetting** —
the model losing knowledge it had before fine-tuning. Mitigations:

- **Mix in general-domain data.** During fine-tuning, include some
  examples from the base model's original training distribution.
  This anchors the model and slows forgetting.
- **Use lower LoRA rank or learning rate.** Smaller updates =
  smaller forgetting.
- **Train for fewer epochs.** The forgetting compounds.
- **Use a smaller adapter (lower rank).** Lower-capacity adapters
  cannot move the model as far.

There is always a trade-off between specialization (which requires
moving the model away from its base behavior) and preservation
(which requires not moving it). LoRA is partly a *constraint* that
limits how far the model can move — and that is a feature.

## Out-of-Distribution Probes

Beyond the eval set, prepare a small *out-of-distribution* probe
set: prompts that have nothing to do with your target task. Run
both models on them. The fine-tune should produce essentially the
same outputs as the base model. If it produces different outputs,
the model has changed in ways you may not want.

This is especially important for **safety-relevant capabilities**.
A fine-tuned model that has lost its refusal behavior — answers
prompts the base model would have declined — is a fine-tune you
should not ship without redoing the safety training.

## Cost-Benefit Analysis

Once you have measured (1) and (2), the third question is
quantitative:

- What is the engineering cost of maintaining this fine-tune
  through future base model updates?
- What is the inference cost saved (if you are running locally
  instead of paying API tokens)?
- What is the user-visible quality lift?

A worked example. You fine-tune a 7B model. Inference latency
unchanged. Savings: $400/month in API costs. Quality lift on the
target task: 76% pairwise preference. Regression on adjacent
tasks: 7% to 15% across categories.

Decision factors:

- If 95% of your traffic is the target task: ship.
- If 40% of your traffic is the target task and the rest is
  adjacent: do not ship; the regression hurts more than the
  improvement helps.
- If you can route on-task traffic to the fine-tune and off-task
  traffic to the base model: ship, with a router.

The Hypothalamus is exactly such a router. A fine-tune evaluated
this way ships with a capability profile, and the router uses it.

## A Sample Evaluation Report

A defensible eval report contains:

1. **Eval set description.** Size, categories, how it was built.
2. **Baseline numbers.** Per-category metrics on the base model.
3. **Fine-tune numbers.** Same metrics on the tuned model.
4. **Pairwise comparison.** How a human (or LLM-judge) prefers
   the two side by side.
5. **OOD probe results.** Confirmation that off-task behavior did
   not regress.
6. **Cost analysis.** Compute used, time invested, projected
   savings or lift.
7. **Decision.** Ship, do not ship, or ship-with-router.
8. **Limitations.** What the eval did not measure and why.

That is what an eval that survives a code review looks like.

## Are-Self Connection

A fine-tune that ships into the Hypothalamus catalog ships with
this evaluation record attached. The Hypothalamus reads the
capability scores when routing. A fine-tune with strong target
metrics and weak OOD metrics gets routed *only* to on-target
requests. A fine-tune with strong target metrics and *also* strong
OOD metrics gets routed broadly. The eval report becomes the
input to a routing policy.

## Think About It

- A 76% pairwise preference for the fine-tune sounds great. What
  does it mean for the 24% where the fine-tune is *worse* than the
  base?
- Catastrophic forgetting is the model losing capability it had.
  What does this say about the assumption that more training is
  always better?
- An OOD probe set is essentially a *test for unintended side
  effects*. Why is this a different kind of test from your main
  eval set?

## Exit Ticket

1. Your fine-tune wins 80% of pairwise comparisons on the target
   category and loses 60% on an adjacent category. Should you
   ship?
2. Why is per-category reporting more important than a single
   overall accuracy number?
3. You discover the fine-tuned model has lost some of the base
   model's safety refusals. Name two interventions you could try
   before re-running the entire fine-tune.

Module 7 takes the shipped fine-tune and serves it.
