# Table Permission Rules

Permission-specific rules for tables with row-level actions or row navigation. Reference: `apps/web/src/features/admin/components/subject-list.tsx`.

---

## Rule 1: Conditional Actions Column

**Requirement:** If the user has no permission for any row action (edit, delete, assign, prompt configs, etc.), do not render the Actions column. Showing an empty Actions column is inconsistent with permission gating.

- Derive a single boolean from the union of all row-action permissions, e.g. `showActionsColumn = Boolean(canUpdate || canDelete || canAssign || …)`.
- Conditionally render **both** the `<TableHead>Actions</TableHead>` **and** each row’s actions `<TableCell>` using that same boolean. Never render the header without the cells or vice versa.

**Violation:** Actions column header and cells always rendered; cells are empty when user has no action permissions.

**Correct:** `showActionsColumn` gates both header and cells. When false, the Actions column is omitted entirely.

---

## Rule 2: Gate Row Navigation on View Permission

**Requirement:** Navigation from a table row to a detail page must be gated by the same permission(s) that protect that resource on the backend. Do not expose a link or row navigation to the detail when the user lacks the corresponding view (or equivalent) permission.

- Determine which permission(s) allow access to the detail route (e.g. view chapters, view question bank, view question papers).
- Only enable navigation (whether by row click or by a link in a cell) when the user has at least one of those permissions. If the user has none, the row must not navigate — show the row content only.
- Use the same permission names as the backend uses for the detail resource.

**Violation:** Row or title link navigates to detail page regardless of permission; or navigation is shown when user has no view permission.

**Correct:** A `canOpenRow` (or equivalent) derived from the relevant view permissions controls whether navigation is available. When the user has no permission, no navigation occurs.

---

## Summary Checklist

When building or reviewing a permission-aware table:

- [ ] **Rule 1:** Actions column (header + cells) is rendered only when at least one row-action permission is present (`showActionsColumn`).
- [ ] **Rule 2:** Row or link navigation to detail is gated by the permission(s) that protect that detail resource; no navigation when the user lacks that permission.

Reference: `apps/web/src/features/admin/components/subject-list.tsx`, `apps/web/src/features/admin/components/batch-list.tsx`, `apps/web/src/features/admin/components/course-list.tsx`.
