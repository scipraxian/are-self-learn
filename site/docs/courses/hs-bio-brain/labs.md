---
title: "Lab Protocols"
sidebar_position: 11
---

# Lab Protocols: The Human Brain and the Are-Self

## Overview

This course integrates hands-on experimentation with Are-Self throughout Weeks 2–5. Each week follows the same experimental cycle: observe on Day 2, design on Day 3 (or early Day 4), run on Day 4, analyze and present on Day 5.

This page provides the technical setup and protocols teachers need to run these labs successfully.

---

## General Setup

### What You Need

- A computer running Are-Self (can be teacher-only or student-accessible, depending on your setup)
- Projector for whole-class demonstrations (Days 2 of each week)
- Student devices for experiment days (Days 4), if available — otherwise, teacher runs experiments with student direction

### Are-Self Access Modes

| Mode | Description | Best For |
|---|---|---|
| **Teacher-projected** | Teacher runs Are-Self on one machine, projected for the class | Schools with limited devices; Weeks 1–2 |
| **Shared stations** | 4–6 computers in the room, students rotate | Most classrooms; Weeks 3–5 |
| **1:1 student access** | Every student or pair has a device | Schools with full device access |

### Identity Setup

Are-Self uses "Identities" — configurations that define how the system reasons. For this course:

- **Demo Identity:** Pre-configured by the teacher with existing engrams (memories) for Days 1–2 demonstrations
- **Experiment Identity:** A fresh Identity for student experiments, so results aren't contaminated by prior data

Create both before the course starts. Instructions are in the [Are-Self documentation](https://are-self.com/docs/getting-started).

---

## Week 2: Memory Lab

### Protocol

**Goal:** Test how Are-Self's engram memory compares to human memory.

**Setup:**
1. Create a fresh Identity for experiments
2. Prepare 3–5 facts to "teach" the system as a class demonstration
3. Ensure students can access the system in pairs

**Suggested experiments:**
- Teach the same fact in different words — does it deduplicate or store both?
- Teach something, then ask about it in a completely different context
- Give it contradictory information — does it notice?
- Teach something emotional vs. neutral — does it treat them differently?

**Data to collect:** What was taught, what was asked, what was returned, whether the recall was accurate.

**Common issues:**
- If engrams aren't appearing, check that the Identity's hippocampus app is enabled
- Deduplication thresholds may prevent some memories from being stored — this is itself a finding

---

## Week 3: Decision Lab

### Protocol

**Goal:** Test whether Are-Self's reasoning misses something a human would catch — particularly emotional or social context.

**Setup:**
1. Prepare a multi-step problem for the Day 2 demonstration (something with moral or social dimensions)
2. Ensure the frontal_lobe and prefrontal_cortex apps are active

**Suggested experiments:**
- Present a moral dilemma and compare AI's response to a human's
- Give a scenario with social consequences and see if the system accounts for them
- Present an ambiguous situation where "gut feeling" matters
- Ask it to make a decision under time pressure vs. without pressure

**Data to collect:** The prompt given, the response received, what a human would have considered differently, whether the system showed any awareness of emotional/social factors.

**Common issues:**
- Students may test knowledge rather than reasoning — peer review on Day 3 should catch this
- The system may surprise students by appearing emotionally aware — discuss why pattern-matching isn't the same as feeling

---

## Week 4: Homeostasis Lab

### Protocol

**Goal:** Test how Are-Self's hypothalamus responds to resource pressure.

**Setup:**
1. If possible, configure Are-Self with adjustable hypothalamus settings (model selection, cost budgets, circuit breakers)
2. If settings aren't adjustable, prepare a demonstration showing different configurations and their effects

**Suggested experiments:**
- Restrict available models and run the same task — does output quality change?
- Reduce the focus budget and observe whether the system switches strategies
- Trigger a circuit breaker and observe the failover behavior

**Data to collect:** Condition (normal/restricted/heavily restricted), model selected, response quality (rated 1–5), time taken, whether circuit breakers fired.

**Common issues:**
- If you can't adjust settings, run this as a demonstration with class discussion
- Students may not see dramatic differences — subtle degradation is itself a finding about graceful failure

---

## Week 5: Network Lab

### Protocol

**Goal:** Test Are-Self's communication behavior — how information flows between regions and what happens when flow is disrupted.

**Setup:**
1. Prepare prompts that require coordination between multiple brain regions
2. If possible, show spike trains or pathway execution logs

**Suggested experiments:**
- Does information from one reasoning session reach another? (Memory isolation between sessions)
- Present a prompt that requires multiple regions to coordinate — can you see the handoffs?
- Look for evidence of the routing layer (thalamus) making choices about where to send input

**Data to collect:** The prompt, which regions appeared to activate, whether information crossed session boundaries, any observable routing behavior.

**Common issues:**
- Internal communication may not be visible to students — use logs or narrate what's happening
- "Finding a seam" between regions is hard — celebrate students who identify even subtle evidence

---

## Safety and Responsible Use

- Students should never input personal, sensitive, or identifying information into Are-Self
- All experiments should be documented honestly — including what didn't work
- Remind students that Are-Self is a research subject, not an authority — the point is to study it, not defer to it
- If a student's experiment produces an unexpected or concerning AI response, treat it as a teaching moment about AI limitations

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Are-Self won't start | Check the [setup guide](https://are-self.com/docs/getting-started). Ensure all dependencies are installed. |
| No engrams appear after teaching | Verify the hippocampus app is enabled for the active Identity. Check deduplication thresholds. |
| Reasoning seems to loop or hang | The frontal_lobe has iteration limits. If it exceeds them, try a simpler prompt. |
| Students can't access the system | Use teacher-projected mode. The concepts transfer even without hands-on access. |
| Cost budget runs out during class | Pre-configure generous budgets for experiment days. Monitor usage during the session. |
