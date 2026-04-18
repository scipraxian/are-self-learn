---
title: "Week 4 — Views and URLs"
sidebar_position: 6
---

# Week 4: Views and URLs

Students learn to handle HTTP requests and route URLs — the core of any web framework. They'll build function-based views, graduate to class-based views, and study how Are-Self organizes its URL routing across thirteen apps. The lab produces views for a brain region.

## Week Overview

**Theme:** Function-based views, class-based views, URL routing, and Are-Self's API structure

**Primary Variable:** Perception — Every view is a lens. The same data looks different depending on which view serves it, which URL routes to it, and which user requests it. Perception shapes what people see, and views shape what users receive.

<!-- Definition of Ready — perspective -->

**Why This Week Matters:**
Views are where Django meets HTTP. Every request comes in through a URL, hits a view, and returns a response. Students who understand views — both function-based and class-based — can build anything from a simple health check endpoint to a complex multi-step workflow. Are-Self's URL structure demonstrates how a large project keeps thirteen apps' worth of endpoints organized and navigable.

<!-- Definition of Ready — assertions -->

**Learning Goals:**

- Write function-based views that handle GET and POST requests with proper status codes
- Implement class-based views using Django's generic views (ListView, DetailView, CreateView)
- Configure URL routing with `path()`, `include()`, named URLs, and URL namespaces
- Explain Are-Self's URL organization across brain region apps
- Return JSON responses from views as a bridge to DRF in Week 5

<!-- Definition of Ready — outside -->

**What This Week Is Not:**

- No DRF serializers or ViewSets — that's Week 5
- No templates or HTML rendering (this course focuses on API development)
- No authentication — that's Week 6

---

## Day 1 (Lecture): Function-Based and Class-Based Views

### Objective

Students will understand the view as the bridge between URL and response, implement views in both function-based and class-based styles, and explain when each style is appropriate.

### Materials Needed

- Projector with IDE and terminal
- Are-Self running locally with browser access
- Whiteboard for request-response diagrams

### Lecture Content (75 minutes)

#### Opening (10 minutes)

Revisit the request-response cycle from Week 1, but now focus on the view:

```
Request → URL dispatcher → VIEW → Response
                            ↕
                          Model (DB)
```

"The view is where your code lives. Everything else is framework machinery. The URL dispatcher finds the right view. The view talks to models, makes decisions, and builds a response. That's it."

#### Part 1: Function-Based Views (25 minutes)

Start simple:

```python
from django.http import JsonResponse
from .models import NeuralPathway

def pathway_list(request):
    if request.method == 'GET':
        pathways = NeuralPathway.objects.all()
        data = [{'id': str(p.id), 'name': p.name} for p in pathways]
        return JsonResponse({'pathways': data})
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def pathway_detail(request, pk):
    try:
        pathway = NeuralPathway.objects.get(pk=pk)
    except NeuralPathway.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)
    data = {
        'id': str(pathway.id),
        'name': pathway.name,
        'created': pathway.created.isoformat(),
    }
    return JsonResponse(data)
```

Walk through:
- `request` object: method, body, headers, user
- `JsonResponse` vs `HttpResponse` — when each is appropriate
- Status codes: 200, 201, 400, 404, 405, 500
- Error handling: try/except for DoesNotExist

Ask: "What's tedious about this?" They'll notice: manual serialization, manual method checking, repetitive error handling. Good. That's the motivation for class-based views and eventually DRF.

#### Part 2: Class-Based Views (25 minutes)

```python
from django.views import View
from django.http import JsonResponse
from .models import NeuralPathway

class PathwayListView(View):
    def get(self, request):
        pathways = NeuralPathway.objects.all()
        data = [{'id': str(p.id), 'name': p.name} for p in pathways]
        return JsonResponse({'pathways': data})

class PathwayDetailView(View):
    def get(self, request, pk):
        try:
            pathway = NeuralPathway.objects.get(pk=pk)
        except NeuralPathway.DoesNotExist:
            return JsonResponse({'error': 'Not found'}, status=404)
        return JsonResponse({
            'id': str(pathway.id),
            'name': pathway.name,
            'created': pathway.created.isoformat(),
        })
```

Then show Django's generic views:

```python
from django.views.generic import ListView, DetailView

class PathwayListView(ListView):
    model = NeuralPathway
    # Django handles the queryset, pagination, and response
```

Compare all three approaches:
- FBVs: explicit, easy to read, good for one-off endpoints
- Base CBVs: organized by HTTP method, good for endpoints with multiple methods
- Generic CBVs: maximum reuse, minimum code, but you need to know what they do behind the scenes

#### Part 3: URL Routing (15 minutes)

```python
# urls.py
from django.urls import path, include
from . import views

app_name = 'cns'

urlpatterns = [
    path('pathways/', views.PathwayListView.as_view(), name='pathway-list'),
    path('pathways/<uuid:pk>/', views.PathwayDetailView.as_view(), name='pathway-detail'),
]
```

