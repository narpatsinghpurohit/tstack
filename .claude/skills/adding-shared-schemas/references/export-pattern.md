> *Code examples reference `@tstack/shared`. Replace with your project's shared package from CLAUDE.md.*

# Shared Schema Export Pattern

## File location

All Zod schemas live in `packages/shared/src/schemas/`.

```
packages/shared/src/schemas/
├── index.ts              # Re-exports everything
├── course.schema.ts
├── chapter.schema.ts
├── bank-question.schema.ts
├── question-paper.schema.ts
└── upload.schema.ts
```

## Schema file template

```typescript
// packages/shared/src/schemas/entity.schema.ts
import { z } from "zod";

// 1. Create schema
export const createEntitySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional().default(""),
});

// 2. Update schema (partial of create)
export const updateEntitySchema = createEntitySchema.partial();

// 3. Response schema (create + server fields)
export const entityResponseSchema = createEntitySchema.extend({
  _id: z.string(),
  orgId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 4. Inferred types
export type CreateEntityDto = z.infer<typeof createEntitySchema>;
export type UpdateEntityDto = z.infer<typeof updateEntitySchema>;
export type EntityResponse = z.infer<typeof entityResponseSchema>;
```

## Index re-export

```typescript
// packages/shared/src/schemas/index.ts
export * from "./course.schema";
export * from "./chapter.schema";
export * from "./bank-question.schema";
export * from "./question-paper.schema";
export * from "./upload.schema";
```

## Package entry point

```typescript
// packages/shared/src/index.ts
export * from "./constants";
export * from "./schemas";
```

## Consuming in NestJS

```typescript
import { createCourseSchema, type CreateCourseDto } from "@tstack/shared";

@Body(new ZodValidationPipe(createCourseSchema)) dto: CreateCourseDto
```

## Consuming in React

```typescript
import { createCourseSchema, type CreateCourseDto } from "@tstack/shared";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm<CreateCourseDto>({
  resolver: zodResolver(createCourseSchema),
});
```
