---
title: "Module 4 — Training and Inference"
sidebar_position: 5
---

# Module 4: Training and Inference

## How Does AI Learn, and How Does It Answer?

By now you know that AI reads text as tokens (Module 1), processes them through a model with billions of parameters (Module 2), and represents meaning as vectors in high-dimensional space (Module 3). But where did all of those parameters come from? How did the model learn what it knows? And what happens, mechanically, when you send it a question?

These are two fundamentally different processes: **training** (how the model learns) and **inference** (how the model answers). Understanding the difference is essential to understanding AI's capabilities, limitations, and costs.

## Training: Building the Brain

Training is the process of setting the model's parameters — finding the right position for each of those billions of dials we discussed in Module 2.

Here is the basic idea:

1. Start with a model whose parameters are set randomly. It knows nothing. It produces gibberish.
2. Show the model a piece of text with the last token hidden. Ask it to predict the hidden token.
3. Compare its prediction to the actual token. Calculate how wrong it was.
4. Adjust the parameters slightly to make the prediction a little less wrong next time.
5. Repeat this process billions of times with billions of pieces of text.

That is it. The model learns by predicting the next token, being told how wrong it was, and adjusting. It does this so many times, with so much text, that the parameters gradually organize into a structure that captures grammar, facts, reasoning patterns, and even something that looks like common sense.

This process is called **pre-training** — the initial phase where the model learns from raw text.

### The Training Data

Pre-training requires enormous amounts of text. Current large models are trained on datasets measured in trillions of tokens — the equivalent of millions of books, billions of web pages, and vast archives of code, scientific papers, and conversations.

The quality and composition of the training data profoundly shapes what the model knows and how it behaves. A model trained mostly on English text will be better at English than at French. A model trained on a lot of code will be better at programming tasks. A model trained on text from the internet will reflect the internet's biases, errors, and cultural assumptions.

This is one of AI's deepest limitations: the model can only know what was in its training data. If a fact was not present in the training text, or was present but rare, the model may not know it. If the training data contains a false claim that appeared frequently, the model may confidently repeat it. The model does not know what is true. It knows what is statistically common.

### Fine-Tuning

After pre-training, a model can be **fine-tuned** — given additional training on a smaller, more focused dataset to improve its performance on specific tasks.

Imagine training a person by having them read every book in a library (pre-training), and then having them work as an apprentice with a doctor for six months (fine-tuning). The library gave them broad knowledge. The apprenticeship gave them specific skill.

Fine-tuning is much cheaper and faster than pre-training because it starts from an already-capable model and adjusts a small number of parameters. Organizations often fine-tune a general-purpose model on their own data to create a version that understands their domain, terminology, and style.

### RLHF: Reinforcement Learning from Human Feedback

There is a problem with a model trained purely on next-token prediction: it learns to produce text that looks like the internet, but not necessarily text that is helpful, honest, or safe.

RLHF is a technique that addresses this. After pre-training and fine-tuning, human reviewers rate the model's outputs. "This response was helpful." "This response was harmful." "Response A is better than Response B." These ratings are used to further train the model, pushing it toward outputs that humans prefer.

RLHF is why modern AI assistants usually give direct, helpful answers instead of rambling. It is why they usually refuse to produce harmful content. It is why they apologize when corrected. These are not properties of the underlying language model — they are behaviors shaped by human feedback.

### The Cost of Training

Training a large language model is extraordinarily expensive:

- **Compute** — training a model with hundreds of billions of parameters requires thousands of specialized processors (GPUs or TPUs) running continuously for weeks or months. The compute cost for a single training run can exceed $10 million, and frontier models may cost over $100 million.
- **Data** — acquiring, cleaning, and curating trillions of tokens of training data is a significant effort involving legal, ethical, and technical challenges.
- **Energy** — the electricity required to power the compute infrastructure is substantial, raising questions about environmental impact.
- **People** — teams of researchers, engineers, and human reviewers are involved throughout the process.

