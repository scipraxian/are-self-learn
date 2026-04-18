---
title: "Week 5 — Django REST Framework"
sidebar_position: 7
---

# Week 5: Django REST Framework

Students graduate from hand-built views to DRF — the industry standard for Django APIs. They learn serializers, ViewSets, routers, filtering, and Are-Self's light/full serializer pattern. The week opens with Iteration 2 Demos. The lab produces a complete REST API for a model.

## Week Overview

**Theme:** Serializers, ViewSets, routers, and the light/full pattern

**Primary Variable:** Inclusion — An API serves many consumers. The light serializer includes the mobile developer who can't afford a 50KB payload. The full serializer includes the dashboard developer who needs every field. Good API design asks "who's excluded by this response?" and builds variants.

<!-- Definition of Ready — perspective -->

**Why This Week Matters:**
DRF is what makes Django the dominant framework for building APIs in Python. It replaces the manual serialization, method dispatching, and error handling students struggled with last week. But it's not magic — it's architecture. Students who understand the serializer-viewset-router pipeline can build, debug, and extend any DRF API. Are-Self's light/full pattern shows how production teams optimize that pipeline for different consumers.

<!-- Definition of Ready — assertions -->

**Learning Goals:**

- Define DRF serializers with field selection, validation, and nested relationships
- Implement light and full serializer variants for list vs. detail views
- Build ViewSets with standard CRUD operations and custom `@action` endpoints
- Configure routers for automatic URL generation
- Use `DjangoFilterBackend` for queryset filtering
- Explain the browsable API and how DRF content negotiation works

<!-- Definition of Ready — outside -->

**What This Week Is Not:**

- No authentication or permissions — that's Week 6
- No custom throttling or caching
- No API versioning (mentioned as a concept, not implemented)

---

## Iteration 2 Demo and Retrospective (Day 1 opening, 30 minutes)

### Demo (20 minutes)

Students demonstrate their Week 3-4 work:
- Admin interface with customized list display, filters, search
- Management command that queries brain regions
- Views returning JSON for list and detail endpoints
- URL routing with namespacing

Three minutes per student.

### Retrospective (10 minutes)

Reflect on Iteration 2:
- Did the Retrospective actions from Iteration 1 help?
- What's the biggest thing you learned in the last two weeks?
- What will you change for Iteration 3?

---

## Day 1 (Lecture): Serializers and the Light/Full Pattern

### Objective

Students will understand DRF serializers as the bridge between Django models and JSON, implement both light and full serializer variants, and explain why the pattern exists.

### Materials Needed

- Projector with IDE
- Are-Self repository open to serializer files
- DRF installed and configured in the project

### Lecture Content (45 minutes, after Demo/Retro)

#### Opening (5 minutes)

"Last week you wrote this by hand for every model:"

```python
data = [{'id': str(p.id), 'name': p.name} for p in pathways]
return JsonResponse({'pathways': data})
```

"This week you'll write this instead:"

```python
class PathwaySerializer(serializers.ModelSerializer):
    class Meta:
        model = NeuralPathway
        fields = ['id', 'name', 'created', 'modified']
```

"Same result. A fraction of the code. And it handles validation, nested relationships, and content negotiation automatically."

#### Part 1: ModelSerializer Basics (15 minutes)

```python
from rest_framework import serializers
from .models import NeuralPathway, Neuron

class NeuralPathwaySerializer(serializers.ModelSerializer):
    class Meta:
        model = NeuralPathway
        fields = ['id', 'name', 'created', 'modified', 'delta']
        read_only_fields = ['id', 'created', 'modified', 'delta']
```

Walk through:
- `fields` controls what's included in the JSON
- `read_only_fields` prevents modification via the API
- `ModelSerializer` introspects the model and generates field definitions automatically
- Validation is inherited from model field constraints

Show serialization and deserialization in the shell:

```python
serializer = NeuralPathwaySerializer(pathway)
serializer.data  # Python dict, ready for JSON
```

#### Part 2: The Light/Full Pattern (20 minutes)

This is the core Are-Self DRF pattern. Open the serializer files and show both variants:

```python
# Light — for list views. Minimal fields, no nested relationships.
class NeuralPathwayLightSerializer(serializers.ModelSerializer):
    neuron_count = serializers.IntegerField(source='neurons.count', read_only=True)

    class Meta:
        model = NeuralPathway
        fields = ['id', 'name', 'created', 'neuron_count']

# Full — for detail views. All fields, nested relationships included.
class NeuralPathwayFullSerializer(serializers.ModelSerializer):
    neurons = NeuronLightSerializer(many=True, read_only=True)
    axons = AxonSerializer(source='get_axons', many=True, read_only=True)

    class Meta:
        model = NeuralPathway
        fields = ['id', 'name', 'created', 'modified', 'delta',
                  'ui_json', 'neurons', 'axons']
```

Why two serializers?
- **Performance:** A list of 100 pathways with all neurons and axons nested is expensive. The light serializer returns just enough for a table row or card.
- **Bandwidth:** Mobile clients, paginated lists, autocomplete dropdowns — they all need less data.
- **Clarity:** The consumer knows what they're getting. Light for browsing, full for drilling down.

