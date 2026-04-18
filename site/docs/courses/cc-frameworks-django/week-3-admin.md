---
title: "Week 3 — Admin and Management Commands"
sidebar_position: 5
---

# Week 3: Admin and Management Commands

Students learn to build operational tooling — the Django admin for browser-based data management and custom management commands for scripted operations. The week opens with Iteration 1 Demos, then moves into the admin interface and command-line tooling that production Django teams rely on daily. The lab produces a management command that queries Are-Self's brain regions.

## Week Overview

**Theme:** Django admin customization and custom management commands

**Primary Variable:** Responsibility — Operational tooling is how you take care of a system after you ship it. The admin and management commands are your obligation to the people who run the software.

<!-- Definition of Ready — perspective -->

**Why This Week Matters:**
Every Django project needs an admin interface for data management and management commands for automation. The default admin is functional but crude. Production teams customize it heavily — list displays, filters, search, inline editing, read-only fields, custom actions. Management commands automate everything from data imports to health checks. Are-Self uses both extensively, and students will too.

<!-- Definition of Ready — assertions -->

**Learning Goals:**

- Register models with the Django admin and customize `list_display`, `list_filter`, `search_fields`, and `readonly_fields`
- Implement inline admin classes for related models
- Write custom admin actions (bulk operations)
- Build a Django management command with argument parsing and output formatting
- Explain the CNS `STATUS_MAP` and `StatusID` constants pattern

<!-- Definition of Ready — outside -->

**What This Week Is Not:**

- No views or URL routing — that's Week 4
- No REST API — that's Week 5
- No database schema changes this week — use the models from Week 2

---

## Iteration 1 Demo and Retrospective (Day 1 opening, 30 minutes)

### Demo (20 minutes)

Students demonstrate their Week 1-2 work:
- Local Are-Self environment running
- Custom model with all four mixins
- Instance creation in the shell
- Passing test

Three minutes per student. The class asks one question per demo. Instructor notes which Definitions of Done were met.

### Retrospective (10 minutes)

The cohort reflects on Iteration 1:
- **What worked well?** (Setup instructions, mixin pattern, pair work)
- **What didn't work?** (Environment issues, time pressure, unclear expectations)
- **What will we change for Iteration 2?** (Concrete actions, not wishes)

Record the actions. Revisit them at the Iteration 2 Retrospective.

---

## Day 1 (Lecture): The Django Admin

### Objective

Students will register models with the Django admin, customize the admin display, and implement inline editing and custom actions.

### Materials Needed

- Projector with Are-Self running, admin accessible
- Browser open to `http://localhost:8000/admin/`

### Lecture Content (45 minutes, after Demo/Retro)

#### Opening (5 minutes)

Navigate to the Are-Self admin. Log in. Show the model list. "This is the most underrated feature in Django. It's a complete CRUD interface for your entire database, generated from your models. Most frameworks don't give you this. Django gives it to you for free — and then lets you customize every pixel of it."

#### Part 1: Basic Registration (10 minutes)

```python
# admin.py
from django.contrib import admin
from .models import MyModel

@admin.register(MyModel)
class MyModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'created', 'modified', 'delta')
    list_filter = ('created',)
    search_fields = ('name',)
    readonly_fields = ('id', 'created', 'modified', 'delta')
```

Walk through each attribute. Show the result in the browser. Emphasize: `list_display` controls what columns appear in the list view, `list_filter` adds sidebar filters, `search_fields` enables the search bar, `readonly_fields` prevents editing of auto-managed fields.

#### Part 2: Inline Admin (15 minutes)

Show how Are-Self registers Neurons inline with Neural Pathways:

```python
class NeuronInline(admin.TabularInline):
    model = Neuron
    extra = 0
    readonly_fields = ('id',)

@admin.register(NeuralPathway)
class NeuralPathwayAdmin(admin.ModelAdmin):
    list_display = ('name', 'created', 'modified')
    inlines = [NeuronInline]
```

Navigate to a Neural Pathway in the admin. Show the inline Neurons. "You can see the entire DAG from one page. Parent model at the top, child models below. This is how operations teams inspect data without writing SQL."

#### Part 3: Custom Admin Actions (10 minutes)

```python
@admin.action(description="Mark selected as archived")
def archive_selected(modeladmin, request, queryset):
    queryset.update(status='archived')

@admin.register(MyModel)
class MyModelAdmin(admin.ModelAdmin):
    actions = [archive_selected]
```

Show how bulk actions appear as a dropdown above the list view. Demonstrate selecting multiple objects and applying the action.

#### Part 4: The StatusID Pattern (5 minutes)

Open the CNS app's constants. Show the `STATUS_MAP`, `IS_ALIVE_STATUS_LIST`, and `IS_TERMINAL_STATUS_LIST` patterns:

