# are-self-learn — Tasks

Work queue for the curriculum framework repo. See `PLAN.md` for the full
planning context and `CLAUDE.md` for session continuity rules.

Last updated: 2026-04-28.

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
- [x] **Rubric system v1.5 minted (2026-04-20).** Three-file pattern per
      course: `rubrics.md` (detailed per-subject criteria), `course-rubric.md`
      (course-scale coaching aid), `lesson-rubric.md` (lesson-scale coaching
      aid). Ladder preserved from 2005 UCSD original: 0 Blank · 1 Term
      Recognition · 2 Limited Awareness · 3 Applicable Awareness · 4
      Synergetic · 5 Instructor Level. O/S dual axis from Michael's PhD
      (Objective: "can I do it?" · Subjective: "do I understand it?").
      Roles: Learner / Facilitator. Learning Outcomes vocabulary: Demo,
      Log, Explorations, Current Events (course-scale); Standup, Demo,
      Log (lesson-scale). GFM tables, markdown-native. Generic templates
      at `_template/rubrics/rubric-template.md` and
      `_template/rubrics/rubric-template-lesson.md`.
- [x] HS Bio rubrics converted to v1.5. `rubrics.md` (detailed criteria)
      rebuilt with full 6-level ladder across 35 criteria × 6 levels
      (210 descriptor cells). `course-rubric.md` and `lesson-rubric.md`
      added as sibling coaching aids at sidebar_position 9 and 11.
- [x] UCSD Cog Sci in the Modern Media rubric banked in v1.5 at
      `are-self-documents/scipraxian/UCSD/Cog_Sci_Modern_Media_Course_Rubric_v1_5.md`
      and companion lesson rubric. Lineage frontmatter:
      `v1.0–v1.3 .xls (2005) → v1.5 .md (2026)`. For UCSD dean send.
- [x] PLAN.md updated with canonical "The rubric system (v1.5 — locked
      2026-04-20)" section.

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
- [x] Draft HS Bio course skeleton (`courses/hs-bio-brain/`). Complete:
      index + 6 week files (30 days of lesson plans), 30 worksheets,
      rubrics, lab protocols, sidebar registered. UCSD-pitch ready.
- [x] Draft Hypothalamus Cost Management course skeleton
      (`courses/corporate-ai-cost-management/`). 2 weeks: Biology of
      Budgets + Operating at Scale. Circuit breakers, failover chains,
      vector routing, fleet economics.
- [x] Python Beginner (`courses/python-beginner/`). 8 modules, self-paced.
      Entry point for programming — no prerequisites.
- [x] Python Intermediate (`courses/python-intermediate/`). 8 modules.
      Classes, inheritance, APIs, testing, signals. Uses real Are-Self patterns.
- [x] Python Advanced (`courses/python-advanced/`). 8 modules.
      Metaprogramming, concurrency, vectors, design patterns, deployment.
      Capstone: design a new brain region.
- [x] CS Frameworks: Django, DRF, Are-Self (`courses/cc-frameworks-django/`).
      10 weeks, 1 quarter. ACM/IEEE CS aligned. Experience Master vocabulary.
- [x] Corporate CI/CD: Neural Pathways (`courses/corporate-ci-cd/`).
      5 days. Neural Pathways, Spike Trains, Axon routing, Fleet Management.
- [x] Middle School Brain (`courses/middle-school-brain/`). 6 weeks.
      Bridge between 4th grade and HS Bio. All twelve Variables.
- [x] Summer Camp: Brains, Bytes & Big Questions (`courses/summer-camp-neurotech/`).
      5 days, 1hr each. Ages 12-14.
- [x] What Is AI (`courses/what-is-ai/`). 6 modules. 100% online.
      Tokens, models, vectors, training, datacenters, business models.
- [x] Agile / Experience Master (`courses/agile-experience-master/`).
      7 modules. For PMs, Workers, and agile addon developers.

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

### P1 — Rubric rollout

- [ ] Apply the v1.5 three-file pattern to the remaining 11 courses.
      Each course needs: `rubrics.md` (detailed per-subject criteria with
      6-level ladder descriptors), `course-rubric.md` (course-scale
      coaching aid), `lesson-rubric.md` (lesson-scale coaching aid).
      Sidebar positions 9, 10, 11 by convention. HS Bio is the reference
      implementation — copy its structure.
- [ ] Update `rubrics_count` in HS Bio `index.md` frontmatter to
      reflect the new three-file shape.
- [ ] Audit other courses' index.md for `rubrics_count` consistency
      once they're converted.

### P1 — New courses (drafted 2026-04-28)

- [x] **Build an AI From Scratch** (`courses/build-ai-from-scratch/`).
      8 modules + pathway.md. Tokenizer through capstone, all in
      PyTorch, no HuggingFace. Karpathy nanoGPT arc as the spine.
      Prereqs: *What Is AI*, *Python Intermediate*. Sidebar registered;
      landing-page card in place (Draft).
- [x] **Tune Pretrained Models** (`courses/tune-pretrained-models/`).
      8 modules + pathway.md. Build-vs-tune decision through capstone.
      No HuggingFace runtime dependency — sovereignty stance baked
      into every module. Prereq: course above. Sidebar + landing card.
- [x] **Graphs and Sleep Consolidation** (`courses/graphs-and-sleep-consolidation/`).
      6 modules + pathway.md. Anchored to the Hippocampus Hypergraph
      Migration paper (Frerichs/Clark). Sidebar + landing card.
- [x] Add `course-card__badge--draft` style to `site/src/css/custom.css`
      (cyan tone) so the new courses' Draft badges render correctly.

