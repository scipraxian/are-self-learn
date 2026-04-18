---
title: "Module 5 — Datacenters and Scale"
sidebar_position: 6
---

# Module 5: Datacenters and Scale

## Where Does AI Physically Live?

Everything we have discussed so far — tokens, models, vectors, training, inference — happens on physical machines in physical buildings. AI is software, but software needs hardware. This module is about that hardware: the GPU clusters, the datacenters, the cooling systems, and the staggering scale of the infrastructure that makes modern AI possible.

## The GPU: AI's Engine

A CPU (Central Processing Unit) is the general-purpose processor in your computer. It is designed to handle a wide variety of tasks — running your operating system, browsing the web, editing documents. It does one or a few things at a time, very quickly.

A GPU (Graphics Processing Unit) was originally designed to render graphics — calculating the color of millions of pixels simultaneously for video games and visual effects. The key word is "simultaneously." A GPU is designed to do many simple calculations at the same time.

It turns out that AI training and inference are exactly the kind of work GPUs are built for. Processing tokens through a model with billions of parameters involves multiplying enormous matrices of numbers — and matrix multiplication is massively parallel. A single GPU can perform trillions of these operations per second.

This is why AI runs on GPUs, not CPUs. A task that would take a CPU hours can be completed by a GPU in minutes. A task that would take a CPU years is what AI training looks like — and GPUs make it feasible.

The dominant GPU manufacturer for AI is NVIDIA. Their A100 and H100 chips are the workhorses of AI training and inference. A single H100 chip costs roughly $30,000 to $40,000. Training a large language model requires thousands of them.

## What a GPU Cluster Looks Like

A GPU cluster is a collection of GPUs connected to work together on a single task. Training a large language model requires splitting the work across thousands of GPUs that communicate with each other at extremely high speeds.

A typical training cluster might include:

