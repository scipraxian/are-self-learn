---
title: "Module 3 — Definition of Done"
sidebar_position: 4
---

# Module 3: Definition of Done

## Three Conditions. Not More.

The Definition of Ready (Module 2) determines whether work can enter an Iteration. The Definition of Done (DoD) determines whether work is complete. In Experience Master, Done has exactly three conditions. If all three are met, the work is Done. If any is not met, the work is not Done. There is no partial credit.

## The Three Conditions

### 1. Assertions Met

Every assertion in the Definition of Ready (the Given/When/Then statements) must pass. Not most of them. Not the important ones. All of them.

This is why writing good assertions matters so much. Vague assertions are impossible to evaluate objectively. "The dashboard should be fast" — is it fast? Who decides? Testable assertions — "Given 100 NerveTerminals in the fleet, when the dashboard loads, then the load time is under 2 seconds" — either pass or they do not.

When a Worker believes the work is complete, they should be able to walk through each assertion and demonstrate that it passes. If any assertion fails, the work is not Done.

If an assertion turns out to be wrong — if the PM and Worker agree that the assertion itself was poorly written or based on a misunderstanding — they can modify the assertion. But they must do so explicitly, with both parties agreeing to the change, and the modification must be documented. You do not silently lower the bar.

### 2. QA Signed Off

A person who did not build the work has verified that it works correctly. This is QA sign-off.

QA sign-off is not a rubber stamp. The QA person (who may be another Worker, a dedicated tester, or the PM depending on team structure) independently verifies the assertions. They do not take the Worker's word for it. They test it themselves.

Why a separate person? Because the person who built the work has blind spots. They know how it is supposed to work, so they test it the way it is supposed to work. They do not test the edge cases, the unexpected inputs, the error paths — because those paths are not in their mental model. A fresh pair of eyes catches what the builder misses.

QA sign-off can be waived through the DoD Exceptions field in the Definition of Ready — but this should be rare. When you waive QA sign-off, you are accepting the risk that the work has undetected problems. Sometimes that risk is acceptable (internal tooling, urgent fixes). Usually it is not.

### 3. Assigned to Completing Worker for Velocity

The completed work is attributed to the Worker who completed it, and this attribution is used for velocity tracking.

This condition exists for a specific reason: it connects individual effort to team capacity planning. Velocity — the amount of work a team completes per Iteration — is the primary metric for predicting future capacity. If velocity is inaccurate, planning is inaccurate, and the Iteration either overcommits (leading to failure) or undercommits (leading to waste).

Assigning completed work to the completing Worker ensures:

- **Accurate velocity tracking** — the team knows how much work it actually completed, attributed to the people who did it
- **Individual workload visibility** — the PM can see whether work is evenly distributed or concentrated on a few Workers
- **Capacity planning** — future Iterations can be planned based on demonstrated capacity, not guesses

Note what this condition does NOT do: it does not rank Workers. It does not create competition. It does not punish Workers who complete less. It creates data for planning. A Worker who completed one large piece of work and a Worker who completed five small pieces may have done the same amount of effort — the velocity data helps the PM understand this.

## Why These Three and Not More

Many agile frameworks have extensive Definitions of Done: code reviewed, tests written, documentation updated, deployed to staging, performance benchmarked, security scanned. Experience Master has three.

This is deliberate. Here is why:

**More conditions create avoidance.** The longer the DoD checklist, the more Workers avoid completing work — because "completing" means doing ten more things after the actual work is done. The result: work stays at 90% completion for days, technically "in progress" but practically done, because the Worker is dreading the checklist.

**Assertions absorb specifics.** If code review is important, write an assertion: "Given the code is submitted, when a reviewer examines it, then the reviewer approves it." If documentation is important, write an assertion. If performance matters, write an assertion with a specific threshold. The assertions field in the DoR is where specific quality requirements live — not in a generic DoD that applies to all work regardless of context.

**The DoD is about done-ness, not quality.** Quality is defined by the assertions. The DoD defines the process of confirming that quality: the assertions passed (quality verified by the builder), QA signed off (quality verified by an independent party), and the work is tracked (so the organization learns from its capacity).

**Three conditions can be held in working memory.** Every Worker can remember: assertions, QA, tracking. Nobody can remember a twelve-item checklist without looking it up — which means they do not internalize it, which means they do not follow it.

## The Relationship Between DoR and DoD

The Definition of Ready and the Definition of Done are a matched pair:

- **DoR** defines what the work IS (perspective, assertions, scope, exceptions, dependencies, demo)
- **DoD** defines when the work is FINISHED (assertions pass, QA confirms, work is tracked)

The assertions field is the bridge. The DoR writes the assertions. The DoD checks them. If the assertions are well-written, the DoD evaluation is straightforward. If the assertions are vague, the DoD evaluation becomes a negotiation — which is exactly what Experience Master is designed to prevent.

## What Happens When Work Is Not Done

If work does not meet the DoD by the end of the Iteration, it is not Done. Period. There are no partial completions, no "it is basically done," no "just one more thing."

Incomplete work rolls to the next Iteration. The PM evaluates whether to re-plan it (with the same or modified scope) or defer it (remove it from the upcoming Iteration and return it to the backlog).

This sounds harsh. It is. And it is the mechanism that makes velocity accurate. If teams could claim partial credit, velocity would be inflated, planning would be based on lies, and every Iteration would overcommit. The clean binary — Done or Not Done — keeps the data honest.

The Retrospective (Module 4) is where the team discusses why work was not completed. Was it scoped too large? Were there hidden dependencies? Was the Worker blocked? Did the assertions change mid-Iteration? These are learning opportunities, not blame opportunities.

## Common Mistakes

**Declaring work Done before QA sign-off.** "I tested it myself" is not QA sign-off. QA sign-off requires a different person.

**Skipping velocity tracking.** If completed work is not attributed and recorded, planning for the next Iteration is based on memory, not data. Memory is unreliable.

**Adding unofficial conditions.** "It is not really Done until it is deployed to production." If deployment is a condition of Done, it should be an assertion in the DoR — not an unwritten rule that surfaces at Demo time.

**Arguing about whether assertions are met.** If you are arguing, the assertions were not specific enough. Fix the assertions for next time. For this time, the PM makes the call.

## Think About It

- Think of a project you recently completed. When did you consider it "done"? Was there a clear moment, or did it drift from "mostly done" to "done enough" to "we moved on"?

- QA sign-off requires someone other than the builder to verify the work. In your non-work life, where do you rely on someone else to check your work? Where could you benefit from it but do not have it?

- Experience Master does not assign story points. Velocity is tracked by counting completed items, not by summing point estimates. What are the advantages of counting items? What are the disadvantages?
