import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DEFAULT_ROLE_NAMES } from "@tstack/shared";
import * as argon2 from "argon2";
import { MembershipRepository } from "../../membership/membership.repository";
import { OrganizationRepository } from "../../organization/organization.repository";
import { UserRepository } from "../../user/user.repository";
import type { Seeder } from "../seeder.interface";

@Injectable()
export class SuperadminSeeder implements Seeder {
	private readonly logger = new Logger(SuperadminSeeder.name);

	constructor(
		private readonly userRepository: UserRepository,
		private readonly orgRepository: OrganizationRepository,
		private readonly membershipRepository: MembershipRepository,
		private readonly configService: ConfigService,
	) {}

	async run(fresh: boolean): Promise<void> {
		this.logger.log("Seeding superadmin user...");

		const email = this.configService.get<string>(
			"SUPERADMIN_EMAIL",
			"admin@tstack.app",
		);
		const password = this.configService.get<string>(
			"SUPERADMIN_PASSWORD",
			"changeme123",
		);
		const firstName = this.configService.get<string>(
			"SUPERADMIN_FIRST_NAME",
			"Super",
		);
		const lastName = this.configService.get<string>(
			"SUPERADMIN_LAST_NAME",
			"Admin",
		);

		if (fresh) {
			this.logger.log("Fresh mode: removing existing superadmin...");
			const existing = await this.userRepository.findByEmail(email);
			if (existing) {
				const userId = String((existing as unknown as { _id: string })._id);
				// Remove membership and org created by previous seed
				await this.membershipRepository.deleteByUserId(userId);
				if (existing.currentOrgId) {
					await this.orgRepository.deleteById(String(existing.currentOrgId));
				}
				await this.userRepository.deleteById(userId);
			}
		}

		const existing = await this.userRepository.findByEmail(email);
		if (existing) {
			const userId = String((existing as unknown as { _id: string })._id);
			if (!existing.currentOrgId) {
				this.logger.log("Superadmin exists but has no org, creating one...");
				await this.createPersonalOrg(userId, email, firstName);
			} else {
				this.logger.log("Superadmin already exists with org, skipping");
			}
			return;
		}

		const passwordHash = await argon2.hash(password);

		// Create superadmin user
		const user = await this.userRepository.create({
			email,
			passwordHash,
			firstName,
			lastName,
			status: "active",
			roleNames: [DEFAULT_ROLE_NAMES.SUPERADMIN],
		});

		const userId = String((user as unknown as { _id: string })._id);

		await this.createPersonalOrg(userId, email, firstName);

		this.logger.log(`Superadmin created: ${email} with personal org`);
	}

	private async createPersonalOrg(
		userId: string,
		email: string,
		firstName: string,
	) {
		const org = await this.orgRepository.create({
			name: `${firstName}'s Organization`,
			slug: email
				.split("@")[0]
				.toLowerCase()
				.replace(/[^a-z0-9]/g, "-"),
			ownerId: userId,
			contactEmail: email,
			status: "active",
			isPersonal: true,
		});

		const orgId = String((org as unknown as { _id: string })._id);

		await this.membershipRepository.create({
			userId,
			orgId,
			roleNames: [DEFAULT_ROLE_NAMES.ADMIN],
			status: "active",
		});

		await this.userRepository.updateById(userId, {
			$set: { currentOrgId: orgId },
		});

		this.logger.log(`Personal org created for ${email}`);
	}
}
