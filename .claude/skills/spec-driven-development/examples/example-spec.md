# Example: Teacher Content Management Spec

## Directory structure

```
specs/teacher-content-management/
├── requirement/
│   ├── REQUIREMENT.md          # Main requirements doc
│   └── resources/
│       ├── chapter-management.md
│       ├── question-bank.md
│       ├── question-paper-management.md
│       └── cross-cutting-concerns.md
├── design/
│   ├── DESIGN.md               # Technical design
│   └── resources/
│       ├── data-models.md
│       ├── api-endpoints.md
│       ├── frontend-components.md
│       └── file-upload.md
└── tasks/
    └── TASK.md                 # Implementation plan with checkboxes
```

## REQUIREMENT.md structure

```markdown
---
status: completed
last-verified: 2026-03-07
---

# Requirements: Feature Name

## Introduction
One paragraph explaining what this feature does and why.

## Scope
### In Scope
- Bullet list of what's included

### Out of Scope
- Bullet list of what's explicitly excluded

## Detailed Requirements
Links to resources/ files with REQ-N numbered requirements.

## Data Model Summary
Table of entities with scope and purpose.

## Cross-Cutting Concerns
### Permissions — table mapping actions to PERMISSIONS constants
### Multi-Tenancy — orgId + BaseRepository enforcement
### Performance — assumptions and pagination needs
```

## TASK.md structure

```markdown
---
status: completed
last-verified: 2026-03-07
---

# Implementation Plan: Feature Name

## Progress
- Total: 20 tasks
- Completed: 20

## Tasks

### Phase 1: Foundation
- [x] 1. Task name
  - Sub-step details
  - _Requirement: REQ-N_
  - _Design: resources/section-name_

### Phase 2: Backend
- [x] 2. Task name
  ...

### Phase 3: Frontend
- [ ] 3. Task name
  ...
```

## Key conventions

1. **Frontmatter with status** — `completed`, `in-progress`, or `draft`
2. **Numbered requirements** — REQ-1 through REQ-N with acceptance criteria
3. **Phased tasks** — Foundation → Backend → Frontend → Tests → Polish
4. **Cross-references** — Tasks link back to requirements and design sections
5. **Resource files** — Detailed specs split into focused resource docs
6. **Checkbox tracking** — `[x]` for completed, `[ ]` for pending, `[-]` for deferred
