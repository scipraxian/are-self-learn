---
title: "Pathway — Hippocampal Consolidation"
sidebar_position: 8
---

# Pathway: Hippocampal Consolidation

This is the **neural pathway companion** to the *Graphs and Sleep
Consolidation* course. It describes the seven-phase consolidation
cycle as a NeuralPathway inside Are-Self.

The course is the human-facing version. The pathway is the machine-
facing version: a graph of Effectors that performs the same work as
a Genome that ships alongside the curriculum and runs during the
`Sleeping` shift of an Are-Self iteration.

This pathway is the most directly research-aligned of the three
that ship with the new courses — it is the implementation
specification for the future-work section of the *Hippocampus
Hypergraph Migration* paper.

## How the Course's Modifiers Compose Into This Pathway

Each module of the course ships its own **NeuralModifier** bundle —
one zip in `neuroplasticity/genomes/`, registered via the Modifier
Garden. Module 2's bundle (`gsc-edges-and-types`) provides the typed-
edge primitives. Module 3's bundle (`gsc-graph-algorithms`) registers
the graph-traversal Effectors. Module 5's bundle
(`gsc-consolidation`) registers the seven sleep-consolidation
Effectors.

This pathway does not redefine those Effectors. It *composes* them
into the seven-phase consolidation cycle. Module 5's modifier is the
heaviest contributor — it registers all seven phase Effectors that
this pathway then wires together.

## Pathway Overview

**Name:** `HippocampalConsolidation`
**Purpose:** Run a complete sleep-mode consolidation cycle on the
typed-edge engram graph: strengthen, decay, prune, cluster,
materialize, summarize, detect contradictions.
**Trigger:** Temporal Lobe `Sleeping` shift activation. Fires once
per sleep cycle per environment.
**Result:** A consolidated engram graph (edges updated, clusters
materialized, summary engrams added, contradictions tagged) and
an engram in the Hippocampus describing what the cycle did.

## Neurons

| Neuron | Effector | Reads | Writes | Course Module |
|--------|----------|-------|--------|---------------|
| `BeginPlay` | `Effector.BEGIN_PLAY` | — | `cycle_id`, `retrieval_log_window` | — |
| `StrengthenActiveEdges` | `effectors.strengthen_active_edges` | `retrieval_log_window` | `n_strengthened` | Module 5 |
| `DecayInactiveEdges` | `effectors.decay_inactive_edges` | `retrieval_log_window`, `decay_rate` | `n_decayed` | Module 5 |
| `PruneStaleEdges` | `effectors.prune_stale_edges` | `weight_threshold` | `n_pruned` | Module 5 |
| `DetectCommunities` | `effectors.run_louvain` | — | `community_set` | Modules 3, 5 |
| `MaterializeClusters` | `effectors.materialize_clusters` | `community_set`, `cohesion_threshold` | `n_cluster_edges_added` | Module 5 |
| `GenerateSummaryEngrams` | `effectors.generate_summary_engrams` | `community_set`, `min_cluster_size` | `summary_engram_ids` | Module 5 |
| `DetectContradictions` | `effectors.detect_contradictions` | `recent_engrams` | `contradiction_edge_ids` | Modules 2, 5 |
| `RecordCycle` | `effectors.save_engram` | counts and IDs from above | `cycle_engram_id` | — |
| `Done` | `Effector.DONE` | `cycle_engram_id` | — | — |

## Axons

| From | To | AxonType | Notes |
|------|-----|----------|-------|
| `BeginPlay` | `StrengthenActiveEdges` | `SEQUENTIAL` | begin cycle |
| `StrengthenActiveEdges` | `DecayInactiveEdges` | `SEQUENTIAL` | edge weights are now updated |
| `DecayInactiveEdges` | `PruneStaleEdges` | `SEQUENTIAL` | weights settled, ready for prune |
| `PruneStaleEdges` | `DetectCommunities` | `SEQUENTIAL` | cleaned graph for community detection |
| `DetectCommunities` | `MaterializeClusters` | `SEQUENTIAL` | communities ready |
| `MaterializeClusters` | `GenerateSummaryEngrams` | `SEQUENTIAL` | clusters exist as edges, ready to summarize |
| `GenerateSummaryEngrams` | `DetectContradictions` | `SEQUENTIAL` | new summaries should also be checked for contradictions |
| `DetectContradictions` | `RecordCycle` | `SEQUENTIAL` | full cycle results ready to log |
| `RecordCycle` | `Done` | `TERMINAL` | terminal node |

The pathway is strictly sequential — each phase depends on the
output of the prior phase. There is no branching and no
conditional execution; this is by design. The cycle either
completes or fails, and the Reasoning Identity that scheduled it
sees a clean engram with the cycle's results.

## Brain Regions Touched

