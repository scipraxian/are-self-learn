---
title: "Module 6: Testing"
sidebar_position: 6
---

# Module 6: Testing

## Learning Objectives

By the end of this module, you will be able to:

- Write unit tests using pytest and Django's TestCase
- Use assertions to verify expected behavior
- Write setup and teardown logic for test fixtures
- Test Django models, including field validation and methods
- Understand test-driven development (TDD) as a practice
- Write tests for Are-Self models and behaviors

## Why Test?

Every time you change code, you risk breaking something. Without tests, the only way to know if you broke something is to manually try every feature. With tests, you run a command and get an answer in seconds.

Tests are not optional in professional development. They are the safety net that lets you change code with confidence.

## Your First Test

```python
# test_basics.py
def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, 1) == 0

def test_add_floats():
    result = add(0.1, 0.2)
    assert abs(result - 0.3) < 0.0001  # Float comparison needs tolerance
```

Run with `pytest test_basics.py`. Pytest finds functions starting with `test_` and runs them. If an `assert` fails, the test fails.

## Assertions

The `assert` statement checks that a condition is true:

```python
assert result == expected          # Equality
assert result != unexpected        # Inequality
assert result > 0                  # Comparison
assert result is None              # Identity
assert result is not None          # Identity (negative)
assert item in collection          # Membership
assert isinstance(obj, ClassName)  # Type checking
```

Pytest provides detailed failure messages showing what went wrong:

```
assert 0.85 == 0.90
E       assert 0.85 == 0.9
```

## Testing Are-Self Models

### Testing the Engram Class

```python
# test_engram.py
import pytest
from datetime import datetime


class Engram:
    """Simplified Engram for testing purposes."""
    
    def __init__(self, name, relevance_score=0.0):
        if not name:
            raise ValueError("Engram name cannot be empty")
        if not 0.0 <= relevance_score <= 1.0:
            raise ValueError("Relevance score must be between 0.0 and 1.0")
        self.name = name
        self.relevance_score = relevance_score
        self.is_active = True
        self.tags = []
        self.created_at = datetime.now()
    
    def add_tag(self, tag):
        if tag and tag not in self.tags:
            self.tags.append(tag)
    
    def is_relevant(self, threshold=0.5):
        return self.is_active and self.relevance_score >= threshold
    
    def deactivate(self):
        self.is_active = False


class TestEngramCreation:
    """Tests for creating Engram instances."""
    
    def test_create_with_defaults(self):
        engram = Engram("Test memory")
        assert engram.name == "Test memory"
        assert engram.relevance_score == 0.0
        assert engram.is_active is True
        assert engram.tags == []
    
    def test_create_with_relevance(self):
        engram = Engram("Important", relevance_score=0.95)
        assert engram.relevance_score == 0.95
    
    def test_create_sets_timestamp(self):
        before = datetime.now()
        engram = Engram("Test")
        after = datetime.now()
        assert before <= engram.created_at <= after
    
    def test_empty_name_raises_error(self):
        with pytest.raises(ValueError, match="name cannot be empty"):
            Engram("")
    
    def test_invalid_relevance_too_high(self):
        with pytest.raises(ValueError, match="between 0.0 and 1.0"):
            Engram("Test", relevance_score=1.5)
    
    def test_invalid_relevance_negative(self):
        with pytest.raises(ValueError, match="between 0.0 and 1.0"):
            Engram("Test", relevance_score=-0.1)


class TestEngramTags:
    """Tests for Engram tag management."""
    
    def setup_method(self):
        """Runs before each test method."""
        self.engram = Engram("Test memory", relevance_score=0.8)
    
    def test_add_tag(self):
        self.engram.add_tag("reasoning")
        assert "reasoning" in self.engram.tags
    
    def test_add_duplicate_tag(self):
        self.engram.add_tag("reasoning")
        self.engram.add_tag("reasoning")
        assert self.engram.tags.count("reasoning") == 1
    
    def test_add_empty_tag(self):
        self.engram.add_tag("")
        assert len(self.engram.tags) == 0
    
    def test_multiple_tags(self):
        self.engram.add_tag("reasoning")
        self.engram.add_tag("planning")
        self.engram.add_tag("context")
        assert len(self.engram.tags) == 3


class TestEngramRelevance:
    """Tests for relevance checking."""
    
    def test_relevant_above_default_threshold(self):
        engram = Engram("Test", relevance_score=0.8)
        assert engram.is_relevant() is True
    
    def test_not_relevant_below_threshold(self):
        engram = Engram("Test", relevance_score=0.3)
        assert engram.is_relevant() is False
    
    def test_relevant_with_custom_threshold(self):
        engram = Engram("Test", relevance_score=0.85)
        assert engram.is_relevant(threshold=0.9) is False
        assert engram.is_relevant(threshold=0.8) is True
    
    def test_inactive_not_relevant(self):
        engram = Engram("Test", relevance_score=0.95)
        engram.deactivate()
        assert engram.is_relevant() is False
```

