---
title: "Module 7: Signals and Events"
sidebar_position: 7
---

# Module 7: Signals and Events

## Learning Objectives

By the end of this module, you will be able to:

- Explain event-driven architecture and why it matters
- Use Django's signal framework: `post_save`, `pre_save`, `m2m_changed`
- Write signal handlers that respond to model changes
- Understand Are-Self's neurotransmitter pattern and how it uses signals
- Connect signals to WebSocket dispatch through the Synaptic Cleft
- Recognize when to use signals vs direct method calls

## Event-Driven Thinking

In the code you have written so far, one function calls another directly:

```python
def save_engram(engram):
    database.save(engram)
    update_search_index(engram)  # Direct call
    notify_dashboard(engram)     # Direct call
    recalculate_stats()          # Direct call
```

This works, but it couples everything together. The `save_engram` function needs to know about search indexes, dashboards, and statistics. Add a new system that cares about engram saves, and you must modify `save_engram`.

Event-driven architecture inverts this. The save function announces what happened, and other systems listen:

```python
def save_engram(engram):
    database.save(engram)
    emit_event("engram_saved", engram)  # Announce, do not direct
```

Now any system can listen for `engram_saved` without the save function knowing about it. This is loose coupling — systems communicate without depending on each other's internals.

## Django Signals

Django has a built-in signal framework. When certain things happen to models, Django automatically sends signals that your code can listen for.

### Built-in Signals

| Signal | When It Fires |
|--------|---------------|
| `pre_save` | Before a model's `save()` method |
| `post_save` | After a model's `save()` method |
| `pre_delete` | Before a model's `delete()` method |
| `post_delete` | After a model's `delete()` method |
| `m2m_changed` | When a ManyToManyField is modified |

### Writing a Signal Handler

```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from are_self.hippocampus.models import Engram


@receiver(post_save, sender=Engram)
def on_engram_saved(sender, instance, created, **kwargs):
    """Handle engram save events."""
    if created:
        print(f"New engram created: {instance.name}")
    else:
        print(f"Engram updated: {instance.name}")
```

The `@receiver` decorator connects the function to the signal. Whenever an Engram is saved, Django calls this function with:
- `sender` — the model class (Engram)
- `instance` — the specific object that was saved
- `created` — `True` if this is a new object, `False` if it is an update
- `**kwargs` — additional keyword arguments (always accept these for forward compatibility)

### Connecting Signals in `apps.py`

Django needs to know to load your signal handlers. The standard pattern:

```python
# are_self/hippocampus/apps.py
from django.apps import AppConfig


class HippocampusConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "are_self.hippocampus"
    
    def ready(self):
        import are_self.hippocampus.signals  # noqa: F401
```

The `ready()` method runs when Django starts up. Importing the signals module triggers the `@receiver` decorators, connecting your handlers.

## ManyToMany Signal: `m2m_changed`

The `m2m_changed` signal is more complex because M2M changes involve two models and can happen in several ways:

```python
from django.db.models.signals import m2m_changed
from django.dispatch import receiver


@receiver(m2m_changed, sender=Engram.tags.through)
def on_engram_tags_changed(sender, instance, action, pk_set, **kwargs):
    """Handle changes to an engram's tags."""
    if action == "post_add":
        tag_names = Tag.objects.filter(pk__in=pk_set).values_list("name", flat=True)
        print(f"Tags added to '{instance.name}': {list(tag_names)}")
    
    elif action == "post_remove":
        print(f"Tags removed from '{instance.name}'")
    
    elif action == "post_clear":
        print(f"All tags cleared from '{instance.name}'")
```

The `action` parameter tells you what is happening:
- `"pre_add"` / `"post_add"` — tags are being added
- `"pre_remove"` / `"post_remove"` — tags are being removed
- `"pre_clear"` / `"post_clear"` — all tags are being cleared

`pk_set` contains the primary keys of the tags being added or removed.

## Are-Self Connection: The Neurotransmitter System

Are-Self models its inter-region communication on biological neurotransmitters. When something significant happens, a signal is fired:

- **Dopamine** — success signal. A task completed, a pathway finished, a model responded correctly.
- **Cortisol** — error signal. An API call failed, a circuit breaker tripped, an exception was raised.
- **Acetylcholine** — entity update signal. A model instance was created, modified, or deleted.

These are implemented using Django signals that dispatch messages through the Synaptic Cleft (WebSocket layer):

```python
# are_self/synaptic_cleft/neurotransmitters.py

from enum import Enum


class NeurotransmitterType(Enum):
    DOPAMINE = "dopamine"
    CORTISOL = "cortisol"
    ACETYLCHOLINE = "acetylcholine"


def fire_neurotransmitter(signal_type, source_region, target_region, 
                          message, payload=None):
    """Fire a neurotransmitter signal through the synaptic cleft.
    
    This dispatches a WebSocket message to connected clients and
    logs the signal for observability.
    """
    from channels.layers import get_channel_layer
    from asgiref.sync import async_to_sync
    
    channel_layer = get_channel_layer()
    
    signal_data = {
        "type": "neurotransmitter.signal",
        "neurotransmitter": signal_type.value,
        "source": source_region,
        "target": target_region,
        "message": message,
        "payload": payload or {},
    }
    
    async_to_sync(channel_layer.group_send)(
        f"region_{target_region}",
        signal_data,
    )
```

### Connecting Model Signals to Neurotransmitters

