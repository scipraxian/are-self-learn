---
title: "Module 6 — Are-Self's Implementation"
sidebar_position: 7
---

# Module 6: Are-Self's Implementation

## Learning Objectives

By the end of this module, you will be able to:

- Map the math from Modules 1–5 onto Are-Self's actual code
  surface
- Identify the database tables that hold the typed-edge
  hypergraph
- Explain how the `HippocampalConsolidation` NeuralPathway
  performs the consolidation cycle
- Read the *Hippocampus Hypergraph Migration* paper end to end and
  follow every section

## From Math to Code

The previous five modules built the conceptual layer:

- A graph has vertices and edges (Module 1)
- Edges can be typed and confidence-scored (Module 2)
- Algorithms walk and cluster the graph (Module 3)
- Brains are graphs at multiple scales (Module 4)
- Sleep consolidation is graph maintenance (Module 5)

This module connects each of those to specific, concrete code
inside `are-self-api/`.

## The Database Layer

The current Hippocampus stores engrams in a single Django model:

```python
class Engram(models.Model):
    name = models.CharField(...)
    description = models.TextField(...)
    tags = models.ManyToManyField(...)
    relevance = models.FloatField(default=1.0)
    embedding = VectorField(dimensions=768)
    # ... provenance fields linking to sessions, turns, spikes
```

After the migration, the schema gains a typed-edge table:

```python
class EngramEdge(models.Model):
    EDGE_TYPES = [
        ("TEMPORAL", "Temporal"),
        ("CAUSAL", "Causal"),
        ("CONTRADICTS", "Contradicts"),
        ("ELABORATES", "Elaborates"),
        ("GENERALIZES", "Generalizes"),
        ("CLUSTERS", "Clusters"),
    ]
    sources = models.ManyToManyField(Engram, related_name="outgoing_edges")
    targets = models.ManyToManyField(Engram, related_name="incoming_edges")
    edge_type = models.CharField(max_length=16, choices=EDGE_TYPES, db_index=True)
    weight = models.FloatField(default=1.0)
    confidence = models.FloatField(default=1.0)
    created_at = models.DateTimeField(auto_now_add=True)
    last_accessed_at = models.DateTimeField(null=True)
```

The `ManyToManyField` on `sources` and `targets` is what makes
this a hypergraph table — an edge can have multiple sources and
multiple targets.

## The API Layer

The Hippocampus exposes a small set of edge-aware operations.
Sketch of the public surface:

```python
class Hippocampus:
    def save_engram(self, description: str, tags: list[str]) -> Engram:
        """Save a new engram and run synchronous edge extraction."""
        ...

    def expand(
        self,
        engram: Engram,
        edge_types: list[EdgeType],
        max_depth: int = 2,
    ) -> list[Engram]:
        """One- or two-hop typed expansion from an engram."""
        ...

    def causal_chain(self, engram: Engram, direction: str = "backward") -> list[Engram]:
        """Walk CAUSAL edges in a direction; return the chain."""
        ...

    def contradictions_with(self, engram: Engram) -> list[Engram]:
        """Find engrams linked to this one by CONTRADICTS edges."""
        ...

    def cluster_of(self, engram: Engram) -> list[Engram]:
        """Find the cluster this engram belongs to."""
        ...
```

These map directly onto the type-aware traversals from Module 3.
Each is a small wrapper around the database queries that the new
edge table makes efficient.

## Synchronous vs Sleep Operations

Some operations run during a request:

- `save_engram` — new engrams must be saved synchronously
- Edge extraction at save time — short BFS to find candidate edges
  to recently-active engrams, classified by an LLM call
- One-hop and two-hop typed expansion during retrieval

Other operations run during sleep, in the `HippocampalConsolidation`
NeuralPathway:

- Strengthening edges from the day's retrieval log
- Decay and prune of stale edges
- Community detection (Louvain on the engram graph)
- Materialization of CLUSTERS hyperedges
- Summarization to produce GENERALIZES summary engrams
- Contradiction sweep across recently-modified engrams

This split was specified in Module 5 conceptually. Here it shows
up as a concrete dispatch: a Reasoning Session triggers the
synchronous operations; a Temporal Lobe `Sleeping` shift triggers
the consolidation pathway.

## The Consolidation Pathway

The `HippocampalConsolidation` NeuralPathway is the executable
form of Module 5's seven-phase cycle. Its specification is the
companion document to this course:
[`pathway.md`](./pathway).

To summarize: a graph of seven Neurons, connected by SEQUENTIAL
Axons, each Neuron carrying an Effector that performs one phase
of the cycle. The pathway is registered with the Temporal Lobe to
fire during the `Sleeping` shift. When the shift activates, the
pathway runs end-to-end, and the engram graph emerges modified.

