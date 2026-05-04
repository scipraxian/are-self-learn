<p align="center">
  <a href="https://are-self.com/learn/">
    <img src="https://are-self.com/img/ui/cns-graph-hero.png" alt="The Are-Self CNS pathway editor — the brain-shaped interface students learn to read, edit, and run through the curriculum." width="900">
  </a>
</p>

# Are-Self Learn

### Free, MIT-licensed curriculum for teaching AI through neuroanatomy.

**4th grade through community college through corporate training.** Worksheets, rubrics, parent letters, classroom norms, capstone projects. Fork it. Print it. Teach it tomorrow.

`Open · MIT · Built solo since April 2026 · 15 courses · 1 shipped, 11 drafted, 3 outlined`

[**Browse the catalog →**](https://are-self.com/learn/)  ·  [**Start with the 4th-grade course →**](https://are-self.com/learn/courses/elementary-4th-grade)  ·  [**Why this exists →**](https://are-self.com/docs/scipraxianism)  ·  [**Sponsor the work →**](https://are-self.com/docs/state#how-to-come-along)

---

## For teachers — what's ready Monday morning

The **4th-grade course** at [`site/docs/courses/elementary-4th-grade/`](site/docs/courses/elementary-4th-grade/) is the one fully-shipped unit. Six weeks. Welcome → Writing → Math → Science → Social Studies → Capstone. Each week is one markdown file you read top-to-bottom. The folder also includes:

- **[`teacher-setup.md`](site/docs/courses/elementary-4th-grade/teacher-setup.md)** — what to install before week 1, what to print, what to project.
- **[`parent-letter.md`](site/docs/courses/elementary-4th-grade/parent-letter.md)** — a letter to families explaining what their kid will be doing and why.
- **[`classroom-norms.md`](site/docs/courses/elementary-4th-grade/classroom-norms.md)** — the three habits the unit teaches (Inclusion, Humility, Inquiry) rendered as classroom-ready language.
- **[`worksheets.md`](site/docs/courses/elementary-4th-grade/worksheets.md)** — printable worksheets for every week.
- **[`admin-guide.md`](site/docs/courses/elementary-4th-grade/admin-guide.md)** — for principals and tech coordinators who need to sign off.

If you teach 4th grade and you can install Are-Self on a laptop, you can run this unit next week.

## The catalog

| Course | Audience | Shape | Status |
|---|---|---|---|
| **elementary-4th-grade** | 4th grade | 6 weeks, three habits, hands-on | ✅ Shipped |
| **middle-school-brain** | Middle school | 6 weeks, brain anatomy + AI | Drafted |
| **hs-bio-brain** | High school biology | 6 weeks + 30 worksheets + labs | Drafted (reference v1.5) |
| **what-is-ai** | High school / general | 6 modules — tokens, models, vectors, training, datacenters, business models | Drafted |
| **python-beginner** | Anyone | 8 modules from "first program" to "exploring Are-Self" | Drafted |
| **python-intermediate** | Beginner alums | 8 modules — classes, inheritance, APIs, testing, signals | Drafted |
| **python-advanced** | Intermediate alums | Metaprogramming and beyond | Drafted |
| **cc-frameworks-django** | Community college | 10 weeks — fundamentals, models, views, DRF, auth, signals, Celery, websockets, capstone | Drafted |
| **agile-experience-master** | Engineering / PM | Experience Master / agile course built around Are-Self's tick cycle | Drafted |
| **corporate-ci-cd** | Engineering teams | 5 days — neural pathways as CI/CD orchestration | Drafted |
| **corporate-ai-cost-management** | CFO-adjacent | 2 weeks — biology of budgets, operating at scale | Drafted |
| **summer-camp-neurotech** | Day camp | 5 days, hands-on neurotech | Drafted |
| **build-ai-from-scratch** | Advanced | Build an AI from scratch — the AI Training trio | Outlined |
| **graphs-and-sleep-consolidation** | Advanced | Graphs and sleep consolidation — the AI Training trio | Outlined |
| **tune-pretrained-models** | Advanced | Tuning pretrained models — the AI Training trio | Outlined |

Eleven of twelve drafted courses still need the **v1.5 three-file rubric pattern** rolled out. `hs-bio-brain` is the reference implementation if you want to see the target shape.

## How this fits inside Are-Self

The curriculum teaches the **first three Scipraxian Variables** explicitly — **Inclusion, Humility, Inquiry** — by name, on purpose. A fourth-grader doesn't need all twelve. Three is enough to fundamentally change how a fourth-grader argues at the lunch table. Older students climb to the full twelve as the lessons climb. The high-school AI-literacy track plays with **Religion or Profit** (evaluating who's selling them what), **Time** (their own relationship to it), and **Permadeath** (which decisions are reversible).

