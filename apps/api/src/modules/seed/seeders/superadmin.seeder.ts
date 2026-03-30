import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DEFAULT_ROLE_NAMES } from "@tstack/shared";
import * as argon2 from "argon2";
import { UserRepository } from "../../user/user.repository";
import type { Seeder } from "../seeder.interface";

@Injectable()
export class SuperadminSeeder implements Seeder {
	private readonly logger = new Logger(SuperadminSeeder.name);

	constructor(
		private readonly userRepository: UserRepository,
		private readonly configService: ConfigService,
	) {}

	async run(_fresh: boolean): Promise<void> {
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

		const existing = await this.userRepository.findByEmail(email);
		if (existing) {
			this.logger.log("Superadmin already exists, skipping");
			return;
		}

		const passwordHash = await argon2.hash(password);

		await this.userRepository.create({
			email,
			passwordHash,
			firstName,
			lastName,
			status: "active",
			roleNames: [DEFAULT_ROLE_NAMES.SUPERADMIN],
		});

		this.logger.log(`Superadmin created: ${email}`);
	}
}
