---
title: "Week 1 — The Biology of Budgets"
sidebar_position: 2
---

# Week 1: The Biology of Budgets

This week builds the foundation. We start with biology — real biology — because the Hypothalamus is not a metaphor. It is a design principle. The human hypothalamus maintains homeostasis: body temperature, blood sugar, hydration, sleep. It does this through negative feedback loops — systems that detect deviation from a set point and correct it automatically. Are-Self's Hypothalamus does the same thing for AI costs.

By Friday, you will understand the complete model selection pipeline, you will have configured budget systems, and you will have watched a circuit breaker trip and recover.

---

## Day 1: Feedback Loops in Biology and Business

### Lecture (60 minutes)

#### Negative Feedback Loops

Your body temperature is 37 degrees Celsius. When it rises, you sweat. When it drops, you shiver. You do not decide to do these things. The hypothalamus detects the deviation from the set point (37 degrees) and triggers the corrective response automatically.

This is a negative feedback loop:

1. **Sensor** detects the current state
2. **Comparator** evaluates the current state against the set point
3. **Effector** takes corrective action if there is a deviation
4. The action moves the state back toward the set point
5. The sensor detects the new state, and the loop continues

The word "negative" does not mean "bad." It means the response opposes the deviation. Temperature rises, so the response lowers it. Temperature drops, so the response raises it. The system resists change. That resistance is stability.

#### Set Points and Homeostasis

A set point is the target value the system maintains. Homeostasis is the state of being at (or near) the set point. Your body has hundreds of set points: blood pH (7.4), blood glucose (70-100 mg/dL), core temperature (37 degrees C), blood oxygen saturation (95-100%).

In Are-Self's Hypothalamus, the set points are budget thresholds:

- **Per-token cost limit** — the maximum price per token you are willing to pay for a given task category
- **Per-request cap** — the maximum total cost for a single AI inference request
- **Per-period spending limit** — the maximum total spending within a BudgetPeriod (hourly, daily, weekly, monthly)

When spending approaches or exceeds a set point, the Hypothalamus takes corrective action: selecting a cheaper model, queuing requests for later, or rejecting requests outright.

#### Positive Feedback Loops (and Why They Are Dangerous)

A positive feedback loop amplifies deviation. In biology: blood clotting. A small cut triggers clotting factors, which trigger more clotting factors, which trigger more, until the wound is sealed. Positive feedback is useful for rapid, decisive action — but it needs an external stop mechanism, or it runs to destruction.

In AI cost management, a positive feedback loop looks like this: a model fails, so the system retries with a more expensive model, which costs more, which burns through the budget faster, which triggers more urgent requests, which select even more expensive models. Without circuit breakers, this escalation can consume an entire monthly budget in minutes.

The Hypothalamus exists to prevent positive feedback loops in cost. Every retry, every failover, every model selection is filtered through budget constraints.

#### The Business Analogy

Organizations have their own homeostasis. Monthly AI budgets are set points. Department spending is a sensor reading. Finance reviews are the comparator. Cost-cutting initiatives are the corrective effector.

The problem: organizational feedback loops are slow. Monthly reviews happen monthly. Budget alerts arrive after the spending has occurred. The time between deviation and correction can be weeks.

The Hypothalamus operates in milliseconds. Every request is evaluated against the budget. Corrective action is immediate. This is the difference between annual physicals and a functioning autonomic nervous system.

### Lab (60 minutes)

1. **Explore the AIModelPricing table** — open the Django admin and list all configured AI models. Note the per-token costs (input and output), the context window sizes, and the capability flags.

2. **Map the feedback loop** — for your Are-Self instance, identify:
   - The sensor (what reads the current spend?)
   - The set point (what are the configured budget limits?)
   - The comparator (where does the system compare spend against budget?)
   - The effector (what action does the system take when spend exceeds budget?)

3. **Create a spending scenario** — using the admin, set a very low BudgetPeriod limit ($0.10 per hour). Launch several AI inference requests and observe what happens when the limit is reached.

4. **Document the feedback loop** — write a one-paragraph description of the negative feedback loop you just observed, using the biological vocabulary: sensor, set point, comparator, effector.

---

## Day 2: The Hypothalamus Algorithm

### Lecture (60 minutes)

#### The Model Selection Pipeline

When a Neuron's Effector requests AI inference, the request does not go directly to a model. It goes to the Hypothalamus, which runs a four-stage selection pipeline:

**Stage 1: Filter** — eliminate models that cannot handle this request. Reasons for elimination:

- The model lacks the required capability (e.g., the request needs vision, but the model is text-only)
- The model's context window is too small for the input
- The model is permanently disabled (scar tissue — Day 4)
- The model's circuit breaker is currently open (it has been failing)
- The model's provider is over its rate limit

After filtering, you have a candidate set of models that could theoretically handle the request.

