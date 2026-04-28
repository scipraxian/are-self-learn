---
title: "Module 2 — Edges and Types"
sidebar_position: 3
---

# Module 2: Edges and Types

## Learning Objectives

By the end of this module, you will be able to:

- Distinguish typed edges from untyped edges and explain what
  information types add
- Identify the six canonical edge types used in the *Hippocampus
  Hypergraph Migration* and describe what each one means
- Explain what a hypergraph is and why typed hyperedges are the
  right structure for clustered memory
- Reason about edge confidence as a separate dimension from edge
  weight

## What an Edge *Means*

A plain edge in a graph asserts: *these two vertices are connected.*
That is all. The connection is undifferentiated.

Real-world relationships are differentiated. "Alice is Bob's
mother" is a different relationship from "Alice is Bob's friend"
is a different relationship from "Alice introduced Bob to Carol."
A graph that records all three of these as identical edges has
lost information.

A **typed** edge assigns each edge to a named category — what kind
of connection it is. A graph with typed edges is sometimes called
a **labeled graph**, **knowledge graph**, or **semantic network**,
depending on which research community you ask.

For Are-Self memory, edges are typed. The type is the most
important property of the edge, more important than the weight.

## The Six Canonical Edge Types

The *Hippocampus Hypergraph Migration* paper formalizes the typed-
edge structure of Are-Self's memory layer. There are six edge types
in the proposed taxonomy:

### TEMPORAL — *S happened before T*

Records the chronological relationship between two memories. If
engram `e1` describes "the user opened a file" and engram `e2`
describes "the file was modified," then a `TEMPORAL` edge from
`e1` to `e2` records that the events occurred in that order.

Used by: any reasoning that depends on sequence — narrative
construction, log-style debugging, causal inference (which
depends on temporal precedence as a precondition).

### CAUSAL — *S caused T*

Records the causal relationship between two memories. Stronger than
TEMPORAL — causality requires temporal precedence but adds the
claim that one event *brought about* the other.

Used by: explanation, troubleshooting, forecasting. The presence of
a CAUSAL edge encodes a much stronger claim than a TEMPORAL edge
alone.

### CONTRADICTS — *S and T assert incompatible facts*

Two memories that cannot both be true. "The user said X" and "the
user said not-X" should be linked by a CONTRADICTS edge. The
system can then surface the contradiction during reasoning and
choose to investigate, defer, or store both with confidence
discounts.

Used by: contradiction detection, fact reconciliation,
identification of stale memories that need to be updated or
retired.

### ELABORATES — *T provides detail on S*

Records that one memory expands on another. "The user is using
Are-Self" (general) is elaborated by "the user is using Are-Self
to write Python" (specific). The ELABORATES edge points from the
general claim to the specific one.

Used by: drilling down from general context to specific context,
finding all the supporting detail behind a general claim.

### GENERALIZES — *T is a generalization of S*

The inverse of ELABORATES. "The user is writing Python" is
generalized by "the user is programming." The GENERALIZES edge
points from the specific to the general.

Both directions matter: ELABORATES lets you drill down,
GENERALIZES lets you climb up to a broader context.

### CLUSTERS — *S and T belong to a semantic cluster*

A symmetric grouping edge. Memories that are about a common topic,
a common project, a common user, or any other axis of cohesion
are linked into a cluster. Cluster edges are not strict logical
relations like CAUSAL or CONTRADICTS — they are softer
associations.

