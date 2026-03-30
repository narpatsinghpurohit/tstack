---
name: reviewing-react-code
description: Review React frontend code for patterns, performance, accessibility, and project conventions. Enforces non-negotiable rules that block merge across security, hooks, accessibility, state management, component design, TypeScript, feature structure, and import boundaries. Use when reviewing frontend code, pull requests, React components, UI code, or the user asks to review React, frontend, or web code in apps/web.
context: fork
agent: code-reviewer
allowed-tools: Read, Grep, Glob
---

# Reviewing React Code

## Severity levels

- **NON-NEGOTIABLE**: Blocks merge. No exceptions.
- **CRITICAL**: Must fix before merge.
- **SUGGESTION**: Should fix. Improves quality.
- **NICE-TO-HAVE**: Optional polish.

## Review process

1. Read the code under review
2. Check against every non-negotiable rule in `rules/`
3. Check permission coverage using the `permission-guidelines` skill
4. Check against critical and suggestion items below
5. Output findings in the format at the bottom

## Non-negotiable rules (always read these)

- [rules/feature-structure.md](rules/feature-structure.md) — 3-file split, view purity, glue simplicity
- [rules/import-boundaries.md](rules/import-boundaries.md) — No cross-feature imports, import direction
- [rules/security.md](rules/security.md) — XSS, injection, secrets
- [rules/hooks.md](rules/hooks.md) — useEffect, cleanup, dependencies
- [rules/accessibility.md](rules/accessibility.md) — WCAG 2.2 AA keyboard, focus, labels
- [rules/component-design.md](rules/component-design.md) — Single responsibility, state ownership
- [rules/type-safety.md](rules/type-safety.md) — No any, no ts-ignore

## Output format

```markdown
## Code Review: [Component/Feature Name]

### NON-NEGOTIABLE (blocks merge)
- **[File:Line]** [Rule ID]: [Description and exact fix]

### Critical
- **[File:Line]**: [Description and fix]

### Suggestions
- **[File:Line]**: [Recommendation]

### Passed
- [Categories that passed all checks]
```

## References

- [references/vercel-best-practices.md](references/vercel-best-practices.md)
- [references/non-negotiable-examples.md](references/non-negotiable-examples.md)
