> *This is a generic template. Replace `Product` with your entity and `@your-org/shared` with your shared package.*

# Generic Zod Schema Template (Product)

## Schema file — `packages/shared/src/schemas/product.schema.ts`

```typescript
import { z } from "zod";

// 1. Create schema — fields for creating a new entity
export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional().default(""),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  isActive: z.boolean().optional().default(true),
});

// 2. Update schema — all fields optional (partial of create)
export const updateProductSchema = createProductSchema.partial();

// 3. Response schema — create + server-generated fields
export const productResponseSchema = createProductSchema.extend({
  _id: z.string(),
  orgId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 4. Inferred types — NEVER define manually
export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
```

## Export — `packages/shared/src/schemas/index.ts`

```typescript
export * from "./product.schema";
```

## NestJS consumption

```typescript
import { createProductSchema, type CreateProductDto } from "@your-org/shared";

// In controller
@Body(new ZodValidationPipe(createProductSchema)) dto: CreateProductDto
```

## React consumption

```typescript
import { createProductSchema, type CreateProductDto } from "@your-org/shared";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm<CreateProductDto>({
  resolver: zodResolver(createProductSchema),
  defaultValues: { name: "", description: "", price: 0, isActive: true },
});
```

## Key patterns

1. **`z.coerce.number()`** for fields that come as strings from forms/query params
2. **`.optional().default()`** for fields with sensible defaults
3. **`.partial()`** generates update schema automatically
4. **`.extend()`** adds server fields to create response schema
5. **`z.infer<>`** infers TypeScript types — never define types manually
