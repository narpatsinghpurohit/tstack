import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Schema as MongooseSchema } from "mongoose";

export type InvitationDocument = HydratedDocument<Invitation>;

@Schema({ timestamps: true, collection: "invitations" })
export class Invitation {
	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: "Organization",
		required: true,
	})
	orgId: string;

	@Prop({ required: true, lowercase: true, trim: true })
	email: string;

	@Prop({ required: true })
	roleName: string;

	@Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
	invitedBy: string;

	@Prop({ required: true })
	tokenHash: string;

	@Prop({ type: Date, required: true })
	expiresAt: Date;

	createdAt: Date;
	updatedAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);

InvitationSchema.index({ orgId: 1, email: 1 });
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
