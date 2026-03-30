import { Injectable, Logger } from "@nestjs/common";
import {
	ALL_PERMISSION_NAMES,
	DEFAULT_ROLE_NAMES,
	PERMISSIONS,
} from "@tstack/shared";
import { RoleRepository } from "../../role/role.repository";
import type { Seeder } from "../seeder.interface";

@Injectable()
export class RoleSeeder implements Seeder {
	private readonly logger = new Logger(RoleSeeder.name);

	constructor(private readonly roleRepository: RoleRepository) {}

	async run(fresh: boolean): Promise<void> {
		this.logger.log("Seeding roles...");

		const roles = [
			{
				name: DEFAULT_ROLE_NAMES.SUPERADMIN,
				description: "Full platform access",
				permissionNames: [...ALL_PERMISSION_NAMES],
				isDefault: true,
			},
			{
				name: DEFAULT_ROLE_NAMES.ADMIN,
				description: "Full organization access",
				permissionNames: [
					PERMISSIONS.ACCESS_ORG_ADMIN_SURFACE,
					PERMISSIONS.ORGANIZATIONS_VIEW,
					PERMISSIONS.ORGANIZATIONS_UPDATE,
					PERMISSIONS.MEMBERS_CREATE,
					PERMISSIONS.MEMBERS_VIEW,
					PERMISSIONS.MEMBERS_UPDATE,
					PERMISSIONS.MEMBERS_DELETE,
					PERMISSIONS.INVITATIONS_CREATE,
					PERMISSIONS.INVITATIONS_VIEW,
					PERMISSIONS.INVITATIONS_DELETE,
					PERMISSIONS.ROLES_VIEW,
				],
				isDefault: true,
			},
			{
				name: DEFAULT_ROLE_NAMES.MEMBER,
				description: "Basic organization access",
				permissionNames: [
					PERMISSIONS.ORGANIZATIONS_VIEW,
					PERMISSIONS.MEMBERS_VIEW,
				],
				isDefault: true,
			},
		];

		for (const role of roles) {
			if (fresh) {
				await this.roleRepository.upsertByName(role.name, role);
			} else {
				const existing = await this.roleRepository.findByName(role.name);
				if (!existing) {
					await this.roleRepository.upsertByName(role.name, role);
				}
			}
		}

		this.logger.log(`Seeded ${roles.length} roles`);
	}
}
