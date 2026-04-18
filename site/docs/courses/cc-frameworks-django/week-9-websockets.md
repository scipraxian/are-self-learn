---
title: "Week 9 — WebSockets and Real-Time"
sidebar_position: 11
---

# Week 9: WebSockets and Real-Time

Students learn to push data to clients in real time using Django Channels and WebSocket consumers. They study Are-Self's synaptic cleft pattern — where neurotransmitter signals (Dopamine, Cortisol, Acetylcholine, Glutamate, Norepinephrine) are broadcast to connected clients through WebSocket channels. The week opens with Iteration 4 Demos. The lab builds real-time status updates.

## Week Overview

**Theme:** Django Channels, WebSocket consumers, and Are-Self's synaptic cleft pattern

**Primary Variable:** Fulfillment — Real-time systems reward users with immediate feedback. When a spike completes and Dopamine fires and the dashboard updates before the user refreshes — that's the experience that makes software feel alive. Fulfillment isn't just for users; it's for builders who see their system respond in real time.

<!-- Definition of Ready — perspective -->

**Why This Week Matters:**
HTTP is request-response: the client asks, the server answers. WebSockets are bidirectional: the server can push data to the client at any time. This changes everything — live dashboards, real-time notifications, collaborative editing, streaming output. Are-Self's synaptic cleft is the real-time communication layer: neurotransmitter signals fired in Week 7, queued through Celery in Week 8, are now delivered to connected clients through WebSocket consumers. This week completes the event pipeline.

<!-- Definition of Ready — assertions -->

**Learning Goals:**

- Explain the difference between HTTP request-response and WebSocket persistent connections
- Configure Django Channels with Redis as the channel layer
- Implement a WebSocket consumer that handles connect, disconnect, and receive events
- Use channel groups to broadcast messages to multiple connected clients
- Describe Are-Self's synaptic cleft pattern: signal → task → WebSocket → client
- Build a real-time status update system

<!-- Definition of Ready — outside -->

**What This Week Is Not:**

- No frontend framework (plain JavaScript WebSocket API or simple HTML for testing)
- No Server-Sent Events (SSE) comparison beyond brief mention
- No WebSocket authentication beyond basic patterns
- No production WebSocket deployment (Daphne/Uvicorn discussed but not configured for scale)

---

## Iteration 4 Demo and Retrospective (Day 1 opening, 30 minutes)

### Demo (20 minutes)

Students demonstrate their Week 7-8 work:
- Signal handlers firing on model events
- Custom signal (neurotransmitter-style) with receivers
- Celery tasks executing asynchronously
- Periodic tasks running on Beat schedule
- Signal-to-task bridges

### Retrospective (10 minutes)

- How did async processing change your thinking about the request-response cycle?
- What was the hardest debugging experience this iteration?
- Iteration 5 commitments (this is the capstone iteration).

---

## Day 1 (Lecture): WebSocket Fundamentals and Django Channels

### Objective

Students will understand WebSocket protocol basics, configure Django Channels, and implement their first WebSocket consumer.

### Materials Needed

- Projector with IDE and terminal
- Redis running for the channel layer
- A browser with WebSocket dev tools (Chrome DevTools Network tab)
- Simple HTML file with JavaScript WebSocket client for testing

### Lecture Content (45 minutes, after Demo/Retro)

#### Opening (5 minutes)

"HTTP: you ask, I answer. Then we hang up. You want another answer? Call again. WebSockets: we shake hands once, then we keep the line open. Either side can talk at any time. The connection stays alive until one of us closes it."

Show the handshake in Chrome DevTools: HTTP 101 Switching Protocols. "It starts as HTTP, then upgrades. After that, it's a different protocol entirely."

#### Part 1: Django Channels Architecture (15 minutes)

Diagram on the board:

```
Browser (WebSocket client)
    │
    ▼ ws://localhost:8000/ws/events/
ASGI Server (Daphne / Uvicorn)
    │
    ▼ routes to consumer
WebSocket Consumer
    │
    ▼ uses channel layer
Redis (Channel Layer)
    │
    ▼ broadcasts to groups
Other Consumers / Celery Tasks
```

