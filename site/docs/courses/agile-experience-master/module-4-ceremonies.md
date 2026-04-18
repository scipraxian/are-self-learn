---
title: "Module 4 — The Ceremonies"
sidebar_position: 5
---

# Module 4: The Ceremonies

## The Meetings That Run the Operating System

Experience Master has six ceremonies. Each has a specific purpose, a specific format, and specific participants. None is optional. When teams drop ceremonies, the operating system degrades — not immediately, but inevitably, the way a machine with a missing gear still turns for a while before grinding to a halt.

## Sifting

**What others call it:** Grooming. Refinement. Backlog grooming.

**What Experience Master calls it:** Sifting. You are separating wheat from chaff. You are picking up a piece of potential work, turning it over, examining it, and deciding: is this real? Is this clear? Is this worth doing?

**When:** Between the Retrospective and the next Iteration's Planning. Typically the Monday before Planning, but the timing is flexible.

**Who:** The PM and relevant Workers. Not the full team unless the work affects everyone.

**What happens:**
1. The PM presents candidate work items from the backlog
2. For each item, the group examines:
   - Is the perspective clear? Do we know why this matters and for whom?
   - Can we write assertions? If we cannot write Given/When/Then statements, we do not understand the work.
   - What is outside scope? What are we explicitly not doing?
   - What are the dependencies? Can they be resolved before the Iteration?
   - How would we demo this?
3. Items that can be fully defined (all six DoR fields) are marked Ready
4. Items that need more information are sent back with specific questions
5. Items that are not worth doing are removed from the backlog

**What goes wrong:** Sifting becomes a brainstorming session. People discuss ideas, possibilities, "wouldn't it be cool if" scenarios. Sifting is not for generating work. It is for evaluating and clarifying work that already exists in the backlog. If the backlog is empty, the PM has a different problem — and Sifting is not the solution.

**The word matters:** "Grooming" has uncomfortable connotations in many cultures and has been dropped by much of the agile community. "Refinement" is better but vague — refined how? Sifting is specific. You have a pile. You sort it. Some of it is ready. Some is not. Some is trash.

## Pre-Planning

**When:** Immediately before Planning, or the day before.

**Who:** The PM only, or the PM and a senior Worker.

**What happens:**
1. The PM reviews all Ready items
2. The PM estimates the team's capacity for the upcoming Iteration (based on velocity and known absences)
3. The PM selects which Ready items to propose for the Iteration
4. The PM sequences the items — what should be done first? What depends on what?
5. The PM prepares the Planning presentation

**What goes wrong:** Pre-Planning is skipped, and Planning becomes Pre-Planning. The PM arrives at Planning without a proposal, and the team spends the meeting doing work the PM should have done in advance. Planning should be a discussion of a proposal, not a brainstorming session.

## Planning

**When:** First day of the Iteration (Monday of Week 1).

**Who:** The PM and all Workers.

**What happens:**
1. The PM presents the proposed work for the Iteration — the items selected during Pre-Planning
2. For each item, the PM walks through the DoR: perspective, assertions, outside, DoD exceptions, dependencies, demo specifics
3. Workers ask questions, challenge assertions, and identify risks
4. Workers volunteer for (or are assigned to) specific items
5. The team commits to the Iteration scope

**What goes wrong:** Three things.

First, the team overcommits. Optimism bias is universal — "we can do more than last time." Velocity data (from the DoD tracking in Module 3) is the corrective. If the team completed seven items last Iteration, proposing twelve this Iteration requires justification.

Second, Workers accept work they do not understand. If a Worker cannot explain the assertions in their own words, they do not understand the work. The PM should check: "Tell me what you will build." If the Worker cannot, the work is not ready for that Worker.

Third, Planning takes too long. Planning should be one to two hours. If it takes longer, the DoR is incomplete (items are being defined during Planning instead of during Sifting) or the proposed scope is too large.

## Demo

**When:** Thursday of Week 2 (second-to-last day of the Iteration).

**Who:** The PM, all Workers, and stakeholders.

**What happens:**
1. Each Worker presents completed work using the Demo Specifics from the DoR
2. The Worker demonstrates that each assertion passes — live, not via slides or screenshots
3. Stakeholders ask questions and provide feedback
4. The PM notes which items are Done (met the DoD) and which are not

**What goes wrong:** Two things.

