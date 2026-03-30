# Schema Rules (Non-Negotiable)

## SCH-1: Always create trio — create + update + response
Every entity needs: `createEntitySchema`, `updateEntitySchema`, `entityResponseSchema`.

## SCH-2: Use z.infer for types
Never define DTO types manually. Always: `type CreateEntityDto = z.infer<typeof createEntitySchema>`.

## SCH-3: Never define DTOs locally
DTOs live in `packages/shared/src/schemas/`, NOT in `apps/api/src/modules/*/dto/`.

## SCH-4: Export both schema and type
```typescript
export const createCourseSchema = z.object({ ... });
export type CreateCourseDto = z.infer<typeof createCourseSchema>;
```

## SCH-5: Update partial from create
```typescript
export const updateCourseSchema = createCourseSchema.partial();
```

## SCH-6: Response extends create with server fields
```typescript
export const courseResponseSchema = createCourseSchema.extend({
  _id: z.string(),
  orgId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
```
