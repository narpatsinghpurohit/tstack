import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
	SystemSetting,
	SystemSettingSchema,
} from "./schemas/system-setting.schema";
import { SystemSettingController } from "./system-setting.controller";
import { SystemSettingRepository } from "./system-setting.repository";
import { SystemSettingService } from "./system-setting.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: SystemSetting.name, schema: SystemSettingSchema },
		]),
	],
	controllers: [SystemSettingController],
	providers: [SystemSettingRepository, SystemSettingService],
	exports: [SystemSettingService, SystemSettingRepository],
})
export class SystemSettingModule {}
