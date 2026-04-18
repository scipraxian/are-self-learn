---
title: "Week 10 — Capstone"
sidebar_position: 12
---

# Week 10: Capstone

Students design, build, test, and demonstrate a complete Django application using Are-Self patterns. This is the culmination of nine weeks of learning — models with mixins, DRF APIs with light/full serializers, secured endpoints, signal-driven behavior, background tasks, and real-time WebSocket delivery. Every student demos working software to the class.

## Week Overview

**Theme:** Design, build, test, deploy, and demo

**Primary Variable:** All twelve — The capstone is where every Variable surfaces. Inclusion (whose use case did you design for?), Humility (what don't you know yet?), Inquiry (what question does your project answer?), Fulfillment (does it feel right?), Religion or Profit (who benefits?), Fun (is this interesting?), Fear (what could go wrong?), Responsibility (did you build it well?), Perseverance (did you finish?), Perception (how do others see your work?), Time (did you use it wisely?), Permadeath (this is the one shot — make it count).

<!-- Definition of Ready — perspective -->

**Why This Week Matters:**
Knowing patterns is not the same as using them. The capstone forces integration — students must make architectural decisions, balance scope against time, handle the unexpected, and present their work to peers. This is the closest a classroom gets to shipping software at work.

<!-- Definition of Ready — assertions -->

**Learning Goals:**

- Architect a Django application with multiple apps, models, and relationships
- Apply Are-Self patterns: mixin composition, light/full serializers, signal-to-task-to-WebSocket pipelines
- Make and defend architectural decisions under time pressure
- Deliver working software with tests, documentation, and a live demo
- Evaluate peer work constructively and receive feedback gracefully

<!-- Definition of Ready — outside -->

**What This Week Is Not:**

- Not a hackathon — students have been building toward this for nine weeks
- Not graded on novelty — graded on correct application of course patterns
- Not expected to be production-ready — graded on architecture, not polish

---

## Capstone Requirements

### Minimum Viable Capstone

Every capstone project must include:

1. **At least two Django apps** with distinct responsibilities
2. **At least two models** using Are-Self mixins (UUIDIdMixin, CreatedAndModifiedWithDelta, NameMixin; VectorMixin optional)
3. **At least one relationship** (ForeignKey or ManyToManyField)
4. **Django admin registration** with customized list_display, filters, and search
5. **DRF API** with:
   - Light and full serializer variants
   - At least one ViewSet with standard CRUD
   - At least one custom `@action` endpoint
   - Router-based URL configuration
   - DjangoFilterBackend on at least one field
6. **Authentication** — Token auth with at least one permission class
7. **At least one signal handler** — post_save, m2m_changed, or custom signal
8. **At least one Celery task** — on-demand or periodic
9. **At least one WebSocket consumer** — pushing events to connected clients
10. **Tests** — At least six: model, serializer, API endpoint, permission, signal, and task
11. **Live demo** — Five minutes, working software, to the class

### Project Proposals

Students submitted proposals at the end of Week 9. Approved proposals should:

- Have a clear domain and purpose
- Be achievable in one week by one person
- Exercise at least the minimum requirements
- Include a Definition of Ready

Example proposals that work well:

**Notification Hub** — A Django app that receives webhook events from external services, stores them as typed notifications (using mixins), exposes them via a filtered DRF API, processes notifications through Celery (deduplication, enrichment), and pushes new notifications to connected dashboards via WebSocket.

**Experiment Tracker** — A lab-notebook-style app for tracking machine learning experiments. Models for Experiment, Run, and Metric (with relationships). Light serializer shows experiment summaries; full shows all runs and metrics. Signals fire when a Run completes; a Celery task computes aggregate statistics; WebSocket pushes live updates to a monitoring page.

**Fleet Monitor** — Inspired by Are-Self's PNS. Models for Worker and Heartbeat. Workers send heartbeats via API. A Celery Beat task checks for stale heartbeats. Signals fire when workers go unhealthy. WebSocket broadcasts worker status changes to a dashboard. Custom permissions: only workers can send heartbeats; only admins can view the fleet.

**Memory Vault** — A simplified Engram system. Models for Memory and Tag with M2M. VectorMixin for embedding storage. m2m_changed signal recomputes embeddings when tags change. Celery task handles embedding computation. DRF API with search endpoint (custom action). WebSocket notifies when new memories are created.

---

## Day 1 (Lecture + Work): Architecture Review and Build

### Schedule (75 minutes)

#### Architecture Review (30 minutes)

Each student presents their project architecture to a small group (3-4 students):
- Which apps, which models, which relationships
- Which Are-Self patterns they're using and why
- Their Definition of Ready
- What they're worried about

The group gives feedback:
- Is the scope realistic for three days?
- Are any required patterns missing?
- What could go wrong?

This is the Pre-Planning ceremony for Iteration 5.

#### Build Time (45 minutes)

Students begin implementation. Priority order:
1. Models and migrations (foundation)
2. Admin registration (quick win, lets you verify data)
3. Serializers and ViewSets (the API layer)

Instructor circulates, answering questions and helping with scope decisions.

---

## Day 2 (Lecture + Work): Integration and Testing

### Schedule (75 minutes)

#### Brief Lecture: Integration Patterns (15 minutes)

Quick review of how the pieces connect:

```
Models → Admin (data management)
Models → Serializers → ViewSets → Router (API)
Models → Signals → Celery Tasks (async processing)
Celery Tasks → Channel Layer → WebSocket Consumer (real-time delivery)
ViewSet → Permission Classes (security)
```

Common integration mistakes:
- Circular imports between apps (solution: import inside functions, not at module level)
- Signal handlers that reference tasks that reference models that have signal handlers (solution: keep the dependency graph acyclic)
- Forgetting to run migrations after model changes
- Celery tasks that pass model instances instead of IDs

#### Build Time (60 minutes)

Students continue implementation. Priority for Day 2:
4. Authentication and permissions
5. Signal handlers
6. Celery tasks
7. WebSocket consumer

By the end of Day 2, the core functionality should work. Day 3 is for testing, polish, and demo preparation.

---

## Day 3 (Lab): Testing, Polish, and Demo

### Lab Duration

110 minutes

### Standup (10 minutes)

Final standup of the course:
- What's working?
- What's not working yet?
- What will you cut to make the demo?

Scope management under time pressure is a real skill. Some features won't make it. That's fine — as long as the minimum requirements are met and the demo tells a coherent story.

### Testing and Polish (40 minutes)

Students write their six required tests and fix any issues:

1. **Model test** — Create an instance, verify mixin behavior (UUID PK, timestamps, delta)
2. **Serializer test** — Verify light serializer excludes fields that full serializer includes
3. **API test** — List endpoint returns 200, detail endpoint returns expected data
4. **Permission test** — Unauthenticated request returns 401
5. **Signal test** — Model event triggers the signal handler (use `mock.patch`)
6. **Task test** — Celery task executes correctly (use `task.apply()`)

### Demo Preparation (20 minutes)

Students prepare their five-minute demo:
- What's the opening? (What does this app do and why?)
- What's the walkthrough? (Show the core flow: create data, see the API, trigger events, watch the WebSocket)
- What's the close? (What patterns from the course did you use? What would you add with more time?)

Practice once with a partner. Get timing feedback.

### Demos (40 minutes)

Five minutes per student. Structure:

1. **Introduction (30 seconds):** What the app does, who it's for
2. **Architecture overview (30 seconds):** Apps, models, patterns used
3. **Live walkthrough (3 minutes):** Working software. Create data. Call the API. Show the admin. Trigger a signal. Watch the Celery worker. See the WebSocket update.
4. **Reflection (1 minute):** What Are-Self patterns you used, what you learned, what you'd do differently

After each demo:
- One question from the class
- Brief feedback from the instructor

### Class Retrospective (remainder of time)

Final Retrospective for the course:
- What was the most valuable thing you learned?
- What would you change about the course?
- What will you take into your next project?
- Which of the twelve Variables showed up most in your capstone?

---

## Assessment

### Capstone Rubric

| Category | Weight | Excellent (A) | Proficient (B) | Developing (C) | Incomplete (D/F) |
|---|---|---|---|---|---|
| **Models and Mixins** | 15% | Multiple models with all four mixins, clean relationships, custom managers | Models with 3+ mixins, standard relationships | Basic models with some mixins | Models don't use mixins or have errors |
| **DRF API** | 20% | Light/full serializers, ViewSet with CRUD + custom actions, filtering, router | Working API with serializer variants | Basic API without variants | API non-functional |
| **Security** | 10% | Token auth, custom permission class, all endpoints appropriately secured | Token auth with standard permissions | Basic authentication | No authentication |
| **Signals** | 10% | Custom signal + model lifecycle signals, proper registration | One signal handler working | Signal exists but doesn't fire correctly | No signals |
| **Async Processing** | 10% | Celery task with retry logic, connected to signal pipeline | Basic Celery task working | Task defined but not integrated | No async processing |
| **Real-Time** | 10% | WebSocket consumer with group broadcast, connected to task pipeline | Basic WebSocket connection | Consumer exists but not integrated | No WebSocket |
| **Tests** | 10% | 6+ tests covering all layers, all passing | 4-5 passing tests | 2-3 tests | Fewer than 2 |
| **Demo** | 10% | Clear, confident, working software, good time management | Functional demo with minor issues | Demo works but disorganized | Non-functional or not presented |
| **Architecture** | 5% | Clean separation of concerns, well-organized code, good naming | Generally well-structured | Functional but messy | Poor structure |

### Definition of Done for the Capstone

- All minimum requirements met
- Tests pass
- Demo delivered to the class
- Code reviewed by at least one peer
- Student has reflected on the experience

---

## Materials for This Week

- All course materials from Weeks 1-9
- Are-Self source code for reference
- DRF documentation for API patterns
- Channels documentation for WebSocket patterns
- Celery documentation for task patterns

## Assignments

| Assignment | Due | Weight |
|------------|-----|--------|
| Capstone project | End of Week 10 Day 3 | 30% of course grade |
| Capstone demo | Week 10 Day 3 | Included in capstone grade |
| Course reflection | End of Week 10 | Participation grade |

## Exit Criteria for Week 10

A student has completed Week 10 when:

- Their capstone project meets all minimum requirements
- At least six tests pass
- They have delivered a live demo to the class
- They have participated in the final retrospective
- They can articulate what they learned and what they'd do differently

---

## Instructor Notes

### Common Issues

**Q: Students can't finish in time.**
A: Scope management is the skill. Help them cut features, not quality. A small project with clean architecture and passing tests is better than an ambitious project that doesn't run.

**Q: The demo is terrifying for some students.**
A: Frame it as a professional skill, not a performance. "You'll demo software at every job you have. This is practice." Allow notes. Allow screen share without standing. Remove every barrier except the requirement to show working software.

**Q: Students compare themselves to each other.**
A: Redirect to the rubric. The grading is against the criteria, not against each other. A student who builds a simple, clean, well-tested app earns the same grade as a student who builds something flashy but broken.

**Q: Integration breaks at the last minute.**
A: This is realistic. Help them isolate the problem. If the WebSocket breaks, they can still demo the API, signals, and tasks. A demo that acknowledges "this part broke and here's what I'd fix" is better than a demo that pretends everything works.

### Final Grades

The capstone is 30% of the course grade. Combined with labs (40%), demos (20%), and participation (10%), students have multiple paths to success. A student who struggled with WebSockets but nailed models, APIs, and testing can still earn an A.

### After the Course

Point students toward:
- The Are-Self open-source project for continued learning
- Django's official deployment guide for production skills
- The Experience Master framework for professional practice
- The Are-Self community Discord for ongoing support

---

*Built by the Are-Self project. MIT licensed. Free to use, modify, and share.*
