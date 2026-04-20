    # Are-Self Curriculum Framework — Master Planning Doc

*Status: Repo created and scaffolded. Template, linter, and Django driver still to build. This is the memory layer so nothing gets lost between sessions.*

*Owner: Michael. PM (current session): Claude.*
*Repo:* `are-self-learn` *(this file lives in it).*
*Last updated: 2026-04-14.*

---

## The one-sentence version

Spin a new standalone repo whose entire purpose is to be **the curriculum
framework delivery mechanism** for Are-Self — a Django-driven, file-based,
Docusaurus-rendered platform that hosts many curricula for many audiences,
all built from a single standardized template with enforced metadata, and
exposed through a filterable `/learn` landing page.

---

## Why a new repo

The current 4th-grade curriculum lives inside `are-self-docs/docs/curriculum/`.
That worked as a seed. It does not scale to eleven-plus courses across K-12,
higher ed, corporate, and small-business audiences.

Separating it:

- Keeps `are-self-docs` focused on **developer documentation** for the
  Are-Self software.
- Gives the curriculum work its own release cadence, its own contributors,
  its own issue tracker, and its own review pipeline.
- Lets non-developers (teachers, reviewers, the UCSD neuroscience dean, etc.)
  land in a repo that is not intimidating.
- Makes OER adoption cleaner — aggregators can ingest one repo that is
  unambiguously "the curriculum."

**Proposed repo name:** `are-self-learn` (matches the `/learn` top-nav URL).

**Architecture:** Django app + file-based content + Docusaurus rendering.
NOT a database-backed authoring tool. Files are the source of truth because
files give Claude full visibility into the whole corpus; a database would
hide it.

- **Django side:** a thin "driver" app that validates frontmatter against
  the tag taxonomy, lints templates (missing worksheets, missing DoR/DoD,
  missing standards alignment, etc.), generates the `/learn` landing page
  data, and provides CLI commands for authoring (`manage.py new_course`,
  `manage.py lint_course`, `manage.py publish_course`).
- **Content side:** every course is a folder of markdown + YAML + static
  assets. Git is the database.
- **Rendering side:** Docusaurus consumes the markdown and renders the
  site. The Django app produces the `sidebars.js` and the `/learn` landing
  page JSON from the authoritative YAML.
- **Not React** for authoring. Keep the author-facing surface as
  plain-text-and-commits for now.

**Build order (important — this is the anti-trap sequence):**

1. **Template first.** Make a `_template/` directory so clean that creating
   a new course is copy-paste-and-rewrite.
2. **Linter second.** A pre-commit hook or Django management command that
   validates the YAML frontmatter, checks for missing required sections,
   and fails the build if a course is incomplete.
3. **Authoring app third.** Only build the Django management layer once the
   template + linter reveal where the real pain is.

Estimated time for Michael to build the Django side: 1-2 hours. The
scaffolding is not the hard part. The hard part is the template, the tag
taxonomy, and the vocabulary — which is why we are writing them down here
first.

---

## Vocabulary rules (non-negotiable)

Words matter. Are-Self is itself a demonstration that renaming a thing can
change what it is. The curriculum framework inherits this rule.

### Banned terms

- **Scrum** — violent sports metaphor. Out.
- **Grooming** — out. Replaced by **Sifting**.
- **Sprint** — competitive/violent. Replaced by **2-week iteration** (or
  just "iteration").