```python
class StatusID:
    PENDING = 'pending'
    RUNNING = 'running'
    SUCCESS = 'success'
    FAILURE = 'failure'
    CANCELLED = 'cancelled'

STATUS_MAP = {s: s for s in [StatusID.PENDING, StatusID.RUNNING, ...]}
IS_ALIVE_STATUS_LIST = [StatusID.PENDING, StatusID.RUNNING]
IS_TERMINAL_STATUS_LIST = [StatusID.SUCCESS, StatusID.FAILURE, StatusID.CANCELLED]
```

"Constants as a class, not an enum. Status lists as curated filters. This pattern appears throughout Are-Self and it's how production Django projects avoid magic strings scattered across the codebase."

### Assessment

- Can students register a model and customize list_display, list_filter, search_fields?
- Can students implement an inline admin class?
- Can students explain the StatusID constants pattern?

### Differentiation

**Advanced Learners:**
- Implement a custom admin view (override `changelist_view` or add a custom URL) that shows a dashboard of model counts across brain regions

**Struggling Learners:**
- Provide a completed `admin.py` for one Are-Self app as a reference; student mirrors it for their own model

---

## Day 2 (Lecture): Custom Management Commands

### Objective

Students will understand the Django management command framework, build commands with argument parsing and formatted output, and study how Are-Self uses management commands for operational automation.

### Materials Needed

- Projector with IDE and terminal
- Are-Self repository open to management command examples

### Lecture Content (75 minutes)

#### Opening (10 minutes)

"You've used `manage.py runserver`, `manage.py migrate`, `manage.py shell`. Those are all management commands. Django ships dozens of them. But the real power is building your own. Every production Django project has custom commands for data import, health checks, cleanup jobs, and reporting."

#### Part 1: Command Structure (20 minutes)

```python
# myapp/management/commands/greet.py
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Greet someone by name'

    def add_arguments(self, parser):
        parser.add_argument('name', type=str, help='Name to greet')
        parser.add_argument('--shout', action='store_true', help='UPPERCASE the greeting')

    def handle(self, *args, **options):
        name = options['name']
        greeting = f'Hello, {name}!'
        if options['shout']:
            greeting = greeting.upper()
        self.stdout.write(self.style.SUCCESS(greeting))
```

Walk through:
- File location matters: `app/management/commands/filename.py`
- The `Command` class must inherit from `BaseCommand`
- `add_arguments` uses Python's `argparse` — full argument parsing for free
- `handle` is the entry point
- `self.stdout.write` with `self.style.SUCCESS/ERROR/WARNING` for colored output

Demonstrate: `python manage.py greet Django --shout`

#### Part 2: Querying in Commands (20 minutes)

Build a command live that queries the database:

```python
# common/management/commands/list_brain_regions.py
from django.core.management.base import BaseCommand
from django.apps import apps

class Command(BaseCommand):
    help = 'List all brain region apps and their model counts'

    def add_arguments(self, parser):
        parser.add_argument(
            '--verbose', '-v',
            action='store_true',
            help='Show model names in addition to counts'
        )

    def handle(self, *args, **options):
        brain_apps = [
            'identity', 'hippocampus', 'frontal_lobe',
            'prefrontal_cortex', 'hypothalamus',
            'central_nervous_system', 'peripheral_nervous_system',
            'thalamus', 'temporal_lobe',
        ]

        for app_label in brain_apps:
            try:
                app_config = apps.get_app_config(app_label)
                model_count = len(app_config.get_models())
                self.stdout.write(
                    f'{app_label}: {model_count} models'
                )
                if options['verbose']:
                    for model in app_config.get_models():
                        count = model.objects.count()
                        self.stdout.write(f'  - {model.__name__}: {count} records')
            except LookupError:
                self.stderr.write(
                    self.style.ERROR(f'{app_label}: app not found')
                )
```

Show the output. Discuss: this is a health check — you run it after deployment to verify the system is intact.

#### Part 3: Are-Self's Management Commands (15 minutes)

Walk through existing management commands in the Are-Self codebase:
- What they do, how they're structured
- How they integrate with the model layer
- Patterns: error handling, verbose output, dry-run flags

Ask: "If you were on call at 2am and the system was misbehaving, which of these commands would you reach for first? Why?"

#### Part 4: When to Use a Command vs. a View (10 minutes)

Commands are for:
- One-off data operations (import, export, cleanup)
- Scheduled operations (cron jobs, Celery Beat — Week 8)
- Health checks and diagnostics
- Operations that don't need a browser

Views are for:
- User-facing interactions
- Data that needs to be displayed
- Operations triggered by HTTP requests

The dividing line: if a human needs a browser to trigger it, it's a view. If a script or scheduler triggers it, it's a command.

### Assessment

- Can students explain the management command file structure and naming convention?
- Can students build a command with arguments and database queries?
- Can students identify when a management command is more appropriate than a view?

### Differentiation

**Advanced Learners:**
- Study how Celery Beat invokes management commands on a schedule. Write pseudocode for a `periodic_tasks` configuration that runs a health check every 5 minutes.

**Struggling Learners:**
- Provide the command skeleton with `add_arguments` and the import block pre-written; student implements only the `handle` method

---