**Stage 2: Strategy** — apply the configured selection strategy. Strategies include:

- **Cheapest** — sort candidates by per-token cost, pick the cheapest
- **Fastest** — sort by average latency, pick the fastest
- **Best quality** — sort by capability score for the task type, pick the highest
- **Balanced** — a weighted combination of cost, speed, and quality
- **Failover chain** — try models in a specified order; if one fails, try the next

The strategy is configured per Identity or per Pathway. Different teams can have different strategies.

**Stage 3: Vector Match** — for strategies that include semantic matching, the Hypothalamus compares the request's content embedding (a 768-dimensional vector) against the model's capability embedding. Models that are semantically closer to the task type score higher.

This is how the system learns which models are good at which tasks without explicit rules. Over time, as requests succeed and fail, the vector embeddings are updated. A model that consistently succeeds at code generation tasks will have a capability vector that is close to the embedding of code-related requests.

**Stage 4: Budget Check** — the selected model's estimated cost is checked against the requester's IdentityBudget. If the estimated cost would exceed the budget, the system either:

- Selects a cheaper model from the candidate set
- Queues the request for later (if the budget period is about to reset)
- Rejects the request with a budget-exceeded error

Only after all four stages does the request go to the model.

#### AIModelPricing

The `AIModelPricing` model tracks cost data for every available model:

- **Provider** — who hosts the model (OpenAI, Anthropic, local, etc.)
- **Model identifier** — the specific model version
- **Input token cost** — price per input token
- **Output token cost** — price per output token
- **Context window** — maximum tokens the model accepts
- **Capability flags** — what the model can do (text, vision, code, function calling, etc.)
- **Capability vector** — the 768-dimensional embedding of the model's strengths
- **Status** — active, degraded, disabled

AIModelPricing is updated regularly (manually or via automated pricing feeds). When a provider changes prices, the Hypothalamus immediately uses the new costs in its selection pipeline.

#### IdentityBudget

Every Identity in Are-Self has a budget configuration:

- **Per-token limit** — maximum cost per token this Identity is allowed to incur
- **Per-request limit** — maximum cost for a single request
- **Period limits** — maximum total spend per hour, day, week, or month
- **Overage policy** — what happens when the budget is exceeded (reject, queue, alert, or allow with warning)

IdentityBudget is the connection between "who is asking" and "what they are allowed to spend." It is the Responsibility Variable encoded in software.

#### BudgetPeriod

A BudgetPeriod is a time window for tracking cumulative spending:

- **Period type** — hourly, daily, weekly, monthly
- **Start and end timestamps** — when this period began and when it resets
- **Allocated amount** — the budget for this period
- **Spent amount** — the running total of what has been spent
- **Remaining amount** — calculated as allocated minus spent

When a BudgetPeriod resets, the spent amount returns to zero. This is the Time Variable at work — costs are not infinite because time resets the counters.

### Lab (60 minutes)

1. **Trace the pipeline** — enable debug logging on the Hypothalamus. Launch an AI inference request and read the logs. Identify each stage: filter (which models were eliminated and why), strategy (which strategy was applied), vector match (what the cosine distances were), budget check (what the estimated cost was and whether it passed).

2. **Configure different strategies** — create two test Identities. Give one the "cheapest" strategy and the other the "best quality" strategy. Send the same request from both. Compare which model each Identity was assigned and the resulting cost.

3. **Test budget enforcement** — set a test Identity's per-request limit to $0.001. Send a request that would exceed this limit. Observe the rejection. Raise the limit to $0.01 and try again.

4. **Observe BudgetPeriod reset** — set a test Identity's hourly budget to $0.05. Send requests until the budget is exhausted. Wait for the period to reset (or manually reset it in the admin). Confirm requests are accepted again.

---

## Day 3: Budget Systems

### Lecture (60 minutes)

#### The Three Layers of Budget Control

Are-Self enforces budgets at three layers, and all three must pass for a request to proceed:

**Layer 1: Per-Token Cost** — the cheapest model in the candidate set is still too expensive on a per-token basis? The request is rejected or deferred. This layer prevents you from accidentally using a premium model when a standard one would suffice.

Per-token cost limits are set on the IdentityBudget. They apply before a model is selected — models that exceed the per-token limit are filtered out in Stage 1 of the pipeline. This means the Identity never even sees expensive models as options.

**Layer 2: Per-Request Cap** — the total estimated cost for this request (input tokens x input cost + estimated output tokens x output cost) exceeds the per-request cap? Rejected or deferred. This layer prevents individual requests from being unexpectedly expensive — a long context window stuffed with a huge document might cost far more than a typical request.

Per-request caps are checked in Stage 4 of the pipeline, after a specific model has been selected. The Hypothalamus estimates the output token count based on the request type and historical data.