First, the Demo becomes a slideshow. "Here is what we built" with screenshots is not a Demo. A Demo is live. The software runs. The assertions are verified in real time. If it breaks during the Demo, that is information — it means it is not Done.

Second, stakeholders use the Demo to request new work. The Demo is for reviewing completed work, not for defining future work. New requests go into the backlog for future Sifting. The PM gates this: "Great idea — let's add it to the backlog and sift it next cycle."

## Retrospective

**When:** Friday of Week 2 (last day of the Iteration). This is the most important meeting in Experience Master.

**Who:** The PM and all Workers. Stakeholders are not invited.

**What happens:**
1. The PM asks three questions:
   - **What went well this Iteration?** What should we keep doing?
   - **What did not go well?** What should we change?
   - **What will we commit to changing in the next Iteration?** (Maximum three commitments)
2. Every Worker contributes to every question
3. The team selects a maximum of three specific, actionable changes
4. The PM records the commitments and will verify them at the next Retrospective

**Why it is the most important meeting:** The Retrospective is the upgrade mechanism for the operating system. Every other ceremony runs the current process. The Retrospective changes the process. Without it, the team repeats the same mistakes indefinitely. With it, the team improves measurably every two weeks.

**What goes wrong:** Three things.

First, the Retrospective is skipped. "We are too busy." This is the same as saying "we are too busy to improve." The Retrospective is the first ceremony to be dropped when a team is under pressure — and the most damaging to drop, because it is the mechanism that prevents future pressure.

Second, the Retrospective produces too many action items. "Let's fix everything" is a recipe for fixing nothing. Three commitments. Maximum. If you cannot fix it in three changes, you need to prioritize.

Third, the commitments are not followed up. The PM must open the next Retrospective by reviewing the previous Retrospective's commitments. "We committed to X, Y, and Z. Did we do them?" If the answer is consistently no, the Retrospective is theater.

## One-on-One

**When:** Weekly, between the PM and each individual Worker.

**Who:** The PM and one Worker.

**What happens:**
1. The Worker speaks first. Not the PM. The Worker.
2. The Worker raises whatever is on their mind: blockers, frustrations, career development, personal challenges, ideas, concerns
3. The PM listens, asks questions, and takes action where appropriate
4. The PM provides feedback on the Worker's performance — specific, actionable, timely

**Why it exists:** The standup is for synchronization. The Retrospective is for process improvement. The One-on-One is for people. Workers are humans with lives, ambitions, frustrations, and needs that do not fit into a fifteen-minute standup or a group retrospective.

The One-on-One is the PM's most important tool for building trust and retaining good people. A Worker who feels heard, supported, and developed will stay. A Worker who feels like a task executor will leave.

**What goes wrong:** The PM talks too much. The One-on-One is for the Worker. The PM's agenda comes second. If the PM spends the meeting giving directives and assigning tasks, it is not a One-on-One — it is a command briefing.

## Roundup

**When:** End of each day, or as needed during the Iteration.

**Who:** The PM and the full team, briefly.

**What happens:**
1. The PM summarizes the day's progress and any status changes
2. The PM highlights any blocks that were resolved or newly discovered
3. The PM adjusts priorities if needed based on new information
4. The team asks rapid-fire questions

**Why it exists:** The standup happens in the morning. Things change during the day. The Roundup is a lightweight end-of-day sync that catches changes before they compound overnight.

**What goes wrong:** The Roundup becomes a second standup. It should be five minutes, not fifteen. The PM talks. The team listens. Questions are rapid. If a topic needs discussion, it happens after.

## The Ceremony Calendar

| Day | Week 1 | Week 2 |
|-----|--------|--------|
| Before the Iteration | Sifting, Pre-Planning | — |
| Monday | Planning | Standup, Roundup |
| Tuesday | Standup, Roundup | Standup, Roundup |
| Wednesday | Standup, Roundup | Standup, Roundup |
| Thursday | Standup, Roundup | Demo |
| Friday | Standup, Roundup | Retrospective |
| Weekly | One-on-One (each Worker) | One-on-One (each Worker) |

## Think About It

- The Retrospective is called "the most important meeting." Do you agree? What would happen to a team that held every ceremony except the Retrospective? What would happen to a team that held only the Retrospective?

- The One-on-One starts with the Worker speaking. Most management meetings start with the manager speaking. What is the effect of inverting this?

- Sifting is explicitly not brainstorming. What is the value of separating "generate ideas" from "evaluate ideas"? Where else in your work would this separation help?
