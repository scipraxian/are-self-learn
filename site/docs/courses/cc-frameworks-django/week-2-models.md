---
title: "Week 2 — Models and Migrations"
sidebar_position: 4
---

# Week 2: Models and Migrations

Students learn to design Django models that go beyond the tutorial. By the end of the week, they understand fields, relationships, migrations, and the mixin patterns that make production code maintainable. The lab has them build a model using Are-Self's patterns — UUID primary keys, auto-timestamped fields, natural keys, and vector embeddings.

## Week Overview

**Theme:** Fields, relationships, and Are-Self's mixin patterns

**Primary Variable:** Inquiry — Every field on a model is an answer to a question someone asked. The better the question, the better the schema.

<!-- Definition of Ready — perspective -->

**Why This Week Matters:**
Models are the foundation of every Django application. A bad model is debt you pay on every query, every serializer, every migration for the life of the project. Are-Self's mixin patterns — `UUIDIdMixin`, `CreatedAndModifiedWithDelta`, `NameMixin`, `VectorMixin` — exist because someone asked "what do almost all of our models need?" and built the answer once.

<!-- Definition of Ready — assertions -->

**Learning Goals:**

- Define Django models with appropriate field types, constraints, and relationships
- Explain the migration system: `makemigrations`, `migrate`, migration files, and migration dependencies
- Implement Are-Self's mixin patterns: `UUIDIdMixin`, `CreatedAndModifiedWithDelta`, `NameMixin`, `VectorMixin`
- Use `ForeignKey`, `ManyToManyField`, and `OneToOneField` with appropriate `on_delete` behavior
- Write and apply custom model managers and `natural_key()` methods

<!-- Definition of Ready — outside -->

**What This Week Is Not:**

- No admin customization — that's Week 3
- No querysets beyond basic ORM usage in the shell
- No serializers — that's Week 5
- No discussion of vector search algorithms — the `VectorMixin` is used, not explained mathematically

---

## Day 1 (Lecture): Django Models and the ORM

### Objective

Students will define models with fields, constraints, and relationships, understand how Django's ORM maps Python classes to database tables, and trace a model through the migration system.

### Materials Needed

- Projector with IDE and terminal
- Whiteboard for ER diagrams
- Are-Self repository open to `common/models.py` and `hippocampus/models.py`

### Lecture Content (75 minutes)

#### Opening (10 minutes)

"Every web application is a database with a user interface. Django knows this. That's why models come first — before views, before templates, before APIs. If you get the models right, everything downstream gets easier. If you get them wrong, everything downstream fights you."

Show a simple model:

```python
from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

Ask: "What database table does this create? What columns? What types?" Walk through the mapping.

#### Part 1: Field Types (20 minutes)

Cover the field types students will encounter in Are-Self:

- `CharField`, `TextField` — Strings with and without length limits
- `IntegerField`, `FloatField`, `DecimalField` — Numbers with different precision
- `BooleanField` — True/False
- `DateTimeField` — Timestamps. `auto_now_add` vs `auto_now` vs neither.
- `UUIDField` — Universally unique identifiers
- `JSONField` — Structured data without a fixed schema (PostgreSQL native)
- `SlugField` — URL-safe strings

For each, show the database column type it creates and explain when to use it.

#### Part 2: Relationships (20 minutes)

- **ForeignKey** — Many-to-one. A Neuron belongs to one Neural Pathway. `on_delete` matters: `CASCADE`, `PROTECT`, `SET_NULL`. Show the Are-Self example: Neuron has FK to Effector.
- **ManyToManyField** — Many-to-many. Tags on an Engram. Django creates the join table automatically. Through models when you need extra data on the relationship.
- **OneToOneField** — One-to-one. Extension patterns. Less common but important.

Draw the ER diagram for the CNS app on the board: Neural Pathway has many Neurons, Neurons connect via Axons (directed edges with flow/success/failure types), Spike Trains execute Pathways and contain Spikes.

#### Part 3: The Migration System (20 minutes)

Demonstrate the full cycle:

```bash
python manage.py makemigrations    # Detect model changes, generate migration files
python manage.py migrate           # Apply migrations to the database
python manage.py showmigrations    # See what's applied and what's pending
python manage.py sqlmigrate app 0001  # See the SQL a migration will run
```

Open a generated migration file. Explain its structure: dependencies, operations, and why it's version-controlled. Show how Are-Self's migration files tell the history of schema evolution.

Key insight: migrations are code. They're reviewed, tested, and deployed like any other code. Treating them as throwaway generated files is a production mistake.

#### Wrap-Up (5 minutes)

"Tomorrow we look at what happens when you notice that every model in your project needs a UUID primary key, a created timestamp, and a modified timestamp. You could copy-paste those three fields into every model. Or you could do what Are-Self does."

### Assessment

- Can students define a model with appropriate field types?
- Can students explain the migration workflow?
- Can students draw an ER diagram for a set of related models?

### Differentiation

**Advanced Learners:**
- Examine the migration dependency graph for the Are-Self CNS app. How do migrations reference each other across apps?

**Struggling Learners:**
- Provide a field-type reference card mapping common data needs to Django field types

---

## Day 2 (Lecture): Are-Self's Mixin Patterns

### Objective

Students will understand Python's multiple inheritance as applied to Django model mixins, implement Are-Self's four core mixins, and explain why composition through mixins is preferred over deep inheritance hierarchies.

### Materials Needed

- Projector with IDE open to Are-Self's `common` app
- Whiteboard for inheritance diagrams

### Lecture Content (75 minutes)

#### Opening (10 minutes)

Open `hippocampus/models.py`. Find the Engram model. Read its class definition line:

```python
class Engram(UUIDIdMixin, CreatedAndModifiedWithDelta, NameMixin, VectorMixin, models.Model):
```

Ask: "What does this model get for free before you write a single field?" Walk through what each mixin contributes. This is the payoff — a model that inherits UUID PKs, timestamps with delta computation, a unique name with natural key support, and a 768-dimensional vector field, all without writing any of it.

#### Part 1: UUIDIdMixin (15 minutes)

```python
class UUIDIdMixin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True
```

Why UUIDs instead of auto-incrementing integers?
- No information leakage (can't guess the next ID)
- Safe for distributed systems (no central sequence)
- Merge-friendly across databases
- The tradeoff: larger, slower to index, not human-readable

Explain `abstract = True` — the mixin doesn't create its own table.

#### Part 2: CreatedAndModifiedWithDelta (20 minutes)

```python
class CreatedAndModifiedWithDelta(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    delta = models.DurationField(null=True, blank=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if self.pk and self.created:
            self.delta = timezone.now() - self.created
        super().save(*args, **kwargs)
```

Walk through the logic:
- `created` is set once, on first save
- `modified` is updated on every save
- `delta` is the duration between creation and the current save — useful for tracking how long something has been alive

Ask: "Why compute delta on every save instead of computing it in a query?" Discuss: denormalization for performance, the cost of `now() - created` across millions of rows, and the value of having the answer pre-computed.

#### Part 3: NameMixin (10 minutes)

```python
class NameMixin(models.Model):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        abstract = True

    def natural_key(self):
        return (self.name,)

    def __str__(self):
        return self.name
```

Explain natural keys: they let you serialize and deserialize objects by name instead of by primary key. This matters for fixtures, data transfer, and human-readable references.

#### Part 4: VectorMixin (15 minutes)

```python
class VectorMixin(models.Model):
    embedding = VectorField(dimensions=768, null=True, blank=True)

    class Meta:
        abstract = True
```

This uses pgvector — a PostgreSQL extension for vector similarity search. The 768 dimensions match standard embedding model output. Don't explain the math; explain the utility: "If you can turn text into a list of 768 numbers, you can find similar texts by comparing those lists. That's what the Hippocampus does to find relevant memories."

Show how Are-Self's M2M signal handlers auto-update vectors when tags change. Preview — we'll build signal handlers in Week 7.

#### Wrap-Up (5 minutes)

"Four mixins. Fewer than 30 lines of code total. And every model in the system gets UUID primary keys, automatic timestamps, human-readable names, and vector search capability. That's the power of composition."

### Assessment

- Can students explain what each of the four core mixins provides?
- Can students articulate why abstract model mixins are preferred over copy-pasting fields?
- Can students trace the MRO (Method Resolution Order) for a model using multiple mixins?

### Differentiation

**Advanced Learners:**
- Write a fifth mixin: `SlugMixin` that auto-generates a URL-safe slug from the name field on save. Handle the case where the name changes.

**Struggling Learners:**
- Provide a visual "mixin ingredient list" showing what each mixin adds to the final model, like a recipe card

---

## Day 3 (Lab): Create a Model Using Are-Self's Patterns

### Objective

Students will design and implement a new Django model that uses all four Are-Self mixins, create and apply migrations, verify the model in the Django shell, and write a basic test.

### Lab Duration

110 minutes

### Standup (10 minutes)

Go around the room:
- What did you learn from the lectures this week?
- What are you about to build?
- What might block you?

### Pre-Planning (10 minutes)

Before writing code, students write a Definition of Ready for their model:

- **Perspective:** What does this model represent and why does it matter?
- **Assertions:** What fields will it have? What relationships? What will a test verify?
- **Outside:** What is this model NOT responsible for?
- **Dependencies:** What mixins will it use? What existing models does it relate to?
- **Demo Specifics:** How will you demonstrate this at the Iteration 1 Demo (end of Week 2)?

Students choose one of the following model scenarios (or propose their own with instructor approval):

1. **Reflex** — An automatic response triggered by a stimulus. FK to a brain region, stores the stimulus pattern and response action, uses VectorMixin to enable similarity matching on stimuli.
2. **Dreamscape** — A record of an AI reasoning session's "dream state" — compressed context from completed spike trains. FK to SpikeTrain, stores the compressed narrative and emotional valence.
3. **Synapse** — A weighted connection between two Engrams, representing associative memory. Two FKs to Engram, a strength float field, and vector embedding of the combined memory content.

### Build Phase (60 minutes)

Students implement their model:

1. **Define the model** in an appropriate app's `models.py` (or create a new app)
2. **Use all four mixins:** `UUIDIdMixin`, `CreatedAndModifiedWithDelta`, `NameMixin`, `VectorMixin`
3. **Add custom fields** appropriate to their chosen scenario
4. **Add at least one relationship** (FK or M2M)
5. **Run `makemigrations`** and inspect the generated migration file
6. **Run `migrate`** and verify the table exists
7. **Use the Django shell** to create, save, and query instances
8. **Write one test** that creates an instance and verifies the mixin behavior (UUID PK exists, created timestamp is set, delta computes correctly)

Circulate. Common mistakes to watch for:
- Forgetting `abstract = True` if they create their own mixin
- Wrong `on_delete` behavior on ForeignKeys
- Not importing mixins from the correct module
- Migration conflicts with existing Are-Self migrations

### Peer Review (15 minutes)

Students pair up and review each other's code:
- Does the model use all four mixins correctly?
- Are the field types appropriate?
- Does the migration look clean?
- Does the test actually test mixin behavior?

This is the first peer review of the course. Explain the norm: reviews are about the code, not the coder. "This field might work better as a TextField" is good. "Why did you use a CharField?" is not.

### Wrap-Up (15 minutes)

Three volunteers show their models on the projector. Class discusses design choices. End with: "This is the model you'll build views for in Week 4 and an API for in Week 5. Make sure you're proud of it."

### Exit Criteria

- Model is defined with all four mixins
- Migration is created and applied without errors
- At least one instance can be created and queried in the shell
- One test passes
- Peer review is completed

### Assessment

| Criterion | Meets Expectations | Approaching | Not Yet |
|---|---|---|---|
| Mixin usage | All four mixins applied correctly | 3 of 4 mixins applied | Fewer than 3 |
| Field design | Appropriate types, constraints, and relationships | Minor type issues | Significant design problems |
| Migration | Clean migration, applied successfully | Migration works but has warnings | Migration fails |
| Test | Tests mixin behavior specifically | Test exists but tests trivially | No test |
| Peer review | Gave and received substantive feedback | Participated minimally | Did not participate |

### Differentiation

**Advanced Learners:**
- Add a custom model manager with a domain-specific queryset method (e.g., `ReflexManager` with `.triggered_today()`)
- Implement `natural_key()` with a composite key (two fields) and the corresponding `get_by_natural_key` manager method

**Struggling Learners:**
- Provide a starter file with the mixin imports and class declaration pre-written; student adds only the custom fields and relationship
- Pair with an advanced learner during the build phase

---

## Iteration 1 Demo Preparation

This is the end of Iteration 1 (Weeks 1-2). Students should prepare to demonstrate at the start of Week 3:

- **What to show:** Their local Are-Self environment running, their custom model with instances in the database, their test passing
- **Time:** 3 minutes per student
- **Format:** Screen share or projector. Show the model code, create an instance in the shell, run the test.

## Materials for This Week

- Django documentation: [Models](https://docs.djangoproject.com/en/6.0/topics/db/models/)
- Django documentation: [Migrations](https://docs.djangoproject.com/en/6.0/topics/migrations/)
- Are-Self source: `common/models.py` (mixin definitions)
- Are-Self source: `hippocampus/models.py` (Engram as mixin usage example)
- Are-Self source: `central_nervous_system/models.py` (relationship examples)

## Assignments

| Assignment | Due | Weight |
|------------|-----|--------|
| Lab: Model with mixins | End of Week 2 | Part of Lab grade (Week 2) |
| Iteration 1 Demo prep | Week 3 Day 1 | Part of Demo grade |
| Reading: Django admin documentation | Before Week 3 Day 1 | Preparation (not graded) |

## Exit Criteria for Week 2

A student has completed Week 2 when:

- They can define models with appropriate fields and relationships
- They can explain and apply the four Are-Self mixins
- They have a working model with migrations applied
- They can create and query instances in the Django shell
- They have a passing test for mixin behavior

---

## Instructor Notes

### Common Issues

**Q: Students want to modify Are-Self's existing models.**
A: Redirect them. They're adding to the system, not modifying it. Changing existing models creates migration conflicts that will waste lab time. Their models should relate to existing ones via ForeignKey, not alter them.

**Q: The MRO confuses students.**
A: Keep it simple: "Python reads left to right. The first mixin's method wins if there's a conflict. In practice, our mixins don't conflict because each one adds different fields."

**Q: pgvector isn't installed and VectorMixin fails.**
A: Have a fallback: students can define the field as `models.JSONField(null=True, blank=True)` temporarily. It won't support similarity search, but the mixin pattern still works. Fix pgvector before Week 5.

---

*Built by the Are-Self project. MIT licensed. Free to use, modify, and share.*
