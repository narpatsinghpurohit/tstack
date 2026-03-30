import { Injectable, Logger } from "@nestjs/common";
import { PermissionRepository } from "./permission.repository";

@Injectable()
export class PermissionService {
	private readonly logger = new Logger(PermissionService.name);

	constructor(
		private readonly permissionRepository: PermissionRepository,
	) {}

	async findAll() {
		return this.permissionRepository.findAll();
	}

	async findAllGrouped(): Promise<Record<string, Array<{ name: string; description: string }>>> {
		const permissions = await this.permissionRepository.findAll();
		const grouped: Record<string, Array<{ name: string; description: string }>> = {};

		for (const perm of permissions) {
			if (!grouped[perm.group]) {
				grouped[perm.group] = [];
			}
			grouped[perm.group].push({
				name: perm.name,
				description: perm.description,
			});
		}

		return grouped;
	}
}
