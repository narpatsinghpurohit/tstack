> *This is a generic template. Replace `Product` with your entity and `@your-org/shared` with your shared package.*

# Generic NestJS Module Template (Product)

## 1. Zod Schema — `packages/shared/src/schemas/product.schema.ts`

```typescript
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional().default(""),
  price: z.coerce.number().min(0),
  isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const productResponseSchema = createProductSchema.extend({
  _id: z.string(),
  orgId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
```

## 2. Mongoose Schema — `schemas/product.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, collection: "products" })
export class Product {
  @Prop({ required: true, index: true })
  orgId!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true, default: "" })
  description!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ default: true })
  isActive!: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
```

## 3. Repository — `product.repository.ts`

```typescript
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import { BaseRepository } from "../../core/database/base.repository";
import { Product, type ProductDocument } from "./schemas/product.schema";

@Injectable()
export class ProductRepository extends BaseRepository<ProductDocument> {
  constructor(@InjectModel(Product.name) model: Model<ProductDocument>) {
    super(model);
  }
}
```

## 4. Service — `product.service.ts`

```typescript
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import type { CreateProductDto, UpdateProductDto } from "@your-org/shared";
import { ProductRepository } from "./product.repository";

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(orgId: string, dto: CreateProductDto) {
    const existing = await this.productRepository.findOneByOrg(orgId, { name: dto.name });
    if (existing) throw new ConflictException("A product with this name already exists");
    return this.productRepository.create({ orgId, ...dto });
  }

  async findAll(orgId: string) {
    return this.productRepository.findManyByOrg(orgId);
  }

  async findOne(orgId: string, id: string) {
    const product = await this.productRepository.findOneByOrg(orgId, { _id: id });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async update(orgId: string, id: string, dto: UpdateProductDto) {
    const product = await this.productRepository.updateOneByOrg(orgId, { _id: id }, dto);
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async delete(orgId: string, id: string) {
    const product = await this.productRepository.deleteOneByOrg(orgId, { _id: id });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }
}
```

## 5. Controller — `product.controller.ts`

```typescript
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { createProductSchema, updateProductSchema, type CreateProductDto, type UpdateProductDto } from "@your-org/shared";
import { Can } from "../../common/decorators/can.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe";
import { PERMISSIONS } from "@your-org/shared";
import { ProductService } from "./product.service";

@ApiTags("products")
@ApiBearerAuth()
@Controller("v1/products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Can(PERMISSIONS.PRODUCTS_CREATE)
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createProductSchema)) dto: CreateProductDto,
  ) {
    return this.productService.create(user.orgId!, dto);
  }

  @Get()
  @Can(PERMISSIONS.PRODUCTS_VIEW)
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.productService.findAll(user.orgId!);
  }

  @Get(":id")
  @Can(PERMISSIONS.PRODUCTS_VIEW)
  findOne(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.productService.findOne(user.orgId!, id);
  }

  @Patch(":id")
  @Can(PERMISSIONS.PRODUCTS_UPDATE)
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) dto: UpdateProductDto,
  ) {
    return this.productService.update(user.orgId!, id, dto);
  }

  @Delete(":id")
  @Can(PERMISSIONS.PRODUCTS_DELETE)
  delete(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.productService.delete(user.orgId!, id);
  }
}
```

## 6. Module — `product.module.ts`

```typescript
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "./schemas/product.schema";
import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
```

Register in `app.module.ts`:
```typescript
import { ProductModule } from "./modules/product/product.module";

@Module({ imports: [..., ProductModule] })
```
