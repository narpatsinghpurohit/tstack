# Example: Full CRUD Endpoint (Course)

## Backend Controller

```typescript
@ApiTags("course")
@ApiBearerAuth()
@Controller("courses")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Can(PERMISSIONS.COURSES_CREATE)
  @ApiOperation({ summary: "Create a course" })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createCourseSchema)) dto: CreateCourseDto,
  ) {
    return this.courseService.create(user.orgId!, dto);
  }

  @Get()
  @Can(PERMISSIONS.COURSES_VIEW)
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.courseService.findAll(user.orgId!);
  }

  @Get(":id")
  @Can(PERMISSIONS.COURSES_VIEW)
  findById(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.courseService.findById(user.orgId!, id);
  }

  @Patch(":id")
  @Can(PERMISSIONS.COURSES_UPDATE)
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateCourseSchema)) dto: UpdateCourseDto,
  ) {
    return this.courseService.update(user.orgId!, id, dto);
  }

  @Delete(":id")
  @Can(PERMISSIONS.COURSES_DELETE)
  delete(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.courseService.delete(user.orgId!, id);
  }
}
```

## Frontend TanStack Query Hooks

```typescript
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

export function useCourses() {
  return useQuery<CourseResponse[]>({
    queryKey: courseKeys.lists(),
    queryFn: () => apiClient.get("/courses").then((r) => r.data),
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCourseDto) => apiClient.post("/courses", dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.lists() }),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/courses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.lists() }),
  });
}
```

## Checklist

- [x] Zod schemas in shared: `createCourseSchema`, `updateCourseSchema`
- [x] Permission decorators: `@Can(PERMISSIONS.COURSES_*)` on each route
- [x] `@CurrentUser()` → `orgId` passed to service
- [x] Query key factory with hierarchical invalidation
- [x] Mutations invalidate on success
