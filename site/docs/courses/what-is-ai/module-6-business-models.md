---
title: "Module 6 — The Business Model"
sidebar_position: 7
---

# Module 6: The Business Model

## Who Pays for All of This?

You have now learned how AI reads text (tokens), how it processes that text (models with billions of parameters), how it represents meaning (vectors), how it learns and answers (training and inference), and where it physically lives (GPU clusters in datacenters). The remaining question is economic: who pays for all of this, and how do they make their money back?

This module is about the business of AI — how companies make money, how costs flow from provider to user, and how Are-Self's approach differs from the dominant model.

## The API Pricing Model

The most common way AI companies make money is by selling inference as a service through an API (Application Programming Interface). You send your tokens in, you get tokens back, and you pay per token.

This is how OpenAI, Anthropic, Google, and most other AI providers operate. The pricing is typically:

- **Input tokens** — charged per token you send to the model. Cheaper than output tokens because the model only needs to read them, not generate them.
- **Output tokens** — charged per token the model generates. More expensive because generating each token requires a full pass through the model.

Prices are usually quoted per million tokens. As of recent pricing:

| Provider | Model | Input (per M tokens) | Output (per M tokens) |
|----------|-------|---------------------|----------------------|
| OpenAI | GPT-4o | ~$2.50 | ~$10.00 |
| Anthropic | Claude Sonnet | ~$3.00 | ~$15.00 |
| OpenAI | GPT-4o mini | ~$0.15 | ~$0.60 |
| Meta | Llama (via providers) | ~$0.10-$1.00 | ~$0.10-$1.00 |

These prices change frequently — often downward, as competition intensifies and hardware improves. But the structure remains: you pay per token, input and output are priced separately, and larger, more capable models cost more.

For a typical interaction — say a 500-token question and a 1,000-token response using a mid-tier model — the cost might be a fraction of a cent. But at scale (millions of requests per day), these fractions add up to thousands or hundreds of thousands of dollars per month.

## The Subscription Model

Consumer-facing AI products typically use subscriptions rather than per-token pricing:

- **Free tier** — limited usage, slower models, reduced features. The purpose is to acquire users and demonstrate value.
- **Paid tier** ($20-30/month)** — higher usage limits, access to premium models, faster responses. This is where most consumer revenue comes from.
- **Enterprise tier** — custom pricing, dedicated capacity, security features, compliance guarantees.

The subscription model hides the per-token economics from the user. You pay a flat fee and use the service as much as you want (within limits). The company bets that average usage will be low enough to make the flat fee profitable. Heavy users subsidize the margin; light users are pure profit.

This is familiar to anyone who has had a gym membership. The gym signs up far more members than can physically use the equipment at once, because most members do not come every day. AI subscriptions work the same way.

## The Infrastructure Play

Some companies do not sell AI directly. They sell the infrastructure that AI runs on:

- **NVIDIA** sells GPUs. Every AI company is their customer.
- **Cloud providers** (AWS, Azure, Google Cloud) rent GPU compute by the hour. AI companies are their customers, and so are organizations running their own AI workloads.
- **TSMC** fabricates the chips that NVIDIA designs. NVIDIA is their customer.

During a gold rush, the people who sell shovels often make more money than the people who dig for gold. The same dynamic is playing out in AI. NVIDIA's market capitalization has surpassed $3 trillion, making it one of the most valuable companies in the world — not because it builds AI products, but because it builds the hardware that AI products require.

## Open-Source vs. Proprietary

There are two approaches to AI model distribution:

**Proprietary** — the model's parameters are secret. You can use the model through an API, but you cannot download it, inspect it, modify it, or run it on your own hardware. OpenAI's GPT models and Anthropic's Claude models are proprietary.

**Open-source (or open-weight)** — the model's parameters are publicly available. You can download the model, run it on your own hardware, modify it, and fine-tune it for your specific needs. Meta's Llama models, Mistral's models, and many others are open-weight.

The distinction matters for several reasons:

**Cost** — running an open-source model on your own hardware can be much cheaper than paying per-token API prices, especially at high volume. The trade-off is that you need the hardware (GPUs) and the expertise to operate it.

**Privacy** — with a proprietary API, your data leaves your network and is processed on someone else's servers. With an open-source model running locally, your data never leaves your building. For organizations with sensitive data (legal, medical, financial), this matters enormously.

**Control** — a proprietary model can change its behavior, pricing, or availability at any time. The provider might add safety filters that block your legitimate use case, raise prices, or discontinue the model. With an open-source model, you control the version, the configuration, and the availability.

