# Agent Task Payloads

Use these templates when preparing task prompts for specialized agents. Fill in the placeholders from the plan.

**Important**: Do NOT include implementation rules or conventions in the payload. Each agent reads its own preloaded skills for conventions, patterns, and rules. Sending them wastes context and risks contradicting the agent's own docs. Send *what* to build, not *how* to build it.

**Available agents**: `backend-agent`, `web-agent`, `mobile-agent`

---

## Payload Template (All Agents)

```
## Feature
{2-3 sentence overview from the plan's `overview` field}

## API Contract (source of truth — MUST match exactly)
{Copy the API contract verbatim from the plan. Include endpoints, DTOs, enums, schema changes.}

## Files to Create
{List from the plan's file tables for this specific app}

## Files to Modify
{List from the plan's file tables for this specific app}

## Constraints and Edge Cases
{Relevant edge cases from the plan that affect this specific app}

## Plan Todo IDs You Are Responsible For
{List the specific todo IDs from the plan this agent should complete}

## What to Return
When done, report:
1. List of all files created or modified (full paths)
2. The exact endpoint paths / route paths registered
3. Any new environment variables needed
4. Any issues, decisions, or deviations from the plan
5. Whether all assigned todo IDs were completed
```

---

## Launch Examples

### Parallel Launch (Backend + Web)

```
// In a single message, launch both:

Task(
  subagent_type: "backend-agent",
  description: "Implement backend for {feature}",
  prompt: "{payload with backend-specific files/todos}"
)

Task(
  subagent_type: "web-agent",
  description: "Implement web for {feature}",
  prompt: "{payload with web-specific files/todos}"
)
```

### Sequential Launch (Backend first, then Web)

```
// First message:
Task(
  subagent_type: "backend-agent",
  description: "Implement backend for {feature}",
  prompt: "{payload}"
)

// After backend agent returns, include its output in web payload:
// "The backend agent confirmed endpoints: POST /things, GET /things/:id"

Task(
  subagent_type: "web-agent",
  description: "Implement web for {feature}",
  prompt: "{payload + backend confirmation}"
)
```

### Targeted Fix (after verification finds an issue)

```
Task(
  subagent_type: "web-agent",
  description: "Fix {specific issue} in web",
  prompt: "The web implementation of {feature} has an issue:

  Problem: {describe the mismatch or bug}
  Expected: {what the plan/contract says}
  Actual: {what was implemented}

  Files to fix:
  - {specific file path}

  Fix the {specific issue} to match the API contract."
)
```

---

## Notes on Payload Preparation

1. **API contract is always included** — Every agent needs it, even for UI-only work (to match response types)
2. **Be specific about files** — List exact file paths, not vague descriptions
3. **Include todo IDs** — So the agent can report which todos it completed
4. **Constraints are per-app** — Only include edge cases relevant to that specific app
5. **If the plan has an implementation order section** — Respect it when deciding parallel vs sequential

---

## What NOT to Include in Payloads

These cause agents to deviate from their own skill guidelines. Never include any of the following:

### Library/tool directives
- "Use X library" or "Don't use Y library"
- "The app uses plain pushState routing, extend that pattern"
- "Use shadcn/ui Button and Input (already installed)"

### Codebase state descriptions about tooling
- "TanStack Router is not installed"
- "The project currently doesn't use react-hook-form"
- "Available shadcn components: Button, Input, Label"

### Simplicity directives that override conventions
- "Keep it simple, no need for a full router"
- "Use a minimal approach"
- "Don't over-engineer, just use useState"

### Why this matters
Each agent has skills that define its mandatory stack. When the orchestrator says "don't use X" or "the project doesn't have Y", the agent interprets this as an override and skips its own conventions. This produces code that works but violates project guidelines. The agent is responsible for reading the codebase, determining what's installed, and installing anything missing.
