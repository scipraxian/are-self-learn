---
# ═══════════════════════════════════════════════════════════════════
# COURSE FRONTMATTER — Are-Self Curriculum Framework
# ═══════════════════════════════════════════════════════════════════
# Every field marked REQUIRED is enforced by the linter.
# Every tag must exist in tags.yaml. No free-form tags.
# Copy this file, replace every [PLACEHOLDER], and delete these comments.
# ═══════════════════════════════════════════════════════════════════

# ── Identity ──────────────────────────────────────────────────────
id: "[PLACEHOLDER-kebab-case]"               # REQUIRED — unique, stable, kebab-case
title: "[PLACEHOLDER Course Title]"          # REQUIRED
subtitle: "[PLACEHOLDER — one sentence]"     # REQUIRED
slug: /learn/[PLACEHOLDER]                   # REQUIRED — URL path under /learn

# ── Authorship ────────────────────────────────────────────────────
author: "[PLACEHOLDER]"                      # REQUIRED
author_email: "[PLACEHOLDER]"                # REQUIRED
contributors: []                             # list of names
reviewed_by:                                 # list of endorsement objects (optional)
  # - name: "[Name]"
  #   title: "[Title]"
  #   institution: "[Institution]"
  #   date: "YYYY-MM-DD"
created: "YYYY-MM-DD"                        # REQUIRED
last_updated: "YYYY-MM-DD"                   # REQUIRED
version: "0.1.0"                             # REQUIRED — semver
status: "draft"                              # REQUIRED — draft | review | published | archived

# ── Licensing ─────────────────────────────────────────────────────
license: "MIT"                               # REQUIRED — do not change

# ── Classification ────────────────────────────────────────────────
# Tags must come from tags.yaml. The linter rejects unknown tags.
audience: "audience:[PLACEHOLDER]"           # REQUIRED — exactly one
subjects:                                    # REQUIRED — one or more
  - "subject:[PLACEHOLDER]"
level: "level:[PLACEHOLDER]"                 # REQUIRED — exactly one
duration: "duration:[PLACEHOLDER]"           # REQUIRED — exactly one
format: "format:[PLACEHOLDER]"               # REQUIRED — exactly one
standards:                                   # optional but encouraged
  - "standards:[PLACEHOLDER]"
tags:                                        # optional — interactive, landmines, reviewed-by, etc.
  - "interactive:worksheets"

# ── Pedagogical Metadata ─────────────────────────────────────────
learning_objectives:                         # REQUIRED — at least 3
  - "[Students will be able to...]"
  - "[Students will be able to...]"
  - "[Students will be able to...]"
prerequisites:                               # REQUIRED — list (can be empty list [])
  - "[PLACEHOLDER or 'None']"
estimated_teacher_prep_hours: 0              # REQUIRED
estimated_student_hours: 0                   # REQUIRED
estimated_classroom_hours: 0                 # REQUIRED

# ── Operating System ─────────────────────────────────────────────
# From Experience Master (Clark & Piper, 2017). These fields structure
# every lesson plan in this course. The linter checks their presence.
iteration_length_weeks: 2
definition_of_ready:
  perspective: "Why does this lesson matter, and who is it for?"
  assertions: "What will students demonstrably do by the end?"
  outside: "What is explicitly outside the scope of this lesson?"
  dod_exceptions: "Any places where the teacher should adapt to their classroom."
  dependencies: "What must be true before this lesson can run?"
  demo_specifics: "How will students share or demonstrate what they learned?"
definition_of_done:
  - "Students can do what the learning goals describe."
  - "The teacher (or a colleague) has reviewed the student work."
  - "The teacher has reflected on what worked and what to change."

# ── Deliverables ──────────────────────────────────────────────────
worksheets_count: 0                          # REQUIRED — linter requires >= 1 per week
labs_count: 0
videos_count: 0
transcripts_available: false                 # linter warns if videos > 0 and this is false
rubrics_count: 0

# ── Links ─────────────────────────────────────────────────────────
hero_diagram: ""                             # path to hero image/diagram (optional)
source_scripts_folder: ""                    # path to video scripts folder (optional)

# ── Accessibility ─────────────────────────────────────────────────
wcag_level: "AA"                             # REQUIRED — target WCAG 2.1 level
alt_text_complete: false                     # linter checks: true before status=published
transcripts_complete: false                  # linter checks: true if videos > 0

# ── Docusaurus ────────────────────────────────────────────────────
sidebar_position: 1
---

# [PLACEHOLDER Course Title]

**[PLACEHOLDER — one-paragraph description of this course. Who is it for?
What will they learn? Why does it matter? What makes this course different
from every other course on the same subject?]**

## Who This Is For

[PLACEHOLDER — describe the target audience in plain language. Assume
they've never heard of Are-Self. Tell them why they should care.]

## The Scipraxian Habits

Every course in the Are-Self framework weaves three habits into the
activities. These aren't AI skills — they're human skills. Are-Self
just gives learners a reason to practice them:

- **Inclusion** — Who is inside and who is outside the circle?
- **Humility** — "I don't know yet" is the beginning of every worthy experience.
- **Inquiry** — After every answer, ask one more question.

These are a few kid-scale compressions of the full twelve scipraxian
Variables. For adult-facing courses, the complete lattice applies:
Inclusion, Humility, Inquiry, Fulfillment or Happiness, Religion or
Profit, Fun, Fear, Responsibility, Perseverance, Perception, Time,
Permadeath.

## Course at a Glance

| Week | Theme | Focus | Scipraxian Habit |
|------|-------|-------|------------------|
| [Week 1](./week-1-[PLACEHOLDER]) | [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] |
| [Week 2](./week-2-[PLACEHOLDER]) | [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] |

[Add or remove rows to match `duration` in frontmatter.]

## What You'll Find Here

- **Weekly Lesson Plans** — [N] days of activities per week, each with
  objectives, materials, procedures, differentiation, and assessment notes.
- **[Worksheets & Handouts](./worksheets)** — Printable student-facing
  materials for every week.
- **[Rubrics](./rubrics)** — Standards-aligned rubrics for every major
  assignment.

[Add course-specific links here: teacher setup guide, parent letter,
admin guide, etc.]

## What Learners Will Be Able to Do

By the end of this course, learners will:

1. [PLACEHOLDER — map to learning_objectives in frontmatter]
2. [PLACEHOLDER]
3. [PLACEHOLDER]

## Standards Alignment

[PLACEHOLDER — list the standards this course addresses. Delete this
section entirely if `standards: ["standards:none"]` in frontmatter.]

## Hardware & Time Requirements

- **Minimum hardware:** [PLACEHOLDER]
- **Ideal hardware:** [PLACEHOLDER]
- **Time per session:** [PLACEHOLDER]
- **Total time:** [PLACEHOLDER]

---

*Built by the Are-Self project. MIT licensed. Free to use, modify, and
share. If you improve it, we'd love to hear about it —
[join the community](https://discord.gg/nGFFcxxV).*