```python
# are_self/hippocampus/signals.py

from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from are_self.hippocampus.models import Engram
from are_self.synaptic_cleft.neurotransmitters import (
    fire_neurotransmitter, NeurotransmitterType
)


@receiver(post_save, sender=Engram)
def engram_saved_handler(sender, instance, created, **kwargs):
    """Fire acetylcholine when an engram is created or updated."""
    if created:
        fire_neurotransmitter(
            signal_type=NeurotransmitterType.ACETYLCHOLINE,
            source_region="hippocampus",
            target_region="central_nervous_system",
            message=f"New engram stored: {instance.name}",
            payload={"engram_id": str(instance.id), "action": "created"},
        )
    else:
        fire_neurotransmitter(
            signal_type=NeurotransmitterType.ACETYLCHOLINE,
            source_region="hippocampus",
            target_region="central_nervous_system",
            message=f"Engram updated: {instance.name}",
            payload={"engram_id": str(instance.id), "action": "updated"},
        )


@receiver(m2m_changed, sender=Engram.tags.through)
def engram_tags_changed_handler(sender, instance, action, **kwargs):
    """Update the engram's embedding vector when tags change."""
    if action in ("post_add", "post_remove", "post_clear"):
        # Trigger re-vectorization when tags change
        instance.update_embedding()
        instance.save(update_fields=["embedding", "modified_at"])
```

This is the M2M signal handler pattern Are-Self uses: when tags are added to or removed from an Engram, the system automatically regenerates the 768-dimensional embedding vector. This keeps semantic search current without manual intervention.

## Are-Self Connection: Auto-Updating Vectors

The `m2m_changed` signal is critical for Are-Self's vector search. When an Engram's tags change, its semantic meaning changes, so its embedding vector must be recalculated:

```python
@receiver(m2m_changed, sender=Engram.tags.through)
def auto_update_engram_vector(sender, instance, action, **kwargs):
    """Automatically regenerate embedding when tag relationships change."""
    if action not in ("post_add", "post_remove", "post_clear"):
        return  # Only act on completed changes
    
    # Build the text to embed from the engram's content
    tag_names = list(instance.tags.values_list("name", flat=True))
    text_to_embed = f"{instance.name} {instance.description} {' '.join(tag_names)}"
    
    # Generate new embedding (simplified — real version calls embedding API)
    new_embedding = generate_embedding(text_to_embed)
    instance.set_embedding(new_embedding)
    
    # Save without triggering post_save (to avoid infinite loops)
    Engram.objects.filter(pk=instance.pk).update(embedding=new_embedding)
```

Notice the final line uses `Engram.objects.filter().update()` instead of `instance.save()`. This is deliberate — calling `.save()` inside a signal handler would trigger `post_save`, which could trigger other signals, creating an infinite loop. The `.update()` call modifies the database directly without firing signals.

## When to Use Signals vs Direct Calls

Signals are powerful but can make code harder to follow. Use them when:

- **Multiple unrelated systems** need to respond to the same event
- **Loose coupling** is important — the sender should not know about the receivers
- **Cross-app communication** — one Django app needs to react to changes in another

Use direct calls when:

- **Only one system** needs to respond
- **The call is always required** — it is part of the core logic, not a side effect
- **You need the return value** — signals do not return values to the sender

## Exercises

### Exercise 1: Engram Lifecycle Signals

Write signal handlers for the full Engram lifecycle:
1. `pre_save` — validate the hash before saving
2. `post_save` — fire acetylcholine for new engrams, log updates for existing ones
3. `m2m_changed` on tags — update the embedding and fire a notification
4. `pre_delete` — log which engram is about to be deleted
5. `post_delete` — fire a cortisol signal if a high-relevance engram is deleted

### Exercise 2: Spike Train Signals

Write signal handlers for SpikeTrain and Spike:
- When a Spike's status changes to "completed", fire dopamine
- When a Spike's status changes to "failed", fire cortisol
- When all Spikes in a SpikeTrain are completed, fire dopamine for the whole train

### Exercise 3: Circuit Breaker Signals

Create a custom Django signal for circuit breaker state changes:

```python
from django.dispatch import Signal

circuit_breaker_state_changed = Signal()  # Provides: breaker, old_state, new_state
```

Write code that sends this signal when the breaker opens or closes, and a handler that logs state transitions.

### Exercise 4: Neurotransmitter Logger

Write a signal handler system that:
1. Intercepts all neurotransmitter signals
2. Logs them to a file with timestamp, type, source, target, and message
3. Maintains running counts by type
4. Fires an alert if cortisol signals exceed a threshold in a time window

### Exercise 5: Signal-Based Dashboard

Design (in pseudocode and implementation) a signal-based dashboard updater:
- Listen for saves on Engram, SpikeTrain, and IdentityDisc
- Maintain an in-memory statistics cache
- Update the cache when signals fire
- Provide a function to read the current stats

This is an example of the Observer pattern implemented with Django signals.

## Reflection

Signals embody the Variable of **Perception** in a system-level context. A signal says: "Something happened." A handler says: "I noticed, and here is what I will do about it." The system perceives its own changes and responds.

Are-Self's neurotransmitter system takes this further. Dopamine, cortisol, acetylcholine — these are not just technical signals. They are the system's emotional vocabulary. Success, failure, change. By naming signals after neurotransmitters, Are-Self makes its internal state legible. You can watch the signals and understand how the system feels about what is happening.

This is design with intention. The names matter. The metaphors matter. When you build systems, think about how they communicate — not just the data, but the meaning.
