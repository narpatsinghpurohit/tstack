# Requirement Gathering

This reference covers Phase 1 of spec-driven development: understanding what needs to be built and documenting it clearly before any design or implementation work begins.

---

## Two-Tier Question Model

### Tier 1 — Blockers (ask before writing anything)

Ask these questions **all at once** (not one by one). These are the minimum needed to write a meaningful requirement doc:

1. **Users/Roles:** Who uses this feature? Which roles interact with it?
2. **Core Input/Output:** What goes in and what comes out? What is the primary action?
3. **Existing Modules:** Which existing parts of the system does this touch? (courses, batches, students, etc.)
4. **Hard Constraints:** Any deadline, third-party API, specific technology, or platform limitation?
5. **Scope Boundary:** What is explicitly NOT part of this feature?

Wait for answers before proceeding. If the user provides partial answers, fill in what you can and ask only about the gaps.

### Tier 2 — Assumptions (state, don't ask)

For everything else — edge cases, error handling, validation rules, UI specifics, performance considerations — write your best assumption directly into the requirement doc and mark it:

```markdown
3. **[Assumed]** IF student loses network during exam THEN system SHALL preserve answers via local storage and sync on reconnect
```

The `[Assumed]` tag invites the user to correct it during review. This is faster than asking questions the user might not have thought about yet.

---

## Express Mode Handling

If the user's initial message contains detailed requirements (specific data models, user flows, acceptance criteria), skip tier-1 questions:

1. Convert the user's input into the standard `REQUIREMENT.md` format
2. Add `[Assumed]` tags for anything you inferred
3. Present for review

---

## REQUIREMENT.md Structure

Create `specs/{feature-name}/requirement/REQUIREMENT.md`:

```markdown
---
status: draft
last-verified: YYYY-MM-DD
---

# Requirements: {Feature Name}

## Introduction

[2-3 sentences: what this feature is, why it exists, who it serves]

## Scope

### In Scope
- [Bullet list of what this feature covers]

### Out of Scope
- [Bullet list of what this feature explicitly does NOT cover]

## Requirements

### REQ-1: {Requirement Title}

**User Story:** As a {role}, I want {feature}, so that {benefit}

#### Acceptance Criteria

1. WHEN {event} THEN system SHALL {response}
2. IF {precondition} THEN system SHALL {response}
3. **[Assumed]** WHEN {event} AND {condition} THEN system SHALL {response}

### REQ-2: {Requirement Title}

[Continue for each requirement...]

## Cross-Cutting Concerns

### Permissions
- Which roles can access which parts of this feature?
- New permissions needed? (reference `permission-guidelines` skill)

### Multi-Tenancy
- All data must be scoped to `orgId`

### Performance
- Any expected load or response time requirements?
```

## EARS Format Reference

Use these patterns for acceptance criteria:

| Pattern | Format | Example |
|---------|--------|---------|
| **Ubiquitous** | `system SHALL {response}` | System SHALL display a loading indicator |
| **Event-driven** | `WHEN {event} THEN system SHALL {response}` | WHEN user clicks submit THEN system SHALL validate input |
| **Conditional** | `IF {precondition} THEN system SHALL {response}` | IF user is authenticated THEN system SHALL show dashboard |
| **State-driven** | `WHILE {state} system SHALL {response}` | WHILE offline system SHALL queue requests |
| **Optional** | `WHERE {feature} system SHALL {response}` | WHERE dark mode enabled system SHALL use dark theme |
| **Combined** | `IF {condition} WHEN {event} THEN system SHALL {response}` | IF cart not empty WHEN checkout clicked THEN system SHALL proceed to payment |

---

## When to Split Into Resources

Create `requirement/resources/` when the feature has **3+ distinct domain areas** that each need detailed acceptance criteria. The main `REQUIREMENT.md` stays as an overview with high-level user stories, and each resource file dives deep into one domain.

**Split by user role or domain boundary**, not by technical component:

| Good Split (by domain) | Bad Split (by tech) |
|------------------------|---------------------|
| `question-paper-management.md` | `mongoose-schemas.md` |
| `student-exam-flow.md` | `api-endpoints.md` |
| `ai-evaluation-pipeline.md` | `react-components.md` |

Each resource file follows the same EARS format for acceptance criteria but focuses on its specific domain. The main `REQUIREMENT.md` links to them:

```markdown
## Detailed Requirements

For detailed acceptance criteria, see:
- [Question Paper Management](resources/question-paper-management.md)
- [Student Exam Flow](resources/student-exam-flow.md)
- [AI Evaluation Pipeline](resources/ai-evaluation-pipeline.md)
```

---

## Review Gate

After creating or updating requirements:

1. Present the document to the user (summarize key points, don't just say "I wrote it")
2. Highlight all `[Assumed]` items — these need explicit confirmation or correction
3. Ask: **"Do the requirements look good? Any changes before we move to design?"**
4. If user requests changes → make them, present again
5. If user approves → update frontmatter `status: draft` to `status: in-progress`, proceed to design phase

**Do NOT proceed to design without explicit approval.**

---

## Checklist

Before moving to design, verify:

- [ ] All tier-1 questions answered
- [ ] Scope boundary defined (in scope / out of scope)
- [ ] Acceptance criteria written in EARS format
- [ ] Permissions model identified
- [ ] All assumptions marked with `[Assumed]`
- [ ] User has explicitly approved the requirements
