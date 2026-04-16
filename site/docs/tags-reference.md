---
id: tags-reference
title: Tags Reference
sidebar_position: 3
---

# Tags Reference

Every course in Are-Self Learn is tagged from a canonical vocabulary.
Tags are enforced — no free-form tags. New tags require a PR that updates
this list and `tags.yaml` in the repo root.

---

## Audience

Pick exactly one per course.

| Tag | Description |
|---|---|
| `audience:elementary` | K-5 |
| `audience:middle-school` | Grades 6-8 |
| `audience:high-school` | Grades 9-12 |
| `audience:community-college` | 2-year college / CC |
| `audience:university` | 4-year university |
| `audience:corporate` | Corporate / enterprise training |
| `audience:small-business` | Small business / sole proprietor |
| `audience:hobbyist` | Hobbyist / maker / indie dev |
| `audience:self-learner` | Independent self-paced learner |

## Subject

Pick one or more per course.

| Tag | Description |
|---|---|
| `subject:biology` | Biology |
| `subject:neuroscience` | Neuroscience / neuroanatomy |
| `subject:computer-science` | Computer science (general) |
| `subject:software-engineering` | Software engineering practices |
| `subject:python` | Python programming |
| `subject:django` | Django web framework |
| `subject:ci-cd` | Continuous integration / continuous delivery |
| `subject:ai-literacy` | AI literacy and understanding |
| `subject:ai-cost-management` | AI model cost management |
| `subject:ela` | English / Language Arts |
| `subject:math` | Mathematics |
| `subject:science` | General science |
| `subject:social-studies` | Social studies / civics |
| `subject:game-development` | Game development |
| `subject:unreal-engine` | Unreal Engine |
| `subject:business` | Business / entrepreneurship |
| `subject:design-patterns` | Software design patterns |

## Level

| Tag | Description |
|---|---|
| `level:intro` | No prior knowledge assumed |
| `level:beginner` | Some familiarity expected |
| `level:intermediate` | Comfortable with fundamentals |
| `level:advanced` | Deep prior knowledge expected |
| `level:expert` | Professional-level depth |

## Duration

| Tag | Description |
|---|---|
| `duration:single-lesson` | One class period |
| `duration:1-week` | ~5 class periods |
| `duration:2-week-iteration` | One iteration (2 weeks) |
| `duration:4-week` | ~4 weeks |
| `duration:6-week-unit` | Full unit (~6 weeks) |
| `duration:quarter` | One academic quarter (~10 weeks) |
| `duration:semester` | One academic semester (~16 weeks) |

## Format

| Tag | Description |
|---|---|
| `format:self-paced` | Learner works at their own speed |
| `format:instructor-led` | Teacher / trainer delivers the course |
| `format:cohort` | Cohort-based with fixed schedule |
| `format:workshop` | Short, intensive, hands-on |

## Standards Alignment

Optional but encouraged. Helps teachers defend adoption to department
heads.

| Tag | Description |
|---|---|
| `standards:common-core-ela` | Common Core State Standards — ELA |
| `standards:common-core-math` | Common Core State Standards — Math |
| `standards:ngss` | Next Generation Science Standards |
| `standards:c3-social-studies` | C3 Framework for Social Studies |
| `standards:acm-cs` | ACM CS Curriculum Guidelines |
| `standards:ieee-cs` | IEEE CS Curriculum Guidelines |
| `standards:none` | Deliberately outside a standards framework |

## Special Tags

| Tag | Description |
|---|---|
| `reviewed-by:<name>` | Expert endorsement. Example: `reviewed-by:dean-neuroscience-ucsd` |
| `interactive:worksheets` | Course includes worksheets |
| `interactive:labs` | Course includes hands-on labs |
| `interactive:projects` | Course includes project work |
| `interactive:videos` | Course includes video content |
| `interactive:live-coding` | Course includes live coding exercises |
| `landmines` | "Don't make these mistakes" format |

---

This list will grow. It will never shrink.

To propose a new tag, open a PR that adds it to both this page and
`tags.yaml` in the repo root.