### Using `pytest.raises`

```python
def test_circuit_breaker_open():
    """Verify CircuitBreakerOpen is raised when circuit is open."""
    breaker = CircuitBreaker("test-model", failure_threshold=2)
    
    # Trip the breaker
    for _ in range(2):
        breaker.record_failure()
    
    with pytest.raises(CircuitBreakerOpen) as exc_info:
        breaker.execute(lambda: "test")
    
    assert "test-model" in str(exc_info.value)
```

## Django TestCase

For testing Django models with a real database, use `django.test.TestCase`:

```python
from django.test import TestCase
from are_self.hippocampus.models import Engram, Tag


class EngramModelTest(TestCase):
    """Tests for the Engram Django model."""
    
    def setUp(self):
        """Create test data before each test."""
        self.tag_reasoning = Tag.objects.create(name="reasoning")
        self.tag_planning = Tag.objects.create(name="planning")
        
        self.engram = Engram.objects.create(
            name="Test engram",
            description="A test memory",
            relevance_score=0.85,
            hash="abc123",
        )
        self.engram.tags.add(self.tag_reasoning)
    
    def test_engram_created(self):
        """Verify the engram was stored in the database."""
        self.assertEqual(Engram.objects.count(), 1)
    
    def test_engram_fields(self):
        """Verify field values are stored correctly."""
        engram = Engram.objects.get(name="Test engram")
        self.assertEqual(engram.description, "A test memory")
        self.assertAlmostEqual(engram.relevance_score, 0.85, places=2)
        self.assertTrue(engram.is_active)
    
    def test_engram_has_uuid(self):
        """Verify the UUIDIdMixin provides an ID."""
        self.assertIsNotNone(self.engram.id)
        self.assertEqual(len(str(self.engram.id)), 36)  # UUID format
    
    def test_engram_timestamps(self):
        """Verify CreatedAndModifiedWithDelta sets timestamps."""
        self.assertIsNotNone(self.engram.created_at)
        self.assertIsNotNone(self.engram.modified_at)
    
    def test_engram_tags(self):
        """Verify ManyToMany tag relationship works."""
        self.assertEqual(self.engram.tags.count(), 1)
        self.engram.tags.add(self.tag_planning)
        self.assertEqual(self.engram.tags.count(), 2)
    
    def test_engram_str(self):
        """Verify __str__ returns expected format."""
        result = str(self.engram)
        self.assertIn("Test engram", result)
    
    def test_unique_hash(self):
        """Verify hash uniqueness is enforced."""
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            Engram.objects.create(
                name="Duplicate",
                hash="abc123",  # Same hash as self.engram
            )
    
    def test_ordering(self):
        """Verify default ordering is by relevance descending."""
        Engram.objects.create(
            name="Low relevance",
            relevance_score=0.2,
            hash="def456",
        )
        engrams = list(Engram.objects.all())
        self.assertGreaterEqual(
            engrams[0].relevance_score,
            engrams[1].relevance_score
        )
```

## Fixtures With pytest