Key concepts:
- **ASGI** — Asynchronous Server Gateway Interface. The async counterpart to WSGI. Channels runs on ASGI.
- **Consumer** — The WebSocket equivalent of a view. Handles connect, disconnect, and receive.
- **Channel Layer** — Redis-backed message bus that lets consumers communicate with each other and with Celery tasks.
- **Groups** — Named collections of channels. Send a message to a group, and every consumer in it receives it.

Configuration:

```python
# settings.py
ASGI_APPLICATION = 'project.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [('127.0.0.1', 6379)],
        },
    },
}
```

```python
# project/asgi.py
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
import synaptic_cleft.routing

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            synaptic_cleft.routing.websocket_urlpatterns
        )
    ),
})
```

#### Part 2: Your First Consumer (20 minutes)

```python
# synaptic_cleft/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NeurotransmitterConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'neurotransmitters'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        # Echo back with a timestamp
        await self.send(text_data=json.dumps({
            'type': 'echo',
            'message': data.get('message', ''),
        }))

    async def neurotransmitter_event(self, event):
        """Handler for messages sent to this consumer via the channel layer."""
        await self.send(text_data=json.dumps(event['payload']))
```

URL routing for WebSockets:

```python
# synaptic_cleft/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/neurotransmitters/$', consumers.NeurotransmitterConsumer.as_asgi()),
]
```

Demonstrate:
1. Start the ASGI server
2. Open a browser with a simple WebSocket client
3. Connect to `ws://localhost:8000/ws/neurotransmitters/`
4. Send a message, receive the echo
5. Open a second browser tab — both receive broadcasts

"The consumer is like a view that stays alive. It processes messages instead of requests. And because of the channel layer, you can push messages to it from anywhere — including Celery tasks."

### Assessment

- Can students explain the difference between HTTP and WebSocket communication?
- Can students configure Django Channels with Redis?
- Can students implement a basic WebSocket consumer?

---

## Day 2 (Lecture): The Synaptic Cleft Pattern — Signals to Screens

### Objective

Students will understand Are-Self's complete event pipeline from Django signal to WebSocket delivery, implement server-initiated pushes from Celery tasks, and build channel group broadcasting.

### Materials Needed

- Projector with IDE and two browser windows
- Celery worker running
- WebSocket consumer from Day 1

### Lecture Content (75 minutes)

#### Opening (10 minutes)

"In Week 7 you built signals. In Week 8 you connected them to Celery tasks. Today you connect those tasks to WebSocket consumers. The full pipeline:"

```
Model Event → Django Signal → Celery Task → Channel Layer → WebSocket Consumer → Browser
```

"That's the synaptic cleft. In biology, the synaptic cleft is the gap between neurons where neurotransmitters carry signals. In Are-Self, the synaptic cleft app is the gap between the backend and the frontend where WebSocket messages carry neurotransmitter events."

#### Part 1: Pushing from Celery to WebSocket (25 minutes)

```python
# hippocampus/tasks.py
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@shared_task
def compute_embedding(engram_id):
    engram = Engram.objects.get(pk=engram_id)

    # Fire Glutamate — work starting
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'neurotransmitters',
        {
            'type': 'neurotransmitter_event',
            'payload': {
                'neurotransmitter': 'glutamate',
                'message': f'Computing embedding for {engram.name}',
                'engram_id': str(engram_id),
            }
        }
    )

    # Do the work
    embedding = generate_embedding(engram.content)
    engram.embedding = embedding
    engram.save(update_fields=['embedding', 'modified'])

    # Fire Dopamine — work complete
    async_to_sync(channel_layer.group_send)(
        'neurotransmitters',
        {
            'type': 'neurotransmitter_event',
            'payload': {
                'neurotransmitter': 'dopamine',
                'message': f'Embedding complete for {engram.name}',
                'engram_id': str(engram_id),
                'duration': '2.3s',
            }
        }
    )
```

Walk through:
- `get_channel_layer()` — Access the Redis-backed channel layer from synchronous code
- `async_to_sync` — Bridge between Celery's synchronous execution and the async channel layer
- `group_send` — Send to every consumer in the `neurotransmitters` group
- `'type': 'neurotransmitter_event'` — This must match the method name on the consumer (dots become underscores)

