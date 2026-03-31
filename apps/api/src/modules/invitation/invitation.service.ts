import { createHash, randomUUID } from "node:crypto";
import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import type { AcceptInvitationDto, CreateInvitationDto } from "@tstack/shared";
import * as argon2 from "argon2";
import { EmailService } from "../email/email.service";
import { MembershipRepository } from "../membership/membership.repository";
import { OrganizationRepository } from "../organization/organization.repository";
import { UserRepository } from "../user/user.repository";
import { InvitationRepository } from "./invitation.repository";

@Injectable()
export class InvitationService {
	constructor(
		private readonly invitationRepository: InvitationRepository,
		private readonly userRepository: UserRepository,
		private readonly membershipRepository: MembershipRepository,
		private readonly orgRepository: OrganizationRepository,
		private readonly emailService: EmailService,
	) {}

	async create(
		orgId: string,
		dto: CreateInvitationDto,
		invitedBy: string,
		invitedByName: string,
	) {
		const existingUser = await this.userRepository.findByEmail(dto.email);
		if (existingUser) {
			const existingMembership =
				await this.membershipRepository.findByUserAndOrg(
					String((existingUser as unknown as { _id: string })._id),
					orgId,
				);
			if (existingMembership) {
				throw new ConflictException(
					"User is already a member of this organization",
				);
			}
		}

		// Remove any existing invitation for this email+org
		await this.invitationRepository.deleteByOrgAndEmail(orgId, dto.email);

		const token = randomUUID();
		const tokenHash = this.hashToken(token);
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

		const org = await this.orgRepository.findById(orgId);
		const orgName = org?.name ?? "Unknown Organization";

		const invitation = await this.invitationRepository.create({
			orgId,
			email: dto.email,
			roleName: dto.roleName,
			invitedBy,
			tokenHash,
			expiresAt,
		});

		await this.emailService.sendInvitationEmail(
			dto.email,
			token,
			orgName,
			invitedByName,
		);

		return invitation;
	}

	async accept(dto: AcceptInvitationDto) {
		const tokenHash = this.hashToken(dto.token);
		const invitation = await this.invitationRepository.findOne({
			tokenHash,
			expiresAt: { $gt: new Date() },
		});

		if (!invitation) {
			throw new BadRequestException("Invalid or expired invitation token");
		}

		let user = await this.userRepository.findByEmail(invitation.email);

		if (!user) {
			if (!dto.firstName || !dto.lastName || !dto.password) {
				throw new BadRequestException(
					"firstName, lastName, and password are required for new users",
				);
			}

			const passwordHash = await argon2.hash(dto.password);
			user = await this.userRepository.create({
				email: invitation.email,
				passwordHash,
				firstName: dto.firstName,
				lastName: dto.lastName,
				status: "active",
			});
		}

		const userId = String((user as unknown as { _id: string })._id);

		const existingMembership = await this.membershipRepository.findByUserAndOrg(
			userId,
			String(invitation.orgId),
		);

		if (!existingMembership) {
			await this.membershipRepository.create({
				userId,
				orgId: String(invitation.orgId),
				roleNames: [invitation.roleName],
				status: "active",
			});
		}

		await this.invitationRepository.deleteById(
			String((invitation as unknown as { _id: string })._id),
		);

		return { message: "Invitation accepted successfully" };
	}

	async listByOrg(orgId: string, options: { page?: number; limit?: number }) {
		const page = options.page ?? 1;
		const limit = options.limit ?? 20;
		const result = await this.invitationRepository.findByOrgId(orgId, {
			page,
			limit,
		});

		return {
			data: result.data,
			total: result.total,
			page,
			limit,
			totalPages: Math.ceil(result.total / limit),
		};
	}

	async delete(id: string) {
		const invitation = await this.invitationRepository.findById(id);
		if (!invitation) {
			throw new NotFoundException("Invitation not found");
		}
		return this.invitationRepository.deleteById(id);
	}

	/**
	 * Use SHA-256 for token hashing (deterministic, allows lookup by hash).
	 * This is different from password hashing (Argon2) — tokens are random UUIDs
	 * with enough entropy that a fast hash is safe.
	 */
	private hashToken(token: string): string {
		return createHash("sha256").update(token).digest("hex");
	}
}
