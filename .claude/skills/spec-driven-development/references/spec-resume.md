# Spec Resume

This reference covers session recovery: how to regain context when starting a new chat session and continuing work on an existing spec.

---

## When to Use

- Starting a new chat or session
- Resuming work on a spec after a break
- Getting oriented before executing the next task
- User says "continue working on {feature}" or "where were we?"

---

## Recovery Flow

### Step 1: Identify the Spec

Determine which spec to resume. Either:
- User names the feature: "Continue exam-evaluation"
- Check `specs/` directory for existing specs and ask the user which one

### Step 2: Read All Spec Documents

Read in this order:

```
specs/{feature-name}/
├── requirement/
│   ├── REQUIREMENT.md         ← Read first: understand WHAT we're building
│   └── resources/*.md         ← Read if they exist
├── design/
│   ├── DESIGN.md              ← Read second: understand HOW we're building it
│   └── resources/*.md         ← Read if they exist
└── tasks/
    └── TASK.md                ← Read third: understand progress and next steps
```

**Read ALL documents.** You need complete context before recommending next steps.

### Step 3: Check Document Status

Read the frontmatter `status` field on each document:

| Status | Meaning |
|--------|---------|
| `draft` | Document created but not yet approved |
| `in-progress` | Approved and execution has started |
| `completed` | All tasks done, spec is finished |
| `superseded` | Replaced by a newer spec (check `superseded-by` field) |

If status is `superseded`, follow the `superseded-by` path to the current spec.

If status is `completed`, report that the spec is finished and ask if the user wants to start a new feature or revisit something.

### Step 4: Analyze Task Progress

From `TASK.md`, count:

| Marker | Count | Meaning |
|--------|-------|---------|
| `[x]` | ? | Completed tasks |
| `[/]` | ? | In-progress (may need attention — interrupted work) |
| `[ ]` | ? | Pending tasks |
| `[~]` | ? | Deferred tasks |

Calculate completion percentage.

### Step 5: Check for In-Progress Tasks

If any task is marked `[/]`:
- This was started but not completed — likely an interrupted session
- Explore the codebase to check if partial work exists
- Options: continue it, reset to `[ ]`, or mark `[x]` if it's actually done

### Step 6: Check Deviations

Read the `## Deviations` section in `DESIGN.md`. If deviations exist, factor them into your understanding — the design doc may not fully match the current codebase.

### Step 7: Identify Next Task

Find the first `[ ]` pending task. Read its:
- Details and referenced requirements
- Referenced design sections
- Dependencies on completed tasks

---

## Context Report

After analysis, present a structured report:

```markdown
## Spec Status: {Feature Name}

### Overview
- **Feature:** {feature name}
- **Status:** {in-progress / draft / etc.}
- **Progress:** X of Y tasks complete (Z%)

### Completed
- [x] 1. {brief description}
- [x] 2.1 {brief description}

### In Progress (if any)
- [/] 2.2 {description} — needs attention

### Deferred (if any)
- [~] 6.2 {description} — {reason}

### Deviations from Design
- {Any logged deviations}

### Next Task
- [ ] 3.1 {description}
  - Requirements: {refs}
  - Design: {refs}
  - Depends on: {completed tasks it builds on}

### Ready to continue?
The next task is "{task title}". Should I proceed?
```

---

## After Recovery

Two options:

### Option 1: Report and Wait
Present the context report and wait for the user to decide.

### Option 2: Proceed to Execute
If the user confirms, transition to `spec-execution.md`:
- Use the gathered context
- Start executing the identified next task

---

## Edge Cases

### No Spec Found
- Ask the user for the correct feature name
- List available specs in `specs/` directory
- Suggest creating a new spec if none exists

### Incomplete Spec Documents
- `REQUIREMENT.md` missing → cannot proceed, need requirements first
- `DESIGN.md` missing → need design before execution
- `TASK.md` missing → need task list, suggest creating one

### All Tasks Complete
- Report that spec execution is finished
- Summarize what was built
- Check `## Deviations` for anything noteworthy
- Suggest next steps

### Stale Spec (completed but user wants changes)
- Recommend creating a follow-up spec rather than reopening a completed one
- If changes are small, use `spec-update.md` flow instead

---

## Codebase Verification (Optional)

If you need deeper confidence that previous tasks were actually completed:

1. Check that files mentioned in completed tasks exist
2. Verify key interfaces or components are implemented
3. Look for patterns referenced in the design

This is optional but useful when the `[/]` marker suggests interrupted work, or when there's been a long gap between sessions.