Show how the ViewSet switches between them:

```python
class NeuralPathwayViewSet(viewsets.ModelViewSet):
    queryset = NeuralPathway.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return NeuralPathwayLightSerializer
        return NeuralPathwayFullSerializer
```

#### Part 3: Nested Serializers and Validation (5 minutes, brief)

Show that serializers can nest. The full serializer includes `NeuronLightSerializer` for each neuron. Validation works through: if the nested serializer rejects data, the parent rejects the request.

Preview: custom validation methods (`validate_<field>` and `validate()`) for cross-field validation.

### Assessment

- Can students define a ModelSerializer with field selection?
- Can students explain when to use light vs. full serializers?
- Can students nest one serializer inside another?

---

## Day 2 (Lecture): ViewSets, Routers, and Filtering

### Objective

Students will implement DRF ViewSets with automatic CRUD, custom `@action` endpoints, routers for URL generation, and `DjangoFilterBackend` for queryset filtering.

### Materials Needed

- Projector with IDE and browser
- DRF browsable API accessible

### Lecture Content (75 minutes)

#### Opening (10 minutes)

"Yesterday you learned serializers — how to turn models into JSON and back. Today you learn ViewSets — the views that use those serializers. And routers — the URL configuration that you never have to write by hand again."

#### Part 1: ModelViewSet (20 minutes)

```python
from rest_framework import viewsets
from .models import NeuralPathway
from .serializers import NeuralPathwayLightSerializer, NeuralPathwayFullSerializer

class NeuralPathwayViewSet(viewsets.ModelViewSet):
    queryset = NeuralPathway.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return NeuralPathwayLightSerializer
        return NeuralPathwayFullSerializer
```

What `ModelViewSet` gives you for free:
- `list` — GET /pathways/ → returns all pathways (light serializer)
- `create` — POST /pathways/ → creates a new pathway
- `retrieve` — GET /pathways/{id}/ → returns one pathway (full serializer)
- `update` — PUT /pathways/{id}/ → replaces a pathway
- `partial_update` — PATCH /pathways/{id}/ → partially updates a pathway
- `destroy` — DELETE /pathways/{id}/ → deletes a pathway

Six endpoints. Zero URL configuration (that's the router's job). Automatic serialization, validation, and error responses.

Show the browsable API in the browser. Navigate to a list endpoint. Show the form for creating a new object. "DRF gives you a free, interactive API explorer. Use it for development. Disable it in production."

#### Part 2: Custom @action Endpoints (15 minutes)

```python
from rest_framework.decorators import action
from rest_framework.response import Response

class NeuralPathwayViewSet(viewsets.ModelViewSet):
    # ... standard CRUD ...

    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        """Create a SpikeTrain to execute this pathway."""
        pathway = self.get_object()
        spike_train = SpikeTrain.objects.create(
            pathway=pathway,
            cerebrospinal_fluid=request.data.get('context', {})
        )
        return Response({'spike_train_id': str(spike_train.id)}, status=201)

    @action(detail=True, methods=['get'])
    def neurons(self, request, pk=None):
        """List all neurons in this pathway."""
        pathway = self.get_object()
        neurons = pathway.neurons.all()
        serializer = NeuronLightSerializer(neurons, many=True)
        return Response(serializer.data)
```

- `detail=True` means the action operates on a single object: `/pathways/{id}/execute/`
- `detail=False` operates on the collection: `/pathways/bulk_archive/`
- Custom actions let you add domain-specific endpoints without leaving the ViewSet pattern

Show Are-Self's custom actions across the codebase. Ask: "What pattern do you see? What kinds of operations get custom actions vs. standard CRUD?"

#### Part 3: Routers (15 minutes)

```python
from rest_framework.routers import DefaultRouter
from .views import NeuralPathwayViewSet, NeuronViewSet

router = DefaultRouter()
router.register('pathways', NeuralPathwayViewSet)
router.register('neurons', NeuronViewSet)

urlpatterns = router.urls
```

The router generates all the URL patterns: list, detail, and custom actions. Show the generated URL list. Compare to Week 4 where students wrote every path by hand.

Include the router in the root URLs:

```python
urlpatterns = [
    path('api/cns/', include('cns.urls')),
]
```

#### Part 4: DjangoFilterBackend (15 minutes)

```python
from django_filters.rest_framework import DjangoFilterBackend

class NeuralPathwayViewSet(viewsets.ModelViewSet):
    queryset = NeuralPathway.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', 'created']
```

Now: `GET /api/cns/pathways/?name=reasoning_loop` returns only matching pathways.

Show Are-Self's filter configurations. Advanced filtering with FilterSet classes:

```python
class NeuralPathwayFilter(django_filters.FilterSet):
    created_after = django_filters.DateTimeFilter(field_name='created', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created', lookup_expr='lte')
    name_contains = django_filters.CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = NeuralPathway
        fields = ['name', 'created_after', 'created_before', 'name_contains']
```

### Assessment

