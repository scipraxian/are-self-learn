# are-self-learn

The Are-Self curriculum framework and course catalog.

**What this is:** A standalone repository whose entire purpose is to be the
curriculum delivery mechanism for Are-Self. One repo, one template, many
courses, many audiences — from 4th grade through community college through
corporate training.

**What lives here:**

- A standardized course template (`_template/`)
- A canonical tag taxonomy (`tags.yaml`)
- A linter that enforces frontmatter and structural rules
- A Django "driver" app that generates the `/learn` landing page and
  `sidebars.js` from the authoritative YAML
- The course content itself, as markdown + YAML + static assets

**What this is not:**

- Not a database-backed authoring tool. Files are the source of truth.
  Git is the database.
- Not developer documentation for Are-Self — that lives in `are-self-docs`.
- Not a React app. Authoring is plain-text-and-commits.

## Layout (planned)

```
are-self-learn/
├── README.md                  ← you are here
├── CLAUDE.md                  ← session continuity for Claude
├── TASKS.md                   ← work queue
├── PLAN.md                    ← master planning doc (the memory layer)
├── LICENSE                    ← MIT
├── tags.yaml                  ← canonical tag taxonomy
├── _template/                 ← the course template (copy-paste-and-rewrite)
│   ├── index.md
│   ├── week-1.md
│   ├── worksheets/
│   ├── rubrics/
│   └── ...
├── courses/
│   ├── elementary-4th-grade/           ← migrated from are-self-docs
│   ├── hs-bio-brain/                   ← 🔥 UCSD dean pitch artifact
│   ├── middle-school-brain/
│   ├── cc-frameworks-django/
│   ├── corporate-ai-cost-management/   ← 🔥 sleeper hit
│   ├── corporate-ci-cd/
│   ├── small-business/
│   ├── python-beginner/
│   ├── python-intermediate/
│   ├── python-advanced/
│   └── unreal-landmines/
├── driver/                    ← Django app
│   ├── manage.py
│   ├── curriculum/            ← Django app package
│   └── ...
└── site/                      ← Docusaurus rendering layer
    └── ...
```

## License

MIT. See `LICENSE`.

## Status

Planning. The master planning doc is `PLAN.md`. If you are reading this
for the first time, start there.
