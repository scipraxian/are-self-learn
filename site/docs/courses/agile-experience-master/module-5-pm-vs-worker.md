---
title: "Module 5 — PM vs Worker"
sidebar_position: 6
---

# Module 5: PM vs Worker

## Two Roles. Clear Boundaries.

Experience Master has two roles: PM and Worker. Not three. Not five. Not a matrix of roles, sub-roles, and dotted-line responsibilities. Two.

This simplicity is deliberate. Every additional role creates a boundary — and every boundary creates a communication overhead, a decision-making ambiguity, and a blame target. Two roles means one boundary. One boundary means clear accountability.

## The PM

The PM is the Project Manager. Not the scrum master. Not the agile coach. Not the facilitator. The PM has authority and uses it.

### What the PM Does

**Owns the backlog.** The PM decides what work exists, how it is prioritized, and when it enters an Iteration. Workers can suggest work. Stakeholders can request work. The PM decides.

**Writes the DoR.** The PM is responsible for ensuring every piece of work has a complete Definition of Ready before it enters an Iteration. The PM writes or supervises the writing of perspective, assertions, outside, DoD exceptions, dependencies, and demo specifics.

**Runs the ceremonies.** The PM facilitates Sifting, Planning, Demo, and Retrospective. The PM conducts One-on-Ones. The PM does the Roundup.

**Removes blocks.** When a Worker is blocked — by a dependency, a decision, an access issue, a stakeholder conflict — the PM removes the block. This is the PM's most important daily activity. A blocked Worker is a wasted Worker, and the PM is accountable for the waste.

**Shields the team.** Stakeholders want things. Customers want things. Executives want things. They want them now. The PM stands between the team and external demands, absorbing pressure so Workers can focus on the committed work. The PM says "no" or "not this Iteration" so Workers do not have to.

**Tracks velocity.** The PM records what was completed each Iteration, who completed it, and whether the Iteration's commitments were met. This data drives future Planning.

### What the PM Does Not Do

**The PM does not do the work.** The PM does not write code, design interfaces, or test features. The PM's job is to create the conditions in which Workers can do the work. A PM who is also doing Worker tasks is neglecting one role or the other.

**The PM does not assign story points.** Experience Master does not use story points. Velocity is measured by counting completed items, not by summing arbitrary complexity estimates. Story points were designed to create a language for negotiation between business and technical stakeholders. Experience Master replaces that negotiation with the DoR: clear, specific, testable assertions that both parties can evaluate.

**The PM does not micromanage.** The PM defines what needs to be done (the DoR). The Worker decides how to do it. The PM does not stand over the Worker's shoulder, suggest implementation approaches, or review work-in-progress unless asked. The Worker's autonomy in the "how" is sacrosanct.

### The PM as Shield

The shield metaphor is central to Experience Master. External forces constantly press on the team: urgent requests, executive mandates, customer escalations, competitive pressures. Without a shield, these forces fragment the team's attention, break commitments, and destroy the Iteration rhythm.

The PM absorbs these forces. When a stakeholder says "we need this by Friday," the PM evaluates: is this genuinely urgent? If so, the PM makes a trade — something comes out of the Iteration so something else can go in. If not, the PM says "we will evaluate this for the next Iteration" and takes the heat.

This is why the PM needs authority, not just facilitation skills. A facilitator can moderate a discussion. A shield needs the power to say no.

## The Worker

The Worker is anyone who completes work within the Iteration. "Worker" is not a title — it is a role. An engineer is a Worker. A designer is a Worker. A QA person is a Worker. A technical writer is a Worker. Anyone who picks up a piece of work, does it, and delivers it according to the DoD is a Worker.

### What the Worker Does

**Completes work.** The Worker's primary job is to take items from the Iteration plan and deliver them according to the assertions in the DoR and the conditions of the DoD.

**Decides how.** The PM defines what. The Worker decides how. This autonomy is not negotiable. If the assertions say "given X, when Y, then Z," the Worker can use any approach, any technology, any design that satisfies those assertions. The PM does not dictate implementation.

**Communicates status.** At the daily standup, the Worker reports what they completed, what they will complete next, and what is blocking them. Between standups, the Worker communicates significant changes proactively — a new block, a discovery that changes scope, a risk that was not anticipated.

