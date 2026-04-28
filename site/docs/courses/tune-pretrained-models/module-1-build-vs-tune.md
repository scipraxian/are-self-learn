---
title: "Module 1 — Build vs Tune"
sidebar_position: 2
---

# Module 1: Build vs Tune

## Learning Objectives

By the end of this module, you will be able to:

- Articulate when fine-tuning is the right approach and when it is
  not
- Identify three lower-cost interventions that often substitute for
  fine-tuning
- Estimate the order of magnitude of cost and benefit before you
  start a tuning project
- Apply a clear decision rubric to a real problem you bring

## The Trap

The most expensive mistake in applied AI is fine-tuning a model when
you did not need to. Fine-tuning consumes engineer time, compute
budget, evaluation effort, and ongoing maintenance — and in a
non-trivial fraction of cases, it produces no measurable improvement
over a well-prompted baseline.

This module exists to keep you out of that trap.

## The Decision Tree

Before fine-tuning, work through these in order. Stop at the first
"yes."

### 1. Is the base model already good enough?

Most modern models, well prompted, handle most tasks. Run a baseline
with a clear, structured prompt and a few in-context examples. If
the output is acceptable, you are done. No tuning needed.

### 2. Can you fix it with prompt engineering?

A well-designed prompt often beats a poorly-tuned model. Spend a
day on prompt iteration before you spend a week on data collection.
Look at: explicit task description, few-shot examples, structured
output schemas, decomposition into sub-tasks.

### 3. Can you fix it with retrieval (RAG)?

If the model lacks *facts* (your company's documentation, recent
events, niche references), retrieval-augmented generation is almost
always cheaper than fine-tuning. Embed your documents, look up
relevant ones at inference time, and stuff them into the context.
The model's general capabilities are unchanged. Only the inputs
change.

### 4. Can you fix it with tools?

If the model needs to *do something* it cannot do (perform a
calculation, look up a value, run a query), give it a tool. Tools
are often the missing piece in cases that look like "we need to
fine-tune the model on our database."

### 5. Now — and only now — do you fine-tune.

If you have ruled out (1)–(4) and the base model genuinely does not
have the capability you need, fine-tuning becomes appropriate.

## When Fine-Tuning Is the Right Tool

The cases where fine-tuning is the correct, and sometimes the only,
answer:

- **Style.** You want output in a specific voice, tone, or format
  that no amount of prompting can reliably produce. Fine-tuning on
  a few thousand examples of that voice is often the only path.
- **Domain shift.** Your domain uses vocabulary or syntax the base
  model has barely seen — legal documents in a specific
  jurisdiction, internal codebase conventions, a constructed
  language.
- **Latency.** A fine-tune that produces shorter, more direct
  responses will be faster at inference than a base model
  prompted to be brief. At high request volumes this can matter.
- **Cost.** Running a 1B-parameter fine-tune locally beats paying
  for tokens against a 70B-parameter API for high-volume
  internal-only workloads.
- **Privacy.** A locally-tuned model means data never leaves your
  hardware. For regulated or sensitive data, this can be a hard
  requirement.

If any of these apply, fine-tuning is on the table.

## When Fine-Tuning Is the Wrong Tool

Cases where teams reach for fine-tuning and shouldn't:

- **You need facts.** Models do not learn facts well from
  fine-tuning data. They learn patterns. If you fine-tune a model
  on "the capital of France is Paris," it will learn the
  *pattern* "the capital of X is Y," not the *fact* "Paris is the
  capital of France." Use retrieval.
- **Your data is small and noisy.** Fine-tuning on a hundred bad
  examples will make the model worse. Either invest in better
  data curation or use prompting.
- **You want the model to follow instructions better.** Modern
  base models already do this well. The marginal lift from
  fine-tuning is small and easily lost to data noise.
- **You need a different output format.** Use structured output
  (JSON schemas, constrained decoding, tools). Do not fine-tune
  for syntax.

## Order-of-Magnitude Costs

Before committing, sketch the costs.

**Engineer time:** A first fine-tuning project takes 2–6 engineer
weeks for a competent ML practitioner. The second one takes
2–6 days. The variance is in data preparation and evaluation, not
in training.

**Compute:** A LoRA fine-tune of a 7B model on 100k examples takes
a few hours on a single 24GB GPU. Full fine-tuning takes much
longer and a much larger GPU. QLoRA in 8-bit makes the GPU memory
requirement smaller at a small quality cost.

**Evaluation:** Often the expensive part. You need a held-out
dataset of representative examples (a few hundred minimum), and
you need an evaluation harness that can compare two models'
outputs on the same prompt. Plan to spend as much time on
evaluation as on training.

**Maintenance:** A fine-tune is a snapshot. As your domain evolves,
the fine-tune drifts out of date. Plan for retraining every few
months, or accept gradual quality decay.

## A Worked Example

A medium-sized company wants their internal Q&A chatbot to answer
questions about their product documentation. Engineering proposes
fine-tuning a 7B model on the documentation.

Walk the decision tree:

1. **Base model good enough?** Probably not — too domain-specific.
2. **Prompt engineering?** Helps, but the documentation is too
   large to fit in context.
3. **Retrieval?** Yes. Embed every paragraph of the documentation,
   retrieve the top-k relevant paragraphs at query time, prompt
   the base model with them.
4. **Tools?** Optional — could add a structured search tool over
   the docs.
5. **Fine-tuning?** Probably not needed.

In this case, retrieval is the right answer. Fine-tuning would
take weeks, perform worse (because models do not learn facts well),
and require ongoing retraining as the documentation evolves.

A different company wants a chatbot that responds in a specific
brand voice — second-person, lowercase, no exclamation marks, very
short. Walk the same tree:

1. **Base model good enough?** Voice is too specific.
2. **Prompt engineering?** Tries, sometimes works for the first
   few turns, drifts back to default voice.
3. **Retrieval?** Voice is not facts.
4. **Tools?** Voice is not actions.
5. **Fine-tuning?** Yes. A few thousand examples of in-voice
   responses, fine-tuned with LoRA, will lock the voice in
   reliably.

Different problems, different answers.

## Are-Self Connection

The Hypothalamus tracks the cost and capability of every model in
its catalog. When a request arrives, it scores the candidates and
picks. If you fine-tune a small model that handles 90% of your
internal traffic at 1/10th the cost of the base model, the
Hypothalamus will route to it whenever it qualifies. A good
fine-tune is a Hypothalamus optimization.

But — a *bad* fine-tune that "feels" specialized but performs
worse on the actual workload is one of the most expensive things
you can put in the catalog. The Hypothalamus will route to it
because it is cheap. Quality regressions will be invisible until a
user complains. The decision tree above is what keeps you from
shipping that bad fine-tune.

## Think About It

- Which of the cases in your work actually pass the decision tree?
  Be honest.
- Why are facts learned poorly by fine-tuning? (Hint: think about
  what the loss function is rewarding.)
- A fine-tune is a snapshot of a moment. What does this say about
  fine-tuning as a long-term solution to a domain that evolves?

## Exit Ticket

1. Name three interventions to try before fine-tuning, in order of
   typical cost.
2. You want a chatbot that always answers in valid JSON. Should
   you fine-tune for this?
3. Your fine-tune costs $200 in compute and saves $500 a month in
   API costs. After how long do you break even, and what is the
   biggest risk to that arithmetic?

If you are convinced that fine-tuning is the right answer for *your*
problem, go to Module 2 and start by loading a checkpoint.
