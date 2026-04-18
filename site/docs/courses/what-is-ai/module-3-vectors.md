---
title: "Module 3 — Vectors"
sidebar_position: 4
---

# Module 3: Vectors

## How Does AI Understand Meaning?

In Module 1, you learned that AI converts words into tokens. In Module 2, you learned that models use these tokens to predict the next token. But there is a step in between that we glossed over: how does the model know that "dog" and "puppy" are related, while "dog" and "democracy" are not?

The answer is **vectors** — lists of numbers that represent meaning. This is where AI gets its ability to understand similarity, analogy, and context. It is also one of the most beautiful ideas in all of computer science.

## Meaning as a Point in Space

Imagine a two-dimensional map — an ordinary X-Y coordinate system. Now imagine placing words on this map based on their meaning. "Dog" goes near "puppy" and "cat." "Car" goes near "truck" and "bicycle." "Happy" goes near "joyful" and "content."

If you could do this perfectly — place every word on a map so that related words are close together and unrelated words are far apart — you would have captured the meaning of every word as a location.

That is what a vector is: a location. In two dimensions, a vector is two numbers: an X coordinate and a Y coordinate. The word "dog" might be at position (3.2, 7.1) and "puppy" might be at (3.4, 7.3) — close together, because they mean similar things.

The problem is that two dimensions are not enough. Meaning is complex. "Dog" is related to "puppy" (size, age), to "cat" (both pets), to "wolf" (ancestry), to "loyalty" (cultural association), and to "bark" (sound). Capturing all of these relationships in just two dimensions is impossible.

So instead of two dimensions, AI uses **768 dimensions**. Or 1024. Or 1536. Hundreds or thousands of dimensions, each capturing some aspect of meaning that humans cannot individually name but that the mathematics can distinguish.

A 768-dimensional vector is a list of 768 numbers. You cannot visualize it — nobody can visualize 768 dimensions. But the math works exactly the same as in two dimensions. Two vectors that are close together (in 768-dimensional space) represent meanings that are similar. Two vectors that are far apart represent meanings that are different.

## Embeddings

The process of converting a token (or a word, or a sentence, or an entire document) into a vector is called **embedding**. The result — the vector itself — is also called an embedding.

When you embed the word "king," you get a vector: 768 numbers that encode everything the model has learned about what "king" means. When you embed "queen," you get a different vector — but one that is close to "king" in 768-dimensional space, because the meanings are related.

Here is the famous example that made the AI research world pay attention to embeddings:

```
vector("king") - vector("man") + vector("woman") ≈ vector("queen")
```

Take the vector for "king." Subtract the vector for "man." Add the vector for "woman." The result is a vector very close to the vector for "queen."

This is not a trick. It is a consequence of how meaning is organized in high-dimensional space. The relationship between "king" and "queen" is the same as the relationship between "man" and "woman" — a gender dimension. The vectors captured this relationship without anyone explicitly programming it. The model learned it from patterns in text.

## Similarity and Distance

If vectors represent meaning, then the distance between two vectors represents how different their meanings are. Two nearby vectors are similar in meaning. Two distant vectors are different.

The most common way to measure vector distance in AI is **cosine similarity** (or its inverse, cosine distance). Cosine similarity measures the angle between two vectors, ignoring their length. It produces a number between -1 and 1:

- **1.0** — the vectors point in exactly the same direction (identical meaning)
- **0.0** — the vectors are perpendicular (no relationship)
- **-1.0** — the vectors point in opposite directions (opposite meaning)

In practice, most vector comparisons produce values between 0.7 (quite similar) and 0.3 (not very similar). Perfect 1.0 scores only happen when comparing a vector to itself.

This is how AI search works. Instead of matching keywords (does the document contain the exact word you searched for?), vector search compares meanings (is the document about the same topic you are asking about?). You can search for "automobile maintenance" and find documents about "car repair" — because their vectors are close together, even though they share no words.

## Are-Self's Engram Vectors

In Are-Self, vectors are everywhere. The system calls them **engrams** — a term from neuroscience referring to the physical trace of a memory in the brain.

Every key entity in Are-Self has a 768-dimensional vector embedding:

- **Identity vectors** — each Identity (user or agent) has a vector that represents their typical usage patterns, preferences, and role. Two Identities that do similar work have similar vectors.

- **Model capability vectors** — each AI model in the catalog has a vector that represents what it is good at. A model that excels at code generation has a vector pointing in the "code" direction. A model that excels at creative writing points in a different direction.

- **Request vectors** — when a request comes in, it is embedded into the same 768-dimensional space. The Hypothalamus compares the request vector to model capability vectors to find the best match.

- **Memory vectors** — the Hippocampus (the memory system) stores memories as vectors. When the system needs to recall relevant context, it searches for memories whose vectors are close to the current situation.

This is how Are-Self makes intelligent decisions without explicit rules. Instead of a lookup table that says "code review requests go to Model X," the system uses vector similarity to match requests to models. This works for task types that did not exist when the system was configured, because the vectors capture meaning, not keywords.

## The 768-Dimension Question

Why 768 dimensions? Why not 100? Why not 10,000?

The number 768 comes from a specific model architecture (BERT, released by Google in 2018) that became widely influential. It is a balance:

- **Too few dimensions** (100) and the space is too cramped — different meanings get squished together and the model cannot distinguish between them
- **Too many dimensions** (10,000) and the space is too sparse — computing distances becomes expensive, and the extra dimensions do not add useful information
- **768 dimensions** turned out to be a sweet spot for many applications — enough room to capture nuanced meaning, but not so many that the math becomes unwieldy

Other models use different numbers: 1024, 1536, 4096. The principle is the same. More dimensions means more nuance but more computational cost. Are-Self standardizes on 768 for its internal embeddings because it provides good quality at reasonable cost.

## Think About It

- Every word you know has a position in your mental "meaning space." When someone says a word you have never heard, you place it somewhere based on context — close to words that were nearby when you first encountered it. Is your brain doing something similar to vector embedding?

- Cosine similarity measures how similar two meanings are. But similarity is subjective — "dog" and "cat" are similar if you are thinking about pets, but very different if you are thinking about behavior. What does it mean for a mathematical function to capture "similarity" without knowing what dimension of similarity you care about?

- Are-Self gives every Identity a 768-dimensional vector. What would your vector look like? What aspects of your work, preferences, and patterns would it capture? What would it miss?

## Going Deeper

The paper that introduced modern word embeddings is "Efficient Estimation of Word Representations in Vector Space" (Mikolov et al., 2013), commonly known as the Word2Vec paper. It is the origin of the king - man + woman = queen example.

For a visual, interactive exploration of how embeddings work, the TensorFlow Embedding Projector allows you to explore word embeddings in 3D (projected from higher dimensions). You can search for words, see their neighbors, and get an intuition for how meaning is organized in vector space.
