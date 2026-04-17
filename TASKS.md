# are-self-learn — Tasks

Work queue for the curriculum framework repo. See `PLAN.md` for the full
planning context and `CLAUDE.md` for session continuity rules.

Last updated: 2026-04-17.

## Completed

- [x] Repo created (`are-self-learn`) with MIT LICENSE.
- [x] `README.md` scaffolded.
- [x] `CLAUDE.md` scaffolded.
- [x] `PLAN.md` moved into repo from `are-self-documents/`.
- [x] `TASKS.md` (this file) scaffolded.
- [x] Storybook published at `are-self-docs/docs/storybook.md` (done in
      the previous session, but listing here since it unblocks the
      4th-grade curriculum migration).
- [x] 4th-grade curriculum migrated into
      `site/docs/courses/elementary-4th-grade/` (13 files, done by Michael).
- [x] `_template/` directory created with full course template:
      `index.md` (maximal frontmatter schema), `week-N.md` (lesson plan
      with stealth DoR/DoD/Retrospective), `worksheets/worksheet-template.md`,
      `rubrics/rubric-template.md`, `diagrams/.gitkeep`, `README.md`.
      All six DoR fields embedded as lesson plan sections. DoD = exit
      ticket. Retrospective = teacher reflection. Demo = showcase.
- [x] GitHub Pages composite deploy action: builds both `are-self-docs`
      and `are-self-learn`, merges learn into `/learn/`, deploys as one
      site. Uses `actions/deploy-pages@v4`, `upload-pages-artifact@v4`,
      `configure-pages@v5`, Node 22, `npm ci`.
- [x] Cross-repo deploy trigger: `are-self-learn/.github/workflows/
      trigger-deploy.yml` fires `repository_dispatch` to `are-self-docs`
      on push to main. Requires `DEPLOY_PAT` secret (one-time setup).
- [x] Learn links repointed: navbar, homepage doors (Teacher, Corporate
      Trainer), news card, and footer all now point to `/learn/` instead
      of the GitHub repo. Footer retains GitHub source link separately.
- [x] Glossary created at `site/docs/glossary.md` (A-Z, 40+ terms).
- [x] Tags reference created at `site/docs/tags-reference.md`.
- [x] Learn Docusaurus site scaffolded (`site/`) with shared glassmorphic
      theme, port 3001, monorepo workspace.

## In progress

(Nothing actively in progress.)

## Next up (priority order)

### P0 — Framework foundation

- [x] Create `tags.yaml` — canonical tag taxonomy. Seeded from PLAN.md.
      Public reference: `site/docs/tags-reference.md`.
- [x] Create `_template/` directory with:
  - [x] `_template/index.md` — course index with full frontmatter schema
        populated with placeholder values and inline comments.
  - [x] `_template/week-N.md` — lesson template with required sections
        (objective, DoR fields as section structure, activities, worksheet
        link, DoD as exit ticket, demo as showcase, retrospective as
        teacher reflection).
  - [x] `_template/worksheets/worksheet-template.md`
  - [x] `_template/rubrics/rubric-template.md`
  - [x] `_template/diagrams/.gitkeep`
  - [x] `_template/README.md` — "how to use this template."
- [ ] Build the linter (`driver/` Django app, `manage.py lint_course
      <course-id>` command). Validates frontmatter against schema,
      checks tags against `tags.yaml`, checks worksheet count, checks
      heading hierarchy, checks for banned link text ("click here"),
      checks for transcript presence when videos > 0.

### P0 — Visual deliverables (SDCC forcing function)

- [ ] Logo refresh. Prompt doc lives at
      `are-self-documents/logo-prompt.md`. Iterate.
- [ ] NanoBanana primary diagram v0. Prompt doc lives at
      `are-self-documents/primary-diagram-prompt.md`. Iterate. Locks
      the final vocabulary once approved.

### P1 — First real courses

- [ ] Migrate existing 4th-grade curriculum (`are-self-docs/docs/
      curriculum/`) into `courses/elementary-4th-grade/`. Update
      frontmatter to new schema. Run linter. Leave redirect at old URL.
