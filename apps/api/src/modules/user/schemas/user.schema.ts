import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Schema as MongooseSchema } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: "users" })
export class User {
	@Prop({ required: true, unique: true, lowercase: true, trim: true })
	email: string;

	@Prop({ required: true })
	passwordHash: string;

	@Prop({ required: true, trim: true })
	firstName: string;

	@Prop({ required: true, trim: true })
	lastName: string;

	@Prop({ default: "" })
	phone: string;

	@Prop({ default: "active", enum: ["active", "inactive"] })
	status: string;

	@Prop({ type: [String], default: [] })
	roleNames: string[];

	@Prop({ type: [String], default: [] })
	directPermissions: string[];

	@Prop({ type: [String], default: [] })
	revokedPermissions: string[];

	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: "Organization",
		default: null,
	})
	currentOrgId: string | null;

	@Prop({ default: null })
	refreshTokenHash: string | null;

	@Prop({ type: Date, default: null })
	refreshTokenExpiresAt: Date | null;

	@Prop({ default: null })
	resetPasswordTokenHash: string | null;

	@Prop({ type: Date, default: null })
	resetPasswordTokenExpiresAt: Date | null;

	createdAt: Date;
	updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