### P2 — Per-module Neural Modifier bundles (Michael's play-through queue)

Each course module ships its own NeuralModifier bundle. Michael
produces these by playing through the course in his own Are-Self
instance, capturing screenshots from the Modifier Garden as each
bundle installs, and refining the bundle's contributions as edge
cases surface. Each module's "Module Genome — Neural Modifier"
section in the course content is the spec; the bundle zip ends up
in `are-self-api/neuroplasticity/genomes/`.

**Build an AI From Scratch — 7 module bundles + 1 composition:**

- [ ] `bafs-tokenizer` (Module 1) — BPE training + encode/decode tools
- [ ] `bafs-embeddings` (Module 2) — token + position embedding builder
- [ ] `bafs-attention` (Module 3) — multi-head causal attention block
- [ ] `bafs-transformer-block` (Module 4) — pre-norm block + stacker
- [ ] `bafs-tiny-model` (Module 5) — end-to-end model + generation
- [ ] `bafs-training-loop` (Module 6) — Celery training task + PyTorch Environment
- [ ] `bafs-data` (Module 7) — corpus tokenization + streaming dataloader
- [ ] `bafs-pathway-composition` (Module 8 capstone) — `BuildTinyTransformer`
      pathway fixture, `requires` all seven above

**Tune Pretrained Models — 7 module bundles + 1 composition:**

- [ ] `tune-decision-rubric` (Module 1) — build-vs-tune Parietal tool
- [ ] `tune-load-checkpoint` (Module 2) — safetensors loader + arch
- [ ] `tune-eval-harness` (Module 3) — eval harness Effector + tool
- [ ] `tune-lora` (Module 4) — LoRA adapter + injection helpers
- [ ] `tune-fine-tune-loop` (Module 5) — Celery fine-tune task + Environment
- [ ] `tune-eval-compare` (Module 6) — comparison report + capability profile
- [ ] `tune-serve` (Module 7) — local serving + Hypothalamus registration
- [ ] `tune-pathway-composition` (Module 8 capstone) — `TunePretrainedModel`
      pathway fixture with CONDITIONAL axon, `requires` all seven above.
      Blocks on `services/` region in `are-self-api` (open question)

**Graphs and Sleep Consolidation — 6 module bundles + 1 composition:**

- [ ] `gsc-implementation` (Module 6) — **first dependency** — `EngramEdge`
      schema migration + extract_edges_on_save Effector + admin pages
- [ ] `gsc-graphs-101` (Module 1) — base `Graph` dataclass + inspection tool
- [ ] `gsc-edges-and-types` (Module 2) — typed-edge primitives, `EdgeType` enum
- [ ] `gsc-graph-algorithms` (Module 3) — BFS/DFS/Dijkstra/Louvain Effectors and tools
- [ ] `gsc-brain-as-graph` (Module 4) — reference brain-region graph + glossary tool
- [ ] `gsc-consolidation` (Module 5) — **the heart** — seven phase Effectors
- [ ] `gsc-pathway-composition` — `HippocampalConsolidation` pathway fixture,
      `requires` all six above (in dependency order: `gsc-implementation`
      first because the schema must land before anything else can write to it)

### P3 — MCP-driven modifier regeneration (deferred)

Once the modifier shapes per course are locked from manual play-through,
build out the are-self.mcp surface that lets a Claude session
regenerate any modifier programmatically — useful for keeping the
bundles in sync with `are-self-api` schema changes, and for CI that
re-packs every modifier and runs install pipelines against a fresh
database. Not first-ship work; ecosystem-and-maintenance work.

### P2 — Remaining courses (in rough order)

- [ ] Small Business Training.
- [ ] Unreal Engine: Don't Make These Mistakes (the "landmines" format).
      Waiting for Michael to finish the modifier first.

### P3 — Tooling (deferred)

- [ ] Build the linter (`driver/` Django app, `manage.py lint_course
      <course-id>` command). Validates frontmatter against schema,
      checks tags against `tags.yaml`, checks worksheet count, checks
      heading hierarchy, checks for banned link text ("click here"),
      checks for transcript presence when videos > 0.

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
- [x] Write the HS Bio course body. Skeleton complete with full lesson
      plans, worksheets, rubrics, and lab protocols.

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
- **Module-modifier + course-pathway pattern (refined 2026-04-28).**
  Each course module is a NeuralModifier bundle (`<prefix>-<slug>` zip
  in `neuroplasticity/genomes/`). The course's pathway is shipped by a
  composition modifier (`<prefix>-pathway-composition`) that depends
  on the per-module bundles via the Modifier Garden's `requires` field.
  Each module's "Module Genome — Neural Modifier" section in the
  course content is the spec for its bundle. Future implementation-
  heavy courses should follow the same pattern.
- **Manual play-through is the production workflow.** Michael produces
  the first version of each modifier by playing through the course in
  his Are-Self instance, capturing screenshots, and refining the
  bundle's contributions as edge cases surface. The are-self.mcp may
  drive regeneration later (P3 above) but the first ship is human-
  mediated because the screenshots are pedagogically load-bearing
  and human play-through catches edge cases an MCP-driven generation
  would silently paper over.
- **Sovereignty stance for the AI courses.** No HuggingFace runtime
  dependency. PyTorch the library is fine; HuggingFace Hub is not. The
  reasoning lives in each course's index — autonomy, dependency surface,
  educational dilution. Hold this line on future tuning/training
  courses unless Michael explicitly revises.
- If you are Claude and you are reading this after a context compression,
  re-read `CLAUDE.md` and `PLAN.md` before touching anything.
