import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Schema as MongooseSchema } from "mongoose";

export type SystemSettingDocument = HydratedDocument<SystemSetting>;

@Schema({ timestamps: true, collection: "system_settings" })
export class SystemSetting {
	@Prop({ required: true, unique: true })
	key: string;

	@Prop({ type: MongooseSchema.Types.Mixed })
	value: unknown;

	createdAt: Date;
	updatedAt: Date;
}

export const SystemSettingSchema = SchemaFactory.createForClass(SystemSetting);