- Can students implement a ModelViewSet with the light/full serializer switch?
- Can students add custom @action endpoints?
- Can students configure a router and DjangoFilterBackend?

### Differentiation

**Advanced Learners:**
- Implement search and ordering backends alongside filtering. Add SearchFilter and OrderingFilter.

**Struggling Learners:**
- Provide a complete ViewSet + Router example for one model as a reference

---

## Day 3 (Lab): Build a REST API for Your Model

### Objective

Students will build a complete DRF API for their Week 2 model using light/full serializers, a ViewSet with custom actions, a router, and filtering.

### Lab Duration

110 minutes

### Standup (10 minutes)

### Pre-Planning (10 minutes)

Definition of Ready for the API:
- What fields go in the light serializer? The full serializer?
- What custom actions make sense for your model?
- What filter fields will consumers need?
- How will you demo this at Iteration 3?

### Build Phase (60 minutes)

Students implement:

1. **Light serializer** — fields appropriate for list views
2. **Full serializer** — all fields plus nested relationships
3. **ModelViewSet** — with `get_serializer_class` switching light/full
4. **At least one custom `@action`** — a domain-specific operation
5. **Router configuration** — registered in the app's `urls.py`
6. **DjangoFilterBackend** — at least two filterable fields
7. **Tests** — at least three:
   - List endpoint returns 200 with correct serializer fields
   - Detail endpoint returns full serializer fields
   - Custom action works as expected

### API Exploration (15 minutes)

Students test their APIs using:
- The DRF browsable API in the browser
- `curl` or `httpie` from the terminal
- The DRF test framework:

```python
from rest_framework.test import APITestCase, APIClient

class PathwayAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.pathway = NeuralPathway.objects.create(name='Test')

    def test_list_uses_light_serializer(self):
        response = self.client.get('/api/cns/pathways/')
        self.assertEqual(response.status_code, 200)
        self.assertNotIn('ui_json', response.data[0])

    def test_detail_uses_full_serializer(self):
        response = self.client.get(f'/api/cns/pathways/{self.pathway.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('neurons', response.data)
```

### Wrap-Up (15 minutes)

Compare: "Show your Week 4 views next to your Week 5 ViewSet. How many lines of code did you save? What did you gain?" The answer is usually 60-80% less code with more features.

### Exit Criteria

- Light and full serializers both work correctly
- ViewSet with CRUD + at least one custom action
- Router generates all URL patterns
- Filtering works on at least two fields
- At least three API tests pass

### Assessment

| Criterion | Meets Expectations | Approaching | Not Yet |
|---|---|---|---|
| Serializers | Light + full with correct field selection | One serializer works | Serializers fail |
| ViewSet | CRUD + custom action, serializer switching | Standard CRUD only | ViewSet broken |
| Router | Registered and generating correct URLs | Router works with issues | No router |
| Filtering | 2+ fields filterable via DjangoFilterBackend | 1 field filterable | No filtering |
| Tests | 3+ passing API tests | 1-2 tests | No tests |

### Differentiation

**Advanced Learners:**
- Implement pagination with `PageNumberPagination` or `CursorPagination`
- Add a `@action` that returns aggregated statistics (counts, averages) for the model

**Struggling Learners:**
- Provide serializer skeletons with the Meta class pre-written; student adds field lists
- Use only the standard CRUD endpoints; custom action optional

---

## Materials for This Week

- DRF documentation: [Serializers](https://www.django-rest-framework.org/api-guide/serializers/)
- DRF documentation: [ViewSets](https://www.django-rest-framework.org/api-guide/viewsets/)
- DRF documentation: [Routers](https://www.django-rest-framework.org/api-guide/routers/)
- DRF documentation: [Filtering](https://www.django-rest-framework.org/api-guide/filtering/)
- Are-Self source: serializer files across brain region apps
- Are-Self source: ViewSet files with `get_serializer_class` patterns

## Assignments

| Assignment | Due | Weight |
|------------|-----|--------|
| Lab: REST API with light/full serializers | End of Week 5 | Part of Lab grade (Week 5) |
| Reading: Django authentication documentation | Before Week 6 Day 1 | Preparation (not graded) |

## Exit Criteria for Week 5

A student has completed Week 5 when:

- They can build serializers with field selection and nested relationships
- They can implement the light/full serializer pattern
- They can build ViewSets with CRUD and custom actions
- They can configure routers and filter backends
- They have a working, tested REST API

---

## Instructor Notes

### Common Issues

**Q: Students ask why not use `fields = '__all__'`.**
A: Explicit is better than implicit. `__all__` exposes every field, including ones you might add later without realizing they're now public. The light/full pattern forces you to think about what each consumer needs.

**Q: The browsable API is slow with large datasets.**
A: Add pagination. This is the natural motivation for the advanced learner extension. Without pagination, DRF serializes everything.

**Q: Custom actions feel arbitrary — students don't know what to build.**
A: Guide them toward domain verbs: execute, archive, clone, reset, summarize. If the operation is a noun, it's probably CRUD. If it's a verb, it's probably a custom action.

---

*Built by the Are-Self project. MIT licensed. Free to use, modify, and share.*
