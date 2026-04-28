---
title: "Module 8 — Capstone"
sidebar_position: 9
---

# Module 8: Capstone

## Learning Objectives

By the end of this module, you will have:

- Selected a base model, downloaded its weights, and verified the
  load
- Built or sourced an evaluation set for your target task
- Fine-tuned LoRA adapters on representative training data
- Evaluated the fine-tune against the base on multiple categories
- Served the result locally and registered it with Are-Self

## The Brief

Fine-tune a model. Specialize it for a domain or task you care
about. Evaluate it rigorously. Serve it locally. Register it with
Are-Self's Hypothalamus. Document everything.

The success criterion is not "the fine-tune is amazing." The
success criterion is "you can defend every decision."

## Suggested Project Shapes

### Project A — Style Specialist

Fine-tune a 1B–3B base model on a specific writing voice. Source:
your own writing, an author you can copy from legally (Project
Gutenberg), or a corporate brand voice you have access to. Evaluate
on pairwise human preference for in-style outputs. This is the
clearest demonstration of "fine-tuning does what it says it does."

### Project B — Domain Q&A

Fine-tune for question-answering on a specific technical domain
(your codebase, a product line, a body of internal documentation).
Compare against a base-model + retrieval baseline. The interesting
question: does fine-tuning add value over retrieval, or not?
Honest answer either way is a good capstone.

### Project C — Format Locker

Fine-tune to produce reliably-structured output (specific JSON
schemas, specific markdown formats, specific code style). Compare
against the base model with strong prompting. Measure adherence
rate, not just average quality.

### Project D — Are-Self Integration

The full pipeline. Fine-tune a model. Serve it locally. Register
with the Hypothalamus. Run a real Are-Self workload through it for
a week. Report the routing decisions the Hypothalamus made, the
quality observed, the cost saved.

## Required Deliverables

Your capstone repository should contain:

1. `download.py` — script that downloads and verifies the base
   model weights from a stable source
2. `model.py` — your transformer architecture (extending the work
   from *Build an AI From Scratch*)
3. `lora.py` — your LoRA adapter implementation
4. `train.py` — fine-tuning loop
5. `data/train.jsonl` and `data/eval.jsonl` — training and
   evaluation data
6. `evaluate.py` — runs the harness, produces a comparison report
7. `serve.py` — the FastAPI server with KV caching
8. `register.py` — script that registers the served model with
   Are-Self's Hypothalamus
9. `README.md` — domain choice, hyperparameters, training cost,
   evaluation results, deployment notes
10. `eval_report.md` — the formal evaluation report (Module 6)

The base model weights themselves are too large for a repo. Document
the download source and let the user download.

## Hyperparameters: A Starting Point

For a 1.1B-parameter base model with LoRA fine-tuning:

| Hyperparameter | Value |
|----------------|-------|
| Base model | TinyLlama-1.1B or Phi-2 (2.7B) |
| LoRA rank | 8 |
| LoRA alpha | 16 |
| LoRA targets | q_proj, k_proj, v_proj, o_proj |
| Learning rate | 1e-4 |
| Batch size | 4 |
| Epochs | 3 |
| Max sequence length | 1024 |
| Mixed precision | bfloat16 |

A few thousand training examples + three epochs is one to four
hours on a single 24GB GPU. CPU-only is possible but painful — plan
overnight.

## Honesty Requirements

The capstone has integrity rules:

- **Do not retroactively change the eval set.** If the fine-tune
  performs poorly on a category, report that. Adjusting the eval
  set after seeing results is data manipulation.
- **Report regressions.** Catastrophic forgetting on adjacent
  tasks must be in the report.
- **Disclose data source.** The provenance of your training data
  matters for license compliance and for evaluating the fine-tune
  fairly.
- **Disclose failures.** If a hyperparameter sweep failed, if the
  first attempt did not converge, if you tried a larger rank and
  it overfit — those are part of the story.

A capstone with negative results, honestly reported, is more
valuable to the community than a capstone with cherry-picked
positive results. If your fine-tune does not actually improve over
the base model + good prompting, that finding is worth publishing.

## Sharing What You Built

If your capstone is useful:

- Open-source the repository under MIT
- Submit the eval report as a community contribution to this
  course — future students benefit from worked examples in
  different domains
- Submit the served model to the Are-Self community model gallery
  (when it exists)
- Write up *what surprised you* — those notes are the most useful
  output of any capstone

## What Comes Next

You now have most of the skills for serious applied ML work in a
sovereignty-respecting stack. Natural next courses:

- ***Graphs and Sleep Consolidation*** — the structural-math layer
  underneath Are-Self's memory model
- ***Hypothalamus Cost Management*** — the economics of routing
  many models in concert at scale
- ***CS Frameworks: Django, DRF, Are-Self*** — wrapping your
  served model in a production-shaped service inside the Are-Self
  codebase

You are an engineer who can fine-tune a model without depending on
anybody else's hub. Few people in the field can say that. Use it.

## Final Reflection

Include in your eval report a one-page reflection:

1. Was fine-tuning the right answer for your problem? If you ran
   the decision tree from Module 1 again now, would you stop
   earlier?
2. What surprised you about training the adapter — what was
   easier than expected, what was harder?
3. What did your evaluation reveal that you would not have
   noticed without it?
4. Will you fine-tune again? For what kinds of problems? And what
   would you do differently?

The model and the report are the artifacts. The reflection is the
work.

## Module Genome — Neural Modifier

The runnable deliverable from this capstone is the **composition
modifier** named `tune-pathway-composition`
(`neuroplasticity/genomes/tune-pathway-composition.zip`). It is what
turns the seven module-modifiers above into a working
NeuralPathway: it ships the `TunePretrainedModel` pathway fixture
(including the CONDITIONAL axon predicate) and depends on
`tune-decision-rubric`, `tune-load-checkpoint`, `tune-eval-harness`,
`tune-lora`, `tune-fine-tune-loop`, `tune-eval-compare`, and
`tune-serve` via the Modifier Garden's `requires` field.

| Field | Value |
|-------|-------|
| Bundle | `neuroplasticity/genomes/tune-pathway-composition.zip` |
| Registers | `TunePretrainedModel` NeuralPathway fixture (Neurons + Axons + CONDITIONAL predicate + EffectorContext defaults) |
| Requires | All seven `tune-*` module modifiers from this course |
| Install via | `install_bundle_from_archive("neuroplasticity/genomes/tune-pathway-composition.zip")` |
| Screenshot | *Modifier Garden after full install (eight bundles ENABLED) + a successful pathway run completing through `ServeAndRegister` — captured during play-through.* |

When all eight modifiers are installed and ENABLED, the
[TunePretrainedModel pathway](./pathway) runs end-to-end. Firing
its Begin Play Neuron triggers: load checkpoint, evaluate baseline,
inject LoRA, fine-tune, evaluate tuned, compare, conditionally
serve and register, record outcome.

This is what completing this course produces: the *capability to
specialize pretrained models* — sovereignly, locally, with rigorous
evaluation as a precondition for shipping — added to your Are-Self
instance as eight composable bundles.