Cover:
- `path()` with converters: `<int:pk>`, `<uuid:pk>`, `<str:slug>`
- `include()` for app-level URL modules
- `app_name` for namespacing: `reverse('cns:pathway-list')`
- Named URLs and `reverse()` — never hardcode URLs

Show Are-Self's root `urls.py` and how it includes each brain region app's URLs. "Thirteen apps, each with its own URL module, all composed into one URL tree. That's how you keep a large project navigable."

### Assessment

- Can students write a function-based view that returns JSON?
- Can students explain the difference between FBV and CBV approaches?
- Can students configure URL routing with path converters and includes?

### Differentiation

**Advanced Learners:**
- Read Django's source for `ListView`. Trace the method resolution from `get()` to the final response. Document the chain.

**Struggling Learners:**
- Provide a side-by-side comparison sheet: FBV on the left, equivalent CBV on the right, with annotations

---

## Day 2 (Lecture): Are-Self's API Structure and View Patterns

### Objective

Students will study how Are-Self organizes views across thirteen apps, understand the DAG-based workflow models as viewed through URL endpoints, and prepare for DRF by identifying what views do that serializers will automate.

### Materials Needed

- Projector with Are-Self codebase
- Browser open to Are-Self's API (if browsable)
- Whiteboard for URL tree diagram

### Lecture Content (75 minutes)

#### Opening (10 minutes)

"Yesterday you built views from scratch. Today we look at what a production codebase actually does. Are-Self doesn't use raw Django views for its API — it uses DRF, which we'll cover next week. But the URL structure and the patterns underneath are pure Django."

#### Part 1: The URL Tree (20 minutes)

Diagram the full Are-Self URL structure on the board:

```
/api/
    /identity/
        /discs/
        /addons/
    /hippocampus/
        /engrams/
    /cns/
        /pathways/
        /neurons/
        /axons/
        /spike-trains/
        /spikes/
    /hypothalamus/
        /models/
        /circuit-breakers/
    /pns/
        /workers/
    /thalamus/
        /chats/
    /temporal/
        /iterations/
    /synaptic-cleft/
        /events/
```

Ask: "How does this URL tree mirror the brain region architecture?" The URL structure isn't arbitrary — it's the API expression of the same nine-app architecture students explored in Week 1.

#### Part 2: The Neural Pathway DAG as a View Target (25 minutes)

Deep dive into the CNS models as they'd be exposed through views:

- **Neural Pathway** — A DAG workflow template. Has `ui_json` for visual layout data. A list view shows all pathways. A detail view shows one pathway with its neurons and axons.
- **Neuron** — A node in the DAG. FK to Effector (what it runs), `is_root` flag (entry point), `invoked_pathway` FK (sub-graph calls). Viewed inline with its pathway or independently.
- **Axon** — A directed edge. Source neuron, target neuron, edge type (flow/success/failure). Three types means conditional execution — success goes one way, failure goes another.
- **Spike Train** — An execution instance of a pathway. Has `cerebrospinal_fluid` (shared context JSON). The running instance vs. the template.
- **Spike** — A single node execution within a spike train. Carries `axoplasm` (per-spike context JSON).

Build a view that returns a pathway's full structure:

```python
def pathway_full(request, pk):
    pathway = get_object_or_404(NeuralPathway, pk=pk)
    neurons = pathway.neurons.all()
    axons = Axon.objects.filter(source__pathway=pathway)
    return JsonResponse({
        'pathway': {
            'id': str(pathway.id),
            'name': pathway.name,
            'ui_json': pathway.ui_json,
            'neurons': [{
                'id': str(n.id),
                'name': n.name,
                'is_root': n.is_root,
                'invoked_pathway': str(n.invoked_pathway_id) if n.invoked_pathway else None,
            } for n in neurons],
            'axons': [{
                'source': str(a.source_id),
                'target': str(a.target_id),
                'edge_type': a.edge_type,
            } for a in axons],
        }
    })
```

Ask: "What's painful about this?" Manual serialization for every nested relationship. This is the exact problem DRF solves. Let the pain land — it makes Week 5's payoff real.

#### Part 3: Light vs. Full — The Preview (20 minutes)

Introduce the concept that will dominate Week 5:

"Are-Self doesn't serve the same data for every request. A list view of 100 pathways doesn't need every neuron and axon — that would be enormous. So Are-Self has two serializer variants: light (for lists) and full (for detail views)."

Show the pattern conceptually:

```python
# Light — just enough for a list
{'id': '...', 'name': 'My Pathway', 'neuron_count': 5}

# Full — everything for a detail view
{'id': '...', 'name': 'My Pathway', 'neurons': [...], 'axons': [...], 'ui_json': {...}}
```

"You'll build both next week. Today, notice the problem. Next week, you'll have the tool to solve it."

### Assessment

- Can students trace a URL through Are-Self's routing to its endpoint?
- Can students describe the Neural Pathway DAG structure through its view representation?
- Can students articulate why manual serialization in views motivates DRF?

