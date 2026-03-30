# Spec Update

This reference covers modifying existing spec documents after initial creation, including handling pivots, scope changes, and discoveries during implementation.

---

## When to Use

- User requests changes to requirements, design, or tasks
- A gap is discovered during execution that requires spec changes
- Scope cut or scope expansion is needed
- Implementation discovery invalidates part of the design

---

## Update Flows

### Flow A: Requirement Update

When modifying `requirement/REQUIREMENT.md` or its resources:

1. Read current requirement documents
2. Understand the change request
3. Make modifications following EARS format
4. Mark new or changed acceptance criteria clearly
5. Present changes to user
6. Ask: **"Do the updated requirements look good?"**
7. Get explicit approval

**Cascade check** — after approval, evaluate impact:
- Does the design need updates? → Proceed to Flow B
- Do tasks need updates? → Proceed to Flow C
- No cascade needed → done

### Flow B: Design Update

When modifying `design/DESIGN.md` or its resources:

1. Read current design documents
2. Read requirement documents for context
3. Understand the change request
4. Make modifications to design
5. Update architecture diagrams if affected
6. Present changes to user
7. Ask: **"Does the updated design look good?"**
8. Get explicit approval

**Cascade check** — after approval:
- Do tasks need updates? → Proceed to Flow C
- No cascade needed → done

### Flow C: Task Update

When modifying `tasks/TASK.md`:

1. Read current task document
2. Read requirements and design for context
3. Make modifications following task format rules
4. Preserve completed task markers `[x]`
5. Preserve deferred markers `[~]` with reasons
6. Add new tasks at appropriate positions in the sequence
7. Update the `## Progress` counts
8. Present changes to user
9. Ask: **"Do the updated tasks look good?"**
10. Get explicit approval → done

---

## Cascade Rules

Changes can cascade downward but not upward:

```
REQUIREMENT change → may require DESIGN update → may require TASK update
DESIGN change → may require TASK update
TASK change → usually isolated
```

Always evaluate cascade impact after each approval. Don't skip levels — a requirement change that affects design should update design before updating tasks.

---

## Handling Pivots

### Pivot Type 1: Scope Cut (dropping something)

When a feature or sub-feature is no longer needed:

1. In `TASK.md`, mark affected tasks as deferred with reason:
   ```markdown
   - [~] 6.2 Admin score override endpoint — deferred, not needed for v1
   ```
2. In `REQUIREMENT.md`, mark the affected requirement:
   ```markdown
   ### REQ-7: Admin Score Override ~~[Deferred — v2]~~
   ```
3. No need to rewrite design — the deferred markers provide enough context
4. Update `## Progress` counts in `TASK.md`

This is cheap and reversible.

### Pivot Type 2: Approach Change (redoing something)

When the technical approach changes but the requirement stays the same:

**Localized change** (e.g., swap queue for sync processing):
1. Update the affected design resource file
2. Update the affected tasks
3. Present both for approval

**Fundamental change** (e.g., rethink the entire data model):
1. Mark the current spec folder as superseded:
   - Update frontmatter on all docs: `status: superseded`, `superseded-by: specs/{feature-name}-v2`
2. Create a new spec version:
   ```
   specs/{feature-name}/        # v1, superseded
   specs/{feature-name}-v2/     # current
   ```
3. In the new version, carry forward completed work and lessons learned
4. Start the spec workflow from requirements (or design, if requirements haven't changed)

A clean restart with lessons from v1 is faster than surgically updating a complex spec.

### Pivot Type 3: Discovery (learned something during implementation)

When implementation reveals new information:

1. Stop execution of the current task
2. Document the discovery in the relevant design resource file under `## Discovery`:
   ```markdown
   ## Discovery

   During task 3.2 implementation, found that the prompt-config API
   returns responses in a different format than assumed. The evaluation
   processor needs to handle both v1 and v2 response formats.
   ```
3. Present the discovery to the user with options:
   - **Continue as-is** — the discovery doesn't change the approach
   - **Update design** — need to revise the affected design section
   - **Pause and rethink** — fundamental impact, may need requirement changes

---

## Update Guidelines

### Requirements Changes
- Preserve existing requirement numbering (REQ-1, REQ-2, etc.)
- New requirements get the next available number
- Changed acceptance criteria get an `[Updated]` tag
- Removed requirements get a `[Removed]` or `[Deferred]` tag

### Design Changes
- Maintain document structure
- Update only affected sections
- Revise Mermaid diagrams if architecture changes
- Note breaking changes prominently
- Add entries to `## Deviations` if the change happened during execution

### Task Changes
- Never change markers on completed `[x]` tasks
- Update in-progress `[/]` markers if the task scope changed
- Insert new tasks at the correct position in the sequence
- Renumber if necessary (but prefer inserting as 2.3, 2.4 rather than renumbering everything)
- Ensure requirement and design references are accurate on new tasks

---

## Conflict Handling

### Found design gap during task update
1. Pause task updates
2. Complete design update (Flow B) first
3. Return to finish task updates

### Found requirement gap during design update
1. Pause design updates
2. Complete requirement update (Flow A) first
3. Return to finish design updates

### Disagreement between spec and codebase
If completed tasks produced code that doesn't match the spec:
1. The **codebase is the source of truth** for completed work
2. Update the spec (design deviations, task descriptions) to match reality
3. Do NOT rewrite working code to match an outdated spec

---

## After Updates

1. Summarize what was changed
2. Note any cascading updates made
3. If ready for implementation → proceed to `spec-execution.md`
4. If fundamental pivot → proceed through the new spec version's workflow
