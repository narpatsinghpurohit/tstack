> *Code examples reference `@tstack/shared`. Replace with your project's shared package from CLAUDE.md.*

# Example: React Component Test (Real Codebase)

## ChapterList test — `chapter-list.test.tsx`

```typescript
import { type ChapterResponse, PERMISSIONS } from "@tstack/shared";
import userEvent from "@testing-library/user-event";
import { http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiUrl, jsonSuccess } from "@/test/http";
import { server } from "@/test/msw-server";
import { renderWithProviders, screen, waitFor, within } from "@/test/test-utils";
import { ChapterList } from "./chapter-list";

// Hoisted mocks — vi.hoisted runs before imports
const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  useCan: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock("sonner", () => ({
  toast: { success: mocks.toastSuccess, error: mocks.toastError },
}));

vi.mock("@/features/auth/hooks/use-can", () => ({
  useCan: mocks.useCan,
}));

const chapter: ChapterResponse = {
  _id: "chapter-1",
  orgId: "org-1",
  subjectId: "subject-1",
  title: "Cell Structure",
  contentMarkdown: "Plant cells contain chloroplasts.",
  order: 0,
  createdAt: "2026-03-01T10:00:00.000Z",
  updatedAt: "2026-03-02T10:00:00.000Z",
};

function setPermissions(permissions: string[]) {
  mocks.useCan.mockReturnValue({
    can: (permission: string) => permissions.includes(permission),
  });
}

function installHandlers(chapters: ChapterResponse[] = [chapter]) {
  server.use(
    http.get(apiUrl("/v1/chapters"), () => jsonSuccess(chapters)),
    http.delete(apiUrl("/v1/chapters/:id"), () => jsonSuccess(chapter)),
  );
}

describe("ChapterList", () => {
  beforeEach(() => {
    setPermissions([
      PERMISSIONS.CHAPTERS_CREATE,
      PERMISSIONS.CHAPTERS_UPDATE,
      PERMISSIONS.CHAPTERS_DELETE,
    ]);
    installHandlers();
  });

  it("renders chapter content and actions", async () => {
    renderWithProviders(<ChapterList subjectId="subject-1" />);

    expect(await screen.findByText("Cell Structure")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Chapter" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete Cell Structure" })).toBeInTheDocument();
  });

  it("hides actions when user lacks permissions", async () => {
    setPermissions([PERMISSIONS.CHAPTERS_CREATE]);

    renderWithProviders(<ChapterList subjectId="subject-1" />);

    expect(await screen.findByText("Cell Structure")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Chapter" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete Cell Structure" })).not.toBeInTheDocument();
  });

  it("confirms deletion before deleting", async () => {
    const user = userEvent.setup();
    setPermissions([PERMISSIONS.CHAPTERS_DELETE]);

    renderWithProviders(<ChapterList subjectId="subject-1" />);

    await user.click(await screen.findByRole("button", { name: "Delete Cell Structure" }));

    const dialog = await screen.findByRole("alertdialog", { name: "Delete Chapter" });
    await user.click(within(dialog).getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(mocks.toastSuccess).toHaveBeenCalledWith("Chapter deleted");
    });
  });
});
```

## Key patterns

1. **Vitest** — `vi.fn()`, `vi.mock()`, `vi.hoisted()` (not Jest)
2. **MSW for API mocking** — `server.use(http.get(...))`, not `jest.mock("axios")`
3. **`renderWithProviders`** — custom wrapper with QueryClient, Router, etc.
4. **`screen.findByText`** — async queries for data-fetching components
5. **`screen.queryByRole`** — assert elements are NOT present
6. **`userEvent.setup()`** — realistic user interactions
7. **Permission testing** — `setPermissions()` helper to test UI gating
8. **`vi.hoisted()`** — mock values accessible inside `vi.mock()` callbacks
9. **`within(dialog)`** — scoped queries for modals/dialogs
10. **`waitFor`** — assert async side effects (toasts, API calls)
