---
title: "Week 2 — Memory and Identity"
sidebar_position: 4
---

# Week 2: Memory and Identity

How do you remember things? How does an AI remember things? Are those even the same kind of remembering? This week, students go deep on the hippocampus — the brain's memory maker — and discover that the way Are-Self stores memories is surprisingly similar in some ways and completely alien in others. Along the way, they'll wrestle with a bigger question: if your memories make you *you*, what does that mean for an AI that has memories too?

## Week Overview

**Theme:** Memory — biological and artificial

**Primary Variable:** Inquiry — asking better questions leads to better understanding.

**Why This Week Matters:**
Memory is the thing students think they understand but don't. They know they remember things. They don't know *how* — and the gap between how brains store memories and how software stores data is one of the most revealing parts of the brain-AI comparison. This week also introduces the Are-Self Identity system, which raises the uncomfortable question of whether software can have a self.

**Learning Goals:**
- Describe how the hippocampus forms and stores memories in the biological brain
- Explain how Are-Self stores memories (engrams, vectors, provenance tracking)
- Design and run a simple memory experiment comparing human recall to AI recall
- Discuss the relationship between memory and identity for both humans and AI
- Practice asking follow-up questions when the first answer isn't enough (Inquiry)

**What This Week Is Not:**
- This is NOT a comprehensive neuroscience lesson on long-term potentiation or synaptic plasticity — keep it accessible
- Students are NOT expected to understand vector databases or embedding models
- The identity discussion is philosophical, not technical — don't get bogged down in code

---

## Day 1: How Do You Remember?

### Warm-Up (5 minutes)

Write on the board: **"What is your earliest memory? How do you know it's real?"**

Let students share. Some will realize they might be remembering a photo or a story someone told them, not the actual event. That's exactly the right starting point.

### Main Activity (30 minutes)

#### Part 1: The Hippocampus Tour (12 minutes)

Introduce the hippocampus. Show where it sits in the brain (inner temporal lobe, one on each side). Cover the basics:

- The hippocampus doesn't store memories — it *creates* them. It takes experiences and turns them into things the brain can file away.
- Short-term to long-term: the hippocampus is the converter. Without it, you can't make new long-term memories.
- The famous case: a patient known as H.M. had his hippocampus removed to treat epilepsy. He could remember everything from before the surgery but couldn't form new memories after it. He'd meet his doctor every morning and introduce himself as if they'd never met.

Ask: "What does H.M.'s story tell us about what the hippocampus does? What does it tell us about where old memories actually live?"

#### Part 2: Memory Chain Game (12 minutes)

Classic memory game with a twist. First student says "I went to the store and bought an apple." Second student repeats and adds an item. Keep going until someone forgets.

Play the game. Then discuss:
- "Where did the chain break? Why?"
- "What strategies did people use to remember? (Visualization? Repetition? Grouping?)"
- "Your hippocampus was working hard during that game. What was it doing?"

#### Part 3: How Good Is Your Memory, Really? (6 minutes)

Show students a tray with 20 common objects for 30 seconds. Cover the tray. Students write down as many items as they can remember.

How many did they get? Most people get 7-12 out of 20. Keep the results — they'll compare them to Are-Self's memory on Day 3.

### Reflection (5 minutes)

Ask: **"If your hippocampus stopped working right now, what's the last memory you'd ever make?"**

### Exit Ticket

"The hippocampus is important because ___. One thing I want to know about how AI remembers: ___."

---

## Day 2: How Does Are-Self Remember?

### Warm-Up (5 minutes)

Quick quiz: "What does the hippocampus do? Tell the person next to you in one sentence. If you can't, that's okay — but notice that your hippocampus is failing to retrieve a memory you made yesterday."

### Main Activity (30 minutes)

#### Part 1: Engrams Explained (10 minutes)

In neuroscience, an engram is the physical trace of a memory in the brain — the pattern of neurons that fire together when you recall something. Are-Self borrowed the word.

In Are-Self, an engram is a stored memory with metadata: what was said, when it was said, who said it, how important it was, and a vector (a list of numbers) that represents its meaning. When Are-Self needs to remember something, it searches for engrams whose vectors are close to the question being asked.

