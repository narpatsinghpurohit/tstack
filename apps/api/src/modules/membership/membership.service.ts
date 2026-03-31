import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import type { AddMemberDto, UpdateMemberDto } from "@tstack/shared";
import * as argon2 from "argon2";
import { RoleService } from "../role/role.service";
import { UserRepository } from "../user/user.repository";
import { MembershipRepository } from "./membership.repository";

@Injectable()
export class MembershipService {
	constructor(
		private readonly membershipRepository: MembershipRepository,
		private readonly userRepository: UserRepository,
		private readonly roleService: RoleService,
	) {}

	async addMember(orgId: string, dto: AddMemberDto) {
		let user = await this.userRepository.findByEmail(dto.email);

		if (!user) {
			const passwordHash = await argon2.hash(
				`temp-${Date.now()}-${Math.random()}`,
			);
			user = await this.userRepository.create({
				email: dto.email,
				passwordHash,
				firstName: dto.firstName,
				lastName: dto.lastName,
				status: "active",
			});
		}

		const userId = String((user as unknown as { _id: string })._id);
		const existing = await this.membershipRepository.findByUserAndOrg(
			userId,
			orgId,
		);
		if (existing) {
			throw new ConflictException(
				"User is already a member of this organization",
			);
		}

		return this.membershipRepository.create({
			userId,
			orgId,
			roleNames: dto.roleNames,
			status: "active",
		});
	}

	async updateMember(membershipId: string, dto: UpdateMemberDto) {
		const membership = await this.membershipRepository.findById(membershipId);
		if (!membership) {
			throw new NotFoundException("Membership not found");
		}

		const update: Record<string, unknown> = {};
		if (dto.roleNames) update.roleNames = dto.roleNames;
		if (dto.status) update.status = dto.status;

		return this.membershipRepository.updateById(membershipId, {
			$set: update,
		});
	}

	async removeMember(membershipId: string) {
		const membership = await this.membershipRepository.findById(membershipId);
		if (!membership) {
			throw new NotFoundException("Membership not found");
		}
		return this.membershipRepository.deleteById(membershipId);
	}

	async listMembers(orgId: string, options: { page?: number; limit?: number }) {
		const page = options.page ?? 1;
		const limit = options.limit ?? 20;
		const result = await this.membershipRepository.findByOrgId(orgId, {
			page,
			limit,
		});

		const userIds = result.data.map((m) => String(m.userId));
		const users = await Promise.all(
			userIds.map((id) => this.userRepository.findById(id)),
		);

		const enriched = result.data.map((m, i) => {
			const user = users[i];
			return {
				_id: String((m as unknown as { _id: string })._id),
				userId: String(m.userId),
				orgId: String(m.orgId),
				email: user?.email ?? "",
				firstName: user?.firstName ?? "",
				lastName: user?.lastName ?? "",
				phone: user?.phone ?? "",
				roleNames: m.roleNames,
				directPermissions: m.directPermissions,
				revokedPermissions: m.revokedPermissions,
				status: m.status,
				createdAt: String(m.createdAt),
				updatedAt: String(m.updatedAt),
			};
		});

		return {
			data: enriched,
			total: result.total,
			page,
			limit,
			totalPages: Math.ceil(result.total / limit),
		};
	}

	async getMembershipsForUser(userId: string) {
		return this.membershipRepository.findByUserId(userId);
	}

	/**
	 * Resolve org-level permissions for a user's membership.
	 */
	async resolveOrgPermissions(
		userId: string,
		orgId: string,
	): Promise<string[]> {
		const membership = await this.membershipRepository.findByUserAndOrg(
			userId,
			orgId,
		);
		if (!membership || membership.status !== "active") {
			return [];
		}

		const rolePermissions = await this.roleService.resolvePermissionBundle(
			membership.roleNames,
		);

		const permissions = new Set<string>(rolePermissions);

		for (const p of membership.directPermissions) {
			permissions.add(p);
		}
		for (const p of membership.revokedPermissions) {
			permissions.delete(p);
		}

		return [...permissions];
	}
}
