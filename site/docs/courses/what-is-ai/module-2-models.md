---
title: "Module 2 — Models"
sidebar_position: 3
---

# Module 2: Models

## What Is a Language Model, and How Does It Think?

In Module 1, you learned that AI converts your words into tokens — numerical representations of text. But converting text to numbers is just the first step. The actual "intelligence" lives in the **model** — a massive mathematical function that takes tokens as input and produces tokens as output.

This module explains what a model is, how it works at a high level, and why some models are better than others.

## The Prediction Machine

At its core, a language model does one thing: it predicts the next token.

That is it. Given a sequence of tokens, the model calculates the probability of every possible next token and picks the most likely one (or, more precisely, samples from the probability distribution — but we will keep it simple for now).

When you ask an AI "What is the capital of France?", the model is not looking up the answer in a database. It is predicting, one token at a time, what sequence of tokens is most likely to follow your question. It predicts "The" as the most likely first token. Then, given "The," it predicts "capital" as the most likely second token. Then "of." Then "France." Then "is." Then "Paris." Then ".".

Each token is predicted based on all the tokens that came before it. The model does not plan ahead. It does not have a draft of the full answer that it reveals token by token. It is genuinely generating the response one piece at a time, and each piece is influenced by everything that preceded it.

This is both remarkable and limiting. It is remarkable because this simple mechanism — predict the next token — produces text that reads like it was written by a knowledgeable human. It is limiting because the model has no understanding of what it is saying. It has statistical patterns, not comprehension.

## Parameters and Weights

A model's "knowledge" is stored in its **parameters** — numerical values, also called weights, that determine how the model transforms input tokens into output probabilities.

Think of parameters as dials on an enormous mixing board. A music mixing board has dozens of dials — volume, bass, treble, reverb — and the position of each dial shapes the sound. A language model has billions of dials, and the position of each one shapes how the model predicts the next token.

- A model with 7 billion parameters has 7 billion dials
- A model with 70 billion parameters has 70 billion dials
- A model with 400 billion parameters has 400 billion dials

More parameters generally means more capacity to capture nuance, handle complex tasks, and produce higher-quality output. But more parameters also means more computation to run the model, more memory to store it, and more energy to power it.

The process of setting these parameters — finding the right position for each dial — is called **training** (covered in Module 4). Once training is complete, the parameters are fixed, and the model is ready for use.

## What Happens Inside

When you send tokens to a model, here is roughly what happens:

1. **Embedding** — each input token is converted into a vector (a list of numbers — more on this in Module 3). This vector captures the token's meaning and relationships.

2. **Attention** — the model calculates how much each token should "pay attention" to every other token in the sequence. The word "bank" in "river bank" should pay attention to "river." The word "bank" in "bank account" should pay attention to "account." The attention mechanism figures this out.

3. **Transformation** — the model runs the attention-weighted vectors through layers of mathematical transformations. Each layer refines the representation, combining information from different tokens, applying learned patterns, and building toward a prediction.

4. **Output** — the final layer produces a probability for every token in the vocabulary. The token with the highest probability (or a token sampled from the distribution) becomes the output.

This happens for every single token the model generates. If the model produces a 500-token response, steps 1-4 run 500 times.

The architecture that makes this work is called a **transformer** — invented in 2017 by researchers at Google in a paper titled "Attention Is All You Need." The transformer architecture is what makes modern AI language models possible. Essentially every major language model today — GPT, Claude, Gemini, Llama, Mistral — is a transformer.

## Model Sizes and Capabilities

Models come in different sizes, measured by parameter count:

| Size Category | Parameter Count | Typical Use |
|---------------|----------------|-------------|
| Small | 1-7 billion | Simple tasks, fast responses, low cost. Good for classification, summarization of short texts, and basic Q&A. |
| Medium | 7-70 billion | Most general tasks. Good enough for coding assistance, document analysis, and creative writing. |
| Large | 70-400+ billion | Complex reasoning, nuanced tasks, expert-level performance. Best for tasks requiring deep understanding or multi-step reasoning. |

Bigger is not always better. A 7-billion parameter model can answer "What is the capital of France?" just as accurately as a 400-billion parameter model — and it will do it faster and cheaper. The larger model's advantage shows up on harder tasks: writing a legal brief, debugging complex code, or synthesizing information from a long document.

This is why model selection matters, and why Are-Self's Hypothalamus exists. Sending every request to the largest, most expensive model is wasteful. Sending every request to the smallest, cheapest model produces poor results on complex tasks. The optimal strategy is to match the model to the task — and that is exactly what the Hypothalamus does.

## Are-Self's Model Catalog

Are-Self does not come with a built-in AI model. Instead, it maintains a catalog of available models — external services (like OpenAI's GPT or Anthropic's Claude) and locally hosted models (like Llama running on your own hardware).

The catalog is stored in the `AIModelPricing` table and includes:

- The model's name and provider
- Its parameter count and context window size
- Its per-token pricing (input and output)
- Its capability flags (what it can do: text, code, vision, etc.)
- Its capability vector (a mathematical representation of what it is good at — Module 3 explains vectors)

When a request comes in, the Hypothalamus consults this catalog to find the best model. "Best" depends on context: the cheapest model that can handle the task, the fastest model, the highest-quality model, or some balance of all three.

The catalog is not static. Administrators add new models as they become available and remove models that are deprecated. Prices are updated when providers change them. Capability vectors evolve as the system learns which models perform well on which tasks.

## The Difference Between a Model and an AI Product

This distinction matters: a model is a mathematical function. An AI product is a system built around a model.

ChatGPT is a product. The model inside it (GPT-4, GPT-4o, etc.) is the mathematical function. The product includes the chat interface, the conversation history, the safety filters, the user accounts, and the billing system. The model does the thinking; the product does everything else.

Are-Self is also a product — but a very different kind. Instead of wrapping a single model in a chat interface, Are-Self orchestrates multiple models through a brain-like architecture. The Hypothalamus selects models. The Central Nervous System routes workflows. The Hippocampus manages memory. The model is just one component in a larger system.

Understanding this distinction helps you evaluate AI products critically. When someone says "our AI can do X," the question is: is that the model's capability, or the product's capability? A model that can generate text is impressive. A system that selects the right model, manages costs, handles failures, and distributes work across a fleet — that is a different kind of achievement.

## Think About It

- If a language model "just predicts the next token," how does it produce responses that seem intelligent? Is statistical pattern matching the same as understanding? Is there a meaningful difference?

- More parameters means more capability but also more cost. In your own life, what are the trade-offs between capability and cost? When do you choose the "smaller model" (the simpler, cheaper option) and when do you invest in the "larger model"?

- The same model can produce different outputs for the same input (because of sampling from probability distributions). What does it mean for a tool to be consistent but not deterministic?

## Going Deeper

The original transformer paper — "Attention Is All You Need" (Vaswani et al., 2017) — is available freely online. The title is not an exaggeration; the attention mechanism really is the key innovation.

For an intuitive visual explanation of how transformers work, 3Blue1Brown's YouTube series on neural networks and transformers is excellent. It uses visual animations to show how attention and parameters interact.