- [ ] Draft HS Bio course skeleton (`courses/hs-bio-brain/`). Wait for
      diagram + vocabulary lock before writing body.
- [ ] Draft Hypothalamus Cost Management course skeleton
      (`courses/corporate-ai-cost-management/`). Pull content from
      existing hypothalamus design docs in `are-self-docs/docs/brain-
      regions/hypothalamus.md`.

### P1 — Site integration

- [x] **DECIDED: Option B → Option A composite deploy.** Learn gets
      its own Docusaurus instance inside `are-self-learn/site/`,
      deployed to `are-self.com/learn` via composite GitHub Action.
      Both sites build in one action, learn output copied into
      `build/learn/`. Cross-repo dispatch triggers redeploy on
      learn pushes.
- [x] Scaffold the Learn Docusaurus instance (`site/`) under
      `are-self-learn/`. Shared glassmorphic theme CSS copied from
      `are-self-docs`. Port 3001 to avoid conflict with docs on 3000.
      `start.bat` convenience script included.
- [ ] `/learn` landing page. Filter panel driven by `tags.yaml`.
      Course table sourced from course frontmatter.
- [x] `/learn/tags` page — public canonical taxonomy. Done at
      `site/docs/tags-reference.md`.
- [ ] `/learn/about` page — trust-building explainer (template,
      linter, OER stance, license, review process).
- [x] **Top-nav link "Learn"** added to `are-self-docs` pointing at
      `/learn`. All homepage doors, footer, and news card repointed
      from GitHub repo to live `/learn/` URLs.
- [x] **Glossary / terms reference.** Single authoritative doc at
      `are-self-learn/site/docs/glossary.md` — A-Z, 40+ terms,
      covering Are-Self, HSH, scipraxianism, brain-region
      architecture, Django-app naming, the Twelve Variables, the
      Creed, and the curriculum vocabulary. Discoverable from Learn
      top-nav, footer, and docs footer.

### P2 — Remaining courses (in rough order)

- [ ] Middle School Brain (`courses/middle-school-brain/`).
- [ ] CS Frameworks: Django, DRF, Are-Self (`courses/cc-frameworks-django/`).
- [ ] Corporate CI/CD Training (`courses/corporate-ci-cd/`).
- [ ] Python Beginner / Intermediate / Advanced (three courses).
- [ ] Small Business Training.
- [ ] Unreal Engine: Don't Make These Mistakes (the "landmines" format).

### Unfrozen — ready to build

- [x] Read the book + `agile_addon.py`. Digest at
      `are-self-documents/BOOK-DIGEST.md`. Vocabulary locked.
      PLAN.md updated.
- [x] Finalize vocabulary terms. Done — see PLAN.md §"The Agile
      injection — UNFROZEN."
- [ ] Design the agile/iteration/DoR/DoD teacher operating system.
      **UNBLOCKED.** Build into the `_template/` lesson plan using
      the six DoR fields and the daily rhythm from the digest.
      Stealth adoption for K-12; explicit naming for CC Frameworks.
- [ ] Build the Django authoring app (forms, admin, etc.). Template and
      linter must come first.
- [ ] Write the HS Bio course body. Diagram + vocabulary + template
      come first.

## Cosmetic / cross-repo

- [x] Fix blockquote color contrast in `are-self-docs` theme. Added
      full blockquote styling: glassmorphic background, teal left border,
      proper text contrast, nested blockquote support with amber accent.
      WCAG AA compliant. Also copied into Learn site CSS.
- [x] **Homepage rewrite v1 shipped** (`are-self-docs/src/pages/
      index.js`). Five sections: scipraxian-flavored hero with
      Story/Developer CTAs, "I am a ___" six-door fan-out, video,
      Twelve Variables strip linking to scipraxian.org, news strip
      (learn launch, SDCC, storybook). Iterate with Michael.

## Notes

- **Worksheets are always required.** Every lesson. Framework rule.
- **SDCC 2026** is the hard deadline for booth-ready visuals.
- **UCSD Dean of Neuroscience** review is the quality bar for HS Bio.
- **MIT license.** Not revisited.
- If you are Claude and you are reading this after a context compression,
  re-read `CLAUDE.md` and `PLAN.md` before touching anything.
