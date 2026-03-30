import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Schema as MongooseSchema } from "mongoose";

export type MembershipDocument = HydratedDocument<Membership>;

@Schema({ timestamps: true, collection: "memberships" })
export class Membership {
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
	userId: string;

	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: "Organization",
		required: true,
	})
	orgId: string;

	@Prop({ type: [String], default: [] })
	roleNames: string[];

	@Prop({ type: [String], default: [] })
	directPermissions: string[];

	@Prop({ type: [String], default: [] })
	revokedPermissions: string[];

	@Prop({ default: "active", enum: ["active", "inactive"] })
	status: string;

	createdAt: Date;
	updatedAt: Date;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

MembershipSchema.index({ userId: 1, orgId: 1 }, { unique: true });
MembershipSchema.index({ orgId: 1 });
