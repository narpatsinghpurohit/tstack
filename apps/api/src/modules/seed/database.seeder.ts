import { Injectable, Logger } from "@nestjs/common";
import { PermissionSeeder } from "./seeders/permission.seeder";
import { RoleSeeder } from "./seeders/role.seeder";
import { SuperadminSeeder } from "./seeders/superadmin.seeder";
import { SystemSettingSeeder } from "./seeders/system-setting.seeder";

@Injectable()
export class DatabaseSeeder {
	private readonly logger = new Logger(DatabaseSeeder.name);

	constructor(
		private readonly permissionSeeder: PermissionSeeder,
		private readonly roleSeeder: RoleSeeder,
		private readonly superadminSeeder: SuperadminSeeder,
		private readonly systemSettingSeeder: SystemSettingSeeder,
	) {}

	async run(options: { fresh?: boolean; class?: string } = {}): Promise<void> {
		const fresh = options.fresh ?? false;

		this.logger.log(
			`Running seeders${fresh ? " (fresh)" : ""}...`,
		);

		const seeders = [
			{ name: "PermissionSeeder", instance: this.permissionSeeder },
			{ name: "RoleSeeder", instance: this.roleSeeder },
			{ name: "SuperadminSeeder", instance: this.superadminSeeder },
			{ name: "SystemSettingSeeder", instance: this.systemSettingSeeder },
		];

		for (const seeder of seeders) {
			if (options.class && seeder.name !== options.class) {
				continue;
			}
			await seeder.instance.run(fresh);
		}

		this.logger.log("Seeding complete");
	}
}