### Differentiation

**Advanced Learners:**
- Map the full CNS URL structure including custom action endpoints. Propose additional endpoints that would be useful.

**Struggling Learners:**
- Provide a printed URL tree map with annotations explaining each level of nesting

---

## Day 3 (Lab): Build Views for a Brain Region

### Objective

Students will implement views and URL routing for their Week 2 model and for at least one existing Are-Self brain region model, producing list and detail endpoints that return JSON.

### Lab Duration

110 minutes

### Standup (10 minutes)

- What did you learn about views and URL routing?
- What will you build today?
- What might block you?

### Pre-Planning (10 minutes)

Students write a Definition of Ready for their views:

- Which models will they expose?
- What fields appear in the list view vs. the detail view?
- What URL patterns will they use?
- How will they handle errors (not found, invalid PK)?

### Build Phase (60 minutes)

Students implement:

1. **List view** for their Week 2 model — returns JSON array of all instances
2. **Detail view** for their Week 2 model — returns JSON object for one instance by UUID
3. **List view** for one Are-Self brain region model (student's choice)
4. **URL configuration** — `urls.py` in their app with `app_name` namespace
5. **Root URL integration** — include their app's URLs in the root `urls.py`
6. **Error handling** — 404 for missing objects, 405 for wrong methods

Stretch goal: implement a "full" detail view that includes related objects (e.g., if their model has FKs, include the related data nested in the response).

### Testing Phase (15 minutes)

Students test their views using:
- The browser (for GET requests)
- `curl` from the terminal
- The Django test client (write at least one test):

```python
from django.test import TestCase, Client

class PathwayViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.pathway = NeuralPathway.objects.create(name='Test Pathway')

    def test_list_returns_200(self):
        response = self.client.get('/api/cns/pathways/')
        self.assertEqual(response.status_code, 200)

    def test_detail_returns_pathway(self):
        response = self.client.get(f'/api/cns/pathways/{self.pathway.id}/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['name'], 'Test Pathway')
```

### Wrap-Up (15 minutes)

Volunteers demonstrate their endpoints. Class discussion: "What was the most tedious part of building these views?" Collect the answers — they're the motivation for Week 5.

### Exit Criteria

- At least two views (list + detail) return valid JSON
- URLs are configured with namespacing
- Error handling returns appropriate status codes
- At least one view test passes

### Assessment

| Criterion | Meets Expectations | Approaching | Not Yet |
|---|---|---|---|
| View implementation | List + detail views for 2+ models | Views work for 1 model | Views don't return valid JSON |
| URL routing | Namespaced, includes, path converters | URLs work but unnamespaced | Routing broken |
| Error handling | 404 and 405 handled correctly | Partial error handling | No error handling |
| Testing | At least 1 test per view | Tests exist but incomplete | No tests |

### Differentiation

**Advanced Learners:**
- Implement pagination in the list view (return 10 items per page with next/previous links)
- Add query parameter filtering (e.g., `?created_after=2026-01-01`)

**Struggling Learners:**
- Provide a complete FBV example for one model; student replicates it for their model

---

## Materials for This Week

- Django documentation: [Writing views](https://docs.djangoproject.com/en/6.0/topics/http/views/)
- Django documentation: [URL dispatcher](https://docs.djangoproject.com/en/6.0/topics/http/urls/)
- Django documentation: [Class-based views](https://docs.djangoproject.com/en/6.0/topics/class-based-views/)
- Are-Self source: `*/urls.py` files across all apps
- Are-Self source: root `urls.py`

## Assignments

| Assignment | Due | Weight |
|------------|-----|--------|
| Lab: Views for a brain region | End of Week 4 | Part of Lab grade (Week 4) |
| Iteration 2 Demo prep | Week 5 Day 1 | Part of Demo grade |
| Reading: DRF quickstart guide | Before Week 5 Day 1 | Preparation (not graded) |

## Exit Criteria for Week 4

A student has completed Week 4 when:

- They can write both function-based and class-based views
- They can configure URL routing with namespacing and includes
- They have working list and detail views returning JSON
- They can explain Are-Self's URL tree organization
- They have at least one passing view test

---

## Instructor Notes

### Common Issues

**Q: Students ask "Why not just use DRF from the start?"**
A: Because DRF automates what you're doing by hand this week. If you don't know what it automates, you can't debug it when it breaks. Next week you'll see the same endpoints built in a tenth of the code — but you'll understand every line.

**Q: UUID path converters cause confusion.**
A: Show the explicit converter: `<uuid:pk>`. Explain that Django validates the format before the view is called. If a non-UUID is in the URL, Django returns 404 automatically.

**Q: Students want to render HTML templates.**
A: This course focuses on API development. If they want to explore templates, point them to the Django tutorial, but keep the lab focused on JSON responses that lead to DRF.

---

*Built by the Are-Self project. MIT licensed. Free to use, modify, and share.*
