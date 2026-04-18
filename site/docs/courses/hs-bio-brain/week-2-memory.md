---
title: "Week 2 — How Brains Remember"
sidebar_position: 4
---

# Week 2: How Brains Remember

The Hippocampus — the seahorse-shaped region that makes you *you*. Students dive deep into biological memory formation (encoding, consolidation, retrieval) and then open the Are-Self hippocampus app to see how software stores memories as vector-embedded engrams. The week's experiment: teach the AI something, wait, and see if it remembers. Compare that to how human memory works — and where it doesn't.

## Week Overview

**Theme:** Biological memory vs. computational memory

**Primary Variable:** Inquiry — after every answer, ask one more question.

<!-- Definition of Ready — perspective -->

**Why This Week Matters:**
Memory is the region where the brain-software metaphor is most seductive and most misleading. Vectors look like memory. Retrieval looks like recall. But biological memory is reconstructive, emotional, lossy, and context-dependent. Software memory is none of those things. Students who can articulate the difference understand something fundamental about both neuroscience and AI.

<!-- Definition of Ready — assertions -->

**Learning Goals:**
- Describe the three stages of biological memory: encoding, consolidation, retrieval
- Explain how the hippocampus interacts with the cortex during memory consolidation
- Compare biological memory formation to Are-Self's engram storage and vector similarity search
- Design and execute a simple experiment testing Are-Self's memory recall under different conditions
- Identify at least three ways biological memory differs from computational memory

<!-- Definition of Ready — outside -->

**What This Week Is Not:**
- This week does NOT cover long-term potentiation at the molecular level
- Students are NOT expected to understand vector mathematics or embedding models
- This is not a computer science lesson — the software is a lens for understanding the biology

---

## Day 1: How You Remember

### Objective

Students will experience and describe the three stages of memory (encoding, consolidation, retrieval) through a hands-on demonstration, then connect each stage to hippocampal function.

### Materials Needed

- 20 random objects on a tray (for the memory demonstration)
- Cloth to cover the tray
- [Week 2 Worksheet A: Memory Stages](./worksheets/week-2-worksheet-a.md)
- Biology textbook or reference material on hippocampal anatomy

<!-- Definition of Ready — dependencies -->

### Prerequisites for This Day

- Students have completed Week 1

### Warm-Up (5 minutes)

The classic memory tray test: show 20 objects for 30 seconds, cover them, ask students to list as many as they can in 2 minutes. Count their results. Ask: **"Why did you remember some and not others? What happened in your brain between seeing them and writing them down?"**

### Main Activity (35 minutes)

#### Part 1: The Biology of Remembering (15 minutes)

Walk through the three stages using the tray test as the anchor:
- **Encoding** — When you looked at the objects, sensory information entered through the temporal and parietal lobes and was processed by the hippocampus
- **Consolidation** — The hippocampus replayed the information (even in those 30 seconds), strengthening some connections and letting others fade
- **Retrieval** — When you wrote your list, the hippocampus coordinated with the cortex to reconstruct what you saw

Emphasize: biological memory is *reconstructive*, not reproductive. You don't replay a recording. You rebuild from fragments every time.

#### Part 2: The Famous Cases (10 minutes)

Briefly introduce patient HM (Henry Molaison) — bilateral hippocampal removal, inability to form new declarative memories, but procedural memory intact. This is the evidence that the hippocampus is critical for memory formation but not the only memory system.

Ask: **"If the hippocampus is removed, you can still ride a bike but can't remember learning to ride it. What does that tell us about where memories actually live?"**

#### Part 3: Worksheet (10 minutes)

Students complete [Worksheet A](./worksheets/week-2-worksheet-a.md) — diagram the three stages, label hippocampal involvement, and predict: "How would a software version of this work?"

### Reflection / Wrap-Up (5 minutes)

"Tomorrow we're going to open the Are-Self hippocampus and see how it stores memories. Your prediction from the worksheet is your hypothesis. Let's see how close you get."

<!-- Definition of Done -->

### Exit Ticket

"The most important thing the hippocampus does that I didn't know before today is ___."

### Assessment

Look for:
- **Understanding:** Can students describe the three stages in their own words?
- **Engagement:** Are they asking about edge cases (dreams, déjà vu, amnesia)?
- **Habit practice:** Are they forming predictions about the software? (Inquiry)

### Differentiation

**Advanced Learners:**
- Research the difference between declarative and procedural memory systems
- Investigate Clive Wearing as a second case study

**Struggling Learners:**
- Provide a pre-labeled diagram of the three memory stages
- Use the tray test as the anchor for every concept — keep it concrete

---

## Day 2: How Are-Self Remembers

### Objective

Students will explore the Are-Self hippocampus app, observe how engrams are created and retrieved, and compare the computational process to biological memory.

