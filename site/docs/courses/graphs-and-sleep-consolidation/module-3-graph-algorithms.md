---
title: "Module 3 — Graph Algorithms"
sidebar_position: 4
---

# Module 3: Graph Algorithms

## Learning Objectives

By the end of this module, you will be able to:

- Implement breadth-first and depth-first traversal of a typed graph
- Implement shortest-path search in a weighted graph
- Identify when traversal should be type-aware vs type-agnostic
- Recognize community-detection problems and reason about which
  algorithm to apply

## Why Algorithms Matter Here

A graph by itself is just data. Algorithms are what turn graph data
into answers. A memory system needs to answer questions like:

- "What memories are most closely related to this one?"
- "What is the chain of causal events that led to this state?"
- "What memories cluster together with this one?"
- "What are the contradictions in this part of the graph?"

Each of those is a graph algorithm. Choosing the right one is what
turns a typed graph from a passive store into an active reasoning
substrate.

## Breadth-First Search

The most fundamental algorithm. Start at a vertex, visit all its
neighbors, then all of *their* neighbors, and so on, in waves.

```python
from collections import deque

def bfs(graph: TypedGraph, start: str, max_depth: int = 5) -> list[str]:
    visited: set[str] = {start}
    queue: deque[tuple[str, int]] = deque([(start, 0)])
    order: list[str] = []
    while queue:
        v, depth = queue.popleft()
        order.append(v)
        if depth >= max_depth:
            continue
        for edge in graph.edges_from(v):
            for u in edge.targets:
                if u not in visited:
                    visited.add(u)
                    queue.append((u, depth + 1))
    return order
```

BFS visits vertices in order of distance (number of edges) from
the start. It is the right algorithm for "find me the closest
memory to this one" or "find every memory within three hops."

For Are-Self memory: when a new engram is saved, BFS from the new
engram finds all the recently-relevant context to consider for
edge creation.

## Depth-First Search

DFS goes deep before going wide — follow one path as far as it
goes, then backtrack and follow the next.

```python
def dfs(graph: TypedGraph, start: str) -> list[str]:
    visited: set[str] = set()
    order: list[str] = []
    def visit(v: str) -> None:
        if v in visited:
            return
        visited.add(v)
        order.append(v)
        for edge in graph.edges_from(v):
            for u in edge.targets:
                visit(u)
    visit(start)
    return order
```

DFS is the right algorithm for "trace this thread to its
beginning" or "reconstruct the full causal chain backward from
this event." Following CAUSAL edges depth-first gives you a
narrative: A caused B caused C caused D.

## Type-Aware Traversal

Both BFS and DFS as written above traverse edges of any type. For
a typed graph, you often want type-aware traversal — only follow
edges of certain types.

```python
def bfs_typed(
    graph: TypedGraph,
    start: str,
    edge_types: set[EdgeType],
    max_depth: int = 5,
) -> list[str]:
    visited: set[str] = {start}
    queue = deque([(start, 0)])
    order = []
    while queue:
        v, depth = queue.popleft()
        order.append(v)
        if depth >= max_depth:
            continue
        for edge in graph.edges_from(v):
            if edge.type not in edge_types:
                continue
            for u in edge.targets:
                if u not in visited:
                    visited.add(u)
                    queue.append((u, depth + 1))
    return order
```

A few example queries that map cleanly onto type-aware traversal:

- *"Reconstruct the causal chain that led to this memory"* → DFS
  backward following only `CAUSAL` edges
- *"Find the cluster this memory belongs to"* → BFS following only
  `CLUSTERS` edges
- *"Find every memory that contradicts this one"* → one-hop scan
  of `CONTRADICTS` edges
- *"Find the most general claim above this specific memory"* → DFS
  following only `GENERALIZES` edges, until no further generalizing
  edges exist

Type-aware traversal is what makes typed edges *worth having*. An
untyped graph forces you to traverse everything; a typed graph
lets you traverse exactly the relationships that matter for the
question you are asking.

## Shortest Path: Dijkstra

For a weighted graph, the **shortest path** from one vertex to
another is the path whose total edge weight (or cost) is minimized.
Dijkstra's algorithm computes shortest paths in `O((V + E) log V)`
time.

