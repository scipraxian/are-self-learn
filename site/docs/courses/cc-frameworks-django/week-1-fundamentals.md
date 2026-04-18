---
title: "Week 1 — Django Fundamentals"
sidebar_position: 3
---

# Week 1: Django Fundamentals

Students meet Django as a production framework and Are-Self as a production codebase. By the end of the week, they can explain how Django projects are structured, what settings files control, how apps compose into a system, and why manage.py is the developer's command center. The lab puts them inside the Are-Self repository itself.

## Week Overview

**Theme:** Project structure, settings, apps, and manage.py

**Primary Variable:** Humility — You're about to read a codebase that was built by someone who made different decisions than you would have. That discomfort is the beginning of learning.

<!-- Definition of Ready — perspective -->

**Why This Week Matters:**
Every Django developer must navigate project structure before writing a single line of code. Students who understand how settings, apps, and management commands compose into a system can join any Django team and orient themselves within the first day. Are-Self provides a non-trivial example — nine brain-region apps, shared mixins, environment-driven configuration — that shows what production structure actually looks like.

<!-- Definition of Ready — assertions -->

**Learning Goals:**

- Explain the role of `settings.py`, `urls.py`, `wsgi.py`, and `manage.py` in a Django project
- Distinguish between a Django project and a Django app
- Navigate the Are-Self repository and identify all nine brain-region apps plus supplementary apps
- Run `manage.py` commands: `runserver`, `shell`, `showmigrations`, `check`
- Describe how `INSTALLED_APPS` composes a Django system from independent components

<!-- Definition of Ready — outside -->

**What This Week Is Not:**

- No model design yet — that's Week 2
- No views or URL routing — that's Week 4
- Students do not need to understand the neuroscience metaphor in depth
- No deployment — this is local development only

<!-- Definition of Ready — dependencies -->

**Prerequisites:**

- Python 3.12+ installed with virtual environment support
- Git installed and configured
- PostgreSQL 16+ running (Docker or native) with pgvector extension
- Redis running (Docker or native)
- IDE installed and configured

---

## Day 1 (Lecture): What Is Django and Why Does It Exist?

### Objective

Students will articulate what Django provides that raw Python does not, trace the request-response cycle through a Django project, and identify the major files in a fresh Django project.

### Materials Needed

- Projector with terminal access
- Fresh Django 6.x installation in a virtual environment
- Whiteboard for diagramming

### Lecture Content (75 minutes)

#### Opening (10 minutes)

Ask: "You all write Python. Why can't you just write a web app with `socket` and `http.server`?" Let them answer. They'll get to "it's too much work" quickly. Push further: "What specific work? What would you have to build yourself?"

Collect on the board: URL routing, database access, form validation, session management, security, templating, admin interface. Django provides all of these. That's the pitch.

#### Part 1: The Request-Response Cycle (20 minutes)

Diagram on the board:

```
Browser → URL dispatcher → View → Model (DB) → Template → Response → Browser
```

Walk through each step. Explain middleware as checkpoints the request passes through on the way in and the response passes through on the way out. Don't go deep on middleware yet — Week 7 covers it.

Introduce the vocabulary: project, app, settings, URLconf, view, model, template, middleware.

#### Part 2: Anatomy of a Django Project (25 minutes)

Create a fresh project live:

```bash
django-admin startproject myproject
cd myproject
python manage.py startapp myapp
```

Walk through every file that was generated:

- `manage.py` — The command-line entry point. Every Django developer's most-used file.
- `myproject/settings.py` — The central nervous system of configuration.
- `myproject/urls.py` — The root URL dispatcher.
- `myproject/wsgi.py` and `asgi.py` — The interface between Django and the web server.
- `myapp/models.py`, `views.py`, `admin.py`, `apps.py`, `tests.py` — The app skeleton.

Emphasize: Django enforces convention. You can deviate, but you need to know what the convention is first.

#### Part 3: Settings Deep Dive (15 minutes)

Walk through `settings.py` line by line:

- `SECRET_KEY` — What it's for, why it must stay secret
- `DEBUG` — What it controls, why it must be False in production
- `INSTALLED_APPS` — The registry of everything Django knows about
- `DATABASES` — How Django talks to PostgreSQL
- `MIDDLEWARE` — The ordered pipeline (preview for Week 7)

Show how environment variables can drive settings:

```python
import os
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'dev-insecure-key')
DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True'
```

#### Wrap-Up (5 minutes)

"Next time, we'll look at a project that has thirteen apps, shared mixins, and settings that configure an AI brain. Today's fresh project is the skeleton. Are-Self is the skeleton with muscles, nerves, and a personality."

### Assessment

- Can students name the five key files in a Django project and explain each one's role?
- Can students explain why `INSTALLED_APPS` matters?
- Can students articulate the request-response cycle in their own words?