```python
import pytest

@pytest.fixture
def sample_engram():
    """Create a sample engram for testing."""
    return Engram("Sample memory", relevance_score=0.85)

@pytest.fixture
def engram_collection():
    """Create a collection of test engrams."""
    return [
        Engram("Memory A", relevance_score=0.95),
        Engram("Memory B", relevance_score=0.42),
        Engram("Memory C", relevance_score=0.88),
        Engram("Memory D", relevance_score=0.15),
    ]

def test_engram_is_relevant(sample_engram):
    assert sample_engram.is_relevant(threshold=0.8) is True

def test_filter_relevant(engram_collection):
    relevant = [e for e in engram_collection if e.is_relevant(threshold=0.5)]
    assert len(relevant) == 3
```

Fixtures are functions decorated with `@pytest.fixture`. They provide test data. When a test function has a parameter with the same name as a fixture, pytest automatically calls the fixture and passes its return value.

## Test-Driven Development

TDD reverses the usual order: write the test first, then write the code to make it pass.

1. Write a failing test that describes what you want
2. Write the minimum code to make the test pass
3. Refactor the code while keeping tests green

```python
# Step 1: Write the test (this fails because MemorySystem does not exist yet)
def test_memory_system_dedup():
    ms = MemorySystem(dedup_threshold=0.90)
    ms.store(Engram("User likes Python", relevance_score=0.8))
    
    # Storing a very similar memory should be rejected
    with pytest.raises(DuplicateEngram):
        ms.store(Engram("User likes Python programming", relevance_score=0.7))

# Step 2: Write MemorySystem with just enough logic to pass
# Step 3: Refactor for clarity and robustness
```

## Exercises

### Exercise 1: Circuit Breaker Tests

Write a comprehensive test suite for the CircuitBreaker class from Module 3:
- Test initial state
- Test recording successes and failures
- Test threshold triggering
- Test cooldown calculation
- Test state transitions (closed -> open -> half_open -> closed)

Aim for at least 10 test cases.

### Exercise 2: IdentityDisc Tests

Write tests for the IdentityDisc class:
- Phase advancement (including boundary: cannot advance past TERMINAL)
- XP awarding and level-up calculation
- Addon granting and checking
- String representation

### Exercise 3: TDD — Build a TagManager

Using TDD, build a `TagManager` class. Write the tests first:

```python
def test_create_tag():
    tm = TagManager()
    tag = tm.create("reasoning")
    assert tag.name == "reasoning"

def test_no_duplicate_tags():
    tm = TagManager()
    tm.create("reasoning")
    with pytest.raises(ValueError):
        tm.create("reasoning")

def test_find_tag():
    # ... write more tests
```

Then implement `TagManager` to make all tests pass.

### Exercise 4: Parametrized Tests

Use `@pytest.mark.parametrize` to test the cooldown calculation with many inputs:

```python
@pytest.mark.parametrize("failure_count,expected_cooldown", [
    (1, 60),
    (2, 120),
    (3, 240),
    (4, 300),
    (5, 300),
    (10, 300),
])
def test_cooldown_calculation(failure_count, expected_cooldown):
    breaker = CircuitBreaker("test", base_cooldown=60, max_cooldown=300)
    breaker.failure_count = failure_count
    assert breaker._calculate_cooldown() == expected_cooldown
```

### Exercise 5: Integration Test

Write a test that exercises multiple components together:
1. Create a NeuralPathway
2. Add Neurons to it
3. Connect them with Axons
4. Execute a SpikeTrain through the pathway
5. Verify the final state of all components

## Reflection

Testing connects to the Variable of **Responsibility**. When you write tests, you are taking responsibility not just for your code working today, but for it continuing to work tomorrow, next week, and next year. You are making a promise: this behavior is intentional and should be preserved.

Tests are also an exercise in **Humility**. They force you to admit that you will make mistakes. The test exists because you know — not fear, but know — that future changes might break things. Tests say: "I am fallible, so I built a system to catch my mistakes."

Every test you write is a contract with your future self and with every developer who will ever touch this code. Honor that contract.
