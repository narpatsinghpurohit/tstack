import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true, collection: "permissions" })
export class Permission {
	@Prop({ required: true, unique: true })
	name: string;

	@Prop({ default: "" })
	description: string;

	@Prop({ default: "" })
	group: string;

	createdAt: Date;
	updatedAt: Date;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
