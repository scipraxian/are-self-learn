---
# -- Identity ──────────────────────────────────────────────────────
title: "CS Frameworks: Django, DRF, Are-Self"
subtitle: "A ten-week community college course on production Django through the lens of a neurologically-inspired AI engine"

# -- Authorship ────────────────────────────────────────────────────
author: "Michael Clark"
author_email: "scipraxian@are-self.com"
contributors: []
reviewed_by: []
  # - name: "[Pending]"
  #   title: "Department Chair, Computer Science"
  #   institution: "[Community College]"
  #   date: "2026-??-??"
created: "2026-04-18"
last_updated: "2026-04-18"
version: "0.1.0"
status: "draft"

# -- Licensing ─────────────────────────────────────────────────────
license: "MIT"

# -- Classification ────────────────────────────────────────────────
audience: "audience:community-college"
subjects:
  - "subject:computer-science"
  - "subject:web-frameworks"
  - "subject:software-engineering"
level: "level:intermediate"
duration: "duration:10-week-quarter"
format: "format:instructor-led"
standards:
  - "standards:acm-ieee-cs2023"
tags:
  - "interactive:labs"
  - "interactive:projects"
  - "framework:django"
  - "framework:drf"

# -- Pedagogical Metadata ─────────────────────────────────────────
learning_objectives:
  - "Build and deploy a Django 6.x project using professional project structure and configuration patterns."
  - "Design relational models with mixins, UUID primary keys, auto-timestamping, and pgvector embeddings."
  - "Implement RESTful APIs using Django REST Framework with serializer variants, filtering, and custom actions."
  - "Secure web applications with authentication, authorization, and DRF permission classes."
  - "Integrate asynchronous task processing with Celery and real-time communication with Django Channels."
  - "Apply the Experience Master operating system to manage work: Iterations, Standups, Sifting, Definition of Ready, Definition of Done."
  - "Evaluate architectural decisions through the twelve scipraxian Variables."
  - "Ship a capstone Django application using Are-Self patterns, demonstrated live to peers."
prerequisites:
  - "Completion of Python Intermediate (../python-intermediate/) or equivalent: classes, decorators, context managers, virtual environments."
  - "Basic SQL: SELECT, INSERT, JOIN, WHERE."
  - "Comfort with the command line: navigation, git basics, pip."
  - "Familiarity with HTTP: methods, status codes, request/response cycle."
  - "Note: Python Advanced is NOT required but is recommended."
estimated_teacher_prep_hours: 10
estimated_student_hours: 120
estimated_classroom_hours: 30

# -- Operating System ─────────────────────────────────────────────
iteration_length_weeks: 2
definition_of_ready:
  perspective: "Why does this module matter, and who is it for?"
  assertions: "What will students demonstrably build or explain by the end?"
  outside: "What is explicitly outside the scope of this module?"
  dod_exceptions: "Any places where the instructor should adapt to their cohort."
  dependencies: "What must be true before this module can run?"
  demo_specifics: "How will students demonstrate what they built?"
definition_of_done:
  - "Students can do what the learning goals describe."
  - "Code passes automated assertions (tests, linting)."
  - "A peer or instructor has reviewed the work."
  - "The student has reflected on what worked and what to change."

# -- Deliverables ──────────────────────────────────────────────────
worksheets_count: 0
labs_count: 10
videos_count: 0
transcripts_available: false
rubrics_count: 10

# -- Links ─────────────────────────────────────────────────────────
hero_diagram: ""
source_scripts_folder: ""

# -- Accessibility ─────────────────────────────────────────────────
wcag_level: "AA"
alt_text_complete: false
transcripts_complete: false

# -- Docusaurus ────────────────────────────────────────────────────
sidebar_position: 1
---

# CS Frameworks: Django, DRF, Are-Self

**A ten-week community college course that teaches production Django through a working AI reasoning engine. Students don't build toy apps — they read, extend, and learn from a real codebase that maps nine brain regions to nine Django apps, runs background workers, fires real-time WebSocket events, and manages AI model budgets with circuit breakers.**

## Prerequisites

- [Python Intermediate](../python-intermediate/) or equivalent proficiency (classes, decorators, context managers, virtual environments)
- Basic SQL (SELECT, INSERT, JOIN, WHERE)
- Comfort with the command line (navigation, Git basics, pip)
- Familiarity with HTTP (methods, status codes, request/response cycle)

**Note:** [Python Advanced](../python-advanced/) is NOT required but is recommended for students who want deeper preparation.