Used by: contextual recall ("what else do I know about this
topic?"), batch retrieval, topic-level summary generation.

## Hyperedges

A regular edge connects exactly two vertices. A **hyperedge**
connects any number of vertices.

For CAUSAL relationships this matters. A real-world cause may be
a *combination* of several preceding events: "the file was open
*and* the user pressed Save *and* disk had space → the file was
written." That is a single causal relationship between three
sources and one target. A regular graph can only encode it as
three separate two-vertex edges, losing the structure.

A hyperedge with three sources and one target encodes it directly:

```
e_cause = ({e_open, e_save_pressed, e_disk_ok}, {e_written}, type=CAUSAL)
```

A hypergraph is a graph where edges may be hyperedges. It is the
right shape for relationships that are not strictly pairwise.

Most edges in a typed memory graph will still be pairwise (TEMPORAL,
CONTRADICTS, ELABORATES, GENERALIZES). CLUSTERS and CAUSAL benefit
most from hyperedge generality.

## Confidence

Each edge in the Are-Self typed-edge model carries a **confidence
score** `c(e) ∈ [0, 1]`. Confidence is distinct from weight:

- **Weight** = how strong is the connection? (How much does the
  edge influence retrieval, traversal cost, etc.)
- **Confidence** = how sure are we that this edge is correct?
  (How reliable is the data this edge is based on?)

A high-weight, low-confidence edge says "if this edge is real, it
matters a lot, but we are not sure it is real." A low-weight,
high-confidence edge says "we are sure this edge exists, but it
does not matter much." The two dimensions cannot be collapsed
without losing information.

The consolidation process in Module 5 updates both confidence and
weight, but on different schedules and from different signals.

## A Typed-Edge Implementation

Extending the graph from Module 1:

```python
from dataclasses import dataclass, field
from enum import Enum

class EdgeType(Enum):
    TEMPORAL = "TEMPORAL"
    CAUSAL = "CAUSAL"
    CONTRADICTS = "CONTRADICTS"
    ELABORATES = "ELABORATES"
    GENERALIZES = "GENERALIZES"
    CLUSTERS = "CLUSTERS"

@dataclass(frozen=True)
class TypedEdge:
    sources: frozenset[str]   # may have multiple sources for hyperedges
    targets: frozenset[str]   # may have multiple targets
    type: EdgeType
    weight: float = 1.0
    confidence: float = 1.0

@dataclass
class TypedGraph:
    vertices: set[str] = field(default_factory=set)
    edges: list[TypedEdge] = field(default_factory=list)

    def add_edge(self, edge: TypedEdge) -> None:
        for v in edge.sources | edge.targets:
            self.vertices.add(v)
        self.edges.append(edge)

    def edges_by_type(self, t: EdgeType) -> list[TypedEdge]:
        return [e for e in self.edges if e.type == t]

    def edges_from(self, v: str) -> list[TypedEdge]:
        return [e for e in self.edges if v in e.sources]
```

This is a complete typed-hypergraph. Module 3 will extend it with
traversal algorithms.

## Are-Self Connection

The Hippocampus today stores engrams as vertices in the geometric
sense — points in a 768-dimensional embedding space — but does not
store edges between them. The migration replaces the implicit
geometric edges with explicit typed edges of the kinds defined
above.

Concretely, the migration adds:

- A new database table for typed edges, keyed by source and target
  engram IDs
- A small extractor that, when a new engram is saved, classifies
  its relationship to recently-active engrams and creates the
  appropriate edges
- An API surface for querying edges by type, by source, by target,
  or by combinations

The math you have just seen is the data model for that table.

## Think About It

- An untyped edge encodes "these two are connected." A typed edge
  encodes "these two are connected *in this specific way*." What
  does the type add that weight alone cannot?
- The CAUSAL edge type is strictly stronger than TEMPORAL —
  causality implies temporal order. Why is it useful to record both
  separately rather than collapsing them?
- Confidence and weight are different dimensions of edge quality.
  Can you think of an edge that should have high weight and low
  confidence? High confidence and low weight?

## Exit Ticket

1. Name the six canonical edge types in the *Hippocampus
   Hypergraph Migration* and describe each in one sentence.
2. Why is a hypergraph (with hyperedges) more appropriate than a
   regular graph for representing causal relationships in
   Are-Self memory?
3. An edge has weight 0.9 and confidence 0.4. Describe in plain
   words what this means about the edge.

Module 3 is where you start walking the graph.
