import { Body, Controller, Get, Patch } from "@nestjs/common";
import { PERMISSIONS } from "@tstack/shared";
import type { UpdateSystemSettingsDto } from "@tstack/shared";
import { updateSystemSettingsSchema } from "@tstack/shared";
import { Can } from "../../common/decorators/can.decorator";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe";
import { SystemSettingService } from "./system-setting.service";

@Controller("settings")
export class SystemSettingController {
	constructor(
		private readonly systemSettingService: SystemSettingService,
	) {}

	@Get()
	@Can(PERMISSIONS.SETTINGS_VIEW)
	findAll() {
		return this.systemSettingService.findAll();
	}

	@Patch()
	@Can(PERMISSIONS.SETTINGS_UPDATE)
	update(
		@Body(new ZodValidationPipe(updateSystemSettingsSchema))
		dto: UpdateSystemSettingsDto,
	) {
		return this.systemSettingService.updateMany(dto);
	}
}