Use a simple analogy: "Imagine your memories are books in a library. Your brain's hippocampus files them by association — a smell reminds you of a place, which reminds you of a person. Are-Self's hippocampus files them by meaning — it converts every memory into a number and finds memories whose numbers are close together."

Ask: "What are the advantages of each system? What are the disadvantages?"

#### Part 2: Live Demo — Are-Self's Memory (12 minutes)

Open Are-Self and demonstrate its memory system:
1. Tell Are-Self something: "My favorite color is blue."
2. Ask about something else. Change the topic.
3. Come back and ask: "What's my favorite color?"
4. Watch Are-Self retrieve the engram.

Now push harder:
5. Tell Are-Self a story with several details.
6. Wait. Ask about one specific detail.
7. Does it remember? How accurately?

Ask students: "How is this different from how you remember? How is it similar?"

#### Part 3: Memory Table (8 minutes)

Students create a comparison table in their notebooks:

| | Human Memory | Are-Self Memory |
|---|---|---|
| Where it lives | | |
| How it's stored | | |
| How it's retrieved | | |
| Can it be wrong? | | |
| Does it fade over time? | | |
| Can it be deleted? | | |

Fill in as much as they can. They'll finish it after Day 3's experiment.

### Reflection (5 minutes)

Ask: **"Is there something your memory does that Are-Self's memory can't? Is there something Are-Self's memory does that yours can't?"**

### Exit Ticket

"The biggest difference between human memory and AI memory is ___."

---

## Day 3: Memory Wars

### Warm-Up (5 minutes)

"Today is experiment day. We're going to test who has a better memory — you or Are-Self. Before we start, write your prediction: who will win, and why?"

### Main Activity (30 minutes)

#### Part 1: Design the Experiment (10 minutes)

As a class, design a fair memory test. Guide students through the scientific method with scaffolding:

- **Question:** Who remembers better — a human or Are-Self?
- **Hypothesis:** Each student writes their own.
- **Method:** The test needs to be fair. What does fair mean here? (Same information, same amount of time, same questions.) Discuss.

A good test: Read a paragraph with 10 facts. Wait 5 minutes. Ask 10 questions. Compare human scores to Are-Self's score.

Students help write the paragraph and the questions. This gives them ownership of the experiment.

#### Part 2: Run the Experiment (15 minutes)

1. Read the paragraph aloud. Students listen and take notes (or don't — their choice, and it's part of the experiment).
2. Feed the same paragraph to Are-Self.
3. Wait 5 minutes. Do something else — a stretch break, a brain teaser.
4. Ask the 10 questions. Students write answers. Then ask Are-Self the same questions, projected for the class to see.
5. Score both.

#### Part 3: Analyze the Results (5 minutes)

Who won? By how much? Was it fair? What would make it fairer?

Key discussion points:
- "Are-Self probably got a perfect score. Is that impressive, or is it just copying?"
- "Some of you got things wrong. But you also remembered things that weren't in the paragraph — personal connections, related memories. Did Are-Self do that?"
- "When you forget something, is it gone or just hard to find? What about Are-Self?"

### Reflection (5 minutes)

Ask: **"What kind of memory test would humans win? Design one in your head."**

The Variable here is Inquiry — the experiment is only as good as the question, and there's always a better question to ask.

### Exit Ticket

"Are-Self scored ___/10. I scored ___/10. But the test wasn't completely fair because ___."

---

## Day 4: Who Are You? Who Is the AI?

### Warm-Up (5 minutes)

Write on the board: **"If you lost all your memories, would you still be you?"**

Let students argue. There's no right answer, and they should feel that tension.

### Main Activity (30 minutes)

#### Part 1: Memory and Identity (10 minutes)

Connect the dots:
- Your memories shape who you are. Your personality, your preferences, your fears — all built from experiences your hippocampus encoded.
- Are-Self has an Identity system. Each AI identity has a name, a personality, skills, preferences, and a purpose. It's defined in a configuration file, not grown from experience.

Ask: "A human identity grows from memories. An AI identity is written by a person. Is that the same thing? Does it matter?"

