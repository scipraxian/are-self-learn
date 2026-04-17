# CLAUDE.md — are-self-learn

Session continuity for Claude working in the `are-self-learn` repo.

## What this repo is

The curriculum framework and course catalog for Are-Self. One repo, one
template, many courses, many audiences. See `README.md` for the layout
and `PLAN.md` for the full planning doc — PLAN.md is the memory layer,
read it first.

## Read these first, in order

1. `README.md` — what this repo is and what it will contain.
2. `PLAN.md` — the master planning doc. Vocabulary rules, tag
   taxonomy, frontmatter schema, course catalog, engrams, next actions.
   **This is the memory layer. If context compresses, re-read this
   file before doing anything else.**
3. `tags.yaml` — the canonical tag taxonomy (once it exists).
4. `_template/index.md` — the course template (once it exists).

## Hard rules for this repo

- **Files are the source of truth.** No database. Git is the database.
  This is a deliberate trade for AI visibility.
- **Every course uses the canonical tag taxonomy.** No free-form tags.
- **Every course has frontmatter that validates against the schema in
  PLAN.md.** The linter enforces it.
- **Every lesson has at least one worksheet.** Framework-level rule.
- **License is MIT. Do not revisit.**
- **Vocabulary rules in PLAN.md are binding.** No "scrum," no "sprint,"
  no "grooming," no violence metaphors. See PLAN.md §"Vocabulary rules."
- **The agile/iteration layer is UNFROZEN.** Vocabulary is locked. See
  PLAN.md §"The Agile injection — UNFROZEN" and
  `are-self-documents/BOOK-DIGEST.md`.
- **No "delete before publishing" notes, design notes, TODO comments,
  or Claude-facing instructions in any publishable .md file.** Every
  .md file in `site/` and `_template/` is publishable. If Claude needs
  to leave itself notes, put them in `CLAUDE.md` or `TASKS.md` — never
  in content a teacher, student, or contributor will read.

## Worksheet rules

- Every lesson has at least one worksheet. Framework-level rule.
- Worksheets are printable. No interactive JS, no links that require
  a device during the activity.
- Reading level must match the course audience tag.
- Include an answer key for any worksheet with right/wrong answers.
  Open-ended worksheets skip the answer key.
- Alt text on any embedded images.
- Tables render in markdown. Keep them simple — 3-5 columns max for
  printability.
- Patterns that work well (from the 4th grade course): matching
  (name to description), field notes (observe and record during a
  live activity), planning sheets (design before building), comparison
  charts (AI output vs. student output), experiment logs (hypothesis
  to data to conclusion), reflection journals (sentence starters +
  free write), project proposals (structured planning for capstone).

## Build order (anti-trap sequence)

1. Template first (`_template/`).
2. Linter second (`driver/` Django management command).
3. Authoring app third (Django forms / CLI only if the linter isn't
   enough). **Do not start with the Django app.**
4. Migrate the existing 4th-grade curriculum from `are-self-docs/docs/
   curriculum/` into `courses/elementary-4th-grade/` as the first real
   course. Update frontmatter to match schema. Leave a redirect at the
   old URL.
5. Build the NanoBanana diagram v0 (depends on the logo refresh and
   locks the vocabulary — see `are-self-documents/primary-diagram-prompt.md`).
6. Draft HS Bio course skeleton (for the UCSD dean pitch).
7. Draft Hypothalamus Cost Management course skeleton.

## Cross-repo references

- `are-self-docs/` — developer documentation. The storybook lives here
  at `docs/storybook.md`. The 4th-grade curriculum currently lives at
  `docs/curriculum/` and will migrate here.
- `are-self-documents/` — non-code planning, research, media plan,
  scripts, and the book. Holds `logo-prompt.md` and
  `primary-diagram-prompt.md`, which feed this repo's visual
  deliverables. Holds `research/Experience_Master_The_Book_20170308.pdf`
  — the book Claude must read before unfreezing the agile discussion.
- `are-self-api/identity/addons/agile_addon.py` — the already-implemented
  agile addon. Also required reading before unfreezing.

## Audience reminder

This repo is read by teachers, professors, corporate trainers, and
reviewers. It is NOT primarily read by developers. The README, PLAN,
and landing page should be welcoming to non-developers. The Django
driver and linter are internal.

## Current session context (2026-04-14)

- Storybook published to `are-self-docs/docs/storybook.md`. Done.
- This repo scaffolded: README, CLAUDE, TASKS, PLAN in place.
- `_template/`, `tags.yaml`, and `driver/` are NOT YET CREATED. Those
  are the next work items.
- SDCC 2026 is the hard external deadline for booth-ready visual
  deliverables (diagram, logo).
- Michael's relationship with the UCSD Dean of Neuroscience is the
  forcing function for the HS Bio course quality bar.

## Scipraxianism

Are-Self exists inside a philosophy called **Scipraxianism**, co-developed by
Michael Clark ("The Scipraxian") and **Andrew Piper** over many years. You do
not need to master it to work in this repo, but if a design question touches
*why* something is free, local, or shaped the way it is, the answer usually
traces back to scipraxianism. The Creed is AI-facing (ten binary-numbered
assertions at [scipraxian.org](https://scipraxian.org)). The working layer is
the **Twelve Variables**: Inclusion · Humility · Inquiry · Fulfillment or
Happiness · Religion or Profit · Fun · Fear · Responsibility · Perseverance ·
Perception · Time · Permadeath. The first three are the kid-scale compression
used in the curriculum and the storybook — **do not mistake the three for the
whole philosophy**.

Are-Self is Michael's solo handiwork (though he bounces everything off Andrew,
the way they always have). The sister franchise **Haunted Space Hotel** is
Andrew and Michael jointly — HSH's in-world Factional Omniarchy of Snohe is
the galactic government that adopted scipraxianism as its official ethical
framework. HSH lives at [hauntedspacehotel.com](https://hauntedspacehotel.com)
and is deliberately kept off the scipraxian GitHub profile.

Full Claude-facing briefing:
`are-self-documents/scipraxian/scipraxian-tldr.md`. Master reference:
`are-self-documents/scipraxian/scipraxian.md`.
