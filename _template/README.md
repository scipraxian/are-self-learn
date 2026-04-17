# Course Template — How to Use

This directory is the starter kit for every course in the Are-Self
curriculum framework. To create a new course:

1. **Copy** this entire `_template/` folder into
   `site/docs/courses/<your-course-slug>/`.
2. **Rename** `week-N.md` for each week you need (e.g., `week-1-intro.md`,
   `week-2-tools.md`). Copy the file once per week.
3. **Fill in** every YAML frontmatter field in `index.md`. The linter
   will reject missing required fields.
4. **Replace** all `[PLACEHOLDER]` tokens in every file with real content.
5. **Create** one worksheet per lesson minimum — copy
   `worksheets/worksheet-template.md` and rename it.
6. **Create** at least one rubric — copy `rubrics/rubric-template.md`.
7. **Add** diagrams and static assets to `diagrams/`.
8. **Register** your course in `site/sidebars.js`.
9. **Run the linter** (`manage.py lint_course <course-id>`) before
   committing.

## What's in here

```
_template/
├── README.md               ← You are here
├── index.md                ← Course landing page + full frontmatter schema
├── week-N.md               ← Lesson plan template (one per week)
├── worksheets/
│   └── worksheet-template.md
├── rubrics/
│   └── rubric-template.md
└── diagrams/
    └── .gitkeep
```

## Rules (non-negotiable)

- **Every tag** must exist in `tags.yaml`. No free-form tags.
- **Every lesson** has at least one worksheet. Framework-level rule.
- **Vocabulary** follows `PLAN.md` §Vocabulary Rules. No "scrum," no
  "sprint," no "grooming," no violence metaphors.
- **License** is MIT. Do not change.
- **Heading hierarchy** must not skip levels (h1 → h2 → h3, never h1 → h3).
- **"Click here"** link text is banned. Use descriptive link text.
- **Alt text** on every image.
- **Video transcripts** required before a course leaves `draft` status.

## The operating system

Every lesson plan in this template is structured around practices from
*Experience Master* (Clark & Piper, 2017). The section names in each
week map directly to the book's vocabulary:

| Lesson plan section | Experience Master term |
|---|---|
| **Why This Week Matters** | Definition of Ready — perspective |
| **Learning Goals** | Definition of Ready — assertions |
| **What This Week Is Not** | Definition of Ready — outside |
| **Prerequisites** | Definition of Ready — dependencies |
| **Demo** | Definition of Ready — demo_specifics |
| **Exit Ticket** | Definition of Done |
| **Teacher Reflection** | Retrospective |

For K-12 courses, teachers encounter these as natural lesson-planning
questions — "Why does this matter? What will students do? How do I know
they got it?" The structure does the work without requiring anyone to
learn a new framework.

For CS and corporate courses, the vocabulary appears explicitly — those
audiences will encounter it professionally.

See `PLAN.md` §"The Agile injection — UNFROZEN" and
`are-self-documents/BOOK-DIGEST.md` for the full mapping.