## Day 3 (Lab): Build a Management Command That Queries Brain Regions

### Objective

Students will build a custom management command that queries Are-Self's brain region apps, produces formatted output, and includes argument parsing, error handling, and colored output.

### Lab Duration

110 minutes

### Standup (10 minutes)

- What did you learn from the admin and management command lectures?
- What command are you going to build?
- What might block you?

### Pre-Planning (10 minutes)

Students write a Definition of Ready for their management command:

Choose one of the following (or propose your own):

1. **Brain Census** — A command that reports the total number of records in each brain region app, with optional filtering by date range and output in table or JSON format.
2. **Pathway Inspector** — A command that takes a Neural Pathway name as an argument and prints its structure: all Neurons, their connections (Axons), and whether each Neuron is a root node or invokes a sub-pathway.
3. **Memory Search** — A command that takes a search string and finds Engrams whose names or content match, displaying the provenance chain (session, turn, spike, disc) for each match.

### Build Phase (60 minutes)

Students implement their management command:

1. **Create the file** in the correct location: `app/management/commands/command_name.py`
2. **Add arguments** with `add_arguments` — at least one positional and one optional argument
3. **Implement `handle`** with database queries against Are-Self models
4. **Format output** using `self.style.SUCCESS`, `self.style.ERROR`, `self.style.WARNING`
5. **Handle errors** — what happens when a brain region doesn't exist? When there's no data?
6. **Add a `--dry-run` flag** that shows what the command would do without doing it (if applicable)
7. **Test the command** by running it against the local Are-Self database

Also: register their Week 2 model with the Django admin:
- `list_display` with at least 4 columns
- `list_filter` with at least 1 filter
- `search_fields` enabled
- `readonly_fields` for auto-managed fields (id, created, modified, delta)

### Peer Review (15 minutes)

Pair up. Run each other's management commands. Review the code:
- Is the argument parsing clear and well-documented (`help` strings)?
- Does the error handling cover edge cases?
- Is the output readable and useful?
- Does the admin registration use all four customization attributes?

### Wrap-Up (15 minutes)

Three volunteers demonstrate their commands on the projector. Run them with different arguments. Discuss: "Which of these commands would you actually want on a production system?"

### Exit Criteria

- Management command runs without errors
- At least one positional and one optional argument
- Output uses Django's style formatting
- Error handling for missing data or invalid arguments
- Week 2 model is registered in the admin with full customization

### Assessment

| Criterion | Meets Expectations | Approaching | Not Yet |
|---|---|---|---|
| Command structure | Correct file location, proper inheritance, `help` text | Minor structural issues | Wrong location or missing inheritance |
| Argument parsing | Positional + optional args with help strings | Arguments work but lack documentation | No argument parsing |
| Database queries | Queries Are-Self models correctly, handles empty results | Queries work but no error handling | Queries fail |
| Output formatting | Colored, readable, useful output | Output works but unformatted | No meaningful output |
| Admin registration | All four attributes customized | 2-3 attributes | Basic registration only |

### Differentiation

**Advanced Learners:**
- Add a `--format` flag that switches between table, JSON, and CSV output
- Implement a `--watch` flag that re-runs the query every N seconds (like `watch` on Linux)

**Struggling Learners:**
- Use the Brain Census option with a provided skeleton that includes the app list and loop structure
- Provide admin registration example to follow

---

## Materials for This Week

- Django documentation: [The Django admin site](https://docs.djangoproject.com/en/6.0/ref/contrib/admin/)
- Django documentation: [Writing custom management commands](https://docs.djangoproject.com/en/6.0/howto/custom-management-commands/)
- Are-Self source: `*/admin.py` files across brain region apps
- Are-Self source: `*/management/commands/` directories
- Are-Self source: `central_nervous_system/constants.py` (StatusID pattern)

## Assignments

| Assignment | Due | Weight |
|------------|-----|--------|
| Lab: Management command + admin registration | End of Week 3 | Part of Lab grade (Week 3) |
| Reading: Django views and URL routing | Before Week 4 Day 1 | Preparation (not graded) |

## Exit Criteria for Week 3

A student has completed Week 3 when:

- They can register models with customized admin displays
- They can build a management command with argument parsing and database queries
- They can explain the StatusID constants pattern
- Their Week 2 model has a complete admin registration
- They have a working management command that queries brain regions

---

## Instructor Notes

### Common Issues

**Q: Students can't find the management commands directory.**
A: The path must be exact: `appname/management/commands/`. Both `management/` and `commands/` need `__init__.py` files. Missing these is the most common mistake.

**Q: The admin looks bare — no data to display.**
A: Run a data seeding command or provide a fixture that populates basic data across brain regions. Having data in the admin makes customization meaningful.

**Q: Students conflate admin actions with management commands.**
A: Clear distinction: admin actions operate on a queryset selected in the browser. Management commands operate from the terminal. Both can do the same work, but the trigger mechanism and context differ.

---

*Built by the Are-Self project. MIT licensed. Free to use, modify, and share.*