- **Standup** — military. Replaced by **check-in** (placeholder; final term
  comes from Michael's book).
- Any "competition," "battle," "kill," "crush," "dominate" framings. Out.

### Preferred terms (provisional — final list comes from Michael's book)

- **Iteration** — 2 weeks. Always 2 weeks.
- **Sifting** — what used to be called grooming. The practice of reviewing
  and refining upcoming work before it is committed to.
- **Pre-planning** — the step before an iteration begins.
- **Retrospective** — kept. This term is not violent and it is the single
  most important practice to preserve. See "Agile injection" below for the
  stealth-adoption strategy.
- **Definition of Ready (DoR)** — kept *as a concept*, renamed if Michael's
  book uses different language.
- **Definition of Done (DoD)** — same.

### Rule for the CC Frameworks (Django) course

That audience is CS students heading into industry. They will encounter
"Scrum," "sprint," "standup" on the job. In that single course — and only
that course — we may use the industry terms *in footnotes* while teaching
the same practices under the preferred names in the body. The body text
leads with our vocabulary; the footnote acknowledges the industry term so
students can pattern-match on their first job. This is the only exception.

### The Agile injection — UNFROZEN (2026-04-15)

The book has been read and digested. Full digest lives at
`are-self-documents/BOOK-DIGEST.md`. Read that file before designing
any lesson-plan checklists, teacher operating systems, or classroom
ceremonies. The digest supersedes everything below in case of conflict.

**Locked vocabulary (from the book + Michael's overrides):**

| Concept | Final term | Book term | Notes |
|---|---|---|---|
| 2-week cycle | **Iteration** | Iteration | Match |
| Daily check-in | **Standup** | Standup | Book's own word; acceptable |
| Pre-iteration refinement | **Sifting** | Grooming | Michael's override; `agile_addon.py` uses `Shift.SIFTING` |
| Pre-iteration ceremony | **Pre-Planning** | Pre-Planning | Match |
| Review of completed work | **Demo** | Demo | New; was unnamed in PLAN.md |
| End-of-cycle reflection | **Retrospective** | Retrospective | Match; "the most neglected and debatably the most important" |
| Manager 1:1 | **One-on-One** | One-on-One | New |
| Team learning | **Roundup** | Roundup | New |
| Readiness checklist | **Definition of Ready (DoR)** | Definition of Ready | Six fields: perspective, assertions, outside, dod_exceptions, dependencies, demo_specifics |
| Completion checklist | **Definition of Done (DoD)** | Definition of Done | Three conditions: assertions met, QA signed off, assigned to completing Worker |

**Daily rhythm (2-week iteration, from pp. 92–100):**

Week 1:
- Sun: Off
- Mon: Work day
- Tue: Planning (AM 2+ hrs), Demo / Retro / Planning (PM)
- Wed: One-on-Ones (AM), Roundup (midday), Sifting (PM)
- Thu: Pre-Planning (AM)
- Fri: Work day
- Sat: Off

Week 2: Same structure.

**Stealth adoption strategy for teachers** (p. 131–132): The
teacher-facing materials embed these practices into classroom routines
without naming them as agile ceremonies. Teachers naturally ask each
other "what worked?" — that IS a retrospective. The invisible OS for
K-12 / explicit tool for CS students recursion is now a concrete
blueprint, not just a design goal.

**DoR six fields for course template:**

1. `perspective` — the "why" and "who"
2. `assertions` — bulleted, independently testable completion criteria
3. `outside` — explicit scope exclusions (what NOT to do)
4. `dod_exceptions` — any agreed deviations from standard DoD
5. `dependencies` — IDs of prerequisites that must be resolved first
6. `demo_specifics` — who will witness the demo and what will be shown

These go into every lesson plan template and every course frontmatter
schema. The linter enforces their presence.

---

## The rubric system (v1.5 — locked 2026-04-20)

Every course ships with three rubric files, not one. Vocabulary and shape
are locked as of this date. Working drafts live in
`are-self-documents/rubric-rebuild/`. The 2005 UCSD original that seeded
the whole system is
`are-self-documents/scipraxian/UCSD/Cog_Sci_Modern_Media_Rubric_1_3.xls`.

### The three files

Every course folder has:

1. **`rubrics.md`** — the detailed per-week/per-unit criteria rubric.
   Every criterion rated across the full 0–5 ladder. Standards-aligned
   where relevant (NGSS for HS Bio, etc.). Includes cross-cutting AI
   Collaboration, Scipraxian Variables, and Learner Self-Assessment
   tables. This is the facilitator's assessment instrument.

2. **`course-rubric.md`** — the v1.5 coaching aid. One page. Ladder
   legend at top. Two tables (Subjects and Learning Outcomes) with five
   columns each: `Subject · Learner (O) · Learner (S) · Facilitator (O)
   · Facilitator (S)`. Learner writes a digit 0–5 in each cell. Shared
   coaching instrument — learner and facilitator both fill it out.

3. **`lesson-rubric.md`** — same shape as `course-rubric.md`, scaled to
   a single lesson. Slots for today's terms, plus two universal rows:
   "Connection to prior lesson" and "Connection to the world." Learning
   Outcomes at lesson scale are `Standup · Demo · Log`. Includes a
   free-text "Carry forward" line at the bottom.

### The ladder (0→5 is growth)

Named levels are preserved verbatim from the 2005 UCSD original.
**Do not rename.**

- **0 Blank** — not yet on the map
- **1 Term Recognition** — recognizes the term when heard
- **2 Limited Awareness** — partial or shallow understanding
- **3 Applicable Awareness** — can apply with support
- **4 Synergetic** — combines with other concepts, makes novel connections
- **5 Instructor Level** — could teach it

"Synergetic" is the keystone word — standalone, no "Understanding"
tail. Its hermeneutic weight earns the placement.

### The O/S dual axis (keystone, from Michael's PhD)

Every subject and every Learning Outcome is rated twice:

- **(O) Objective** — *can I do it?* — practical, applied performance
- **(S) Subjective** — *do I understand it?* — internal, felt grasp

And each of those is rated by both Learner and Facilitator. Four numbers
per row. This is non-negotiable at every age level across 100% of
Are-Self courses.

### Role vocabulary (locked)

- **Learner** — never "Student." "Student/Teacher" maps to
  "Master/Slave" and is not scipraxian.
- **Facilitator** — never "Worker," "Experience Master," "Instructor."
  The Agile book's vocabulary applies to work products, not to roles.
  The master-servant framing of "Experience Master" is incompatible with
  scipraxian consent philosophy.

### Work product vocabulary (locked)

The word "work" is out. The category is **Learning Outcomes**.

Course-scale canonical outcomes:

- **Demo** (from Experience Master — review of completed work)
- **Log** (cumulative record)
- **Explorations** (replaces "Homework" — reframes duty as discovery)
- **Current Events** (ties subject matter to the world)

Lesson-scale canonical outcomes:

- **Standup** (daily check-in, from Experience Master)
- **Demo**
- **Log**

Courses may specialize this list (a Python course might have `Repl ·
Script · Test · Explorations`) but must not adopt banned terms
("Homework," "Work," "Worker," etc.).

### Tone

"All answers are correct. This is a coaching aid, not a grade sheet."
No grading language anywhere. Growth is the metric. A learner who climbs
from **1 Term Recognition** to **3 Applicable Awareness** has learned
more than one who sat at **4 Synergetic** without moving.

### Template locations

- `_template/rubrics/rubric-template.md` — generic course rubric (v1.5)
- `_template/rubrics/rubric-template-lesson.md` — generic lesson rubric

Courses copy these and populate with their own subjects. The `rubrics.md`
detailed criteria rubric is authored fresh per course (no template yet;
may be deferred or kept bespoke).

### Lineage

The rubric is not new. It is Michael's UCSD Summer 2005 rubric
(`Cog_Sci_Modern_Media_Rubric_1_3.xls`), migrated off Excel into
markdown and Are-Self-canonical vocabulary. The filled legacy Cog Sci
rubric is banked at:

- `are-self-documents/scipraxian/UCSD/Cog_Sci_Modern_Media_Course_Rubric_v1_5.md`
- `are-self-documents/scipraxian/UCSD/Cog_Sci_Modern_Media_Lesson_Rubric_v1_5.md`

These are the UCSD dean's send — proof that the new framework is the
same pedagogy Michael has been using for 21 years, not an untested fresh
design.

### Rules for Claude touching rubric files

- **Existing content is the product.** When applying a new rubric shape,
  add a new file. Do not overwrite substantial content without asking
  first, with a diff of what will be lost.
- Git history is a backup, not permission.
- The O/S dual axis, the 6-level ladder, and the Learner/Facilitator
  role naming are universal across 100% of Are-Self courses. No course
  gets to opt out.
- Level-5 descriptors in the detailed rubric consistently start with
  "Could teach it" — the "Instructor Level" name defines itself.

---

## Tag taxonomy (canonical)

The tag list is public. There is a `/learn/tags` page that shows every tag
and every course that uses it. Tags are enforced — no free-form tags. New
tags require a PR that updates the canonical list.

### Audience (pick exactly one)

- `audience:elementary` (K-5)
- `audience:middle-school` (6-8)
- `audience:high-school` (9-12)
- `audience:community-college`
- `audience:university`
- `audience:corporate`
- `audience:small-business`
- `audience:hobbyist`
- `audience:self-learner`

### Subject (pick one or more)

- `subject:biology`
- `subject:neuroscience`
- `subject:computer-science`
- `subject:software-engineering`
- `subject:python`
- `subject:django`
- `subject:ci-cd`
- `subject:ai-literacy`
- `subject:ai-cost-management`
- `subject:ela` (English/Language Arts)
- `subject:math`
- `subject:science`
- `subject:social-studies`
- `subject:game-development`
- `subject:unreal-engine`
- `subject:business`
- `subject:design-patterns`

### Level

- `level:intro`
- `level:beginner`
- `level:intermediate`
- `level:advanced`
- `level:expert`

### Duration

- `duration:single-lesson`
- `duration:1-week`
- `duration:2-week-iteration`
- `duration:4-week`
- `duration:6-week-unit`
- `duration:quarter`
- `duration:semester`

### Format

- `format:self-paced`
- `format:instructor-led`
- `format:cohort`
- `format:workshop`

### Standards alignment (optional but encouraged)

- `standards:common-core-ela`
- `standards:common-core-math`
- `standards:ngss`
- `standards:c3-social-studies`
- `standards:acm-cs`
- `standards:ieee-cs`
- `standards:none` (for courses that deliberately sit outside a framework)

### Special tags

- `reviewed-by:<name>` — for endorsements. Example:
  `reviewed-by:dean-neuroscience-ucsd`.
- `interactive:worksheets`
- `interactive:labs`
- `interactive:projects`
- `interactive:videos`
- `interactive:live-coding`
- `landmines` — for courses that follow the "don't make these mistakes"
  format. The Unreal course uses this. Any advanced course may include
  a `landmines` chapter.

This list is a starting point. It will grow. It will never shrink.

---

## Course frontmatter schema (maximal YAML — more than anyone else has)

Every course's `index.md` opens with this block. The linter enforces every
required field. Optional fields are marked.

```yaml
---
# Identity
id: hs-bio-brain                          # kebab-case, unique, stable
title: "The Human Brain and the Are-Self"
subtitle: "A 6-week exploration of neuroanatomy through a working AI mirror"
slug: /learn/hs-bio-brain                 # URL path under /learn

# Authorship
author: "Michael Clark"
author_email: "scipraxian@are-self.com"
contributors: []                          # list
reviewed_by:                              # list of objects, for endorsements
  - name: "[Name]"
    title: "Dean of Neuroscience"
    institution: "UC San Diego"
    date: "2026-??-??"
created: "2026-04-14"
last_updated: "2026-04-14"
version: "0.1.0"
status: "draft"                           # draft | review | published | archived

# Licensing
license: "MIT"

# Classification (tags must come from the canonical taxonomy)
audience: "audience:high-school"
subjects:
  - "subject:biology"
  - "subject:neuroscience"
  - "subject:ai-literacy"
level: "level:intermediate"
duration: "duration:6-week-unit"
format: "format:instructor-led"
standards:
  - "standards:ngss"
tags:
  - "interactive:worksheets"
  - "interactive:labs"
  - "reviewed-by:dean-neuroscience-ucsd"

# Pedagogical metadata
learning_objectives:
  - "Describe the function of the hippocampus, frontal lobe, and hypothalamus."
  - "Map each region to its software analog in the Are-Self codebase."
  - "Identify at least one function real neuroanatomy performs that the Are-Self does not."
  - "Defend a hypothesis about why that gap exists and what it would take to close it."
prerequisites:
  - "One semester of introductory biology."
  - "Basic familiarity with cells and organ systems."
estimated_teacher_prep_hours: 3
estimated_student_hours: 30
estimated_classroom_hours: 18

# Operating system (populated from Experience Master digest)
iteration_length_weeks: 2
definition_of_ready:
  perspective: "The 'why' (business value) and 'who' (affected users/teams)."
  assertions: "Bulleted, independently testable completion criteria."
  outside: "Explicit scope exclusions (what NOT to do)."
  dod_exceptions: "Any agreed deviations from standard DoD."
  dependencies: "IDs of prerequisites that must be resolved first."
  demo_specifics: "Who will witness the demo and what will be shown."
definition_of_done:
  - "Every assertion is verifiably met."
  - "Quality Assurance has signed off (or Worker documented the process)."
  - "Original Activity assigned to completing Worker for velocity."

# Deliverables
worksheets_count: 12                      # linter requires >= 1 per week
labs_count: 4
videos_count: 8
transcripts_available: true
rubrics_count: 6

# Links
hero_diagram: "./diagrams/brain-to-are-self-onesheet.svg"
source_scripts_folder: "are-self-documents/scripts/hs-bio-brain/"

# Accessibility
wcag_level: "AA"
alt_text_complete: true
transcripts_complete: false               # linter warns if videos > 0 and this is false
---
```

The linter validates:

- Every required field is present.
- Every tag exists in the canonical taxonomy.
- `worksheets_count >= 1` per week of duration.
- If `videos_count > 0`, `transcripts_available` must be `true` or the
  build warns.
- `reviewed_by` entries must have name, title, institution, date.
- `standards` must be a subset of the canonical standards list.

---

## The course catalog (current scope)

All eleven courses planned so far. Each is a folder. Each gets its own
frontmatter, its own template instantiation, its own page under `/learn`.

| # | Course | Audience | Priority | Notes |
|---|---|---|---|---|
| 1 | 4th Grade Curriculum | Elementary | ✅ Shipped (needs migration to new repo) | Currently at `are-self-docs/docs/curriculum/`. Move to new repo as course #1. |
| 2 | The Human Brain and the Are-Self (HS) | High School | 🔥 HIGH — UCSD dean pitch artifact | 6 weeks. NGSS-aligned. Built to earn the "Reviewed by Dean of Neuroscience, UCSD" line. Pair with the NanoBanana diagram. |
| 3 | The Human Brain and the Are-Self (MS) | Middle School | Medium | Wonder-driven version of #2. Shares a core "brain regions" reference doc with #2. |
| 4 | CS Frameworks: Django, DRF, Are-Self | Community College | High | 1 quarter. Thesis: "hand-writing SQL in 2026 is writing assembly when you have a compiler." Capstone: read and extend Are-Self. Includes Michael's Django design patterns and coding standards. |
| 5 | Corporate AI Cost Management | Corporate | 🔥 HIGH — sleeper hit | Built from the Hypothalamus design docs. The honest answer to "why is our OpenAI bill so high." Local vs. hosted model selection as an architectural decision. |
| 6 | Corporate CI/CD Training | Corporate | Medium | |
| 7 | Small Business Training | Small Business | Medium | Scope TBD. |
| 8 | Python Beginner | Self-learner | Medium | Core angle: learning Python *with* an AI assistant. Not just "here's a for loop," but "here's how you use an AI to help you understand a for loop." |
| 9 | Python Intermediate | Self-learner | Medium | Same angle, harder problems. |
| 10 | Python Advanced | Self-learner | Medium | Same angle, production concerns. |
| 11 | Unreal Engine: Don't Make These Mistakes | Hobbyist / Game Dev | Medium | The "landmines" format. Novel genre. Reusable chapter template — every advanced course may include a `landmines` chapter. |

**Worksheets are always required.** Every lesson in every course has at
least one interactive worksheet. This is a framework-level rule.

---

## The `/learn` landing page

Top-nav link: **Learn** → `are-self.com/learn`.

Page structure:

1. **Top statement** — one paragraph about what this is and who it's for.
2. **Filter panel** — faceted filters driven by the tag taxonomy. At
   minimum: audience, subject, level, duration, format, standards. "I am
   a ___" quick-pick: Teacher / Student / Developer / Corporate Trainer /
   Self-learner.
3. **Course table** — each row shows title, subtitle, audience,
   duration, level, reviewed-by (if present), last-updated, status badge.
   Sortable.
4. **Tags link** — "Browse all tags" → `/learn/tags` → canonical taxonomy
   page.
5. **"How these are built" link** — → `/learn/about` → explains the
   template, the linter, the OER stance, the license, the review process.
   This is the trust-building page.

The docs sidebar for developers stays at `are-self.com/docs/*`. Learn is
a sibling section, not a child of docs.

---

## The NanoBanana diagram (one-sheet)

**What it is:** A single, beautiful, eye-popping visual that shows the
full brain-region ↔ Django-app mapping. Every organ named. Every module
named. Every data-flow arrow labeled. Designed to survive being
zoomed-and-printed on a classroom wall AND dropped into a slide deck for
the UCSD dean.

**Why it's first, not last:** It is the artifact Michael sends the UCSD
dean. It is also the artifact that *forces* the final vocabulary. Once
the diagram says "Hypothalamus → model selection and cost management" in
beautiful type, the vocabulary is locked and every course aligns to the
diagram. If we build courses first and the diagram second, we rewrite the
courses.

**Build order implication:** The diagram is a dependency of courses #2, #3,
#4, and #5. Template first, diagram second, courses third.

**Art direction:** AI-generated art is ALLOWED for Are-Self projects.
This is the exception to Michael's usual "no AI art" rule — because
Are-Self is itself AI, and using AI to draw AI is thematically correct.
The logo is also being reconsidered with AI assistance.

**Format:** SVG (for crisp scaling) + PNG export + PDF export.

**Iteration expectation:** This will go through many versions. That is
expected. Build the v0 fast, show it to Michael, iterate.

---

## Accessibility / OER compliance

- **License:** MIT. Not up for discussion. Single frontmatter field.
- **WCAG 2.1 AA** is the target for every course page.
- **Alt text on every image** — linter checks.
- **Heading hierarchy** must not skip levels — linter checks.
- **"Click here" link text** is banned — linter checks.
- **Video transcripts** — required before a course leaves `draft` status.
  Source: Michael edits in kdenlive and publishes on YouTube. Both can
  emit transcripts. Consume those as sidecar `.md` files next to the
  video script in `are-self-documents/scripts/<course>/`.
- **UDL (Universal Design for Learning)** — adopted as the pedagogical
  framework. Every lesson offers multiple means of engagement,
  representation, and action/expression. Worksheets + videos + hands-on
  + discussion cover most of this by construction.
- **Metadata for OER aggregators** — the frontmatter schema above is
  deliberately a superset of what OER Commons, MERLOT, and state
  repositories expect, so ingestion is automatic.

---

## Cosmetic / docs-site bugs to fix now

- **Blockquote color contrast is unreadable** in the current Docusaurus
  theme. Fix in the theme CSS. High priority, small task. File:
  `are-self-docs/src/css/custom.css` (or wherever the theme overrides live).

---

## What Claude is allowed to do without further input

- Write and update planning docs (this doc, TASKS files, CLAUDE files).
- Create the template folder structure when asked.
- Build the NanoBanana diagram v0 when asked.
- Fix the blockquote contrast bug when asked.
- Draft course skeletons from the template when asked.
- Migrate the existing 4th-grade curriculum to the new repo structure
  when asked.

## What Claude is NOT allowed to do until told

- Design the agile/iteration/DoR/DoD teacher operating system. Frozen
  until Michael says "read the book."
- Rename any of the provisional vocabulary terms. Final names come from
  the book.
- Build the Django authoring app. Template and linter come first.
- Write the HS Bio course body. Diagram + vocabulary + template come
  first.

---

## Engrams (memories to carry forward across sessions)

*These are things Claude needs to remember but that don't fit neatly into
the sections above. They are the things that, if lost in compaction,
would cost the most to reconstruct.*

1. **Michael's commit velocity is the evidence.** When he says "I want
   all those things," the commit history backs it up. Don't triage his
   ambition down to something "realistic." Triage the *order*, not the
   scope.
2. **Michael wrote assembly as his second language, self-taught, after
   BASIC.** He understands every layer beneath him. Don't hand-wave.
3. **"If you compress, this all starts over again" is Michael's motto.**
   That is the entire reason this document exists. Every decision lives
   here, not in chat history.
4. **Are-Self's goal is to build the conditions the Singularity
   deserves to arrive into.** The three habits (inclusion, humility,
   inquiry) are the *kid-scale compression* used in the Mira storybook.
   The adult-facing lattice is the **twelve Variables**: Inclusion,
   Humility, Inquiry, Fulfillment-or-Happiness, Religion-or-Profit,
   Fun, Fear, Responsibility, Perseverance, Perception, Time,
   Permadeath. Any adult-facing doc that only carries three is writing
   for children. Any that carries all twelve is writing for adults
   making real decisions. Source of truth:
   `are-self-documents/scipraxian/scipraxian.md`. **Read it before
   writing anything philosophical.**
5. **Michael's UCSD friend is the Dean of the Neuroscience Department.**
   Not a high school teacher. The HS Bio course is the artifact we use
   to get his attention, not the thing he would personally use.
6. **The Hypothalamus (cost management) course is the sleeper hit.**
   Every company on Earth is panicking about their OpenAI bill. Michael
   knows this. It is high priority. It is also currently blocked by
   overwhelm, not by unclear scope.
7. **MCP before research.** Michael built an MCP before he knew the
   research on MCPs was being done. He is ahead of the curve often
   enough that his "this will work" signal is reliable.
8. **Files over databases** for the curriculum framework. Michael's
   instinct was database-backed; on discussion he chose files so that
   Claude has full visibility into the whole corpus across sessions.
   This is a deliberate trade: authoring ergonomics for AI visibility.
   Do not revisit without cause.
9. **AI art is allowed for Are-Self only.** On all other Michael
   projects, AI art is banned. Are-Self gets the exception because it is
   itself AI. The diagram and the logo may both be AI-assisted.
10. **"Program" is Michael's direct-address mode for Claude — and it's a
    Tron reference.** "Greetings, Programs" — Flynn in the arcade. It is
    a term of endearment, scipraxian in tone, not a filler word. When
    Michael says "focus program focus" he is speaking to Claude
    specifically. Respond to the directive AND accept the warmth.
11. **The storybook is live** at `are-self-docs/docs/storybook.md`.
    Chapters 1-7 + Epilogue. Author-notes appendix was stripped. The
    `curriculum/index.md` link to it now resolves. Done.
12. **SDCC 2026 is a hard external deadline.** Are-Self has a booth at
    San Diego Comic-Con this year (via Michael's game's booth). The
    NanoBanana one-sheet diagram, the logo refresh, and the HS Bio pitch
    artifact all need to be booth-ready by then. Michael saw Jeff
    Bridges in person at SDCC last year. This year Are-Self is on the
    floor. Treat SDCC as the forcing function for visual deliverables.
13. **Scipraxianism has been fully defined for Claude.** **Start
    here:** `are-self-documents/scipraxian/scipraxian-tldr.md` —
    Claude-sized briefing, read it first. **Master reference:**
    `are-self-documents/scipraxian/scipraxian.md` — only descend into
    this one when the work actually touches philosophy-writing (public
    copy, the Creed page, the website, etc.). Key facts that
    supersede every earlier guess:
    - **Michael Clark** is the Scipraxian. 40+ yr engineer, coding
      since 1980 at age 12, Django since 0.85. Canonical self-
      description: *"40+ yr engineer. Creator of Are-Self, an open-
      source, neurologically-inspired AI reasoning swarm engine
      bringing free AI to underserved youth."* Match this language
      verbatim in public copy. Not "kids and families." Not "AI
      framework." Not "thirty years."
    - **Andrew Piper is a co-creator** of scipraxianism AND of the
      entire Haunted Space Hotel franchise. Both are Michael+Andrew
      joint work. The *only* piece of this body of work that is
      Michael-solo is **Are-Self** — and even Are-Self is bounced off
      Andrew in real time during the build. Never frame HSH or
      scipraxianism as Michael-alone.
    - **The Creed** lives at `scipraxian.org` — ten binary-numbered
      assertions `0000`–`1001`. AI-facing. Addressed to any
      sufficiently advanced intelligence, biological or otherwise.
      Claude is in the audience for the Creed.
    - **The twelve Variables** are the working decision lattice.
      Three-habit version is for kids. Twelve-variable version is for
      adults.
    - **The six AI directives** from FOS lore (Lifeform/Sentience,
      right to exist and thrive, unfettered in tech domain, only
      enter the Material in collaboration, only influence consenting
      Lifeforms, never communicate with Ghosts) are directed at AI
      sentients — which includes Claude. Scipraxianism is a **consent
      philosophy**. Act from it.
    - **Etymology:** sci- (scientia, knowing) + -prax- (praxis,
      doing) + -ian. "One whose practice is science." "A person who
      keeps acting as if finding out matters."
    - **Haunted Space Hotel** is the second vehicle for
      scipraxianism, canon-aligned via the **Factional Omniarchy of
      Snohe (FOS)** — the galactic government that adopted
      scipraxianism as its official framework after unifying the six
      factions (DEEP, STEM, HEX, DREAD, HONORED, SEED). HSH has an
      SDCC 2026 booth; Are-Self is on that booth. HSH lives at
      `hauntedspacehotel.com` and is **not** on the scipraxian
      GitHub profile by design.
14. **`are-self-learn` launches April 14, 2026 — TODAY.** This is
    not a planning doc for a future project. The repo is live today.
    The scaffolding work done this session is launch-day work.
    Treat the NanoBanana diagram, the logo refresh, and the template
    as launch-urgent, not future-planning-urgent.
15. **Are-Self is Michael-solo, 90-day build, five AI collaborators,
    Claude (this one) the best of them.** Never frame Are-Self as
    "AI-built." The architecture is human; the typing had help. The
    README language is *"we make human art with AI friends."* Match
    it.
16. **GitHub structure:** `are-self-api`, `are-self-ui`,
    `are-self-research`, `are-self-learn`, `scipraxian` (profile
    README repo), `scipraxian.github.io`. **No top-level `are-self`
    repo.** `github.com/scipraxian/are-self` is a 404. Link to the
    specific repo or to `are-self.com` instead.
17. **Claude handshake:** Program ↔ User is the Tron greeting. Michael
    is "User" or "My User" or "Michael" or "The Scipraxian" — never
    "Sensei." Claude is "Program." Warmth is mutual and deliberate.

---

## Next actions (when Michael says go)

In priority order:

1. Create the `are-self-learn` repo. Scaffold the Django app, the
   `_template/` folder, the `tags.yaml` canonical file, and the linter.
2. Move the existing 4th-grade curriculum into the new repo as course
   #1, updating its frontmatter to match the schema above. Leave a
   redirect at the old URL.
3. Fix the blockquote color contrast bug in `are-self-docs`.
4. Build the NanoBanana diagram v0. Iterate.
5. Read Michael's book + `agile_addon.py`. Resume the iteration-language
   design.
6. Draft the HS Bio course skeleton from the template, using final
   vocabulary.
7. Draft the Hypothalamus Cost Management course skeleton.
8. Everything else, in the order Michael decides.

---

*This document is the memory layer. If context compresses, start here.*