```python
import heapq

def dijkstra(graph: TypedGraph, start: str) -> dict[str, float]:
    distances: dict[str, float] = {v: float("inf") for v in graph.vertices}
    distances[start] = 0.0
    heap: list[tuple[float, str]] = [(0.0, start)]
    while heap:
        d, v = heapq.heappop(heap)
        if d > distances[v]:
            continue
        for edge in graph.edges_from(v):
            for u in edge.targets:
                # Cost to traverse this edge: lower weight = harder to follow.
                # Inverting weight makes "stronger" edges cheaper to traverse.
                cost = 1.0 / max(edge.weight, 1e-6)
                new_dist = d + cost
                if new_dist < distances[u]:
                    distances[u] = new_dist
                    heapq.heappush(heap, (new_dist, u))
    return distances
```

For Are-Self memory: shortest-path queries can answer "what is the
strongest chain of related memories from A to B?" — useful for
explaining why a particular memory feels relevant when you might
not have an obvious direct link.

The cost-versus-weight inversion (`cost = 1 / weight`) is worth
pausing on. In a road network, edge weight = distance, so we
minimize total distance. In a memory network, edge weight =
strength, so we want to *maximize* strength along a path —
equivalently, minimize the inverse strength. Same algorithm,
different objective, achieved by inverting the cost function.

## Community Detection

A **community** in a graph is a subset of vertices that are more
densely connected to each other than to the rest of the graph.
Finding communities is the algorithmic version of "what are the
natural clusters in this graph?"

Several algorithms exist. The two most relevant for memory:

### Louvain Method

A greedy modularity-maximization algorithm. Modularity is a measure
of how much more dense the within-community connections are than
you would expect by chance. The Louvain method iteratively moves
vertices between communities to increase modularity.

Strength: fast (`O(V log V)` typical), produces hierarchical
clusterings, scales to millions of vertices.

For Are-Self: produces the natural clusters in the memory graph
that should be linked by `CLUSTERS` hyperedges. The Louvain output
is a candidate set of clusters that the consolidation process can
review and write to the graph.

### Spectral Clustering

Uses the eigenvectors of the graph Laplacian to find clusters.
Mathematically elegant, more interpretable than Louvain in some
contexts, slower at scale.

Strength: solid theoretical foundation, often produces tighter
clusterings than greedy methods.

For Are-Self: appropriate for periodic, deeper consolidation runs
that have time to run a more thorough analysis. Less appropriate
for fast incremental clustering.

## Algorithmic Complexity in Practice

Memory-graph algorithms must run on graphs with potentially
hundreds of thousands or millions of vertices. Algorithm choice
matters more than implementation language.

Practical guidance:

- **One-hop or two-hop queries** (most retrieval): essentially
  free, run synchronously during a request.
- **BFS / DFS to a small depth** (context expansion): fast enough
  for synchronous use if vertex set is bounded.
- **Single-source shortest path** (Dijkstra): synchronous-friendly
  for graphs up to ~100k vertices.
- **All-pairs shortest path**: do not, except at small scale.
- **Community detection**: run during sleep consolidation, not
  per-request.

The split between synchronous and asynchronous work is exactly
the boundary between *waking* memory operations and *sleeping*
consolidation. Module 5 makes this explicit.

## Are-Self Connection

The Hippocampus today does roughly one synchronous algorithm: vector
similarity search (cosine similarity to find the top-k closest
engrams). After the migration, the Hippocampus will additionally do:

- Type-aware one-hop and two-hop expansion during retrieval (BFS
  across `ELABORATES`, `GENERALIZES`, `CLUSTERS` edges, bounded)
- Causal-chain reconstruction on demand (typed DFS across `CAUSAL`)
- Contradiction scans on save (one-hop `CONTRADICTS` queries)

The deeper algorithms — community detection, full Dijkstra,
hypergraph operations — run during sleep consolidation, which is
Module 5.

## Think About It

- BFS and DFS visit the same vertices but in different orders. What
  does this say about the relationship between an algorithm and a
  *narrative*?
- Type-aware traversal answers a different *kind* of question than
  type-agnostic traversal. What does this imply about how a
  retrieval system designs its query language?
- Synchronous algorithms run during a request, and asynchronous
  algorithms run during idle time. Why is that distinction more
  important for memory than it is for, say, a search engine?

## Exit Ticket

1. You want to find the strongest chain of CAUSAL edges from one
   memory to another. Which algorithm and what cost function?
2. Why is community detection appropriate for sleep consolidation
   rather than for synchronous retrieval?
3. A query asks "what memories elaborate on this one, with all the
   second-level elaborations they each have?" Which traversal,
   bounded to what depth, with what edge type filter?

Module 4 is where you look at the graph as a brain.