The teaching frame matches the philosophy: **science + practice**. *Sci-prax-ian.* The scientific method as a habit, held alongside twelve Variables, in service of the kind of citizen who keeps asking one more question.

The full philosophy: [are-self.com/docs/scipraxianism](https://are-self.com/docs/scipraxianism).

## The story underneath

***Mira and the Are-Self*** is the storybook — Book One of the Scipraxian Tales. A ten-year-old, a strange box, three habits, a Tuesday afternoon. Twenty minutes to read. Free. Online. The 4th-grade unit's week 1 reads it together; older units reference it.

Read it: [are-self.com/docs/storybook](https://are-self.com/docs/storybook).

## How to come along

This curriculum is solo for now. Everyone is welcome. The mission is free AI literacy in front of kids and the grownups who teach them — and most of the doors in don't go through me at all:

1. **Teach a unit.** Pick one from the drafted list, take it into a classroom, send back what worked and what didn't. Filing an issue counts. A pull request with edits counts more.
2. **Get your school, library, after-school program, or 501(c)(3) to adopt it.** A teacher with a printer and a 16GB laptop can run the 4th-grade unit next week. The unlock at this scale is institutional permission.
3. **Write the next course.** Copy [`_template/`](_template/) into `site/docs/courses/<your-slug>/`, fill in every `[PLACEHOLDER]`, and open a PR. See `_template/README.md` for the full process. Every tag must exist in `tags.yaml` — no free-form tags.
4. **Roll v1.5 forward.** Take a drafted course, look at `hs-bio-brain` as the reference, and bring the three-file rubric pattern across. PRs welcome.
5. **Translate.** A course in your language is one fewer kid locked out by language alone.
6. **If you'd like this curriculum to keep growing at the pace it's been going** — roughly $5–7/day in AI tooling, out-of-pocket — sponsoring the human typing it forward is one direct lever: [GitHub Sponsors](https://github.com/sponsors/scipraxian) · [Ko-fi](https://ko-fi.com/scipraxian) · [Buy Me a Coffee](https://buymeacoffee.com/scipraxian) · [Patreon](https://patreon.com/scipraxian).

The work happens either way.

## Local development (for course authors)

File-based content rendered by [Docusaurus](https://docusaurus.io/). Files are the source of truth. Git is the database. Deployed to [are-self.com/learn](https://are-self.com/learn/) via a composite GitHub Action that builds both `are-self-docs` and `are-self-learn` into a single site.

```bash
cd site
npm install
npm start          # runs on port 3001
```

Layout:

```
are-self-learn/
├── README.md                  ← you are here
├── CLAUDE.md                  ← session continuity for Claude
├── TASKS.md                   ← work queue
├── PLAN.md                    ← master planning doc
├── LICENSE                    ← MIT
├── tags.yaml                  ← canonical tag taxonomy
├── _template/                 ← course template (copy-paste-and-rewrite)
└── site/                      ← Docusaurus instance (npm workspace)
    └── docs/courses/          ← every course lives here
```

## Find us

[YouTube](https://youtube.com/@scipraxian) · [Discord](https://discord.gg/nGFFcxxV) · [Facebook](https://facebook.com/scipraxian) · [X](https://x.com/scipraxian) · [Truth Social](https://truthsocial.com/@scipraxian) · [TikTok](https://tiktok.com/@scipraxian) · [Instagram](https://instagram.com/scipraxian/) · [Reddit](https://reddit.com/user/Scipraxian/)

## License

MIT. The Grid is free. Teach with it. Print it. Remix it. Send it home with the kid.

---

If any of this caught you, the real welcome is at **[are-self.com](https://are-self.com)**. Star this if you believe a teacher should be able to teach AI without their school district paying a license fee per student.
