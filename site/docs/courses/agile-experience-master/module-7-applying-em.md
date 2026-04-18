---
title: "Module 7 — Applying EM to Your Team"
sidebar_position: 8
---

# Module 7: Applying Experience Master to Your Team

## How to Start

You have read six modules. You understand the operating system, the Definition of Ready, the Definition of Done, the ceremonies, the roles, and how it all encodes into software. Now the question: how do you actually start using Experience Master?

The answer is not "implement everything on Monday." The answer is: start with the Retrospective.

## The Retrospective-First Approach

If you adopt only one ceremony from Experience Master, adopt the Retrospective. Here is why:

The Retrospective is the mechanism that improves everything else. If your standups are broken, the Retrospective will surface it. If your planning is poor, the Retrospective will surface it. If your team has a trust deficit, the Retrospective will begin to address it (slowly, painfully, but it will).

Starting with the Retrospective also sends a signal: we care about getting better. Not about following rules. Not about adopting a framework because someone told us to. We care about examining our own process, honestly, and making it better.

### How to Run Your First Retrospective

1. **Schedule it.** End of your current work cycle (whatever that cycle is — a sprint, a month, a quarter). Block 60-90 minutes. Make it mandatory.

2. **Set the rules.** What is said in the Retrospective stays in the Retrospective. No blame. No punishment. No recording for HR. This is a safe space for honest assessment.

3. **Ask the three questions:**
   - What went well?
   - What did not go well?
   - What will we commit to changing? (Maximum three commitments.)

4. **Everyone speaks.** Not just the loud people. Not just the senior people. Everyone. Go around the room if you must. Silence is not agreement — it is disengagement.

5. **Pick three changes.** Not five. Not ten. Three. Write them down. Assign an owner to each.

6. **Follow up.** At the next Retrospective, start by reviewing the three commitments. Did we do them? If yes, celebrate. If no, ask why.

Run this for three Iterations (six weeks). By the end, your team will have identified its most pressing problems and made concrete progress on at least some of them. At that point, you are ready to add more of the operating system.

## The Adoption Sequence

After the Retrospective is established, add ceremonies in this order:

### Phase 1: Retrospective (Weeks 1-6)

Run the Retrospective every two weeks. This is all you change. Keep everything else the same.

### Phase 2: Standup and Iteration Rhythm (Weeks 7-12)

Add the daily standup with the three questions (completed, will complete, blocked). Formalize the two-week Iteration: define start and end dates, and make the Retrospective the official end of each Iteration.

At this point you have the clock (the two-week Iteration) and the daily pulse (the standup). The team has a rhythm.

### Phase 3: Definition of Ready (Weeks 13-18)

Introduce the six DoR fields. Start with just two: perspective and assertions. Add outside and dependencies next. Add DoD exceptions and demo specifics last.

Do not introduce all six at once. The team will resist. Each field is a new discipline, and disciplines are adopted one at a time.

### Phase 4: Planning and Demo (Weeks 19-24)

Formalize Planning as the first day of the Iteration and Demo as the second-to-last day. The PM role begins to crystallize — someone needs to own the DoR, run Planning, and facilitate the Demo.

### Phase 5: Sifting, Pre-Planning, and the Full Operating System (Weeks 25+)

Add Sifting, Pre-Planning, One-on-Ones, and Roundup. By this point, the team has been running a Retrospective for six months and has organically adopted most of the operating system. The remaining ceremonies fill gaps the team has already identified.

### Why This Sequence?

The sequence follows the principle of **pull, not push.** Each phase creates a need that the next phase addresses:

- The Retrospective surfaces problems ("we keep committing to work we do not understand")
- The standup makes those problems visible daily ("I am blocked because the requirements are unclear")
- The Definition of Ready prevents the problems ("the work is not ready until these six fields are complete")
- Planning and Demo create accountability ("we committed to this; here is what we delivered")
- Sifting and Pre-Planning make Planning efficient ("the PM already prepared the proposal")

If you push the full operating system on a team that has not felt the need for it, they will resist, comply minimally, and resent the overhead. If you let each phase create demand for the next, adoption is organic and durable.

## Common Mistakes

### Mistake 1: Adopting Everything at Once

"We are doing Experience Master starting Monday. Here are all the ceremonies, all the artifacts, all the roles." This overwhelms the team, creates resistance, and produces superficial compliance. The ceremonies are performed but not understood. Within six weeks, the team has quietly dropped everything except the standup (which becomes a status meeting) and the Retrospective (which becomes a complaint session).