Live demo:
1. Open two browser tabs connected to the WebSocket
2. Create an Engram via the API
3. Watch the post_save signal fire → Celery task queued → Glutamate arrives at both browsers → Work completes → Dopamine arrives at both browsers

"The user didn't ask for an update. The server pushed it. That's real-time."

#### Part 2: The Five Neurotransmitters in Real Time (20 minutes)

Show the complete mapping with WebSocket delivery:

| Signal Event | Neurotransmitter | WebSocket Payload |
|---|---|---|
| Spike completes | Dopamine | `{neurotransmitter: 'dopamine', spike_id: '...', pathway: '...'}` |
| Budget exceeded | Cortisol | `{neurotransmitter: 'cortisol', model: '...', cost: '...', threshold: '...'}` |
| Engram created | Acetylcholine | `{neurotransmitter: 'acetylcholine', engram_id: '...', name: '...'}` |
| Spike Train starts | Glutamate | `{neurotransmitter: 'glutamate', spike_train_id: '...', pathway: '...'}` |
| Priority escalation | Norepinephrine | `{neurotransmitter: 'norepinephrine', task: '...', priority: '...'}` |

A dashboard client can filter by neurotransmitter type and display them differently:
- Dopamine → green success toast
- Cortisol → red alert banner
- Acetylcholine → blue memory indicator
- Glutamate → yellow activity spinner
- Norepinephrine → orange priority badge

"The server sends everything. The client decides what to show. That's separation of concerns applied to real-time communication."

#### Part 3: Scoped Groups and Targeted Delivery (15 minutes)

Not every client needs every message. Show how to create scoped groups:

```python
# Connect to a specific pathway's events
async def connect(self):
    self.pathway_id = self.scope['url_route']['kwargs']['pathway_id']
    self.group_name = f'pathway_{self.pathway_id}'
    await self.channel_layer.group_add(self.group_name, self.channel_name)
    await self.accept()
```

URL routing:

```python
re_path(r'ws/pathways/(?P<pathway_id>[0-9a-f-]+)/$', PathwayConsumer.as_asgi()),
```

"Now a client monitoring Pathway A only gets events from Pathway A. The PNS heartbeat goes to the worker monitoring group. The Hippocampus memory events go to the memory dashboard group. Scoped groups keep the noise down."

#### Part 4: Error Handling and Reconnection (5 minutes)

