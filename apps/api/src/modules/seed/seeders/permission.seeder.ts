import { Injectable, Logger } from "@nestjs/common";
import { PERMISSION_DEFINITIONS } from "@tstack/shared";
import { PermissionRepository } from "../../permission/permission.repository";
import type { Seeder } from "../seeder.interface";

@Injectable()
export class PermissionSeeder implements Seeder {
	private readonly logger = new Logger(PermissionSeeder.name);

	constructor(
		private readonly permissionRepository: PermissionRepository,
	) {}

	async run(_fresh: boolean): Promise<void> {
		this.logger.log("Seeding permissions...");

		for (const def of PERMISSION_DEFINITIONS) {
			await this.permissionRepository.upsertByName(def.name, {
				name: def.name,
				description: def.description,
				group: def.group,
			});
		}

		this.logger.log(
			`Seeded ${PERMISSION_DEFINITIONS.length} permissions`,
		);
	}
}
