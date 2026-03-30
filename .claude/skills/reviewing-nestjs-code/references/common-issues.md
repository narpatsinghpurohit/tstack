> *Code examples reference `@tstack/shared`. Replace with your project's shared package from CLAUDE.md.*

# Common NestJS Review Issues

## 1. Missing org scoping

**Bad:**
```typescript
findAll() {
  return this.repo.find({});
}
```

**Good:**
```typescript
findAll(@CurrentUser() user: AuthenticatedUser) {
  return this.service.findAll(user.orgId!);
}
```

## 2. DTO defined locally instead of shared

**Bad:**
```typescript
// apps/api/src/modules/course/dto/create-course.dto.ts
export class CreateCourseDto {
  @IsString() title: string;
}
```

**Good:**
```typescript
import { createCourseSchema, type CreateCourseDto } from "@tstack/shared";
```

## 3. Missing duplicate check before create

**Bad:**
```typescript
async create(orgId: string, dto: CreateCourseDto) {
  return this.repo.create({ orgId, ...dto });
}
```

**Good:**
```typescript
async create(orgId: string, dto: CreateCourseDto) {
  const existing = await this.repo.findOneByOrg(orgId, { title: dto.title });
  if (existing) throw new ConflictException("A course with this title already exists");
  return this.repo.create({ orgId, ...dto });
}
```

## 4. Direct model access in service

**Bad:**
```typescript
// In service
const results = await this.courseModel.find({ orgId }).lean().exec();
```

**Good:**
```typescript
// In service — delegates to repository
const results = await this.courseRepository.findManyByOrg(orgId);
```

## 5. Missing permission decorator

**Bad:**
```typescript
@Delete(":id")
delete(@Param("id") id: string) { ... }
```

**Good:**
```typescript
@Delete(":id")
@Can(PERMISSIONS.COURSES_DELETE)
delete(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { ... }
```

## 6. Circular dependency without forwardRef

**Bad:**
```typescript
@Module({
  imports: [SubjectModule, BatchModule],
})
```

**Good (when circular):**
```typescript
@Module({
  imports: [forwardRef(() => SubjectModule), forwardRef(() => BatchModule)],
})
```

## 7. Missing existence check before delete

**Bad:**
```typescript
async delete(orgId: string, id: string) {
  return this.repo.deleteOneByOrg(orgId, { _id: id });
}
```

**Good:**
```typescript
async delete(orgId: string, id: string) {
  const deleted = await this.repo.deleteOneByOrg(orgId, { _id: id });
  if (!deleted) throw new NotFoundException("Course not found");
  return deleted;
}
```

## 8. Sequential queries that could be parallel

**Bad:**
```typescript
const subjectCount = await this.subjectRepo.countByOrg(orgId, { courseId: id });
const batchCount = await this.batchRepo.countByOrg(orgId, { courseId: id });
```

**Good:**
```typescript
const [subjectCount, batchCount] = await Promise.all([
  this.subjectRepo.countByOrg(orgId, { courseId: id }),
  this.batchRepo.countByOrg(orgId, { courseId: id }),
]);
```