## Who This Is For

You're teaching working adults who already write Python. They've done the tutorials. They can subclass a thing and pip-install another thing. What they haven't done is work inside a codebase that was built for production — one where the models use UUID primary keys and auto-timestamped mixins, the serializers come in light and full variants, the signals fire asynchronously through WebSockets, and the background workers have heartbeats monitored by Celery Beat.

Are-Self is that codebase. It's Django 6.x, it's real, and it's strange enough to be interesting — a neurologically-inspired AI reasoning swarm where the Hippocampus stores memories as 768-dimensional vectors and the Hypothalamus manages model budgets with circuit breakers. Students will clone it in Week 1 and build on top of it for the remaining nine weeks.

You do not need to be a neuroscientist. The brain metaphor is the architecture, not the curriculum. The curriculum is Django.

## The Twelve Variables

This is a course for professionals. They get the full scipraxian decision lattice — all twelve Variables — because every engineering decision carries weight beyond the code:

Inclusion, Humility, Inquiry, Fulfillment or Happiness, Religion or Profit, Fun, Fear, Responsibility, Perseverance, Perception, Time, Permadeath.

When a student chooses between a ForeignKey and a ManyToManyField, that's a technical decision. When they choose whether to cache aggressively or query fresh, that's a decision about Time and Responsibility. When they decide whose use case to optimize for in their capstone, that's Inclusion and Perception. The Variables aren't a sidebar — they're the lens through which professionals evaluate tradeoffs.

## The Experience Master Operating System

This course uses Experience Master (Clark & Piper, 2017) vocabulary throughout. Students operate as a delivery team:

- **Iterations** — Two-week cycles. Weeks 1-2, 3-4, 5-6, 7-8, 9-10.
- **Standups** — Brief check-ins at the start of each lab session. What did you do? What are you doing? What's blocking you?
- **Sifting** — Backlog refinement. Students maintain a personal backlog of learning objectives and lab tasks, prioritized weekly.
- **Pre-Planning** — At the start of each Iteration, students commit to what they'll deliver by the Demo.
- **Demo** — At the end of each Iteration, students demonstrate working software to the class.
- **Retrospective** — After each Demo, the cohort reflects: what worked, what didn't, what to change.

### Definition of Ready

Before a student begins a lab or assignment, it must have:

| Element | Question |
|---------|----------|
| **Perspective** | Why does this work matter? |
| **Assertions** | What will it demonstrably do when it's done? |
| **Outside** | What is explicitly not part of this work? |
| **DoD Exceptions** | Any agreed-upon deviations from the standard Definition of Done? |
| **Dependencies** | What must exist before this work can start? |
| **Demo Specifics** | How will this be shown at Demo? |

### Definition of Done

A piece of work is Done when:

1. All assertions are met and verified
2. Code passes linting and tests
3. A peer or instructor has reviewed the work
4. The work is assigned to the completing Worker (the student)

## Course at a Glance

| Week | Theme | Focus | Primary Variable |
|------|-------|-------|------------------|
| [Week 1](./week-1-fundamentals) | Django Fundamentals | Project structure, settings, apps, manage.py | Humility |
| [Week 2](./week-2-models) | Models and Migrations | Fields, relationships, Are-Self mixin patterns | Inquiry |
| [Week 3](./week-3-admin) | Admin and Management Commands | Django admin, custom management commands | Responsibility |
| [Week 4](./week-4-views) | Views and URLs | FBVs, CBVs, URL routing, Are-Self API structure | Perception |
| [Week 5](./week-5-drf) | Django REST Framework | Serializers, ViewSets, routers, light/full pattern | Inclusion |
| [Week 6](./week-6-auth) | Authentication and Permissions | Django auth, DRF permissions, token auth | Fear + Responsibility |
| [Week 7](./week-7-signals) | Signals and Middleware | Django signals, m2m_changed, neurotransmitter pattern | Perseverance |
| [Week 8](./week-8-celery) | Background Tasks | Celery, task queues, periodic tasks, PNS heartbeat | Time |
| [Week 9](./week-9-websockets) | WebSockets and Real-Time | Django Channels, WebSocket consumers, synaptic cleft | Fulfillment |
| [Week 10](./week-10-capstone) | Capstone | Design, build, test, deploy, demo | All twelve |

## Iteration Schedule

