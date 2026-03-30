# Mongoose Schema Rules (Non-Negotiable)

## MSCH-1: Always include `orgId` with index
Every entity schema MUST have `orgId` as a required, indexed string prop.
```typescript
@Prop({ required: true, index: true })
orgId!: string;
```

## MSCH-2: Use `timestamps: true`
Always enable timestamps in the `@Schema` decorator. Never add manual `createdAt`/`updatedAt` props.
```typescript
@Schema({ timestamps: true, collection: "entities" })
```

## MSCH-3: Collection name must be explicit
Always specify the `collection` option in `@Schema()` using the plural, lowercase, kebab-friendly name.

## MSCH-4: Export `Document` type alias
Always export a `HydratedDocument` type alias for the schema class.
```typescript
export type CourseDocument = HydratedDocument<Course>;
```

## MSCH-5: Use `!` assertion on all props
All `@Prop` fields must use the non-null assertion operator.
```typescript
@Prop({ required: true, trim: true })
title!: string;
```

## MSCH-6: Use `trim: true` on string props
All user-facing string fields should have `trim: true` unless there's a reason not to.

## MSCH-7: Defaults via `@Prop`, not constructor
Use `@Prop({ default: "" })` for defaults, never class property initializers.

## MSCH-8: Repository extends `BaseRepository`
Every repository MUST extend `BaseRepository<EntityDocument>` and inject the model via `@InjectModel`.
```typescript
@Injectable()
export class CourseRepository extends BaseRepository<CourseDocument> {
  constructor(@InjectModel(Course.name) model: Model<CourseDocument>) {
    super(model);
  }
}
```

## MSCH-9: One schema file per entity
Place schema in `schemas/entity-name.schema.ts` inside the module directory.

## MSCH-10: Export `SchemaFactory` result
Always export the schema factory result for module registration.
```typescript
export const CourseSchema = SchemaFactory.createForClass(Course);
```