### Mistake 2: Renaming Scrum Ceremonies

"We are doing Experience Master now. Our sprint is now an Iteration. Our grooming is now Sifting. Our scrum master is now a PM." Renaming is not adopting. If your Sifting meeting looks exactly like your old grooming meeting — a free-form discussion without DoR fields, without ready/not-ready decisions — you have changed the label but not the process.

### Mistake 3: Skipping the Retrospective

Some teams adopt the visible ceremonies (standup, planning, demo) and skip the Retrospective because it feels like "navel-gazing." This is fatal. Without the Retrospective, the operating system cannot adapt. Problems accumulate. Resentment builds. The team concludes that "agile does not work" — when in reality, they never installed the mechanism that makes agile work.

### Mistake 4: The PM Does Everything

A PM who writes every DoR, facilitates every ceremony, removes every block, and does not develop Workers is a single point of failure. The PM should be training Workers to write better assertions, to identify dependencies, and to resolve blocks independently. The PM's goal is a team that needs the PM less over time, not more.

### Mistake 5: Treating the DoR as Bureaucracy

"We have to fill out all these fields before we can start? This is just overhead." The DoR is not bureaucracy. Bureaucracy is process that exists for its own sake. The DoR exists because work that enters an Iteration without clear perspective, testable assertions, defined scope, known dependencies, and a demo plan has a high probability of failing. The DoR is not overhead — it is the cost of preventing much more expensive mid-Iteration failures.

## When to Deviate

Experience Master is an operating system, not a religion. There are times to deviate:

**Emergency work.** A production outage does not wait for Sifting, Pre-Planning, and Planning. The PM pulls work into the Iteration, makes a trade (something comes out), and the team executes. The Retrospective examines why the emergency happened and whether the process can prevent recurrence.

**Very small teams.** A team of two people does not need a formal standup. They are already talking constantly. But they still need a Retrospective, a Definition of Ready, and a Definition of Done. The ceremonies can be shortened and combined, but the artifacts are still necessary.

**Exploration work.** Research, prototyping, and experimentation do not always fit neatly into assertions and DoD conditions. For these items, the DoR might have softer assertions ("Given one week of exploration, when the Worker presents findings, then the team has enough information to decide whether to pursue this direction"). The key is that the work is still defined, time-boxed, and evaluated.

**New teams.** A team that has never worked together is still forming trust and norms. Pushing the full operating system too early can be counterproductive. Start with the Retrospective and the standup. Let the team build relationships before adding structure.

The rule for deviation: deviate consciously, document why, and review the deviation at the next Retrospective. Unconscious deviation is drift. Conscious deviation is adaptation.

## Experience Master and Are-Self Together

If you are adopting Experience Master for a team that also uses Are-Self, you have a unique opportunity: the operating system runs both in your team culture and in your software.

The agile addon (Module 6) can enforce the Iteration rhythm for your AI agents. Human team members follow the ceremonies in meetings. AI agents follow them in code. The shifts, the DoR checks, the velocity tracking — all of it runs in parallel for humans and machines.

This creates a shared language and a shared rhythm between the human and AI parts of your team. When a human Worker says "I am in Executing mode," the AI agents are literally in the Executing shift. When the PM says "we are Sifting," the AI agents are evaluating backlog items against DoR completeness.

Whether you adopt this integration immediately or grow into it over time depends on your team's maturity with both Experience Master and Are-Self. But the possibility is there — and it is one of the things that makes this combination unusual.

## Final Thoughts

Experience Master is simple. Two-week Iterations. Six ceremonies. Two roles. Six DoR fields. Three DoD conditions. The entire operating system fits on a single page.

Simple does not mean easy. Running the Retrospective honestly is hard. Writing good assertions is hard. Being a shield for your team is hard. Completing work (not just working on it) is hard. These are human challenges, and no framework eliminates them.

What Experience Master does is make the challenges visible. The Retrospective surfaces what is broken. The DoR prevents what is unclear. The DoD enforces what is complete. The standup reveals what is blocked. Every ceremony exists to make something visible that would otherwise be hidden — and hidden problems are the ones that destroy teams.

Start with the Retrospective. Run it for six weeks. See what surfaces. Build from there.
