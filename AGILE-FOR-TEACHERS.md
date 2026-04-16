# Agile for Teachers — Design Decisions

*Companion to `are-self-documents/BOOK-DIGEST.md`. The digest tells you what Experience Master says. This file tells you how Are-Self applies it to K-12 classrooms, corporate training, and the CC Frameworks course.*

*Decisions locked by Michael on 2026-04-15 in response to the digest's open questions. The book is legacy reference; these answers are the operating spec.*

---

## Vocabulary call

The book uses **Standup** and **Grooming**. PLAN.md pre-emptively replaced them with **check-in** and **Sifting**. The book is legacy. PLAN.md wins. `agile_addon.py` already sided with PLAN.md (`Shift.SIFTING`, line 133), so the code is already correct.

Final canonical terms for every course: **Iteration** (2 weeks), **Pre-Planning**, **Sifting**, **Check-in**, **Demo**, **Roundup**, **One-on-One**, **Retrospective**, **Definition of Ready**, **Definition of Done**. The three ceremonies the book names that PLAN.md hadn't provisionally named — Demo, Roundup, One-on-One — are clean adds and belong in the teacher operating system.

---

## Scope call: introduce ALL the ceremonies

The teacher-facing material carries **100% of the ceremonies from the book**, not just the subset Are-Self currently implements. Teachers have never conceived of this idea. The whole suite is the novelty — compressing or subsetting it would be translating something they've never seen back into something they already half-do. Ship the full set.

---

## Retrospective facilitation — by an authority, not the teacher

The retrospective is run **by an authority who is not the teacher being reflected on**. This is the point: teachers currently do not get observed and reflected on in this format, by anyone. Having a principal, a department head, a peer-from-another-school, or an outside facilitator run a retrospective on a teacher's iteration is the whole innovation. The teacher is the subject of the retrospective, not the facilitator of it. This is also the answer to "how does a teacher get another teacher to run their retrospective — they won't see it coming": the facilitator is the authority figure who is already in the room, and the ritual is framed as something else (observation, coaching, check-in) until the practice takes.

---

## Velocity — yes, it's the right metric, and gaming it is the point

Velocity is a **whole lesson** in the CC Frameworks course and appears in abbreviated form in every course that has iterations. It is the right metric. Students (and teachers) **are expected to game it**. That is not a bug — it is the core lesson. The moment you measure work, you change work. If the PM knows the game too, gaming velocity becomes a shared, legible negotiation between estimator and estimated instead of a hidden one. Teach the gaming. Teach the counter-gaming. Teach the meta.

This is also the answer to "what do you do when students inflate their estimates": you congratulate them for learning the first real lesson of project management, and then you teach them what PMs do about it.

---

## Check-in (the book's "Standup") — planned, not surprise

What teachers currently endure: they are made to stand up and torture themselves as a surprise. The innovation is that the Are-Self version is **planned**. Daily, brief, with a known shape — what I finished, what I'm on, what's blocking me. Predictable. Scheduled. Scripted enough that a brand-new teacher can run one without prep. The book-vs-practice distinction here is everything; it is the difference between a ritual and an ambush.

---

## Pre-Planning — "who's gonna pay for this"

Pre-Planning is not a soft discovery meeting. Pre-Planning is the **"who's gonna pay for this"** meeting. Scope, cost, budget, funding source, political will. Before a single lesson plan is drafted, Pre-Planning answers the question of who bears the cost — district, principal, grant, parent, teacher's own time. This is also the place to surface the cost of *not* doing the work.

Burnout is not a design concern here. Teachers are already burned out doing unplanned work for undefined stakeholders with no Definition of Done. Pre-Planning reduces burnout by naming the payer and bounding the work. If Pre-Planning feels heavy, it is because the current system hides the cost until it lands on the teacher.

---

## Demo audience, DoD for assignments, retrospectives for young students

These are handled by **rubrics**. Every lesson in every course has at least one rubric (framework-level rule, same tier as "every lesson has at least one worksheet"). The rubric is where:

- The Demo audience is named (peers, teacher, parents, external reviewer, or combination).
- The Definition of Done for the specific artifact is spelled out — learning outcome AND shipping quality, both, because in pedagogy they are the same thing when the rubric is honest.
- Elementary-age retrospective prompts are age-shaped without changing the practice — "what did you learn, what surprised you, what would you try differently."

The rubric absorbs the ambiguity. It is the per-lesson interface where the universal operating system meets the specific audience.

---

## What this unfreezes

`PLAN.md` §"The Agile injection — frozen" is now unfrozen. The next Claude session can:

1. Populate `definition_of_ready` and `definition_of_done` in the course frontmatter schema using the exact six DoR fields and the DoD ownership rule from `BOOK-DIGEST.md` §4.
2. Author the `_template/` daily-rhythm section using the full ceremony suite (Pre-Planning, Sifting, Planning, Check-in daily, Demo, Roundup, One-on-One, Retrospective).
3. Write the HS Bio course's iteration structure and the Hypothalamus Cost Management course's iteration structure against this locked vocabulary.
4. Draft the Velocity lesson for the CC Frameworks course as its own first-class unit, with explicit "gaming it is the lesson" framing.
5. Write per-lesson rubric templates that carry Demo-audience, artifact-level DoD, and age-appropriate retrospective prompts.

---

## What is still Michael's call

Nothing in the agile layer is blocking. The questions the book left open have been answered above. The remaining decisions are scope decisions — which course gets the agile treatment first — and those are already sequenced in PLAN.md §"Next actions."