This cost is why only a handful of organizations train frontier models: OpenAI, Anthropic, Google, Meta, Mistral, and a few others. Most organizations use models that others have trained.

## Inference: Using the Brain

Once training is complete, the model's parameters are frozen. It does not learn from your conversations. It does not update its knowledge. The parameters are fixed, stored in files, and loaded into memory when the model runs.

**Inference** is the process of using a trained model to generate output. When you send a message to ChatGPT or Claude, inference is what happens: your tokens go in, the model's parameters process them, and output tokens come out.

Inference is much cheaper than training — but it is not free. Each request consumes:

- **Compute** — processing your input tokens through billions of parameters requires significant computation
- **Memory** — the model's parameters must be loaded into GPU memory, which is expensive and limited
- **Time** — generating output tokens happens sequentially (one at a time), so longer responses take longer
- **Energy** — every computation consumes electricity

The cost of inference is measured in tokens (as you learned in Module 1). You pay for the tokens you send in (input tokens) and the tokens the model generates (output tokens). Output tokens are typically more expensive because generating each one requires running the full model.

### Batch Processing vs. Real-Time

Inference can happen in two modes:

**Real-time** — you send a request and wait for the response. This is what happens in a chat interface. Latency (the time between sending and receiving) matters. Users expect responses within seconds.

**Batch** — you send many requests at once and receive the results later. This is used for large-scale processing: analyzing a thousand documents, generating a thousand summaries, classifying a thousand support tickets. Cost matters more than latency.

Some providers offer lower prices for batch processing because they can schedule the work during off-peak hours, use leftover compute capacity, and process multiple requests simultaneously.

## How Are-Self Manages Training and Inference

Are-Self does not train models. It uses models that others have trained. Its job is to make inference as efficient, reliable, and cost-effective as possible.

Here is how the concepts from this module show up in Are-Self:

**Model catalog** — Are-Self's `AIModelPricing` table includes information about each model's training lineage: who trained it, when, on what data (to the extent known), and whether it has been fine-tuned for specific tasks. This helps the Hypothalamus make informed selection decisions.

**Inference routing** — when a Neuron in a Neural Pathway requests AI inference, the request goes to the Hypothalamus, which selects the appropriate model, sends the request, and receives the response. The Neuron never interacts with the model directly.

**Token tracking** — Are-Self counts input and output tokens for every inference request and records them against the Identity's budget. This is how cost control works at the token level.

**Context window management** — Are-Self checks whether a request will fit within a model's context window before sending it. If it will not fit, the request is routed to a model with a larger window — or the input is truncated, depending on the configuration.

**No model training** — Are-Self deliberately does not train or fine-tune models. It is a consumer of inference, not a producer of models. This is a design choice: by staying out of the training business, Are-Self remains model-agnostic. It can use any model from any provider, and switch between them based on cost, quality, and availability.

## Think About It

- A model trained on internet text reflects the internet's biases and errors. What biases exist in the text you have read in your life? How do those biases shape your own "parameters"?

- Training costs millions of dollars. Inference costs fractions of a cent per request. But inference at scale (millions of users, millions of requests) costs as much as training. What does it mean for something to be cheap individually but expensive collectively?

- The model does not learn from your conversations. Your messages go in, the response comes out, and the model forgets you instantly. Does this change how you think about your relationship with AI?

- RLHF shapes models to produce outputs that humans prefer. But which humans? The reviewers are a small, specific group. What happens when their preferences diverge from yours?

## Going Deeper

For an accessible explanation of how training works mechanically, Andrej Karpathy's lecture "Let's build GPT: from scratch, in code" (available on YouTube) walks through the entire process. Despite the title, the explanation is conceptual enough to follow without coding experience.

The RLHF technique was introduced in "Training language models to follow instructions with human feedback" (Ouyang et al., 2022), the paper behind InstructGPT, which was the precursor to ChatGPT. It is available on arXiv and is one of the most influential AI papers of the decade.