Brief coverage:
- WebSocket connections drop. The client must reconnect.
- Exponential backoff on reconnection attempts
- The server should handle connect/disconnect gracefully — no crash on unexpected disconnect
- Consider: what happens to messages sent while the client was disconnected? (Answer: they're lost. If you need guaranteed delivery, use a different pattern.)

### Assessment

- Can students send messages from Celery tasks to WebSocket consumers?
- Can students explain the full event pipeline from signal to browser?
- Can students implement scoped channel groups?

### Differentiation

**Advanced Learners:**
- Implement a "missed messages" pattern: when a client reconnects, send a summary of events that occurred while disconnected (store recent events in Redis with TTL)

**Struggling Learners:**
- Provide the Celery-to-WebSocket bridge code pre-written; student implements the consumer and routing

---

## Day 3 (Lab): Build Real-Time Status Updates

### Objective

Students will build a WebSocket consumer that broadcasts model events to connected clients, integrate it with their signal-to-task pipeline from Weeks 7-8, and demonstrate live updates.

### Lab Duration

110 minutes

### Standup (10 minutes)

### Pre-Planning (10 minutes)

Definition of Ready:
- What events will your system broadcast? (Model CRUD, custom domain events, periodic status)
- What channel groups do you need? (Global, model-scoped, user-scoped)
- How will a client test page display the events?
- What will you show at the capstone demo?

### Build Phase (60 minutes)

Students implement:

1. **Django Channels configuration** — ASGI application, channel layer settings, routing
2. **WebSocket consumer** — Connect, disconnect, receive, and at least one custom event handler
3. **Channel group** — At least one group for broadcasting events
4. **Celery-to-WebSocket bridge** — Modify their Week 8 task to push events through the channel layer
5. **Test client** — A simple HTML page with JavaScript that connects to the WebSocket and displays incoming messages:

```html
<script>
const ws = new WebSocket('ws://localhost:8000/ws/events/');
ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const div = document.createElement('div');
    div.className = data.neurotransmitter || 'info';
    div.textContent = `[${data.neurotransmitter}] ${data.message}`;
    document.getElementById('events').appendChild(div);
};
</script>
<div id="events"></div>
```

6. **End-to-end test** — Trigger a model event (create/update via API) and verify the WebSocket message arrives

### Integration Demo (15 minutes)

Students demonstrate the full pipeline:
1. Open the test client page in a browser
2. Use `curl` or the DRF browsable API to create/modify a model instance
3. Watch the signal fire → task queue → WebSocket push → browser update

The class sees each student's event pipeline in action.

### Wrap-Up (15 minutes)

"You've built the complete stack: models, migrations, admin, views, API, authentication, signals, background tasks, and real-time delivery. Next week, you put it all together in the capstone. Every pattern you've learned — mixins, light/full serializers, signals, tasks, WebSockets — is available to you."

### Exit Criteria

- Django Channels configured with Redis channel layer
- WebSocket consumer handles connect/disconnect/receive
- Channel group broadcasts messages to all connected clients
- Celery task pushes events through the channel layer
- Test client page displays incoming events
- End-to-end pipeline works: API action → signal → task → WebSocket → browser

### Assessment

| Criterion | Meets Expectations | Approaching | Not Yet |
|---|---|---|---|
| Channels config | ASGI, routing, channel layer all working | Configuration works with minor issues | Cannot establish WebSocket connection |
| Consumer | Full lifecycle (connect, disconnect, custom events) | Connect and receive work | Consumer doesn't run |
| Channel groups | Group broadcasting to multiple clients | Single client works | No group messaging |
| Celery bridge | Tasks push to WebSocket successfully | Partially connected | No bridge |
| Test client | Displays events in real time | Connects but display issues | No test client |
| End-to-end | Full pipeline works | Most steps work | Pipeline broken |

### Differentiation

**Advanced Learners:**
- Implement WebSocket authentication: only authenticated users can connect, and they receive only their own events
- Add a "system dashboard" consumer that aggregates all five neurotransmitter types with counts and rates

**Struggling Learners:**
- Provide the consumer, routing, and ASGI configuration pre-written; student implements the Celery bridge and test client

---

## Materials for This Week

- Django Channels documentation: [Introduction](https://channels.readthedocs.io/en/stable/introduction.html)
- Django Channels documentation: [Consumers](https://channels.readthedocs.io/en/stable/topics/consumers.html)
- Django Channels documentation: [Channel Layers](https://channels.readthedocs.io/en/stable/topics/channel_layers.html)
- Are-Self source: `synaptic_cleft/` app (consumers, routing)
- MDN: [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## Assignments

| Assignment | Due | Weight |
|------------|-----|--------|
| Lab: Real-time status updates | End of Week 9 | Part of Lab grade (Week 9) |
| Capstone proposal | End of Week 9 | Required for capstone (not graded separately) |
| Reading: Review all Are-Self patterns | Before Week 10 Day 1 | Preparation |

## Exit Criteria for Week 9

A student has completed Week 9 when:

- They can configure Django Channels with WebSocket routing
- They can implement consumers with group broadcasting
- They can push events from Celery tasks to WebSocket clients
- They understand the synaptic cleft as a complete event pipeline
- They have a working real-time update system
- They have submitted a capstone proposal

---

## Instructor Notes

### Common Issues

**Q: WebSocket connections fail immediately.**
A: Check: Is the ASGI application configured? Is Redis running? Is the routing correct? Is the consumer's `connect` method calling `await self.accept()`?

**Q: `async_to_sync` confuses students in Celery tasks.**
A: Celery runs synchronously. The channel layer is async. `async_to_sync` bridges the gap. It's a one-liner wrapper — don't overthink it.

**Q: Students try to access Django ORM in async consumers.**
A: The ORM is synchronous. Use `database_sync_to_async` from `channels.db` to wrap ORM calls, or do the ORM work in Celery tasks and push results through the channel layer.

---

*Built by the Are-Self project. MIT licensed. Free to use, modify, and share.*