**Capability** — proprietary models from frontier labs (OpenAI, Anthropic, Google) are generally more capable than open-source alternatives, especially on complex reasoning tasks. The gap has been narrowing, but it persists.

## How Are-Self Approaches This

Are-Self is open-source software that orchestrates AI models from any source. This is a deliberately different approach from both the proprietary API model and the pure open-source model:

**Open-source orchestration** — Are-Self itself (the Central Nervous System, Hypothalamus, Hippocampus, and all other brain regions) is open-source. You can inspect every line of code, modify it, and run it on your own hardware. There is no API fee for using Are-Self.

**Model-agnostic** — Are-Self does not have its own model. It uses whatever models you configure: proprietary APIs (OpenAI, Anthropic), open-source models running locally (Llama, Mistral), or any combination. The Hypothalamus selects between them based on cost, capability, and availability.

**Run on your hardware** — Are-Self is designed to run on hardware you control. A laptop, a server, a fleet of machines. Your data stays on your network. You control the costs. You control the models.

**Cost transparency** — the Hypothalamus tracks every token, every request, and every dollar spent. There is no hidden pricing. The `AIModelPricing` table shows exactly what each model costs, and the budget system shows exactly what each Identity has spent.

**No subscription** — Are-Self does not charge a subscription. It is free software. The costs you incur are the costs of the AI models you use (either API fees to external providers or the infrastructure cost of running models locally) and the infrastructure to run Are-Self itself.

This approach means Are-Self is not for everyone. It requires technical capability to install, configure, and operate. It does not come with a chat interface and a "sign up" button. But for organizations that want control over their AI infrastructure — including what models they use, where their data goes, and what they spend — it is a different proposition than subscribing to a proprietary service.

## The Economics of Scale

One pattern appears at every level of the AI business:

- Training a model is enormously expensive, but the cost is paid once
- Serving that model to one user is cheap
- Serving it to millions of users amortizes the training cost across all of them

This is why AI companies want scale. The more users they have, the lower the effective cost per user, and the higher the margin. This dynamic creates intense pressure to grow — which is why AI products offer generous free tiers, why companies raise billions in venture capital, and why the race to build the largest models is so fierce.

It also means that the market tends toward consolidation. Companies with more users can spread training costs thinner, price inference lower, attract more users, and repeat. Smaller companies struggle to compete on price because they have fewer users over which to amortize their costs.

Open-source models partially break this dynamic. When Meta releases Llama for free, it subsidizes the training cost for everyone. Organizations can run Llama on their own hardware without paying Meta anything. This shifts the economics: instead of paying for access to a model, you pay for the hardware to run it.

## The Hidden Costs

Not all AI costs appear on an invoice:

**Integration cost** — connecting AI to your existing systems (databases, workflows, user interfaces) requires engineering time. This cost is often larger than the AI model cost.

**Quality assurance** — AI outputs are probabilistic, not deterministic. The same question can produce different answers. Ensuring quality requires human review, testing, and monitoring.

**Maintenance** — models are updated, APIs change, prices shift, capabilities evolve. Keeping an AI integration working over time requires ongoing effort.

**Organizational change** — adopting AI changes workflows, roles, and expectations. Managing that change is a cost measured in time, attention, and occasionally morale.

Are-Self addresses some of these hidden costs through its architecture. The Central Nervous System provides a standard workflow framework (reducing integration cost). The Hypothalamus automates model selection (reducing quality assurance and maintenance cost). The neurotransmitter system provides real-time monitoring (reducing the cost of staying informed). But the organizational change cost is irreducible — technology can support change, but humans must navigate it.

## Think About It

- You pay for AI either through API fees (money) or by running it yourself (hardware, electricity, expertise). Which of these costs is more visible? Which is easier to control?

- Open-source models are "free" but require hardware to run. Proprietary models are paid but require no hardware. This is the same trade-off as owning a car vs. taking taxis. When does each make sense?

- AI companies want scale to amortize training costs. Social media companies wanted scale to amortize content costs. The dynamics are similar. What happened with social media, and what might that predict for AI?

- Are-Self is open-source and free. How does an open-source project sustain itself? What is the business model for giving software away? (Hint: it is not advertising.)

## Going Deeper

For a detailed analysis of AI economics, the Stanford AI Index Report (published annually) provides comprehensive data on AI investment, costs, and market dynamics.

For understanding open-source AI economics, the AI Snake Oil blog by Arvind Narayanan and Sayash Kapoor provides clear-eyed analysis of what AI companies are actually selling and what they are promising.

For a historical perspective on how infrastructure companies (railroads, telecom, cloud) have shaped technology markets, Brian Arthur's *The Nature of Technology* provides a framework for understanding how AI infrastructure is following familiar patterns.
