---
title: "Corporate CI/CD Training: Neural Pathways in Are-Self"
sidebar_position: 1
---

# Corporate CI/CD Training: Neural Pathways in Are-Self

**A one-week intensive for teams adopting Are-Self as their workflow engine.**

This course teaches your team to design, build, test, and operate workflows using Are-Self's Central Nervous System. If you came here expecting GitHub Actions or Jenkins pipelines, recalibrate. The CI/CD system in Are-Self is the Central Nervous System itself: Neural Pathways are your workflow templates, Neurons are your execution nodes, Axons are your edges, and Spike Trains are your running instances. By the end of this week, every participant will have designed and deployed a working Neural Pathway from scratch.

## Who This Is For

You are a software engineer, DevOps practitioner, or technical lead at an organization that has adopted (or is evaluating) Are-Self. You are comfortable with Python and Django. You understand what a DAG is. You have access to a running Are-Self instance with the Central Nervous System app enabled.

This is not an introduction to Are-Self's architecture at a high level. This is a hands-on deep dive into the workflow engine that powers everything else.

## The Experience Master Framework

This course follows the Experience Master operating system (Clark & Piper, 2017). The week functions as a compressed Iteration:

- **Monday** is Sifting: we examine the system, understand the parts, and decide what matters.
- **Tuesday** is Pre-Planning: we trace execution paths and understand what it takes to build a workflow.
- **Wednesday** is Planning: we design branching strategies and error-handling patterns.
- **Thursday** is Executing: we connect the fleet and observe real distributed execution.
- **Friday** is Demo: each participant builds and presents a working Neural Pathway.

Each day is a two-hour session: one hour of lecture and guided exploration, one hour of hands-on lab work.

## The Twelve Variables

This course engages several of the twelve scipraxian Variables directly:

- **Inquiry** — Every neuron you add to a pathway is a question: "What should happen next?" The entire DAG is a structured inquiry.
- **Perseverance** — Spike Trains fail. Axons route to failure paths. The system was built for recovery, and so must your workflows be.
- **Perception** — Reading the visual graph editor is an exercise in perception. The shape of the DAG tells you what the system will do before you run it.
- **Responsibility** — Every Neural Pathway you deploy runs on real infrastructure, consumes real resources, and affects real users.
- **Fear** — Circuit breakers exist because systems fail. Acknowledging failure as a first-class concern is the opposite of pretending it away.
- **Time** — Spike Trains have lifetimes. Neurons have timeouts. Time is not an abstraction here; it is a constraint you must design for.

## Course Schedule

| Day | Title | Focus |
|-----|-------|-------|
| [Day 1](./day-1-neural-pathways) | Neural Pathways as Workflow Templates | DAGs, neurons, axons, effectors, the visual graph editor |
| [Day 2](./day-2-spike-trains) | Spike Trains | Execution instances, status propagation, axoplasm flow, cerebrospinal_fluid |
| [Day 3](./day-3-branching-and-error-handling) | Branching and Error Handling | Axon types, conditional routing, retry patterns, circuit breakers |
| [Day 4](./day-4-fleet-management) | Fleet Management | PNS distribution modes, heartbeat monitoring, NerveTerminals, neurotransmitter signals |
| [Day 5](./day-5-build-your-pathway) | Build Your First Pathway | Design, build, test, run, demo |

## Prerequisites

- Familiarity with Are-Self concepts. The [What Is AI?](../what-is-ai/) course is optional but useful preparation for understanding the neural pathway execution model.
- No programming is required — this course is about understanding and operating the workflow system, not writing code.
- Basic understanding of workflow or pipeline concepts is helpful (e.g., "steps run in order, some can branch").
- A running Are-Self instance (v6.x) with superuser access
- Access to the Are-Self admin panel and the graph editor
- A functioning Celery worker setup (for Day 4)

## What You Will Be Able to Do

By Friday afternoon, participants will:

1. **Design** a Neural Pathway as a DAG using the visual graph editor and `ui_json`
2. **Configure** Neurons with appropriate Effectors for each task in a workflow
3. **Wire** Axons with correct types (flow, success, failure) to control execution routing
4. **Launch** Spike Trains and trace their execution through the pathway
5. **Implement** error-handling patterns using failure axons, retries, and circuit breaker integration
6. **Deploy** pathways to a fleet using PNS distribution modes
7. **Monitor** running Spike Trains using neurotransmitter signals and the admin interface
8. **Present** a complete, working Neural Pathway in a live demo
