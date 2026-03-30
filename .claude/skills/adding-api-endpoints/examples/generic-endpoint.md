> *This is a generic template. Replace `Product` with your entity and `@your-org/shared` with your shared package.*

# Generic CRUD Endpoint Template (Product)

## Controller — `product.controller.ts`

```typescript
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  createProductSchema, updateProductSchema,
  type CreateProductDto, type UpdateProductDto,
  PERMISSIONS,
} from "@your-org/shared";
import { Can } from "../../common/decorators/can.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe";
import { ProductService } from "./product.service";

@ApiTags("products")
@ApiBearerAuth()
@Controller("v1/products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Can(PERMISSIONS.PRODUCTS_CREATE)
  create(@CurrentUser() user, @Body(new ZodValidationPipe(createProductSchema)) dto: CreateProductDto) {
    return this.productService.create(user.orgId!, dto);
  }

  @Get()
  @Can(PERMISSIONS.PRODUCTS_VIEW)
  findAll(@CurrentUser() user) {
    return this.productService.findAll(user.orgId!);
  }

  @Get(":id")
  @Can(PERMISSIONS.PRODUCTS_VIEW)
  findOne(@CurrentUser() user, @Param("id") id: string) {
    return this.productService.findOne(user.orgId!, id);
  }

  @Patch(":id")
  @Can(PERMISSIONS.PRODUCTS_UPDATE)
  update(@CurrentUser() user, @Param("id") id: string, @Body(new ZodValidationPipe(updateProductSchema)) dto: UpdateProductDto) {
    return this.productService.update(user.orgId!, id, dto);
  }

  @Delete(":id")
  @Can(PERMISSIONS.PRODUCTS_DELETE)
  delete(@CurrentUser() user, @Param("id") id: string) {
    return this.productService.delete(user.orgId!, id);
  }
}
```

## TanStack Query Hooks — `use-products.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CreateProductDto, ProductResponse, UpdateProductDto } from "@your-org/shared";

const productKeys = {
  all: ["products"] as const,
  list: () => [...productKeys.all, "list"] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: productKeys.list(),
    queryFn: () => apiClient.get<{ data: ProductResponse[] }>("/v1/products").then((r) => r.data.data),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => apiClient.get<{ data: ProductResponse }>(`/v1/products/${id}`).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateProductDto) => apiClient.post("/v1/products", dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProductDto }) =>
      apiClient.patch(`/v1/products/${id}`, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/v1/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });
}
```

## Key patterns

1. **Query key factory** — hierarchical keys for precise cache invalidation
2. **`r.data.data`** — unwraps backend response envelope `{ data: T }`
3. **`invalidateQueries`** on mutations — keeps list fresh after create/update/delete
4. **`enabled: !!id`** — prevents query from firing with empty ID
5. **Separate hooks per operation** — one mutation per CRUD action
