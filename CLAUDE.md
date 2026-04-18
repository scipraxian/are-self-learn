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

1. ~~Template first (`_template/`).~~ DONE.
2. Linter second (`driver/` Django management command).
3. Authoring app third (Django forms / CLI only if the linter isn't
   enough). **Do not start with the Django app.**
4. ~~Migrate the 4th-grade curriculum.~~ DONE (by Michael, 13 files).
5. Build the NanoBanana diagram v0 (depends on the logo refresh and
   locks the vocabulary — see `are-self-documents/primary-diagram-prompt.md`).
6. Draft HS Bio course skeleton (for the UCSD dean pitch).
7. Draft Hypothalamus Cost Management course skeleton.

## Cross-repo references

- `are-self-docs/` — developer documentation. Storybook at
  `docs/storybook.md`. Composite GitHub Action deploys both sites.
- `are-self-documents/` — non-code planning, research, media plan,
  scripts. Holds `logo-prompt.md`, `primary-diagram-prompt.md`,
  `BOOK-DIGEST.md`, and `scipraxian/` reference docs.
- `are-self-api/identity/addons/agile_addon.py` — the agile addon
  that encodes Experience Master vocabulary into Are-Self.

## Audience reminder

This repo is read by teachers, professors, corporate trainers, and
reviewers. It is NOT primarily read by developers. The README, PLAN,
and landing page should be welcoming to non-developers. The Django
driver and linter are internal.

## Current status (2026-04-18)

- Repo scaffolded: README, CLAUDE, TASKS, PLAN, tags.yaml all in place.
- `_template/` created with full course template (index, week-N,
  worksheets, rubrics, diagrams, README).
- 4th-grade curriculum migrated (13 files in `site/docs/courses/
  elementary-4th-grade/`).
- Learn Docusaurus site running (`site/`, port 3001, glassmorphic theme).
- Glossary and tags reference published.
- GitHub Pages composite deploy action written (builds both sites).
- Cross-repo deploy trigger written (learn push → docs redeploy).
- All docs homepage links repointed to `/learn/`.
- Agile layer unfrozen. Book digested. Vocabulary locked.
- SDCC 2026 is the hard external deadline for booth-ready visuals.
- UCSD Dean of Neuroscience is the quality bar for HS Bio course.
- HS Bio course skeleton complete: `courses/hs-bio-brain/` with index,
  6 week files (30 days), 30 worksheets, rubrics, lab protocols, sidebar
  registered. UCSD-pitch ready.
- 12 courses total now in the catalog, all with sidebar entries and
  landing page cards:
  - 4th Grade Curriculum (elementary, 6 weeks)
  - Middle School Brain (grades 6-8, 6 weeks)
  - Summer Camp: Brains, Bytes & Big Questions (ages 12-14, 5 days)
  - HS Biology: The Human Brain & the Are-Self (high school, 6 weeks)
  - What Is AI (online, 6 modules, universal entry point)
  - Python Beginner / Intermediate / Advanced (self-paced, 8 modules each)
  - CS Frameworks: Django, DRF, Are-Self (community college, 10 weeks)
  - Corporate CI/CD: Neural Pathways (1 week intensive)
  - Hypothalamus Cost Management (2 weeks, corporate)
  - Agile / Experience Master (7 modules, for PMs and Workers)
- All courses have prerequisites cross-linked to other courses in catalog.
- Landing page redesigned with glassmorphic course cards.
- **Next:** Build verification, linter (P3), NanoBanana diagram,
  Unreal Engine course (waiting for Michael), Small Business (TBD).

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