### Materials Needed

- Computer running Are-Self, projected (or on student devices)
- [Week 2 Worksheet B: Engrams vs. Neurons](./worksheets/week-2-worksheet-b.md)

### Prerequisites for This Day

- Are-Self is running with at least one Identity that has stored some engrams

### Warm-Up (5 minutes)

"Yesterday we learned that your hippocampus encodes, consolidates, and retrieves memories. Today we open the software version. Before we look — what do you predict? How would a computer store a memory?"

### Main Activity (35 minutes)

#### Part 1: Inside the Hippocampus App (15 minutes)

Navigate through the Are-Self hippocampus. Show:
- **Engrams** — the basic memory unit. Each engram is a piece of text converted to a vector (a list of numbers that captures meaning)
- **Deduplication** — the system checks whether a new memory is too similar to an existing one before storing it
- **Provenance** — every engram tracks where it came from and when

Ask as you go: "Is this like encoding? Is deduplication like consolidation? Where does this metaphor work? Where does it feel wrong?"

#### Part 2: The Critical Differences (10 minutes)

Lead a class discussion on the differences. Write on the board:

| Biological Memory | Are-Self Memory |
|---|---|
| Reconstructive — rebuilt each time | Reproductive — exact retrieval |
| Emotional weighting | No emotional weighting |
| Degrades over time | Persists until deleted |
| Context-dependent | Context via vector similarity |
| Can be false | Cannot be false (but can be irrelevant) |

Students contribute to the table. This is the key conceptual takeaway.

#### Part 3: Worksheet (10 minutes)

Students complete [Worksheet B](./worksheets/week-2-worksheet-b.md) — compare engrams to biological memory on specific dimensions.

### Reflection / Wrap-Up (5 minutes)

"Software memory doesn't forget. Yours does. Is forgetting a bug or a feature? Think about that tonight."

### Exit Ticket

"One way Are-Self memory is better than human memory: ___. One way human memory is better: ___."

### Assessment

Look for:
- **Understanding:** Can students articulate at least 2 differences between biological and computational memory?
- **Engagement:** Is the "forgetting is a feature" question generating debate?
- **Habit practice:** Are they pushing beyond the obvious parallels? (Inquiry)

### Differentiation

**Advanced Learners:**
- Research how vector similarity search works conceptually (no math required — just the idea of "closeness in meaning")

**Struggling Learners:**
- Focus on 2-3 key differences rather than the full table
- Provide sentence starters for the comparison

---

## Day 3: The Memory Experiment — Design

### Objective

Students will design a controlled experiment to test how Are-Self's memory (engram recall) compares to human memory under specific conditions.

### Materials Needed

- [Week 2 Worksheet C: Experiment Design](./worksheets/week-2-worksheet-c.md)
- Access to Are-Self (for planning purposes — actual experiment runs on Day 4)

### Prerequisites for This Day

- Students have completed Days 1–2

### Warm-Up (5 minutes)

"You've seen how both systems remember. Now you're going to test one of them. Your job today: design an experiment that tests Are-Self's memory in a way that reveals something about how it's different from yours."

### Main Activity (35 minutes)

#### Part 1: Experiment Design Discussion (10 minutes)

Brainstorm possible experiments as a class:
- "What happens if we teach it the same fact in different words? Does it deduplicate or store both?"
- "What if we teach it something, then ask about it in a completely different context?"
- "What if we give it contradictory information — does it notice?"
- "What if we teach it something emotionally charged vs. something neutral — does it treat them differently?"

#### Part 2: Individual/Pair Design (20 minutes)

Using [Worksheet C](./worksheets/week-2-worksheet-c.md), students design their experiment:
- Research question
- Hypothesis (with reasoning)
- What they'll teach the AI
- How they'll test recall
- What they'll measure
- What the control condition is

#### Part 3: Peer Review (5 minutes)

Swap experiment designs with another pair. Does the experiment actually test what it claims to test? Is there a control? Feedback on sticky notes.

### Reflection / Wrap-Up (5 minutes)

"Tomorrow you run it. Make sure your design is tight — you only get one shot with the class time we have."

### Exit Ticket

"My experiment tests whether Are-Self can ___. I predict it [can / cannot] because ___."

### Assessment

Look for:
- **Understanding:** Is the experiment actually testing memory, not reasoning or tool use?
- **Engagement:** Are the designs creative and specific?
- **Habit practice:** Did peer review lead to revisions? (Humility)

### Differentiation

**Advanced Learners:**
- Design a second experiment that tests a different aspect of memory

**Struggling Learners:**
- Provide 3 pre-designed experiment templates they can choose from and customize

---

## Day 4: The Memory Experiment — Run and Record

### Objective

Students will execute their memory experiment with Are-Self, collect data, and record observations.

### Materials Needed

