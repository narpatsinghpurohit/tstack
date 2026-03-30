import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import type { UpdateSystemSettingsDto } from "@tstack/shared";
import { SystemSettingRepository } from "./system-setting.repository";

@Injectable()
export class SystemSettingService {
	private readonly logger = new Logger(SystemSettingService.name);

	constructor(
		private readonly settingRepository: SystemSettingRepository,
	) {}

	async findAll() {
		return this.settingRepository.findAll();
	}

	async findByKey(key: string) {
		const setting = await this.settingRepository.findByKey(key);
		if (!setting) {
			throw new NotFoundException(`Setting "${key}" not found`);
		}
		return setting;
	}

	async getValue(key: string): Promise<unknown> {
		const setting = await this.settingRepository.findByKey(key);
		return setting?.value ?? null;
	}

	async updateMany(dto: UpdateSystemSettingsDto) {
		const results = await Promise.all(
			dto.settings.map((s) => this.settingRepository.upsert(s.key, s.value)),
		);
		return results;
	}
}
