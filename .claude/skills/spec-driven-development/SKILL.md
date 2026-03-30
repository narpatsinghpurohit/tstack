---
name: spec-driven-development
description: Spec-driven development workflow for medium-to-large features. Creates structured requirement, design, and task documents in specs/{feature}/ before implementation. Reduces AI assumptions, preserves context across sessions, and produces reviewable planning artifacts. Use when a feature touches 2+ apps, requires 3+ modules, involves new data models, or will span multiple sessions.
disable-model-invocation: true
argument-hint: [feature-name]
---

# Spec-Driven Development

## When to Use

Use this workflow when a feature:
- Touches 2+ apps (backend + web)
- Requires 3+ new modules/components
- Involves new data models or schemas
- Will span multiple coding sessions
- Has unclear requirements needing discovery

## Decision Tree

**Requirements clear + detailed?** → Express mode (skip guided discovery)
**Requirements vague or complex?** → Guided mode (structured discovery)

## Phases

### Phase 1: Requirements
Create `specs/{feature}/requirement/REQUIREMENT.md`
See [references/requirement-gathering.md](references/requirement-gathering.md)

### Phase 2: Design
Create `specs/{feature}/design/DESIGN.md`
See [references/design-creation.md](references/design-creation.md)

### Phase 3: Tasks
Create `specs/{feature}/tasks/TASK.md`
See [references/task-creation.md](references/task-creation.md)

### Phase 4: Execution
Use `feature-orchestrator` or implement tasks directly.
See [references/spec-execution.md](references/spec-execution.md)

## Resuming Work

When continuing a spec across sessions:
See [references/spec-resume.md](references/spec-resume.md)

## Updating Specs

When requirements change mid-implementation:
See [references/spec-update.md](references/spec-update.md)

## References

- [references/requirement-gathering.md](references/requirement-gathering.md)
- [references/design-creation.md](references/design-creation.md)
- [references/task-creation.md](references/task-creation.md)
- [references/spec-execution.md](references/spec-execution.md)
- [references/spec-resume.md](references/spec-resume.md)
- [references/spec-update.md](references/spec-update.md)
