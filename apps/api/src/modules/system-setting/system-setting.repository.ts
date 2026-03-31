import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import {
	SystemSetting,
	type SystemSettingDocument,
} from "./schemas/system-setting.schema";

/**
 * SystemSetting is a global entity (no orgId). Uses direct model access.
 */
@Injectable()
export class SystemSettingRepository {
	constructor(
		@InjectModel(SystemSetting.name)
		private readonly settingModel: Model<SystemSettingDocument>,
	) {}

	async findAll(): Promise<SystemSetting[]> {
		return this.settingModel.find().sort({ key: 1 }).lean().exec() as Promise<
			SystemSetting[]
		>;
	}

	async findByKey(key: string): Promise<SystemSetting | null> {
		return this.settingModel.findOne({ key }).lean().exec();
	}

	async upsert(key: string, value: unknown): Promise<SystemSetting> {
		const doc = await this.settingModel
			.findOneAndUpdate(
				{ key },
				{ $set: { key, value } },
				{ upsert: true, new: true },
			)
			.lean()
			.exec();
		return doc as SystemSetting;
	}
}
