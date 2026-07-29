# Topic backlog

The generator reads only the lines under the "## Topics" heading. It picks the
first topic not yet published (matched loosely against existing article
titles/slugs), writes an article, and leaves the list untouched (dedupe is by
what already exists in src/content/articles). When the list runs low, the
generator asks the model to propose a fresh, on-brand topic.

Idempotent by design: safe to run on a schedule; it keeps producing the next
unpublished topic.

## Topics

Idempotency in distributed systems, and why it saves you
Choosing between SQL and NoSQL without the dogma
How I think about caching layers
Message queues: when you actually need one
Database indexing, explained through the queries you run
Rate limiting strategies that do not punish good users
The cost of microservices nobody warns you about
Observability: logs, metrics, and traces without drowning
Feature flags as an architecture tool, not just a toggle
Designing for failure: timeouts, retries, and circuit breakers
Schema migrations without downtime
Building an internal platform your team actually uses
Vector databases and when they earn their place
Prompt engineering is not enough: structuring LLM systems
Evaluating LLM output: moving past "it seems good"
Kubernetes: what you need before you reach for it
Infrastructure as code and the discipline it forces
API versioning strategies that age well
The read-write split and when it helps
Event-driven architecture without the chaos
Technical debt as a deliberate decision
Onboarding engineers through your codebase conventions
Backpressure and flow control in high-throughput systems
Multi-tenancy patterns for SaaS backends
Securing an API: the basics teams still miss