- **Temporal Lobe** — owns the `Sleeping` shift that triggers the
  pathway. Without an active iteration in `Sleeping`, the pathway
  does not fire.
- **Central Nervous System** — owns the pathway, dispatches the
  spike train, accumulates per-phase counts in axoplasm.
- **Hippocampus** — the *target* of the consolidation. Every
  phase reads from and writes to the hippocampus's typed-edge
  schema. The `RecordCycle` neuron writes a meta-engram describing
  the cycle into the hippocampus itself.
- **Frontal Lobe** — `GenerateSummaryEngrams` invokes a Reasoning
  Session (or a focused inference call) to produce summary
  engrams. This is the only phase that calls an LLM.
- **Hypothalamus** — selects the model for the summarization call.
  For high-volume consolidation, this should be a locally-served
  fine-tune (see *Tune Pretrained Models*) rather than a paid API.

## Where the Effectors Come From

The seven phase Effectors are registered by the per-module
NeuralModifier bundles (primarily Module 5's `gsc-consolidation`,
with the typed-edge primitives from Module 2 and the graph-
algorithm primitives from Module 3 as dependencies).

The Effectors:

1. `strengthen_active_edges` — increment weight on edges incident
   to recently-retrieved engrams
2. `decay_inactive_edges` — decrement weight on edges not in the
   active set
3. `prune_stale_edges` — delete edges below threshold
4. `run_louvain` — community detection on the current graph
5. `materialize_clusters` — add `CLUSTERS` hyperedges for
   high-cohesion communities
6. `generate_summary_engrams` — invoke the Frontal Lobe to produce
   summary engrams for large clusters; link with `GENERALIZES`
   edges
7. `detect_contradictions` — scan recent engrams against existing
   ones and add `CONTRADICTS` edges

Phases 1–5 are pure Python operations on the database — fast and
deterministic. Phase 6 makes one LLM call per cluster — the
expensive phase. Phase 7 makes one LLM call per recent engram in
the worst case — bounded by a window size.

The `MaterializeClusters` and `GenerateSummaryEngrams` Effectors
require careful idempotency: rerunning the consolidation pathway on
the same data should not double-count clusters or summaries. The
implementation should check for an existing edge or engram before
creating a new one. This idempotency requirement is part of the
contract that `gsc-consolidation`'s install must verify.

A composition modifier (`gsc-pathway-composition`) wraps the
pathway fixture and depends on the six module bundles via the
Modifier Garden's `requires` field. The Module 6 modifier
(`gsc-implementation`) ships the `EngramEdge` migration itself —
without it, none of the others have anything to write to.

## Tunable Parameters

The pathway exposes hyperparameters via its EffectorContext:

| Parameter | Default | Used By |
|-----------|---------|---------|
| `decay_rate` | 0.005 | DecayInactiveEdges |
| `weight_strengthen_increment` | 0.01 | StrengthenActiveEdges |
| `weight_threshold` | 0.10 | PruneStaleEdges |
| `cohesion_threshold` | 0.60 | MaterializeClusters |
| `min_cluster_size` | 5 | GenerateSummaryEngrams |
| `retrieval_window_hours` | 24 | StrengthenActiveEdges, DecayInactiveEdges |

These are all the dials you can turn without changing the
algorithm. The first thing a new operator should do is read the
default values, run the pathway against synthetic data, and
verify the output makes sense before tuning.

## Genome Versioning

The pathway is genome-owned. Updates to the consolidation algorithm
(adding a new phase, changing the order of phases, refining the
clustering method) bump the genome version and ship a new fixture.
The course content and the pathway must agree at all times.

## Status

| Element | Status |
|---------|--------|
| Course modules 1–6 | Drafted |
| Pathway specification (this doc) | Drafted |
| Per-module NeuralModifier bundles (6 of them) | Not yet — see TASKS.md |
| `EngramEdge` model migration (shipped inside `gsc-implementation`) | Not yet (blocks all others) |
| Edge-extraction synchronous Effector | Not yet (out of this pathway's scope) |
| Composition modifier (`gsc-pathway-composition`) | Not yet — depends on the six |
| End-to-end runnable | Blocked on `gsc-implementation` (schema migration) |

The Module 6 modifier is the first dependency. Until it ships and
the `EngramEdge` migration runs, none of the consolidation Effectors
have anything to write to. Module 6's modifier is also the first one
Michael will produce in his play-through.

## Reading

The *Hippocampus Hypergraph Migration* paper is the authoritative
specification. This pathway document is the engineering plan that
implements the paper's future-work section. Any disagreement
between the two should be resolved by updating the pathway
document, not the paper.

The course this pathway belongs to (*Graphs and Sleep
Consolidation*) is the teaching-grade introduction to all of this.
A new contributor should take the course, read the paper, then
read this document, and then they are equipped to write Effectors.
