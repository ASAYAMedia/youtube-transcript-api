# superpowers — Jesse Vincent's Agentic Skills Framework

> https://github.com/obra/superpowers — 116k stars, MIT license
> By Jesse Vincent / Prime Radiant

## The Core Insight

**Agents MUST NOT jump straight into code. They must think first.**

## The Basic Workflow

1. **brainstorming** — Activates before writing code. Refines rough ideas through questions, explores alternatives, presents design in sections for validation. Saves design document.
2. **using-git-worktrees** — Activates after design approval. Creates isolated workspace on new branch, runs project setup, verifies clean test baseline.
3. **writing-plans** — Activates with approved design. Breaks work into bite-sized tasks (2-5 minutes each). Every task has exact file paths, complete code, verification steps.
4. **subagent-driven-development** or **executing-plans** — Activates with plan. Dispatches fresh subagent per task with two-stage review (spec compliance, then code quality), or executes in batches with human checkpoints.
5. **test-driven-development** — Activates during implementation. Enforces RED-GREEN-REFACTOR: write failing test, watch it fail, write minimal code, watch it pass, commit. Deletes code written before tests.
6. **requesting-code-review** — Activates between tasks. Reviews against plan, reports issues by severity. Critical issues block progress.
7. **finishing-a-development-branch** — Activates when tasks complete. Verifies tests, presents options (merge/PR/keep/discard), cleans up worktree.

## The Iron Law (Non-Negotiable)

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Write code before tests → delete it and start over with TDD. No exceptions.

## RED-GREEN-REFACTOR Cycle

```
RED: Write failing test. Watch it fail for the RIGHT reason.
GREEN: Minimal code to pass. Nothing more.
REFACTOR: Clean up, keep tests green.
```

## brainstorming Skill (Key Details)

- Check project context first (files, docs, recent commits)
- Ask clarifying questions ONE AT A TIME
- Propose 2-3 approaches with tradeoffs + recommendation
- Present design in digestible sections, get approval after each
- Write design doc to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
- Spec self-review: placeholder scan, internal consistency, scope check, ambiguity check
- User reviews spec before proceeding
- ONLY THEN → invoke writing-plans skill

## writing-plans Skill (Key Details)

- Bite-sized = one action per step: write failing test → run it → write minimal code → run test → commit
- No placeholders ever. No "TBD", no "TODO", no "implement later", no "similar to Task N"
- File structure mapping before task decomposition
- Plan document MUST start with agent handoff header
- Every step must contain actual content — no red flags

## Anti-Pattern: "This Is Too Simple To Need A Design"

Every project goes through this process. A todo list, a single-function utility, a config change — all of them.

## Philosophy

- **Test-Driven Development** — Write tests first, always
- **Systematic over ad-hoc** — Process over guessing
- **Complexity reduction** — Simplicity as primary goal
- **Evidence over claims** — Verify before declaring success