**Layer 3: Per-Period Spending** — the cumulative spending for the current BudgetPeriod would exceed the period limit if this request is processed? Rejected, queued, or allowed with a warning, depending on the overage policy.

Per-period spending is the backstop. Even if individual requests are cheap, enough of them will exhaust any budget. Period limits are the set point in the negative feedback loop.

#### Budget Hierarchies

Budgets can be hierarchical:

- An **organization-level** budget caps total spending across all Identities
- A **team-level** budget caps spending for a group of Identities
- An **Identity-level** budget caps spending for a single user or service account

The most restrictive budget wins. If your Identity has a $100/month limit but your team has a $50/month limit and your team has already spent $49, your effective budget is $1 — even though your personal budget shows $100 remaining.

This hierarchy maps to organizational structures. The CFO sets the organization budget. Department heads set team budgets. Individual contributors get Identity budgets. The Hypothalamus enforces all three simultaneously.

#### Overage Policies

When a budget limit is reached, four policies are available:

- **Reject** — the request fails immediately with a budget error. The caller must handle it. This is the strictest policy.
- **Queue** — the request is held until the budget period resets or additional budget is allocated. The caller receives a "queued" response and must poll or wait for a callback.
- **Alert** — the request proceeds, but a Cortisol neurotransmitter signal is fired to notify administrators. This is a soft limit — useful for monitoring without blocking.
- **Allow with warning** — the request proceeds with a warning in the response metadata. No signal is fired. This is the loosest policy, useful during initial rollout when you are still calibrating limits.

Most production deployments use Reject for per-request caps (to prevent runaway individual requests) and Alert for per-period limits (to avoid blocking work while still maintaining visibility).

### Lab (60 minutes)

1. **Configure a three-layer budget** — create a test Identity with:
   - Per-token limit: $0.00005
   - Per-request cap: $0.05
   - Hourly budget: $0.50
   Set each limit and test it independently. For each layer, send a request designed to trigger that specific limit.

2. **Test budget hierarchy** — create a team budget of $0.20/hour. Create two Identities in the team, each with a $0.50/hour personal budget. Send requests from both until the team budget is exhausted. Verify that both Identities are blocked, even though their personal budgets have room.

3. **Compare overage policies** — configure one Identity with "reject" and another with "alert." Exceed both budgets. Compare the behavior. Check for Cortisol signals on the "alert" Identity.

4. **Budget reporting** — open the admin's budget summary view. Identify which Identity has spent the most this period. Calculate the percentage of budget consumed. Identify the most expensive model used.

---

## Day 4: Circuit Breakers and Failover

### Lecture (60 minutes)

#### Why Circuit Breakers Exist

Without circuit breakers, a failing model creates a cascade: the request times out (consuming time and money), the system retries (consuming more time and money), the retry times out, and the cycle continues until the budget is exhausted or an operator intervenes.

A circuit breaker stops this cycle by tracking failures and temporarily disabling a model after too many consecutive failures. The name comes from electrical engineering — a circuit breaker "trips" when current exceeds a safe level, breaking the circuit to prevent damage.

#### The Three States

A circuit breaker has three states:

**Closed** — normal operation. Requests flow through to the model. The circuit breaker tracks the failure rate. If the failure rate exceeds the threshold (configurable, typically 50% over a recent window), the breaker trips.

**Open** — the model is temporarily disabled. All requests to this model fail immediately with a circuit-breaker error. No actual API call is made. This prevents wasting time and money on a model that is known to be failing.

**Half-Open** — after the timeout period expires, the breaker transitions to half-open. A single test request is allowed through. If it succeeds, the breaker closes (normal operation resumes). If it fails, the breaker reopens with a longer timeout.

#### Escalating Timeouts

Are-Self's circuit breakers use escalating timeouts:

| Trip Number | Timeout Duration |
|-------------|-----------------|
| 1st trip | 60 seconds |
| 2nd trip | 2 minutes |
| 3rd trip | 4 minutes |
| 4th+ trip | 5 minutes (cap) |

The escalation is deliberate. The first trip is short — maybe the model had a momentary hiccup. The second is longer — this might be a real outage. By the fourth trip, the system assumes the model is having a significant problem and waits the maximum five minutes before trying again.

This escalation prevents the half-open test requests from contributing to the cascade. If a model is truly down, you do not want to poke it every 60 seconds. You back off.

#### Resource Cooldowns and Scar Tissue

Beyond circuit breakers, the Hypothalamus tracks long-term model reliability. A model that trips its circuit breaker frequently accumulates "scar tissue" — a reliability score that degrades over time.

Scar tissue affects model selection: a model with significant scar tissue is ranked lower in the selection pipeline, even when its circuit breaker is closed. The Hypothalamus learns to distrust unreliable models.

In extreme cases, a model can be **permanently disabled** — the Permadeath Variable in action. If a model's reliability score drops below a configurable threshold, it is removed from the candidate set permanently. This requires manual re-enablement.

