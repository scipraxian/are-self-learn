# are-self-learn

The Are-Self curriculum framework and course catalog.

**What this is:** A standalone repository whose entire purpose is to be the
curriculum delivery mechanism for Are-Self. One repo, one template, many
courses, many audiences — from 4th grade through community college through
corporate training.

**Architecture:** File-based content rendered by Docusaurus. Files are the
source of truth. Git is the database. Deployed to `are-self.com/learn` via
a composite GitHub Action that builds both `are-self-docs` and
`are-self-learn` into a single site.

## Layout

```
are-self-learn/
├── README.md                  ← you are here
├── CLAUDE.md                  ← session continuity for Claude
├── TASKS.md                   ← work queue
├── PLAN.md                    ← master planning doc (the memory layer)
├── LICENSE                    ← MIT
├── tags.yaml                  ← canonical tag taxonomy
├── _template/                 ← course template (copy-paste-and-rewrite)
│   ├── README.md              ← how to use the template
│   ├── index.md               ← course landing page + full frontmatter
│   ├── week-N.md              ← lesson plan template
│   ├── worksheets/
│   ├── rubrics/
│   └── diagrams/
└── site/                      ← Docusaurus instance (npm workspace)
    ├── package.json
    ├── docusaurus.config.js
    ├── sidebars.js
    ├── start.bat
    ├── src/css/custom.css
    └── docs/
        ├── index.md           ← /learn landing page
        ├── glossary.md        ← A-Z terms reference
        ├── tags-reference.md  ← canonical tag taxonomy (public)
        └── courses/
            └── elementary-4th-grade/   ← shipped (13 files)
```

## Quick start (local dev)

```bash
cd site
npm install
npm start          # runs on port 3001
```

## License

MIT. See `LICENSE`.

## Contributing

Copy `_template/` into `site/docs/courses/<your-course-slug>/`, fill in
every `[PLACEHOLDER]`, and open a PR. See `_template/README.md` for the
full process. Every tag must exist in `tags.yaml` — no free-form tags.
