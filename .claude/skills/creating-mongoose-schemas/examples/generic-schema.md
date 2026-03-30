> *This is a generic template. Replace `Product` with your entity.*

# Generic Mongoose Schema Template (Product)

## Schema — `schemas/product.schema.ts`

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

## Repository — `product.repository.ts`

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

## Module registration

```typescript
MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
```

## Key patterns

1. **`orgId`** — always first field, required + indexed
2. **`timestamps: true`** — never add manual date fields
3. **`collection: "products"`** — explicit plural collection name
4. **`trim: true`** on user-facing strings
5. **`default: ""`** for optional string fields
6. **`HydratedDocument<T>`** type alias exported
7. **`SchemaFactory.createForClass`** exported as const
8. **Repository extends `BaseRepository`** — no raw model queries