#### FailoverStrategy Chains

A FailoverStrategy is an ordered list of models to try. When the first model fails (or is unavailable due to a circuit breaker), the system tries the second. If that fails, it tries the third. And so on.

FailoverStrategy chains are configured per Identity or per task type:

```
Primary: claude-sonnet → Failover 1: gpt-4o → Failover 2: claude-haiku → Failover 3: local-llama
```

Each step in the chain is subject to the same budget checks. The system does not fail over to a model that would exceed the budget.

FailoverStrategy chains are the Perseverance Variable encoded in software. The system does not give up after one failure. It tries another way, and another, until either a model succeeds or all options are exhausted.

#### The Interaction Between Circuit Breakers and Failover

When a FailoverStrategy chain encounters a tripped circuit breaker, it skips that model entirely (no wait, no test request) and moves to the next model in the chain. The half-open test happens on a separate schedule, not as part of a user request.

This means a request with a failover chain of four models might skip two (circuit breakers open) and succeed on the third, all within milliseconds. The user never knows that two models were unavailable.

### Lab (60 minutes)

1. **Trip a circuit breaker** — configure a model with a very low failure threshold (e.g., 2 consecutive failures). Send requests designed to fail (use a test endpoint or temporarily misconfigure the model's API key). Observe the circuit breaker trip. Check the circuit breaker state in the admin.

2. **Observe escalating timeouts** — trip the same circuit breaker multiple times. After each trip, note the timeout duration. Verify the escalation: 60s, 2m, 4m, 5m cap.

3. **Test failover** — configure a FailoverStrategy chain with three models. Disable the first model (trip its circuit breaker). Send a request and verify it fails over to the second model. Disable the second model and verify failover to the third. Check the cost of each failover — was a cheaper or more expensive model used?

4. **Monitor with signals** — subscribe to Cortisol neurotransmitter signals. Trip a circuit breaker and observe the Cortisol signal. Watch for Dopamine when the half-open test succeeds and the breaker closes.

---

## Day 5: Lab Day

### Full Integration Lab (120 minutes)

Today is a hands-on lab with no new lecture material. You will configure a complete Hypothalamus setup from scratch.

#### Scenario

You are the platform engineer for a company that uses AI for three task categories:

- **Customer support** — high volume, cost-sensitive, quality can be moderate
- **Code review** — medium volume, quality is critical, cost is secondary
- **Document summarization** — low volume, speed is important, quality can be moderate

You have access to five AI models at different price points and capability levels. Your total monthly budget is $500. Design and configure a cost management strategy.

#### Part 1: Model Pricing Configuration (20 minutes)

1. Set up AIModelPricing records for five models (use test/simulated models if real ones are not available)
2. Assign capability flags and vectors to each model
3. Document which models you expect the Hypothalamus to select for each task category, and why

#### Part 2: Budget Configuration (20 minutes)

1. Create three team-level budgets (customer support, engineering, operations)
2. Create Identity-level budgets for test users in each team
3. Set per-token limits, per-request caps, and monthly period limits
4. Choose and justify overage policies for each team

#### Part 3: Failover Strategy (20 minutes)

1. Design a FailoverStrategy chain for each task category
2. Configure them in the admin
3. Document the rationale: why this order? What happens at each failover step?

#### Part 4: Circuit Breaker Tuning (20 minutes)

1. Set circuit breaker thresholds for each model based on its reliability history
2. Configure the failure rate windows and trip thresholds
3. Test each circuit breaker by simulating failures
4. Verify that failover chains correctly skip tripped breakers

#### Part 5: Integration Test (20 minutes)

1. Send a batch of requests simulating a typical hour of usage across all three task categories
2. Monitor the Hypothalamus decisions: which model was selected for each request? Why?
3. Check budget consumption across all three teams
4. Trip a circuit breaker mid-test and observe failover behavior
5. Verify no budget limits were exceeded

#### Part 6: Documentation (20 minutes)

Write a one-page summary of your cost management configuration. Include:

- Model pricing table
- Budget hierarchy diagram
- Failover chains for each task category
- Circuit breaker settings and rationale
- Expected monthly cost breakdown

This document is your deliverable for Week 1. You will extend it during the Week 2 capstone.

## Week 1 Key Takeaways

- The Hypothalamus is a negative feedback loop: sensor (spend tracking), set point (budget limits), comparator (budget check), effector (model selection and rejection)
- The model selection pipeline has four stages: filter, strategy, vector match, budget check
- Three layers of budget control: per-token, per-request, per-period
- Circuit breakers prevent cascading failures with escalating timeouts (60s, 2m, 4m, 5m)
- FailoverStrategy chains provide resilience by trying alternative models
- Scar tissue and permanent disablement handle chronically unreliable models