#### Part 2: Meet an Identity (10 minutes)

Show students an Are-Self Identity configuration. Read through it together:
- What's this AI's name?
- What's its personality?
- What skills does it have?
- What's its purpose?

Then ask Are-Self: "Who are you?" and "Why do you exist?" Watch how it answers. Does it just read back its config, or does it say something more?

#### Part 3: Design Your Own AI Identity (10 minutes)

Students draft an AI Identity on paper. They decide:
- Name
- Personality (3-5 traits)
- What this AI is good at
- What this AI cares about (if anything)
- One memory they'd give it to start with

Share a few examples with the class. Ask: "Is this AI a person? Why or why not?"

### Reflection (5 minutes)

Ask: **"Your identity comes from your memories and experiences. This AI's identity comes from a file someone wrote. Is one more real than the other?"**

Today's Variable is Fulfillment or Happiness. Can an AI experience fulfillment? Should we care?

### Exit Ticket

"The most important difference between human identity and AI identity is ___."

---

## Day 5: Memory Remix

### Warm-Up (5 minutes)

"It's Friday. Let's see what your hippocampus retained this week." Quick quiz — no notes, no devices:
1. Where is the hippocampus located?
2. What does it do?
3. What's an engram?
4. Name one difference between human memory and AI memory.
5. What happened to patient H.M.?

Students grade their own. Celebrate what they remembered and talk about what they forgot.

### Main Activity (30 minutes)

#### Part 1: False Memories (10 minutes)

Tell students a list of related words: bed, rest, awake, tired, dream, wake, snooze, blanket, doze, slumber, snore, nap, peace, yawn, drowsy.

Wait one minute. Then ask: "Was the word SLEEP on the list?"

Most students will say yes. It wasn't. This is the Deese-Roediger-McDermott paradigm — a classic demonstration that human memory isn't a recording. It's a reconstruction.

Discuss: "Your brain created a false memory. Could Are-Self do that? Why or why not?"

#### Part 2: Memory Strengths and Weaknesses (10 minutes)

Students update their comparison tables from Day 2 with everything they've learned. Then they write a short argument (3-4 sentences):

**"Human memory is better than AI memory at ___ because ___. AI memory is better than human memory at ___ because ___."**

#### Part 3: Week in Review (10 minutes)

Return the "First Impression" paragraphs from Week 1. Students read their own and answer: "Would you change anything you wrote? What?"

Then look ahead: "Next week, we go from memory to thinking. The frontal lobe. Decision-making. And the wildest brain injury story in history."

### Reflection (5 minutes)

Ask: **"What's one thing you learned this week that you'll still remember a month from now? What makes you think so?"**

### Exit Ticket

"This week changed how I think about memory because ___."

---

## Looking Ahead

Week 3 moves from memory to thinking. Students will explore the frontal lobe, meet Phineas Gage, and wrestle with whether AI can actually think or just look like it does.

## Teacher Reflection

*Fill this in after teaching the week.*

### What Worked Well

-

### What Didn't Work

-

### What to Change Next Time

-

### Common Questions and Troubleshooting

**Q: Students are asking whether AI is conscious.**
A: Welcome to the hardest question in philosophy and computer science. Don't answer it. Ask them: "What evidence would convince you either way?" Let them sit with the uncertainty. This is Humility in action.

**Q: The memory experiment felt unfair because the AI just looks things up.**
A: Perfect. That's the insight. AI memory is retrieval, not recall. Ask students: "Is a filing cabinet's memory the same as your memory? What's the difference?"

**Q: Some students are uncomfortable with the identity discussion.**
A: Keep it low-pressure. The question "who are you?" can be intense for middle schoolers. Focus on the AI side if needed — "who is the AI?" is easier and still gets at the same concepts.

### Assets to Prepare Before This Week Starts

- Object tray for Day 1 memory test (20 common items, a cloth to cover them)
- Are-Self running with an established Identity (for Day 2 and Day 4 demos)
- A paragraph with 10 embedded facts for the Day 3 experiment
- DRM word list for Day 5 false memory demo
- Sticky notes for exit tickets