- Computer access (lab or rotation)
- [Week 2 Worksheet D: Data Collection](./worksheets/week-2-worksheet-d.md)
- Experiment designs from Day 3

### Prerequisites for This Day

- Experiment designs reviewed and ready
- Are-Self running with fresh or designated Identity for experiments

### Warm-Up (3 minutes)

"Today is lab day. You have 35 minutes to run your experiment, collect your data, and record your observations. Stick to your design. If something unexpected happens — good. Write it down."

### Main Activity (40 minutes)

Students run their experiments in pairs. Teacher circulates, asking:
- "What are you seeing?"
- "Is that what you predicted?"
- "What would you change if you ran this again?"

Students record all data on [Worksheet D](./worksheets/week-2-worksheet-d.md).

### Reflection / Wrap-Up (5 minutes)

Quick share: 3 pairs share one surprising result in 30 seconds each.

### Exit Ticket

"My data shows ___. This [supports / contradicts / partially supports] my hypothesis because ___."

### Assessment

Look for:
- **Understanding:** Is data collection systematic and tied to the hypothesis?
- **Engagement:** Are they noticing unexpected results and recording them?
- **Habit practice:** Are they asking "why did that happen?" when surprised? (Inquiry)

### Differentiation

**Advanced Learners:**
- Run a second trial with modified variables

**Struggling Learners:**
- Teacher or TA assists with Are-Self operation; student focuses on observation and recording

---

## Day 5: The Memory Experiment — Analysis and Presentation

### Objective

Students will analyze their experimental data, draw conclusions about biological vs. computational memory, and present their findings.

### Materials Needed

- Completed data worksheets from Day 4
- [Week 2 Worksheet E: Analysis and Conclusions](./worksheets/week-2-worksheet-e.md)

### Prerequisites for This Day

- Experiments completed on Day 4

### Warm-Up (3 minutes)

"You have data. Now make it mean something."

### Main Activity (37 minutes)

#### Part 1: Analysis (15 minutes)

Using [Worksheet E](./worksheets/week-2-worksheet-e.md), students:
- Summarize their results
- Compare to their hypothesis
- Identify what their results reveal about the difference between biological and computational memory
- Connect back to the critical differences table from Day 2

#### Part 2: Lightning Presentations (20 minutes)

Each pair presents in 2 minutes: question, hypothesis, result, one insight. Class asks one question per presentation.

#### Part 3: Revisit Hypotheses (2 minutes)

"Look at your Week 1 hypothesis. Has anything changed? Write one sentence updating it based on what you learned this week."

### Reflection / Wrap-Up (5 minutes)

"Memory is where the metaphor is most tempting and most dangerous. Software 'remembers' perfectly. You remember imperfectly. But your imperfect memory is connected to emotion, context, and meaning in ways the software's isn't. Which is better? That depends on what you're trying to do."

### Exit Ticket

"The most important difference between how brains remember and how Are-Self remembers is ___ because ___."

---

## Looking Ahead

"Next week we go from memory to reasoning. The Frontal Lobe and Prefrontal Cortex — the parts of your brain that make plans, weigh options, and control impulses. And the parts of Are-Self that try to do the same thing. If you thought memory was complicated, wait until you see decision-making."

---

<!-- Retrospective -->

## Week 2 Reflection for Teachers

*Fill this in after you teach the week. Then share it with a colleague — ask them what worked in their classroom. You'll both be better for it.*

### What Worked Well

-

### What Didn't Work

-

### What to Change Next Time

-

### Common Questions & Troubleshooting

**Q: Students are confused about vectors and embeddings.**
A: They don't need to understand the math. The concept is: "the computer turns words into numbers that capture meaning, and similar meanings get similar numbers." That's enough. The biology is the point, not the linear algebra.

**Q: The memory experiment didn't show anything interesting.**
A: That's data too. Ask: "Why do you think it worked as expected? What would you change to get a more surprising result?" Null results teach experimental design.

### Assets to Prepare Before This Week Starts

- 20 objects for the memory tray demonstration
- HM (Henry Molaison) case study summary
- Are-Self running with an Identity that has some existing engrams
- Fresh Identity available for student experiments (Day 4)
- Copies of Worksheets A through E

<!-- Definition of Ready — demo_specifics -->

### Demo

**Who sees the work:** Classmates (lightning presentations on Day 5)

**What students show:** Experiment question, hypothesis, data, and one key insight

**How long:** 2 minutes per pair

---

## Summary

Week 2 takes students deep into the Hippocampus — biological and computational. They experience their own memory's limitations, compare them to software's perfect recall, and design an experiment that reveals the difference. The critical takeaway: biological memory is reconstructive, emotional, and lossy. Computational memory is reproductive, context-free, and persistent. Neither is better. They're different tools for different problems.
