import { Injectable, Logger } from "@nestjs/common";
import { DEFAULT_SYSTEM_SETTINGS } from "@tstack/shared";
import { SystemSettingRepository } from "../../system-setting/system-setting.repository";
import type { Seeder } from "../seeder.interface";

@Injectable()
export class SystemSettingSeeder implements Seeder {
	private readonly logger = new Logger(SystemSettingSeeder.name);

	constructor(
		private readonly settingRepository: SystemSettingRepository,
	) {}

	async run(_fresh: boolean): Promise<void> {
		this.logger.log("Seeding system settings...");

		const entries = Object.entries(DEFAULT_SYSTEM_SETTINGS);

		for (const [key, value] of entries) {
			const existing = await this.settingRepository.findByKey(key);
			if (!existing) {
				await this.settingRepository.upsert(key, value);
			}
		}

		this.logger.log(`Seeded ${entries.length} system settings`);
	}
}
