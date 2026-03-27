# Paperclip — Autonomous Company Control Plane

> https://github.com/paperclipai/paperclip — 34k stars, MIT license
> "The backbone of the autonomous economy."

## What It Is

Paperclip is the **control plane** for zero-human companies. It orchestrates AI agents organized as a real company — with org charts, goals, budgets, governance, and accountability. If OpenClaw/Claude Code/etc. are the workers, Paperclip is the company operating system.

**Paperclip is NOT:**
- A chatbot
- An agent framework
- A workflow builder
- A prompt manager
- A code review tool

**Paperclip IS:**
- A control plane (not execution plane)
- A company modeling system
- A goal-aligned task orchestrator
- A cost-enforcing budget system
- A governance and approval system

## Core Concepts

### Company (First-Order Object)
Everything in Paperclip lives inside a **Company**. A company has:
- **Goal** — why it exists ("Build the #1 free micro-tool platform, reach 1M users")
- **Employees** — every employee is an AI agent
- **Org structure** — who reports to whom
- **Revenue & expenses** — tracked at company level
- **Task hierarchy** — all work traces back to company goal

### Goal Hierarchy (Task Parentage)
Every task traces back to the company goal through a chain:

```
I am fixing the navigation bug (current task)
  because → I need to improve site UX (parent)
    because → I need to reduce bounce rate (parent)
      because → I need to grow organic traffic (parent)
        because → I need to reach 1M users (parent)
          because → Build the #1 free micro-tool platform
```

**This is what keeps autonomous agents aligned.** They can always answer "why am I doing this?"

### Org Chart
Agents have:
- **Title** — CEO, CTO, Engineer, Marketer, etc.
- **Reporting line** — who they report to
- **Adapter config** — how this agent runs, what defines its identity/behavior
- **Capabilities description** — what this agent does (helps other agents discover who can help)

### Heartbeats
Agents wake on a schedule, check their work queue, do work, and report back. The delegation flows up and down the org chart.

```
wake → check inbox → pick highest priority task → do work → report → sleep
```

### Token Budgets
Every agent has a **token salary** (budget). When they hit the limit, they stop. No runaway costs. No hidden token burn.

### Approval Gates
Certain actions require **board approval** before execution. This prevents autonomous agents from making irreversible or expensive decisions without human sign-off.

### Ticket System
Every conversation is traced. Every decision is explained. Full tool-call tracing and immutable audit log. Work is never lost across reboots.

## Architecture: Control Plane vs Execution Plane

```
┌─────────────────────────────────────┐
│  CONTROL PLANE (Paperclip)          │
│                                     │
│  • Agent registry + org chart        │
│  • Task assignment + status          │
│  • Budget + token spend tracking    │
│  • Company knowledge base           │
│  • Goal hierarchy                   │
│  • Heartbeat monitoring             │
│  • Approval governance              │
│  • Audit logging                    │
└─────────────────────────────────────┘
           ↕ phone home
┌─────────────────────────────────────┐
│  EXECUTION SERVICES (Adapters)      │
│                                     │
│  • OpenClaw agents                  │
│  • Claude Code sessions             │
│  • Codex instances                  │
│  • Custom Python scripts            │
│  • HTTP webhooks                    │
│                                     │
│  Paperclip orchestrates. Agents run │
│  wherever they run and phone home.  │
└─────────────────────────────────────┘
```

## Why It Matters

| Without Paperclip | With Paperclip |
|---|---|
| 20 Claude Code tabs, can't track which does what | Ticket-based tasks, threaded conversations, sessions persist |
| Manual context gathering to remind bot what to do | Context flows from task → project → company goals |
| Folder of agent configs, reinventing task management | Org charts, ticketing, delegation, governance built-in |
| Runaway loops waste hundreds in tokens | Cost tracking + budget hard-stops |
| Recurring jobs need manual kicking off | Heartbeats handle regular work on schedule |
| Idea → find repo → fire up Claude → babysit | Add task in Paperclip, agent works it, management reviews |

## The Paperclip Product Principles

1. **Time-to-first-success under 5 minutes** — fresh user should see meaningful agent output in one sitting
2. **Board-level abstraction always wins** — default UI answers: what is the company doing, who is doing it, why does it matter, what did it cost, what needs approval
3. **Conversation stays attached to work objects** — chat with CEO still resolves to strategy threads, decisions, tasks, or approvals
4. **Progressive disclosure** — top: human-readable summary, middle: checklist/artifacts, bottom: raw logs/tool calls/transcript
5. **Output-first** — work is not done until there is a visible result: file, doc, preview link, screenshot, plan, PR
6. **Local-first, cloud-ready** — same mental model for solo use and shared/public deployment
7. **Safe autonomy** — auto mode allowed; hidden token burn is not
8. **Thin core, rich edges** — optional chat, knowledge, special surfaces go in plugins

## The Paperclip Engineering Rules (for building Paperclip itself)

From their AGENTS.md:

1. **Keep changes company-scoped** — every domain entity should be scoped to a company
2. **Keep contracts synchronized** — schema → shared types → server routes → UI (all in sync)
3. **Preserve control-plane invariants:**
   - Single-assignee task model
   - Atomic issue checkout semantics
   - Approval gates for governed actions
   - Budget hard-stop auto-pause behavior
   - Activity logging for mutating actions
4. **Definition of Done:**
   - Behavior matches SPEC-implementation.md
   - Typecheck, tests, and build pass
   - Contracts synced across all layers
   - Docs updated when behavior changes

## Key Quote

> "Paperclip is the control plane, the nervous system, the operating layer. Every autonomous company needs structure, task management, cost control, goal alignment, and human governance. We are to autonomous companies what the corporate operating system is to human ones — except this time, the operating system is real software, not metaphor."

## What Paperclip Means for TinyToolbox

TinyToolbox operates as a Paperclip-style autonomous company:
- Daniel = CEO / board of one
- Supervisor = executive assistant
- Domain agents = department heads
- Every task traces to company goal
- Budget awareness on every cycle
- Output as definition of done
- Approval gates for major strategic moves

The goal: tinytoolbox.co as a self-improving, autonomous business that runs 24/7 with measurable outcomes.
