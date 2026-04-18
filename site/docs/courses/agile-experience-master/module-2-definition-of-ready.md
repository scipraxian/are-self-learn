---
title: "Module 2 — Definition of Ready"
sidebar_position: 3
---

# Module 2: Definition of Ready

## What Makes Work Ready to Be Worked

Before a Worker can begin a piece of work, that work must be Ready. This sounds obvious. It is not. Most agile teams have a vague sense of "ready" — the story has been discussed, someone understands it, there is probably enough information to start. This vagueness is the source of most mid-Iteration problems: misunderstandings, scope creep, blocked work, and the dreaded "I thought you meant..."

Experience Master eliminates vagueness by defining exactly what Ready means. A piece of work is Ready when it has six specific fields completed. Not five. Not "most of them." All six.

## The Six Fields

### 1. Perspective

**What it is:** A statement of why this work matters and who it matters to.

**Format:** "From the perspective of [who], [why this matters]."

**Example:** "From the perspective of a fleet administrator, I need to see which NerveTerminals are offline so I can investigate before work is reassigned automatically."

**Why it exists:** Work without a "why" drifts. If the Worker does not know why the work matters, they cannot make good decisions when ambiguity arises — and ambiguity always arises. The perspective field forces the PM to articulate the purpose before handing the work off.

The "who" is equally important. "From the perspective of the system" is not a perspective. Systems do not have perspectives. People do. Who will benefit from this work? Who asked for it? Who will be affected if it is not done? Naming the person (or role) creates empathy and accountability.

### 2. Assertions

**What it is:** A list of testable statements that define what "working" looks like. These are acceptance criteria.

**Format:** "Given [context], when [action], then [expected result]."

**Example:**
- Given a NerveTerminal has missed three heartbeats, when the heartbeat monitor runs, then the NerveTerminal's status is set to OFFLINE.
- Given a NerveTerminal is OFFLINE, when the fleet dashboard loads, then the NerveTerminal appears in the "offline" section with a red indicator.
- Given a NerveTerminal transitions to OFFLINE, when the transition occurs, then a Norepinephrine neurotransmitter signal is fired.

**Why it exists:** Assertions are the contract between the PM and the Worker. The PM says "this is what I need." The Worker says "I will deliver this." When the work is complete, both parties evaluate the assertions. If they all pass, the work is done. If any fail, the work is not done.

Without assertions, "done" is a matter of opinion. With assertions, it is a matter of fact.

Note the format: Given/When/Then. This is not accidental. Assertions written in this format are directly testable — a QA person (or an automated test) can verify each one without interpretation.

### 3. Outside

**What it is:** A list of things that are explicitly not part of this work.

**Example:**
- Outside: NerveTerminal auto-recovery (restarting offline workers). That is a separate piece of work.
- Outside: Historical heartbeat data visualization. The dashboard shows current status only.
- Outside: Email notifications for offline workers. Only neurotransmitter signals are in scope.

**Why it exists:** Scope creep starts with "while you are in there, could you also..." The Outside field is the PM's preemptive defense against scope creep. By listing what is not included, the PM creates a boundary that both parties can reference when the inevitable "could you also" arrives.

The Outside field also prevents the Worker from over-building. A Worker who sees the dashboard mockup might think "I should also add historical charts." The Outside field says: no. Do this. Not that. This Iteration.

### 4. DoD Exceptions

**What it is:** Any exceptions to the standard Definition of Done (Module 3) that apply to this specific piece of work.

**Example:**
- DoD Exception: QA sign-off is waived for this item because it is an internal tooling change with no user-facing impact. The PM will verify directly.

**Why it exists:** The Definition of Done is a standard — three conditions that every piece of work must meet (Module 3). But standards have exceptions. A critical hotfix might skip full QA. An internal tool might not need a demo. A documentation change might not need automated tests.

Without the DoD Exceptions field, exceptions are ad hoc — decided in the moment, forgotten, inconsistent. With the field, exceptions are explicit, agreed upon in advance, and documented. The team can look back and see exactly which exceptions were granted and why.

Most work has no DoD exceptions. The field is usually empty. That is fine. It exists for the times it is needed.

### 5. Dependencies

**What it is:** A list of other work items, external resources, or conditions that must be satisfied before or during this work.

**Example:**
- Dependency: The heartbeat monitoring Celery Beat task must be deployed (Work Item #42).
- Dependency: Access to the staging fleet (at least three NerveTerminals) for testing.
- Dependency: The Norepinephrine signal type must be registered in the neurotransmitter system.

**Why it exists:** Dependencies are the most common cause of mid-Iteration blocks. A Worker starts a piece of work, discovers they need something that does not exist yet, and stops. The Dependencies field surfaces these needs before the Iteration begins.

During Planning, the PM reviews dependencies for every piece of work. If a dependency cannot be satisfied during the Iteration, the work is not ready — it stays out of the Iteration until the dependency is resolved.

Dependencies are not just other work items. They include access (to environments, accounts, data), decisions (from stakeholders, legal, compliance), and resources (hardware, third-party services, budget).

### 6. Demo Specifics

**What it is:** A description of how this work will be demonstrated at the Demo ceremony.

**Example:**
- Demo: Show the fleet dashboard with three NerveTerminals online. Kill one worker. Wait for heartbeat timeout. Show the dashboard updating in real time. Show the Norepinephrine signal in the WebSocket monitor.

**Why it exists:** The Demo is where completed work is shown to stakeholders (Module 4). If the Worker does not know how to demo the work, they do not fully understand what "done" looks like.

The Demo Specifics field forces the PM and Worker to agree, in advance, on what the demonstration will look like. This serves three purposes:

1. It clarifies the work — if you cannot describe how to demo it, you do not understand it well enough
2. It aligns expectations — the PM knows what they will see; the Worker knows what they must produce
3. It prepares the Demo — no scrambling on Thursday to figure out how to show the work

## The DoR as a Gate

The Definition of Ready is a gate. Work that does not have all six fields completed does not enter the Iteration. It stays in the backlog, in Sifting, until it is Ready.

This is not bureaucracy. It is protection. Every piece of unready work that enters an Iteration is a risk: a risk of misunderstanding, scope creep, blocked progress, or incomplete delivery. The DoR eliminates that risk by ensuring clarity before commitment.

The PM is responsible for ensuring work is Ready. The Worker can (and should) push back if a piece of work is presented for Planning without a complete DoR. "This is not ready" is a legitimate and expected response.

## Common Mistakes

**Writing vague assertions.** "The dashboard should look nice" is not an assertion. "Given the dashboard loads, when the user views the offline section, then offline NerveTerminals are displayed with red indicators and their last heartbeat timestamp" is an assertion.

**Leaving Outside empty.** If the Outside field is empty, scope is unbounded. There is always something that is not part of this work. Name it.

**Ignoring dependencies.** "We will figure it out" is not a dependency strategy. If the work needs something that does not exist yet, write it down.

**Writing Demo Specifics after the work is done.** The demo is not an afterthought. It is part of the definition of the work. Write it before the Iteration starts.

**Treating DoD Exceptions as standard.** If every piece of work has DoD exceptions, your Definition of Done is wrong — fix the DoD, not the exceptions.

## Think About It

- Pick a piece of work your team recently completed. Could you write all six DoR fields for it retroactively? Which field would have been hardest to fill in before the work started? That is the field that would have prevented the most problems.

- The perspective field requires naming a person or role. What happens to work that has no clear beneficiary? Should that work be done?

- "Outside" is a list of things you are not doing. In your personal life, what would an "Outside" field look like for your current priorities? What are you explicitly not doing this week?
