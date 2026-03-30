> *Code examples reference `@tstack/shared`. Replace with your project's shared package from CLAUDE.md.*

# 3-File Pattern — Reference Examples

Every feature follows the same pattern. These examples show how the pattern scales naturally — more files in `_hooks/` and `_components/` as the feature grows, but the core 3 files never change.

---

## Example 1: List Page (course-list)

```
features/course-list/
├── course-list.hook.ts
├── course-list.view.tsx
├── course-list.tsx
├── index.ts
├── use-courses.ts                   # API hooks
├── _components/
│   └── course-form-dialog.tsx       # Create/edit dialog
```

### Hook

```typescript
// course-list.hook.ts
import { useState } from 'react';
import { useCourses } from './use-courses';
import { useCan } from '@/features/auth/hooks/use-can';
import { PERMISSIONS } from '@tstack/shared';
import type { CourseResponse } from '@tstack/shared';

export type CourseListViewProps = {
  courses: CourseResponse[];
  isLoading: boolean;
  error: Error | null;
  canCreate: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  createDialog: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
};

export function useCourseList(): CourseListViewProps {
  const { data, isLoading, error } = useCourses();
  const { can } = useCan();
  const [searchQuery, setSearchQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = (data ?? []).filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return {
    courses: filtered,
    isLoading,
    error: error as Error | null,
    canCreate: can(PERMISSIONS.COURSES_CREATE),
    searchQuery,
    onSearchChange: setSearchQuery,
    createDialog: { open: createOpen, onOpenChange: setCreateOpen },
  };
}
```

### View

```typescript
// course-list.view.tsx
import type { CourseListViewProps } from './course-list.hook';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CourseFormDialog } from './_components/course-form-dialog';

export function CourseListView({
  courses,
  isLoading,
  error,
  canCreate,
  searchQuery,
  onSearchChange,
  createDialog,
}: CourseListViewProps) {
  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (error) return <p className="text-destructive">{error.message}</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
        {canCreate ? (
          <Button onClick={() => createDialog.onOpenChange(true)}>Add Course</Button>
        ) : null}
      </div>
      {courses.map((course) => (
        <div key={course._id} className="rounded-lg border p-4">
          <h3 className="font-semibold">{course.title}</h3>
        </div>
      ))}
      <CourseFormDialog open={createDialog.open} onOpenChange={createDialog.onOpenChange} />
    </div>
  );
}
```

### Glue

```typescript
// course-list.tsx
import { useCourseList } from './course-list.hook';
import { CourseListView } from './course-list.view';

export function CourseList() {
  return <CourseListView {...useCourseList()} />;
}
```

---

## Example 2: Detail Page with Tabs (course-detail)

```
features/course-detail/
├── course-detail.hook.ts
├── course-detail.view.tsx
├── course-detail.tsx
├── index.ts
├── use-course.ts
├── _components/
│   ├── course-info-tab.tsx
│   ├── subject-list-tab.tsx
│   └── batch-list-tab.tsx
```

### Hook

```typescript
// course-detail.hook.ts
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCourse, useDeleteCourse } from './use-course';
import { useCan } from '@/features/auth/hooks/use-can';
import { PERMISSIONS } from '@tstack/shared';
import type { CourseResponse } from '@tstack/shared';

export type CourseDetailViewProps = {
  course: CourseResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  canUpdate: boolean;
  canDelete: boolean;
  deletion: {
    isPending: boolean;
    onDelete: () => void;
  };
};

export function useCourseDetail(courseId: string): CourseDetailViewProps {
  const { data, isLoading, error } = useCourse(courseId);
  const deleteMutation = useDeleteCourse();
  const { can } = useCan();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');

  const handleDelete = () => {
    deleteMutation.mutate(courseId, {
      onSuccess: () => navigate({ to: '/admin/courses' }),
    });
  };

  return {
    course: data,
    isLoading,
    error: error as Error | null,
    activeTab,
    onTabChange: setActiveTab,
    canUpdate: can(PERMISSIONS.COURSES_UPDATE),
    canDelete: can(PERMISSIONS.COURSES_DELETE),
    deletion: { isPending: deleteMutation.isPending, onDelete: handleDelete },
  };
}
```

### View

```typescript
// course-detail.view.tsx
import type { CourseDetailViewProps } from './course-detail.hook';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CourseInfoTab } from './_components/course-info-tab';
import { SubjectListTab } from './_components/subject-list-tab';
import { BatchListTab } from './_components/batch-list-tab';

export function CourseDetailView({
  course,
  isLoading,
  error,
  activeTab,
  onTabChange,
  canUpdate,
  canDelete,
  deletion,
}: CourseDetailViewProps) {
  if (isLoading) return <Skeleton className="h-60 w-full" />;
  if (error) return <p className="text-destructive">{error.message}</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        {canDelete ? (
          <Button
            variant="destructive"
            disabled={deletion.isPending}
            onClick={deletion.onDelete}
          >
            Delete
          </Button>
        ) : null}
      </div>
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <CourseInfoTab course={course} canUpdate={canUpdate} />
        </TabsContent>
        <TabsContent value="subjects">
          <SubjectListTab courseId={course._id} />
        </TabsContent>
        <TabsContent value="batches">
          <BatchListTab courseId={course._id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

Note: `_components/` like `SubjectListTab` CAN use hooks internally. They are not views.

---

## Example 3: Complex Feature (paper-editor)

```
features/paper-editor/
├── paper-editor.hook.ts
├── paper-editor.view.tsx
├── paper-editor.tsx
├── index.ts
├── use-paper.ts
├── _hooks/
│   ├── use-paper-form.ts
│   ├── use-paper-sections.ts
│   └── use-bank-picker.ts
├── _components/
│   ├── section-card.tsx
│   ├── question-card.tsx
│   ├── bank-picker-dialog.tsx
│   └── section-reorder-handle.tsx
```

### Hook (composes _hooks/)

```typescript
// paper-editor.hook.ts
import { usePaperForm } from './_hooks/use-paper-form';
import { usePaperSections } from './_hooks/use-paper-sections';
import { useBankPicker } from './_hooks/use-bank-picker';
import type { QuestionPaperResponse, Section } from '@tstack/shared';