| Iteration | Weeks | Demo Focus |
|-----------|-------|------------|
| Iteration 1 | 1-2 | A Django project with custom models using Are-Self mixins |
| Iteration 2 | 3-4 | Admin interface and views for a brain region |
| Iteration 3 | 5-6 | A secured REST API with light/full serializers |
| Iteration 4 | 7-8 | Signal-driven notifications with async background processing |
| Iteration 5 | 9-10 | Capstone: a complete Django application using Are-Self patterns |

## What Students Will Be Able to Do

By the end of this course, students will:

1. **Configure** a Django 6.x project with environment-driven settings, multiple apps, and shared utilities
2. **Design** models using professional patterns: UUID PKs, auto-timestamping, natural keys, vector embeddings
3. **Build** RESTful APIs with DRF ViewSets, serializer variants, filtering, and custom actions
4. **Secure** applications with authentication, authorization, and permission classes
5. **Orchestrate** background processing with Celery workers and periodic tasks
6. **Implement** real-time features with Django Channels and WebSocket consumers
7. **Operate** as a delivery professional using Experience Master vocabulary and cadences
8. **Ship** a production-quality Django application and demonstrate it live

## ACM/IEEE CS2023 Alignment

This course addresses the following ACM/IEEE Computer Science Curricula 2023 knowledge areas:

- **SDF (Software Development Fundamentals):** Development methods, program correctness, development tools
- **SE (Software Engineering):** Software design, construction, verification, evolution, project management
- **PL (Programming Languages):** Object-oriented programming, type systems, language pragmatics
- **NC (Networking and Communication):** Web protocols, client-server architecture, WebSocket communication
- **PD (Parallel and Distributed Computing):** Task parallelism, message passing (Celery), concurrency
- **IAS (Information Assurance and Security):** Authentication, authorization, secure coding practices
- **SP (Social Issues and Professional Practice):** Ethical decision-making, professional communication, teamwork

## The Are-Self Architecture Map

This is the reference students will use throughout the course:

| Brain Region | Django App | What It Does | Course Week(s) |
|---|---|---|---|
| Identity | `identity` | IdentityDisc with phased addons (IDENTIFY, CONTEXT, HISTORY, TERMINAL) | 2, 5, 10 |
| Hippocampus | `hippocampus` | Engram memory with hash dedup, 768-dim vectors, provenance chains | 2, 7 |
| Frontal Lobe | `frontal_lobe` | Reasoning sessions, tool use, focus budgeting | 4, 5 |
| Prefrontal Cortex | `prefrontal_cortex` | Work hierarchy, Definition of Ready enforcement | 3, 4 |
| Hypothalamus | `hypothalamus` | Budget filtering, failover strategy, vector matching, circuit breakers | 5, 8 |
| Central Nervous System | `central_nervous_system` | Neural Pathways (DAGs), Neurons, Axons, Spike Trains | 4, 7 |
| Peripheral Nervous System | `peripheral_nervous_system` | Worker fleet management, Celery Beat heartbeat | 8 |
| Thalamus | `thalamus` | Chat interface, human-AI relay | 4, 9 |
| Temporal Lobe | `temporal_lobe` | Iteration scheduling, shift management | 3 |
| Synaptic Cleft | `synaptic_cleft` | WebSocket events, neurotransmitter signals | 9 |
| Parietal Lobe | `parietal_lobe` | Spatial reasoning, context integration | 10 |
| Occipital Lobe | `occipital_lobe` | Visual processing, image handling | 10 |
| Common | `common` | Shared mixins, utilities, base classes | 2, 3 |

## Hardware and Software Requirements

- **Development machine:** Any OS capable of running Python 3.12+, PostgreSQL 16+ with pgvector, Redis
- **IDE:** Any (VS Code recommended for consistency)
- **Are-Self repository:** Cloned locally in Week 1
- **Docker:** Recommended for PostgreSQL and Redis (optional if installed natively)
- **Time per week:** Two 75-minute lectures + one 110-minute lab session

## Grading Structure

| Component | Weight | Notes |
|-----------|--------|-------|
| Lab assignments (10) | 40% | Weekly lab deliverables, assessed against Definition of Done |
| Iteration Demos (5) | 20% | Bi-weekly demonstrations of working software |
| Participation | 10% | Standups, Sifting, Retrospectives, peer reviews |
| Capstone project | 30% | Week 10 design, implementation, and live demo |

---

*Built by the Are-Self project. MIT licensed. Free to use, modify, and share. If you improve it, we'd love to hear about it — [join the community](https://discord.gg/nGFFcxxV).*
