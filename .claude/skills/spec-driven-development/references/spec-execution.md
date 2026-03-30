# Spec Execution

This reference covers Phase 4 of spec-driven development: implementing tasks from an approved spec one at a time with user review between each task.

---

## Critical Rules

These are **non-negotiable**:

1. **Read all spec documents** before executing any task — `REQUIREMENT.md`, `DESIGN.md` (+ resources), `TASK.md`
2. **Execute ONE task at a time**
3. **Pause before writing code** for each task — show the task and plan, then wait briefly before implementing
4. **Do NOT implement functionality** belonging to other tasks
5. **Verify implementation** against task requirements and design
6. **Run lints on every task** — `ReadLints` on all modified files; fix before advancing
7. **Use risk tier for review decisions** — Tasks annotated `[risk: high]` require a scoped code review; `[risk: medium]` and `[risk: low]` require lint only
8. **Commit after each task** — commit only files touched by the task + `specs/{feature}/tasks/TASK.md`
9. **Run a phase milestone review** before starting the next phase

---

## Understanding User Intent

The user may ask about tasks without wanting to execute them.

| User Says | Intent | Your Action |
|-----------|--------|-------------|
| "Execute next task" / "Start task 2.1" | Execute | Begin execution flow |
| "What's the next task?" / "Show me task 3" | Information | Report the task, don't execute |
| "Continue" / "Next" / "Proceed" | Execute | Confirm which task, then execute |
| "How many tasks left?" / "What's the progress?" | Information | Report status only |

**Rule:** If the user is asking a question, answer it. Don't start implementing.

---

## Before First Execution

On the first execution in a session:

1. Read all spec documents (requirement, design, tasks)
2. Check `TASK.md` for current progress markers
3. Identify the next `[ ]` pending task
4. Report current progress: "X of Y tasks complete. Next task is {title}. Should I proceed?"
5. Wait for confirmation

---

## Execution Flow

### Step 1: Context Gathering

For the selected task:
1. Read task details from `TASK.md`
2. Read referenced requirements and acceptance criteria
3. Read referenced design sections or resource files
4. Explore existing codebase for patterns relevant to this task

### Step 2: Mark In-Progress

Update `TASK.md`:
```diff
- [ ] 2.1 Create user model
+ [/] 2.1 Create user model
```

### Step 3: Implementation

1. Implement **only** what the current task specifies
2. Follow patterns from the design document
3. Follow existing codebase conventions
4. Use the appropriate skills for implementation (`generating-nestjs-modules`, `generating-react-features`, `permission-guidelines`, etc.)
5. Write tests if the task specifies testing
6. Do NOT make changes outside task scope

### Step 4: Verification

After implementation:
1. Verify against task requirements — does it satisfy the referenced acceptance criteria?
2. Verify against design — does it follow the specified interfaces and patterns?

### Step 5: Lint Check

Run `ReadLints` on all modified files. Fix any lint or syntax errors introduced by this task before proceeding.

### Step 6: Code Review (risk: high only)

Check the task's `[risk: high | medium | low]` annotation:

- **`[risk: medium]` or `[risk: low]`** — skip this step, lint is sufficient
- **`[risk: high]`** — run a scoped code review:
  1. Run `code-reviewer` agent scoped only to the files touched by this task
  2. Fix all findings — do not defer findings to later tasks
  3. Re-run review until the agent reports clean
  4. If a finding reveals a design gap → stop and redirect to `spec-update.md`

### Step 7: Mark Complete

Update `TASK.md`:
```diff
- [/] 2.1 Create user model
+ [x] 2.1 Create user model
```

Update the `## Progress` section counts.

### Step 8: Log Deviations

If implementation diverged from the design in any way:
- Add the deviation to `DESIGN.md` under `## Deviations`
- Keep it brief: what changed and why

### Step 9: Commit

Commit using exactly:
- All files created or modified by this task
- `specs/{feature}/tasks/TASK.md`

Do NOT include files from other tasks or unrelated changes. Use a commit message that names the task.

### Step 10: Advance to Next Task

1. Summarize what was implemented
2. List files created or modified
3. Note any deviations or discoveries that might affect future tasks
4. **If all tasks in the current phase are complete** → run a Phase Milestone Review (see below) before continuing
5. Automatically begin context gathering for the next pending task
6. Present the next task and your implementation plan — **pause before writing any code** so the user can redirect if needed

---

## Phase Milestone Review

Run this after completing all tasks in a phase (e.g., all "Phase 1: Backend" tasks), before starting the next phase.

1. Run `code-reviewer` agent across **all files touched during that phase**
2. Fix any findings before starting the next phase
3. Inform the user: "Phase X complete and reviewed. Starting Phase Y."

This is the primary quality gate for `[risk: medium]` and `[risk: low]` tasks that skipped per-task reviews, catching integration-level issues before the next phase builds on them.

---

## Cross-App Task Execution

For tasks that touch both `apps/api` and `apps/web`, delegate to the `feature-orchestrator` skill which coordinates `backend-agent` and `web-agent` subagents. Pass the spec paths so agents have full context.

For tasks that touch only one app, execute directly using the appropriate skills.

---

## Handling Gaps During Execution

### Found Missing Requirements
1. Stop implementation
2. Note the gap to the user
3. Redirect to `spec-update.md` to add requirements
4. Resume only after specs are updated and approved

### Found Design Issues
1. Stop implementation
2. Document the issue
3. Redirect to `spec-update.md` to revise design
4. Resume only after specs are updated and approved

### Task Is Unclear
1. Ask the user for clarification before implementing
2. If clarification reveals a design gap → redirect to `spec-update.md`
3. If clarification is minor → proceed

### Found Bug Outside Current Task Scope
1. If bug is in current task scope → fix as part of the task
2. If bug is outside scope → note it but do NOT fix it now
3. Add a note to `TASK.md` under a `## Discovered Issues` section

### Discovery During Implementation
If you learn something that changes the understanding of future tasks:
1. Add a `## Discovery` note in the relevant design resource file
2. Inform the user in the task completion report
3. Let the user decide whether to update the spec or continue as-is

---

## When All Tasks Are Complete

### Final Review

Before marking documents complete:

1. Run `technical-architect` agent (readonly) across the full implementation
2. The architect reviews for:
   - Architectural drift from the approved design
   - Cross-task inconsistencies not caught in phase reviews
   - Performance or security concerns
3. Fix any critical findings
4. Log non-critical findings in `DESIGN.md` under `## Deviations` for future reference

### Close Out

1. Update `TASK.md` frontmatter to `status: completed`
2. Update `DESIGN.md` frontmatter to `status: completed`
3. Update `REQUIREMENT.md` frontmatter to `status: completed`
4. Set `last-verified` to today's date on all documents
5. Ensure `## Deviations` in `DESIGN.md` is complete
6. Summarize what was built across all tasks
7. List any deferred tasks with reasons
8. Suggest next steps (testing, follow-up features, etc.)
