---
title: "Module 1 — Tokens"
sidebar_position: 2
---

# Module 1: Tokens

## How Does AI Read Your Words?

When you type a message to an AI, you are writing in English (or Spanish, or Mandarin, or whatever language you use). But the AI does not understand English. It understands numbers. Before the AI can do anything with your message, your words must be converted into numbers. The process of converting text into numbers is called **tokenization**, and the resulting numbers are called **tokens**.

This is the most fundamental concept in all of AI language processing. Everything else — models, training, inference, cost — builds on top of tokens. Get this module right, and the rest of the course will make sense.

## Words Are Not Tokens

Your first instinct might be: "One word equals one token." That is close, but wrong. Tokens are not words. They are **pieces** of words.

Consider the word "understanding." A tokenizer might break this into three tokens: "under," "stand," and "ing." Or it might break it into "understand" and "ing." Or it might keep it as one token if the word appears frequently enough in the training data. The exact split depends on the tokenizer — the specific algorithm used to chop text into pieces.

Why not just use whole words? Two reasons:

**Reason 1: Vocabulary size.** English has over 170,000 words in active use. If every word were its own token, the AI would need a vocabulary of at least 170,000 entries — and that is before considering other languages, misspellings, technical jargon, proper names, and the infinite creative ways humans combine letters. A token vocabulary of word pieces (called subwords) can represent any word in any language using a vocabulary of 30,000 to 100,000 entries. This is more manageable for the mathematics underneath.

**Reason 2: Unseen words.** If the AI had never encountered the word "cryptocurrency" during training, it would have no token for it and could not process it at all. But with subword tokens, "cryptocurrency" becomes "crypto" + "currency" — two tokens the AI has seen before. Subword tokenization means the AI can handle words it has never encountered by combining familiar pieces.

## What a Token Looks Like

Let us trace a sentence through tokenization. Take: "The cat sat on the mat."

A typical tokenizer might produce:

| Token | Text | Token ID |
|-------|------|----------|
| 1 | "The" | 464 |
| 2 | " cat" | 3797 |
| 3 | " sat" | 3492 |
| 4 | " on" | 319 |
| 5 | " the" | 262 |
| 6 | " mat" | 2291 |
| 7 | "." | 13 |

Notice a few things:

- "The" (capitalized, start of sentence) is a different token from " the" (lowercase, mid-sentence). Capitalization matters.
- The spaces are included in the tokens. " cat" is a single token that includes the leading space.
- Punctuation is its own token.
- This six-word sentence became seven tokens. Tokens and words do not map one-to-one.

Now consider a more complex sentence: "The transformative power of neuroplasticity."

A tokenizer might produce: "The" + " transform" + "ative" + " power" + " of" + " neuro" + "plast" + "icity" + "." — nine tokens for six words. Long and unusual words get split into more tokens. Common words stay intact.

## Context Windows

Every AI model has a **context window** — the maximum number of tokens it can process at once. Think of it as the model's short-term memory. A model with a context window of 4,000 tokens can "see" about 3,000 words at a time (since words average about 1.3 tokens each). A model with a context window of 128,000 tokens can see about 100,000 words — roughly the length of a novel.

The context window includes both the input (what you send to the model) and the output (what the model generates). If you send a 3,000-token prompt to a model with a 4,000-token context window, the model can only generate about 1,000 tokens in response before it hits the wall.

This is why you sometimes see AI responses get cut off mid-sentence. The model ran out of context window. It did not choose to stop — it was forced to.

Context windows have been growing rapidly. In 2022, most models had windows of 2,000 to 4,000 tokens. By 2025, windows of 128,000 to 200,000 tokens are common, and some models claim windows of over a million tokens. Larger context windows let you give the model more information, but they also cost more (more on this in Module 6).

## How Are-Self Uses Tokens

In Are-Self, tokens are not just an implementation detail — they are a cost management tool. The Hypothalamus (the brain region responsible for model selection and budget management) tracks token usage for every request:

- **Input tokens** — the number of tokens in the prompt you send
- **Output tokens** — the number of tokens the model generates in response
- **Total tokens** — the sum, which determines the cost of the request

When the Hypothalamus selects a model for a request, it estimates the token count and checks it against the budget. A request with 10,000 input tokens costs more than one with 100 input tokens, and the Hypothalamus knows this before the request is even sent.

Are-Self also checks token counts against model context windows. If your request would exceed a model's context window, that model is filtered out of the candidate list. You never get an error from sending too many tokens — the system routes you to a model that can handle them.

This is one of the practical benefits of understanding tokens: you can control costs by controlling token counts. Shorter prompts cost less. More concise instructions cost less. Asking the model to produce shorter responses costs less. Tokens are the unit of AI currency.

## The Hidden Tokenizer

Different AI models use different tokenizers. OpenAI's GPT models use a tokenizer called tiktoken. Anthropic's Claude models use a different tokenizer. A sentence that produces seven tokens with one tokenizer might produce eight or nine with another.

This matters for two reasons:

1. **Cost estimation** — if you are comparing prices between providers, you need to account for different token counts for the same text
2. **Context window usage** — the same document might fit within one model's context window but exceed another's, purely because of tokenizer differences

Are-Self handles this automatically. The Hypothalamus knows which tokenizer each model uses and calculates token counts accordingly. When it compares models on cost, it compares actual cost for the actual text, not a generic estimate.

## Think About It

- When you write a long email and then edit it down to be shorter, you are doing something very similar to token optimization. What would it mean to "tokenize" your own writing process — to think about the cost of each word?

- Context windows create a hard limit on what the AI can "see" at once. What are the context windows in your own life? How much information can you hold in your head at one time? What happens when you exceed that limit?

- Different tokenizers break the same text into different pieces. Different people parse the same sentence differently depending on their language, culture, and experience. Is tokenization a form of perspective?

## Going Deeper

If you want to see tokenization in action, OpenAI provides a free tool called the Tokenizer (available on their platform page) that lets you type text and see it broken into tokens in real time. Try pasting different types of text — English, code, URLs, emoji — and observe how the token counts change.

The technical name for the most common tokenization algorithm is Byte Pair Encoding (BPE). It works by starting with individual characters and repeatedly merging the most common pairs until a target vocabulary size is reached. The original paper (Sennrich et al., 2016) is readable even without a deep technical background.