**Participates in ceremonies.** The Worker attends Planning, Demo, and Retrospective. The Worker presents their completed work at Demo. The Worker contributes to the Retrospective's three questions.

**Raises blocks immediately.** A blocked Worker must not silently wait for the block to resolve itself. The moment a block is identified, the Worker communicates it — to the PM, at the standup, or directly. Blocks are the PM's responsibility to remove, but only if the PM knows they exist.

### What the Worker Does Not Do

**The Worker does not manage the backlog.** The Worker does not prioritize work, schedule Iterations, or decide what the team should do next. The Worker can suggest. The PM decides.

**The Worker does not negotiate scope with stakeholders.** If a stakeholder asks the Worker to do something that is not in the Iteration plan, the Worker says "talk to the PM." The Worker does not say yes. The Worker does not say no. The Worker defers to the PM, because scope management is the PM's job.

**The Worker does not estimate story points.** There are no story points to estimate.

### The Worker's Autonomy

The how is the Worker's domain. This means:

- The Worker chooses the technical approach
- The Worker chooses the order in which they address the assertions
- The Worker decides when to ask for help and when to push through
- The Worker's workspace, tools, and schedule (within the Iteration structure) are their own

This autonomy is not a perk. It is a design requirement. Workers who are told both what to do and how to do it have no ownership. Workers who have no ownership do not care whether the work is good — they care whether the work matches what they were told. The quality difference between an autonomous Worker and a directed one is profound.

## The One-on-One as a Development Tool

The One-on-One (Module 4) is where the PM-Worker relationship becomes personal. In the context of roles, the One-on-One serves specific functions:

**For the PM:** The One-on-One is how the PM understands each Worker as a person — their strengths, their frustrations, their career aspirations, their current state of mind. This understanding informs how the PM assigns work, removes blocks, and supports the Worker.

**For the Worker:** The One-on-One is the Worker's private channel to the PM. Issues that cannot be raised in a group setting (interpersonal conflicts, burnout, compensation concerns, personal problems affecting work) have a safe space.

**As a development tool:** The PM uses the One-on-One to develop the Worker's skills. This is not performance review — it is ongoing, specific, actionable feedback. "Your assertions in the Demo were clear and well-structured. I noticed you struggled with the dependency analysis. Let me show you how I approach that." Feedback is bidirectional — the Worker can tell the PM what is working and what is not about the PM's leadership.

## Why You Do Not Assign Story Points

This deserves its own section because it is one of Experience Master's most controversial positions.

Story points are a unit of estimated complexity used in Scrum. The team assigns points to each story (1, 2, 3, 5, 8, 13...) and tracks how many points the team completes per sprint (velocity in points). The idea is that relative estimation is easier than absolute estimation, and that velocity in points gives a predictable planning metric.

Experience Master rejects story points for four reasons:

**1. Estimation is waste.** The time spent estimating (planning poker sessions, debates about whether something is a 5 or an 8) produces no value. It produces a number that is, at best, a guess. Experience Master replaces estimation with clarity: if the assertions are specific, the work is understood. If the work is understood, it either fits in the Iteration or it does not.

**2. Points are gameable.** Teams learn to inflate points to reduce pressure. A task that used to be a 3 becomes a 5 because the team wants more slack. Velocity in points appears stable, but the actual work decreases. Counting completed items is harder to game — you either completed the work or you did not.

**3. Points distort conversation.** "Is this a 3 or a 5?" is the wrong question. "Do we understand this well enough to commit to it?" is the right question. Story point discussions displace the conversations that matter — about assertions, dependencies, and risks — with conversations about numbers.

**4. Velocity in items is simpler and sufficient.** The team completed seven items last Iteration. Can we commit to seven items this Iteration? Are the items roughly comparable in size? If one item is vastly larger than the others, break it into smaller items. Simplicity beats precision when the inputs are uncertain.

## Think About It

- The PM decides what. The Worker decides how. Where in your current work is this boundary clear? Where is it blurred? What happens when it is blurred?

- The PM is a shield. Who is your shield? If you do not have one, who absorbs the external pressure on your work?

- Experience Master says story points are waste. If you currently use story points, what value do they provide? Could that value be obtained a different way?

- The Worker's autonomy in "how" is described as a design requirement, not a perk. Why? What breaks when Workers are told how to do their work?
