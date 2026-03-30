# Task Creation

This reference covers Phase 3 of spec-driven development: converting the approved design into an actionable, ordered list of implementation tasks.

---

## Prerequisites

- `REQUIREMENT.md` must exist and be approved
- `DESIGN.md` must exist and be approved
- Read both documents before generating tasks

---

## Task Generation Principle

Convert the design into a series of incremental, code-focused tasks. Each task should be concrete enough for an AI agent to execute without ambiguity. Tasks build on each other — no orphaned code that isn't integrated into a prior step.

---

## TASK.md Structure

Create `specs/{feature-name}/tasks/TASK.md`:

```markdown
---
status: draft
last-verified: YYYY-MM-DD
---

# Implementation Plan: {Feature Name}

## Progress

- Total: X tasks
- Completed: 0
- In Progress: 0
- Deferred: 0

## Tasks

- [ ] 1. {Task title} [risk: high]
  - {What to create or modify}
  - {Specific files, components, or modules}
  - _Requirement: REQ-1, REQ-2_
  - _Design: DESIGN.md > Data Models_

- [ ] 2. {Task group title}
- [ ] 2.1 {Sub-task title} [risk: medium]
  - {What to create or modify}
  - _Requirement: REQ-3_
  - _Design: resources/data-models.md_

- [ ] 2.2 {Sub-task title} [risk: low]
  - {What to create or modify}
  - _Requirement: REQ-3_
  - _Design: resources/evaluation-queue.md_

[Continue...]
```

---

## Task Format Rules

### Structure
- **Numbered checkbox list** with maximum **two levels of hierarchy**
- Top-level items for grouping (like epics) only when needed
- Sub-tasks numbered with **decimal notation** (1.1, 1.2, 2.1)

### Each Task MUST Include
- A clear objective involving **writing, modifying, or testing code**
- Specific files or components to create or modify
- Reference to specific requirements (e.g., `REQ-1`, `REQ-3.2`)
- Reference to specific design sections or resource files
- Enough detail for an agent to execute without clarification
- A `[risk: high | medium | low]` annotation (see Risk Tier below)

### Each Task MUST NOT Include
- User acceptance testing or manual testing steps
- Deployment or environment setup
- Performance benchmarking or metrics gathering
- Documentation creation (unless code comments)
- Business process or organizational changes
- Any action that cannot be completed by writing, modifying, or testing code

**Automated tests are allowed and encouraged** — the exclusion is manual testing.

---

## Task Ordering Guidelines

1. **Shared schemas first** — Zod schemas in `packages/shared` that both apps depend on
2. **Data models next** — Mongoose schemas, repositories
3. **Backend services** — Business logic, then controllers
4. **Queue processors** — If the feature has async processing
5. **Frontend API hooks** — TanStack Query hooks that call the new endpoints
6. **Frontend UI** — Pages, components, forms
7. **Wiring** — Route registration, module registration, permission wiring
8. **Tests** — Can be inline with each task or as a final task group

Each step MUST build incrementally on previous steps. After any task, the codebase should be in a working (or at least compilable) state.

---

## Risk Tier

Every task must include a `[risk: high | medium | low]` annotation. This drives the review strategy during execution — `[risk: high]` tasks get a scoped code review; others get lint only, with a phase-level review at the end of each phase.

| Tier | Examples |
|------|----------|
| `high` | New Mongoose schema, auth/permission wiring, queue logic, cross-app contracts, service logic that owns business rules |
| `medium` | API endpoints, complex components, TanStack Query hooks, controller mapping |
| `low` | Zod DTOs, shared index exports, route additions, UI labels, icon buttons, config constants |

```markdown
- [ ] 1. Create PromptConfig Mongoose schema [risk: high]
- [ ] 2. Export schema from shared index [risk: low]
```

When in doubt between two tiers, choose the higher one.

---

## Task Sizing

**Too small:** "Add the `name` field to the schema" — this is a single line change, not worth a task boundary and review cycle.

**Too big:** "Implement the entire exam evaluation backend" — this hides complexity and gives the AI no incremental checkpoints.

**Right size:** "Create ExamSession and Submission Mongoose schemas with repositories" — a coherent unit of work that produces a reviewable artifact.

**Rule of thumb:** A task should touch 1-4 files and take the AI one focused execution cycle to complete.

---

## Status Markers

| Marker | Status | Meaning |
|--------|--------|---------|
| `[ ]` | Pending | Not started |
| `[/]` | In Progress | Currently being worked on |
| `[x]` | Complete | Done and verified |
| `[~]` | Deferred | Intentionally skipped, with reason noted |

Deferred tasks include a reason:

```markdown
- [~] 6.2 Admin score override endpoint — deferred, not needed for v1
```

---

## Review Gate

After creating or updating tasks:

1. Present the task list to the user
2. Call out the total count, estimated grouping, and execution order rationale
3. Ask: **"Does the task list look good? Any changes before we start execution?"**
4. If user requests changes → make them, present again
5. If user identifies design gaps → redirect to spec-update workflow
6. If user approves → update frontmatter `status: draft` to `status: in-progress`, ready for execution

**Do NOT start executing tasks without explicit approval.**