This is the exact pattern Are-Self uses for every coordinated
sequence of operations. It is also why the pathway view of the
work is genuinely useful — the graph of operations *is* the
specification of what happens.

## Edge Extraction

The most interesting synchronous step is **edge extraction** at
save time. When a new engram is saved, what edges should be added
to it?

The proposal is a small LLM-augmented classifier. For a new engram
`e_new`:

1. Retrieve the top-`k` most similar recent engrams by vector
   similarity (the existing operation).
2. For each candidate `e_candidate`, prompt a classifier with both
   engram texts and ask: which edge types apply, with what
   confidence?
3. Materialize the high-confidence edges in the database.

The classifier prompt looks roughly like:

```
Engram A: {e_new.description}
Engram B: {e_candidate.description}

For each of the following edge types, judge whether the edge applies
from A to B (or in the noted direction), and give a confidence in
[0, 1]:

- TEMPORAL (A happened before B)
- CAUSAL (A caused B)
- CONTRADICTS (A and B assert incompatible facts)
- ELABORATES (B provides detail on A)
- GENERALIZES (B is a generalization of A)
- CLUSTERS (A and B belong to a common cluster)

Output as JSON.
```

The classifier is a small but capable model — typically the same
local fine-tune you might produce in *Tune Pretrained Models*.
Edge extraction is, structurally, exactly the kind of constrained,
schema-driven task that fine-tuned small models excel at.

## Preserving Backward Compatibility

A hard constraint of the migration: existing engrams continue to
work. Vector similarity search still returns the right engrams;
existing queries do not break.

The implementation respects this by treating typed edges as an
*additional* layer rather than a *replacement*. The flat engram
table remains. Edge extraction and the typed-edge table are added
alongside. Old code that only knows about engrams still works.
New code that uses edges gets richer behavior.

This is the correct migration shape for any structural change to
production memory: extend, do not replace, and let consumers opt
in to the new structure as they are updated.

## Reading the Paper

By this point, the *Hippocampus Hypergraph Migration* paper should
be fully readable. Recommended order:

1. **Abstract and Introduction** — sets up the problem and the
   motivation. Familiar from this course's framing.
2. **Background** — the neuroscience reference. Module 4 covers
   the basics.
3. **Current Architecture** — the flat-engram baseline. The
   Hippocampus today.
4. **Proposed Hypergraph Model** — Module 2's typed edges, made
   formal.
5. **Edge Type Semantics** — definitions of the six canonical
   edge types. This module covered them informally; the paper
   makes them precise.
6. **Migration Plan** — the staged rollout. The "extend, do not
   replace" pattern in detail.
7. **Knowledge Consolidation** — Module 5's sleep cycle, made
   formal.
8. **Evaluation Plan** — how the migration's success is
   measured. Pairwise comparison of retrieval quality on a
   held-out task set.
9. **Future Work** — sleep consolidation, federated multi-agent
   memory, emotional tagging via a software Amygdala.

If a section confuses you, return to the corresponding module of
this course. The two are designed to interleave.

## Are-Self Connection

This entire module *is* the Are-Self connection. The course exists
to make the migration legible to engineers who want to contribute
to it, to reviewers who want to evaluate the approach, and to
students who want to understand how a memory system can be more
than a list of facts.

When the migration ships, the engram graph will be live. The
consolidation pathway will run during idle iterations. The
typed-edge API will be available. At that point, the math from
Modules 1–5 is no longer a teaching aid — it is the working
specification of a running system.

## Think About It

- The migration extends the schema rather than replacing it. What
  does this say about how to evolve a production system that
  already has users?
- Edge extraction is delegated to an LLM classifier. What is the
  alternative, and what would be the trade-offs?
- The consolidation pathway runs only during idle time. What
  happens if the system is never idle? What design decision does
  this force?

## Exit Ticket

1. The migration adds an `EngramEdge` table. Why is it a
   `ManyToManyField` on both `sources` and `targets` rather than
   a `ForeignKey`?
2. Edge extraction at save time depends on an LLM classifier. Why
   is this an acceptable dependency? When would it become
   unacceptable?
3. After this course you can read the *Hippocampus Hypergraph
   Migration* paper end to end. Which section was the hardest, and
   what part of the paper do you now think is under-developed?

You have finished the course. The next time you read about
hippocampal consolidation, you will know not just what it is, but
how to put it in software. That is rare.

## Going Further

- Read the paper.
- Read it again next week.
- Find the part of the implementation that is currently under-
  specified (the paper has TODOs in several sections) and propose
  a refinement.
- Build the consolidation pathway, end to end, in your local
  Are-Self installation. The pathway companion to this course
  ([`pathway.md`](./pathway)) is the spec to follow.

The migration is in flight. There is room to contribute.