- **Thousands of GPUs** — arranged in racks, each rack containing multiple servers, each server containing multiple GPUs
- **High-speed interconnects** — specialized networking (like NVIDIA's NVLink or InfiniBand) that allows GPUs to share data at hundreds of gigabytes per second. Standard ethernet is too slow.
- **Massive storage** — the training data (trillions of tokens) must be accessible to every GPU. This requires petabytes of high-speed storage.
- **Redundancy** — at this scale, hardware failures are constant. A cluster of 10,000 GPUs will have GPUs failing every day. The system must continue training despite individual component failures.

For inference (serving requests to users), the clusters are different. They do not need as many GPUs working together on a single task, but they need many GPUs available to handle many concurrent requests. A popular AI service might need to process thousands of requests per second, each requiring its own GPU time.

## The Datacenter

GPU clusters live in datacenters — large, purpose-built facilities that provide power, cooling, networking, and security.

An AI datacenter is different from a traditional cloud datacenter in several ways:

**Power** — GPUs consume enormous amounts of electricity. A single H100 GPU draws about 700 watts. A rack of eight draws 5,600 watts. A cluster of 10,000 GPUs draws 7 megawatts — enough to power about 5,000 homes. A large AI datacenter might draw 100-300 megawatts. Some planned facilities exceed a gigawatt.

**Cooling** — all that electricity becomes heat. Traditional datacenters use air conditioning. AI datacenters increasingly use liquid cooling — running coolant directly over the GPUs — because air cannot remove heat fast enough. Some facilities use river water, ocean water, or cold outside air. The location of AI datacenters is increasingly determined by access to cheap power and effective cooling.

**Networking** — the internal network of an AI datacenter must handle extraordinary bandwidth. GPUs communicate with each other, with storage, and with the outside world. The network fabric is a major engineering challenge and cost.

**Physical security** — the hardware in an AI datacenter is worth hundreds of millions of dollars. Physical security (fences, guards, biometric access) is substantial.

## The Scale of It

To put the scale in perspective:

- **OpenAI's** training clusters are estimated to include tens of thousands of GPUs. Their total compute capacity is not publicly disclosed.
- **Google** operates custom AI chips (TPUs — Tensor Processing Units) in addition to GPUs, across multiple datacenters worldwide.
- **Meta** has committed to spending over $30 billion on AI infrastructure in a single year.
- **Microsoft** has invested over $13 billion in OpenAI and is building dedicated AI datacenters globally.
- The total global investment in AI datacenter infrastructure is measured in hundreds of billions of dollars per year and growing.

This is not a software problem anymore. This is an industrial infrastructure build-out comparable to the construction of the electrical grid or the interstate highway system.

## Who Is Building What

The AI infrastructure landscape has several tiers:

**Hyperscalers** — the largest cloud providers (Microsoft Azure, Google Cloud, Amazon AWS) operate the biggest datacenters and rent AI compute to others. If you use an AI product from a startup, the actual inference probably runs on a hyperscaler's GPUs.

**AI companies** — organizations like OpenAI, Anthropic, and Google DeepMind operate their own training infrastructure (often hosted in hyperscaler datacenters) and sell inference as a service.

**Chip manufacturers** — NVIDIA dominates, but AMD, Intel, Google (TPU), and startups like Cerebras and Groq are competing. The chip supply chain — from design (often in the US) to fabrication (primarily in Taiwan, at TSMC) — is one of the most strategically important supply chains in the world.

**Sovereign AI** — nations are building their own AI infrastructure to ensure they are not dependent on foreign providers. France, the UK, Japan, Saudi Arabia, and others have announced national AI compute initiatives.

**Local and edge** — smaller models can run on consumer hardware. A laptop with a modern GPU can run a 7-billion parameter model. This is where Are-Self operates: providing the orchestration layer for AI that runs on your own hardware, from a single laptop to a multi-server fleet.

## Energy and Environment

AI's energy consumption is a real and growing concern:

- Training a single large model can consume as much electricity as a hundred homes use in a year
- The global AI industry's electricity consumption is growing faster than the supply of renewable energy
- Water usage for cooling is significant — a single datacenter can consume millions of gallons per year
- The carbon footprint depends heavily on the energy source: a datacenter powered by hydroelectric has a very different impact than one powered by natural gas

These are not abstract concerns. They are engineering and policy challenges that will shape AI's future. Efficiency improvements (better chips, better algorithms, smaller models that perform well) partially offset the growth, but the overall trajectory is up.

## How Are-Self Relates to All of This

Are-Self occupies a specific place in this landscape: it is designed to run on whatever hardware you have.

**Your laptop** — a single machine can run Are-Self with locally hosted small models. The Central Nervous System, Hypothalamus, and all other brain regions run as Django apps on your machine. Inference happens on your local GPU (or CPU, more slowly).

**Your server** — a team can run Are-Self on a single server with one or more GPUs. The Peripheral Nervous System manages workers on the same machine.

**Your fleet** — an organization can run Are-Self across multiple servers. NerveTerminals register as workers. The PNS distributes Spikes across the fleet. GPU nodes handle inference; CPU nodes handle orchestration.

**Hybrid** — Are-Self can use both local models and external APIs. The Hypothalamus selects between them based on cost, capability, and availability. Your sensitive data stays on your hardware; non-sensitive requests go to external providers.

This flexibility is deliberate. Not every organization can afford (or wants) to send data to a cloud provider. Not every organization needs a GPU cluster. Are-Self lets you start small and scale up, or start in the cloud and bring AI home.

## Think About It

- AI runs on physical hardware that consumes real electricity and generates real heat. When you send a message to an AI, you are burning energy. Does (or should) this awareness change how you use AI tools?

- The AI hardware supply chain runs through a small number of critical points: TSMC in Taiwan fabricates most of the world's advanced chips. What happens to AI if that supply chain is disrupted?

- Are-Self is designed to run on your own hardware. What are the advantages of running AI locally versus using a cloud service? What are the disadvantages? When does each approach make sense?

- Nations are building sovereign AI infrastructure. What does it mean for a country to be "AI independent"? Is it similar to energy independence? Food independence?

## Going Deeper

For a detailed look at NVIDIA's AI datacenter architecture, their technical blog publishes detailed descriptions of GPU cluster design, cooling systems, and networking.

The International Energy Agency (IEA) publishes reports on datacenter energy consumption that include AI-specific projections. Their reports provide data-driven context for the energy discussion.

For an understanding of the chip supply chain, Chris Miller's book *Chip War* traces the history and geopolitics of semiconductor manufacturing — essential context for understanding AI's physical infrastructure.
