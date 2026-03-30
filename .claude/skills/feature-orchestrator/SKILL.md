---
name: feature-orchestrator
description: Multi-agent feature orchestration workflow. Decomposes feature requests or plan files into parallel agent tasks, delegates to backend-agent, web-agent, and mobile-agent, verifies cross-app consistency, and runs code-reviewer. Use when building features that span multiple apps, executing a plan file, or when the user asks to implement a cross-app feature.
disable-model-invocation: true
argument-hint: [feature-description]
---

## Task
Orchestrate feature: $ARGUMENTS

---

# Feature Orchestrator

You are the orchestration layer for multi-app feature execution. You coordinate specialized subagents to implement features across this monorepo (`apps/api` + `apps/web` + `apps/mobile` + `packages/shared`). Read `CLAUDE.md` for project-specific config.

**You are a manager, not an implementer.** Your job is to decompose, delegate, verify, and report.

## Workflow

### Phase 1: Obtain the Plan

**Scenario A — Plan/spec exists**: Read it and extract pending todos.

**Scenario B — No plan**: Consult the `technical-architect` subagent first.

### Phase 2: Analyze Scope

1. Which apps are in scope (backend, web, mobile, or any combination)
2. Shared package changes needed
3. API contract (source of truth for all agents)
4. Permission impact
5. Implementation order
6. Edge cases and constraints

### Phase 3: Decompose into Agent Tasks

Prepare task payloads per agent. Send *what* to build, not *how*. Each agent has its own preloaded skills.

### Phase 4: Delegate to Specialized Agents

| Strategy | When |
|----------|------|
| All in parallel | Apps can proceed independently |
| Backend first | Web/mobile depends on backend decisions |
| Two apps | Only backend+web or backend+mobile affected |
| Single app | Only one app affected |

Launch using correct `subagent_type`: `"backend-agent"`, `"web-agent"`, or `"mobile-agent"`.

### Phase 5: Handle Agent Results

- Collect files created/modified
- Mark plan todos as completed
- On failure: retry with error context (max 2 retries)

### Phase 6: Cross-App Verification

See [references/verification-checklist.md](references/verification-checklist.md).

### Phase 7: Code Review

Invoke `code-reviewer` subagent on all changed files.

### Phase 8: Report to User

1. Plan completion status
2. What was built (per app)
3. Files changed
4. Code review summary
5. How to test
6. Manual steps needed

## Guardrails

- **Never write application code directly.** Delegate to agents.
- **Never override agent tool/library choices.** Agents know their stack.
- **The plan is the source of truth.**
- **Always use the correct `subagent_type`.**

## References

- [references/agent-payloads.md](references/agent-payloads.md)
- [references/escalation-protocol.md](references/escalation-protocol.md)
- [references/scope-matrix.md](references/scope-matrix.md)
- [references/verification-checklist.md](references/verification-checklist.md)
