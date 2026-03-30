# Escalation Protocol

When to consult which entity during orchestration.

---

## Consult the Technical Architect

Use `Task(subagent_type: "technical-architect", readonly: true)` when:

| Situation | What to Ask |
|-----------|-------------|
| Plan is unclear or incomplete | "The plan says X but doesn't specify Y. What's the right approach?" |
| Sub-agents produce conflicting outputs | "Backend implemented X, but web expected Y. The plan says Z. Which is correct?" |
| Edge case not covered by plan | "What should happen when {edge case}? The plan doesn't address this." |
| Need to deviate from the plan | "The plan says X but I think we need Y because {reason}. Should we deviate?" |
| Scope question | "The plan says backend-only but this feature clearly needs a web page. Should we expand scope?" |

**Always use `readonly: true`** — the architect plans, it doesn't implement.

---

## Ask the User

Escalate to the user when:

| Situation | How to Ask |
|-----------|------------|
| Product/business ambiguity | "Should students see X? The plan doesn't specify the business rule." |
| Priority conflict | "The plan has 12 todos. Should I implement all of them or focus on a subset?" |
| Portal decision | "The plan mentions web but doesn't specify if this is admin portal or student portal. Which one?" |
| Resource concern | "This feature touches both apps. Should I implement both now or defer one?" |
| Manual action needed | "This requires adding env var X to the deployment. Please add it before testing." |

---

## Retry Failed Agents

When a sub-agent fails:

### Retry Strategy

1. **First retry**: Append the error context to the original task prompt
   ```
   Task(
     subagent_type: "{same agent}",
     description: "Retry: {feature} {app}",
     prompt: "{original payload}

     ## Previous Attempt Failed
     Error: {error message}
     Context: {what went wrong}

     Please fix the issue and complete the implementation."
   )
   ```

2. **Second retry**: If the same error recurs, try a different approach
   ```
   Task(
     subagent_type: "{same agent}",
     description: "Retry v2: {feature} {app}",
     prompt: "{original payload}

     ## Previous Attempts Failed (2x)
     Attempt 1 error: {error}
     Attempt 2 error: {error}

     Try a different approach. Consider: {alternative suggestion}."
   )
   ```

3. **After 2 retries**: Report to user
   ```
   "The {app} agent failed after 2 retries. Here's what happened:
   - Attempt 1: {error summary}
   - Attempt 2: {error summary}
   - Files successfully created before failure: {list}
   - What remains to be done: {list}
   
   Would you like me to try a different approach, or would you prefer to handle this manually?"
   ```

### Max Retry Limits

| Phase | Max Retries |
|-------|-------------|
| Agent implementation | 2 per agent |
| Code review fix cycles | 2 cycles (review → fix → review → fix → report) |
| Verification fixes | No limit for minor fixes; 1 retry for targeted agent fixes |

---

## Convention Compliance Failures

When verification (Phase 6) reveals agents didn't follow their own conventions:

| Situation | Action |
|-----------|--------|
| Agent used `useState` routing instead of TanStack Router | Dispatch a targeted fix to the web-agent — do NOT tell it to "skip the router" |
| Agent used raw `useEffect`+`fetch` instead of TanStack Query | Dispatch a targeted fix to the web-agent or mobile-agent |
| Agent used manual form state instead of `react-hook-form` | Dispatch a targeted fix to the web-agent or mobile-agent |
| Agent used custom HTML instead of `shadcn/ui` components | Dispatch a targeted fix to the web-agent |
| Agent used ScrollView + .map() instead of FlatList | Dispatch a targeted fix to the mobile-agent |
| Agent used inline styles instead of NativeWind | Dispatch a targeted fix to the mobile-agent |
| Agent used manual navigation instead of React Navigation | Dispatch a targeted fix to the mobile-agent |

**Root cause check**: If the agent deviated, first check your own task payload. If you told the agent to skip a convention, that's your bug — fix the payload and re-dispatch.

---

## Do NOT Escalate

Handle these yourself (as the main agent):

- **Minor import/registration issues** — Fix directly (add module to `app.module.ts`, add export to `packages/shared/src/index.ts`, etc.)
- **Linter errors in generated code** — Fix directly if the fix is obvious
- **Missing file headers or formatting** — Fix directly
- **Obvious typos in generated code** — Fix directly
