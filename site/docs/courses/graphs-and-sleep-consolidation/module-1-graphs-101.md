---
title: "Module 1 — Graphs 101"
sidebar_position: 2
---

# Module 1: Graphs 101

## Learning Objectives

By the end of this module, you will be able to:

- Define a graph in formal terms (vertices, edges, sets)
- Distinguish directed from undirected, weighted from unweighted,
  simple from multigraph
- Represent a graph in code using adjacency lists or adjacency
  matrices and reason about when each is appropriate
- Explain why "memory" and "graph" are natural fits for one another

## What a Graph Is

A graph is a pair `G = (V, E)` where:

- `V` is a set of **vertices** (also called **nodes**)
- `E` is a set of **edges** — connections between vertices

That is the entire definition. Everything else in graph theory is
elaboration on those two sets.

A graph of three friends might be:

```
V = {alice, bob, carol}
E = {(alice, bob), (bob, carol), (alice, carol)}
```

Three people, three friendships. The pair `(alice, bob)` is an
edge representing one friendship. The graph encodes who knows
whom.

You can draw it:

```
  alice ----- bob
    \         /
     \       /
      carol
```

A line (or arrow) per edge. A point (or circle) per vertex. That is
all you ever draw.

## The Big Distinctions

### Directed vs Undirected

In an **undirected** graph, the edge `(alice, bob)` is the same as
the edge `(bob, alice)`. Friendship is symmetric — if Alice knows
Bob, Bob knows Alice.

In a **directed** graph, edges have a direction:
`(alice → bob)` is not the same as `(bob → alice)`.

A "follows" relationship on social media is directed (Alice can
follow Bob without Bob following Alice). A genealogy graph is
directed (Alice is Bob's mother — not the reverse).

For Are-Self memory, edges are directed. The relationship "fact A
caused fact B" is not symmetric.

### Weighted vs Unweighted

An **unweighted** graph just records that an edge exists.

A **weighted** graph attaches a number to each edge — the
**weight**. Weights can mean almost anything: distance, cost,
strength, confidence, frequency.

For Are-Self memory, edges are weighted. The strength of the
connection between two memories matters; the consolidation process
in Module 5 is largely about adjusting these weights.

### Simple vs Multigraph

A **simple** graph has at most one edge between any pair of
vertices. A **multigraph** allows multiple parallel edges.

For Are-Self memory we use a multigraph variant: two memories may
be connected by edges of different *types* (one TEMPORAL edge,
one CAUSAL edge), each carrying its own weight. Type and weight
together distinguish parallel edges.

## Two Ways to Store a Graph

### Adjacency List

For each vertex, store a list of its neighbors:

```python
graph: dict[str, list[str]] = {
    "alice": ["bob", "carol"],
    "bob": ["alice", "carol"],
    "carol": ["alice", "bob"],
}
```

Memory cost: roughly `O(|V| + |E|)`.

Looking up "is `alice` connected to `bob`?" requires scanning
`alice`'s neighbor list — `O(degree(alice))` time. For sparse
graphs (few edges per vertex) this is essentially constant.

### Adjacency Matrix

For a graph with `n` vertices, an `n × n` matrix where entry
`(i, j)` is 1 if there is an edge from `i` to `j`, 0 otherwise:

```
        alice  bob  carol
alice  [  0    1     1  ]
bob    [  1    0     1  ]
carol  [  1    1     0  ]
```

Memory cost: `O(|V|²)`. Looking up "is `alice` connected to `bob`?"
is constant time (one matrix lookup).

For weighted graphs, the matrix entries are weights instead of
booleans. For graphs with many vertices and few edges (sparse), the
adjacency list wins on memory. For dense graphs and applications
that do many "is connected?" lookups, the matrix wins.

### Sparse Matrix Hybrid

Real-world memory graphs are sparse but large — many vertices, few
edges per vertex. Sparse matrix representations (compressed sparse
row, COO format) split the difference: matrix-like operations,
list-like memory cost.

For Are-Self, the practical answer is a hybrid: store the edges as
database rows (adjacency-list-flavored, indexable), and lift them
into a sparse matrix only when the consolidation algorithm needs
matrix operations. Module 6 covers the implementation.

## Why Graphs Fit Memory

A flat list of memories — "I know X. I know Y. I know Z." — is
already useful, but it is missing structure. Real memory is
relational:

- *X happened before Y.*
- *X caused Y.*
- *X contradicts Y.*
- *X is a more specific case of the general fact Y.*
- *X and Y are part of the same cluster.*

Each of those is an edge. The list of memories is the vertex set;
the relationships are the edge set. The graph captures information
that the flat list cannot.

This is why brains store memory as a network of cells with
synaptic connections, not as a database of facts. Connections are
the information. Removing them collapses meaning into a list.

The Are-Self Hippocampus today is the list. The migration in
Module 6 makes it the graph. This course is the math you need to
follow that migration.

## A First Code Example

A tiny graph in plain Python — directed, weighted, simple:

```python
from dataclasses import dataclass, field
from collections import defaultdict

@dataclass
class Graph:
    vertices: set[str] = field(default_factory=set)
    edges: dict[tuple[str, str], float] = field(default_factory=dict)

    def add_vertex(self, v: str) -> None:
        self.vertices.add(v)

    def add_edge(self, u: str, v: str, weight: float = 1.0) -> None:
        self.add_vertex(u)
        self.add_vertex(v)
        self.edges[(u, v)] = weight

    def neighbors(self, u: str) -> list[str]:
        return [v for (uu, v) in self.edges.keys() if uu == u]

    def weight(self, u: str, v: str) -> float | None:
        return self.edges.get((u, v))
```

That is enough graph for the next several modules. We will extend
it with edge types in Module 2 and traversal algorithms in Module 3.

## Are-Self Connection

Today, an engram in the Hippocampus is a vertex. Its embedding
vector lives in 768-dimensional space, and "similar" engrams are
those whose vectors are nearby. There are *implicit* edges in this
representation — geometric closeness — but they are not edges you
can name, query, or update.

After the migration in the *Hippocampus Hypergraph Migration*
paper, an engram is still a vertex, but the implicit closeness is
made explicit as edges of named types with explicit weights.

This module is the entry-level vocabulary you need to read that
work.

## Think About It

- A graph is a set of points and a set of connections. What
  information does the connection set encode that is not present
  in the point set alone?
- Adjacency list and adjacency matrix encode the same information
  with different cost profiles. What does this say about the
  relationship between data structure and use case?
- Friendship is undirected but real-world social networks are
  directed (you can follow someone who does not follow you). What
  does this small distinction change about the math?

## Exit Ticket

1. A simple undirected graph has 5 vertices and 7 edges. What is
   the maximum possible number of edges in a simple undirected
   graph on 5 vertices?
2. Describe the adjacency-matrix representation of a graph with
   one million vertices and one million edges. Is this a good fit?
3. Why is a *multigraph* the right shape for a memory system that
   wants to express both temporal and causal relationships
   between the same pair of facts?

Module 2 is where edges start to mean something.
