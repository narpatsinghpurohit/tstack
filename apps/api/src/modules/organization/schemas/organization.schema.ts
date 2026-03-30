import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Schema as MongooseSchema } from "mongoose";

export type OrganizationDocument = HydratedDocument<Organization>;

@Schema({ timestamps: true, collection: "organizations" })
export class Organization {
	@Prop({ required: true, trim: true })
	name: string;

	@Prop({ required: true, unique: true, lowercase: true, trim: true })
	slug: string;

	@Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
	ownerId: string;

	@Prop({ default: "", lowercase: true, trim: true })
	contactEmail: string;

	@Prop({ default: "" })
	contactPhone: string;

	@Prop({ default: "" })
	address: string;

	@Prop({
		default: "active",
		enum: ["active", "suspended", "inactive"],
	})
	status: string;

	@Prop({ default: false })
	isPersonal: boolean;

	@Prop({ default: null })
	logoUrl: string | null;

	@Prop({ default: null })
	logoKey: string | null;

	createdAt: Date;
	updatedAt: Date;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