### Differentiation

**Advanced Learners:**
- Compare Django's project structure to another framework they know (Flask, Express, Rails). What's similar? What's different? Why?

**Struggling Learners:**
- Provide a printed reference card with the file tree and one-sentence descriptions of each file

---

## Day 2 (Lecture): The Are-Self Project Structure

### Objective

Students will navigate the Are-Self repository, identify its app architecture, explain how thirteen Django apps compose into a neurologically-inspired system, and describe how Are-Self's settings extend the patterns from Day 1.

### Materials Needed

- Projector with IDE open to the Are-Self repository
- Printed or projected Are-Self architecture map (from the course index)
- Whiteboard for diagramming

### Lecture Content (75 minutes)

#### Opening (10 minutes)

Pull up the Are-Self repository root. Ask: "What do you see that looks like what we built yesterday? What looks different?"

They'll notice: many more apps, additional directories, configuration files they haven't seen before. Good. That's the gap between a tutorial and a production system.

#### Part 1: The App Map (25 minutes)

Walk through each app directory. For each one, open `apps.py` and `models.py` briefly — just enough to see that it's a real Django app:

**The Nine Brain Regions:**
1. `identity` — IdentityDisc: the AI's sense of self, with phased addons
2. `hippocampus` — Engram: memory storage with hash deduplication and vector embeddings
3. `frontal_lobe` — Reasoning sessions, tool orchestration
4. `prefrontal_cortex` — Work hierarchy and planning
5. `hypothalamus` — Model selection, cost management, circuit breakers
6. `central_nervous_system` — Neural Pathways (DAG templates), Neurons, Axons, Spike Trains
7. `peripheral_nervous_system` — Worker management, heartbeat monitoring
8. `thalamus` — Chat interface, human-AI relay
9. `temporal_lobe` — Scheduling, shift management

**Supplementary Apps:**
10. `parietal_lobe` — Spatial reasoning
11. `occipital_lobe` — Visual processing
12. `synaptic_cleft` — WebSocket events, neurotransmitter signals
13. `common` — Shared mixins and utilities

Ask after the walkthrough: "Why thirteen apps instead of one big app?" Drive toward: separation of concerns, independent development, testability, the Unix philosophy applied to Django.

#### Part 2: Settings in Production (20 minutes)

Open Are-Self's settings configuration. Compare to yesterday's fresh project:

- Environment-driven configuration with defaults
- Database configuration for PostgreSQL with pgvector
- Redis configuration for caching and Celery
- `INSTALLED_APPS` with all thirteen apps plus third-party packages
- Django REST Framework settings
- Celery configuration
- Channel Layers for WebSocket support

Key insight: the structure is the same as `startproject` generated. It's just bigger. Every production Django project is a grown-up version of the same skeleton.

#### Part 3: manage.py as the Developer's Toolkit (15 minutes)

Demonstrate Are-Self management commands:

```bash
python manage.py check                    # System check
python manage.py showmigrations           # Migration status
python manage.py shell                    # Interactive Python with Django loaded
python manage.py diffsettings             # What changed from defaults
```

Show that Are-Self has custom management commands. Open one. Explain that Week 3 will cover building these, but for now, notice that they exist and they're how production Django projects automate operations.

#### Wrap-Up (5 minutes)

"You now know how to read a Django project. Not how to write one yet — that starts next week with models. But you can clone any Django project on Earth and find your way around it. That's not a small thing."

### Assessment

- Can students identify all thirteen Are-Self apps and give a one-sentence description of each?
- Can students explain how Are-Self's settings extend the basic Django settings pattern?
- Can students run `manage.py` commands against the Are-Self project?

### Differentiation

**Advanced Learners:**
- Trace a specific `INSTALLED_APPS` entry through the codebase: find the app, its `apps.py`, its `models.py`, and its URL configuration

**Struggling Learners:**
- Provide a pre-built cheat sheet mapping each brain region to its app directory and primary model

---

## Day 3 (Lab): Clone Are-Self and Explore the Project

### Objective

Students will clone the Are-Self repository, set up their local development environment, run the project, and complete an exploration exercise that requires navigating the codebase to answer specific questions.

### Lab Duration

110 minutes

### Materials Needed

- Student laptops with prerequisites installed (Python 3.12+, PostgreSQL, Redis, Git)
- Are-Self repository URL
- Lab handout with setup instructions and exploration questions

### Standup (10 minutes)

First standup of the course. Go around the room:

- **What did you learn this week?** (It's Week 1, so this is about the lectures)
- **What are you about to do?** (Set up and explore the codebase)
- **What might block you?** (Environment issues, missing dependencies)

Explain: this is how professional teams start every work session. It takes five minutes and saves hours.

### Setup Phase (30 minutes)

Students work through the setup instructions:

1. Clone the repository
2. Create and activate a virtual environment
3. Install dependencies from `requirements.txt`
4. Configure environment variables (database URL, Redis URL, secret key)
5. Run `python manage.py migrate`
6. Run `python manage.py check` — confirm zero issues
7. Run `python manage.py runserver` — confirm the server starts

Circulate. Environment setup is where most students get stuck. Pair students who finish quickly with students who are struggling. This is Inclusion in practice — the person who finishes first isn't done until their neighbor is running too.

### Exploration Phase (50 minutes)

Students answer the following questions by navigating the codebase. They must cite the file and line number for each answer:

1. How many Django apps are listed in `INSTALLED_APPS`? Which ones are Are-Self apps and which are third-party?
2. Find the `common` app. What mixins does it define? List them and describe what each one provides (read the code, don't guess).
3. Open `hippocampus/models.py`. What model represents a memory? What fields does it have?
4. Open `central_nervous_system/models.py`. Find the Neural Pathway model. What fields define it as a DAG template?
5. Find `hypothalamus/models.py`. What model manages circuit breakers? What fields control the escalating timeout behavior?
6. How does Are-Self configure its database? Find the setting. What's different from the default SQLite configuration?
7. Run `python manage.py showmigrations`. How many migrations exist across all apps? Which app has the most?
8. Find one custom management command in the Are-Self codebase. What does it do?
9. Open the root `urls.py`. How is URL routing organized across the thirteen apps?
10. Find the `STATUS_MAP` in the CNS app. What pattern does it implement? Why use constants instead of raw strings?

### Sifting Exercise (10 minutes)

Students create their first personal backlog — a list of things they encountered in the codebase that they don't understand yet, prioritized by curiosity. This backlog will grow every week and drive their learning.

### Wrap-Up (10 minutes)

Quick share: "What was the most surprising thing you found in the codebase?" Go around the room. No wrong answers.

Assign for next week: read the `common` app's mixin files carefully. Week 2 starts with models, and those mixins are the foundation.

### Exit Criteria

- Are-Self runs locally on the student's machine
- The student can execute `manage.py` commands without errors
- The exploration questions are answered with file paths and line numbers
- The personal backlog has at least five items

### Assessment

| Criterion | Meets Expectations | Approaching | Not Yet |
|---|---|---|---|
| Environment setup | Project runs, migrations applied, server starts | Project runs with minor issues | Cannot start the server |
| Exploration depth | All 10 questions answered with citations | 7+ questions answered | Fewer than 7 answered |
| Backlog quality | 5+ items, prioritized, specific | 3-4 items, somewhat vague | Fewer than 3 items |
| Standup participation | Spoke clearly, listened to others | Participated minimally | Did not participate |

### Differentiation

**Advanced Learners:**
- Write a brief architectural analysis (one page) comparing Are-Self's project structure to a Django project they've worked on before. What patterns are shared? What's novel?

**Struggling Learners:**
- Pair with an advanced learner for the exploration phase
- Provide a simplified question set (questions 1-5 only) with hints about which directories to look in

---

## Materials for This Week

- Django 6.x documentation: [Project structure](https://docs.djangoproject.com/en/6.0/intro/tutorial01/)
- Are-Self repository (provided by instructor)
- Lab handout with setup instructions
- Exploration question sheet
- Personal backlog template (simple numbered list)

## Assignments

| Assignment | Due | Weight |
|------------|-----|--------|
| Lab: Clone and Explore | End of Week 1 | Part of Lab grade (Week 1) |
| Reading: `common` app mixins | Before Week 2 Day 1 | Preparation (not graded) |

## Exit Criteria for Week 1

A student has completed Week 1 when:

- They can explain the role of `settings.py`, `urls.py`, `wsgi.py`, and `manage.py`
- They can distinguish between a Django project and a Django app
- Are-Self runs on their local machine
- They have answered the exploration questions with code citations
- They have started a personal learning backlog

---

## Instructor Notes

### Common Issues

**Q: Students can't get PostgreSQL with pgvector running.**
A: Have a Docker Compose file ready as a fallback. One command should bring up PostgreSQL and Redis. Prepare this before the quarter starts.

**Q: Students want to jump ahead to writing code.**
A: Good instinct, wrong week. Channel the energy: "You'll be writing models in four days. Right now, learning to read a codebase is the skill that separates junior developers from senior ones."

**Q: The codebase is overwhelming.**
A: It's supposed to be. That's Humility. Nobody understands a production codebase on day one. The exploration exercise gives them a structured way to build understanding incrementally.

### Retrospective Prompts (for end of Iteration 1, shared with Week 2)

- What surprised you about production Django project structure?
- Where did the Are-Self codebase match your expectations? Where did it diverge?
- How effective were the Standups? What would make them better?

---

*Built by the Are-Self project. MIT licensed. Free to use, modify, and share.*