export type PaperEditorViewProps = {
  paper: QuestionPaperResponse | undefined;
  isLoading: boolean;
  form: {
    title: string;
    onTitleChange: (v: string) => void;
    duration: number;
    onDurationChange: (v: number) => void;
  };
  sections: {
    items: Section[];
    onReorder: (from: number, to: number) => void;
    onAdd: () => void;
    onDelete: (id: string) => void;
    activeId: string | null;
    onSelect: (id: string) => void;
  };
  bankPicker: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    results: BankQuestion[];
    onSelect: (questionIds: string[]) => void;
    isSearching: boolean;
  };
  submission: {
    isPending: boolean;
    onSubmit: () => void;
    onSaveDraft: () => void;
  };
};

export function usePaperEditor(paperId: string): PaperEditorViewProps {
  const form = usePaperForm(paperId);
  const sections = usePaperSections(paperId);
  const bankPicker = useBankPicker();

  return {
    paper: form.paper,
    isLoading: form.isLoading,
    form: {
      title: form.title,
      onTitleChange: form.setTitle,
      duration: form.duration,
      onDurationChange: form.setDuration,
    },
    sections: {
      items: sections.items,
      onReorder: sections.reorder,
      onAdd: sections.add,
      onDelete: sections.remove,
      activeId: sections.activeId,
      onSelect: sections.select,
    },
    bankPicker: {
      open: bankPicker.open,
      onOpenChange: bankPicker.setOpen,
      searchQuery: bankPicker.searchQuery,
      onSearchChange: bankPicker.setSearchQuery,
      results: bankPicker.results,
      onSelect: bankPicker.selectQuestions,
      isSearching: bankPicker.isSearching,
    },
    submission: {
      isPending: form.isSubmitting,
      onSubmit: form.handleSubmit,
      onSaveDraft: form.handleSaveDraft,
    },
  };
}
```

### View (pure rendering of complex UI)

```typescript
// paper-editor.view.tsx
import type { PaperEditorViewProps } from './paper-editor.hook';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionCard } from './_components/section-card';
import { BankPickerDialog } from './_components/bank-picker-dialog';

export function PaperEditorView({
  paper,
  isLoading,
  form,
  sections,
  bankPicker,
  submission,
}: PaperEditorViewProps) {
  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!paper) return <p>Paper not found</p>;

  return (
    <div className="space-y-6">
      <Input value={form.title} onChange={(e) => form.onTitleChange(e.target.value)} />

      <DndContext collisionDetection={closestCenter} onDragEnd={/* from sections.onReorder */}>
        <SortableContext items={sections.items} strategy={verticalListSortingStrategy}>
          {sections.items.map((section) => (
            <SectionCard
              key={section._id}
              section={section}
              isActive={section._id === sections.activeId}
              onSelect={() => sections.onSelect(section._id)}
              onDelete={() => sections.onDelete(section._id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" onClick={sections.onAdd}>Add Section</Button>
      <Button variant="outline" onClick={() => bankPicker.onOpenChange(true)}>
        Add from Bank
      </Button>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={submission.onSaveDraft}>Save Draft</Button>
        <Button disabled={submission.isPending} onClick={submission.onSubmit}>Publish</Button>
      </div>

      <BankPickerDialog {...bankPicker} />
    </div>
  );
}
```

---

## Example 4: Feature with Route Params (course-editor)

Create/edit merged into one feature with `mode`.

```
features/course-editor/
├── course-editor.hook.ts
├── course-editor.view.tsx
├── course-editor.tsx
├── index.ts
```

### Glue accepts params and determines mode

```typescript
// course-editor.tsx
import { useCourseEditor } from './course-editor.hook';
import { CourseEditorView } from './course-editor.view';

type CourseEditorProps = {
  courseId?: string;  // undefined = create mode
};

export function CourseEditor({ courseId }: CourseEditorProps) {
  return <CourseEditorView {...useCourseEditor(courseId)} />;
}
```

### Hook

```typescript
// course-editor.hook.ts
export function useCourseEditor(courseId?: string): CourseEditorViewProps {
  const mode = courseId ? 'edit' : 'create';
  const { data } = useCourse(courseId!, { enabled: mode === 'edit' });
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  // ...
  return { mode, form, submission };
}
```

### Route

```typescript
// routes/.../courses/new.lazy.tsx — create
function NewCoursePage() {
  return <CourseEditor />;
}

// routes/.../courses/$courseId/edit.lazy.tsx — edit
function EditCoursePage() {
  const { courseId } = Route.useParams();
  return <CourseEditor courseId={courseId} />;
}
```

---

## Example 5: Cross-Feature Data Sharing

When `course-detail` and `batch-enrollment` both need course data:

```
// BEFORE: each feature has its own use-courses.ts — duplicated

// AFTER: promote to shared
shared/api/queries/course.queries.ts    # Query hooks + key factory
features/course-detail/course-detail.hook.ts    # imports from shared
features/batch-enrollment/batch-enrollment.hook.ts  # imports from shared
```

The shared query file is identical to the feature-local one — just moved:

```typescript
// shared/api/queries/course.queries.ts
export const courseKeys = { /* same */ };
export function useCourses() { /* same */ }
export function useCourse(id: string) { /* same */ }
```

Both features import from the same source. One query cache. One invalidation.
