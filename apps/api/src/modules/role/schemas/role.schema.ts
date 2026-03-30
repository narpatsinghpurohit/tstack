import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true, collection: "roles" })
export class Role {
	@Prop({ required: true, unique: true, trim: true })
	name: string;

	@Prop({ default: "" })
	description: string;

	@Prop({ type: [String], default: [] })
	permissionNames: string[];

	@Prop({ default: false })
	isDefault: boolean;

	createdAt: Date;
	updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
