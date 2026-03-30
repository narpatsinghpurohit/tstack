import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import type {
	ChangePasswordDto,
	CreateUserDto,
	UpdateProfileDto,
	UpdateUserInfoDto,
	UpdateUserRolesDto,
} from "@tstack/shared";
import * as argon2 from "argon2";
import { RoleService } from "../role/role.service";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		private readonly userRepository: UserRepository,
		private readonly roleService: RoleService,
	) {}

	async findById(id: string) {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new NotFoundException("User not found");
		}
		return user;
	}

	async findByEmail(email: string) {
		return this.userRepository.findByEmail(email);
	}

	async findMany(options: { page?: number; limit?: number; search?: string }) {
		const page = options.page ?? 1;
		const limit = options.limit ?? 20;
		const filter: Record<string, unknown> = {};
		if (options.search) {
			filter.$or = [
				{ email: { $regex: options.search, $options: "i" } },
				{ firstName: { $regex: options.search, $options: "i" } },
				{ lastName: { $regex: options.search, $options: "i" } },
			];
		}

		const result = await this.userRepository.findMany(filter, { page, limit });

		return {
			data: result.data,
			total: result.total,
			page,
			limit,
			totalPages: Math.ceil(result.total / limit),
		};
	}

	async create(dto: CreateUserDto) {
		const existing = await this.userRepository.findByEmail(dto.email);
		if (existing) {
			throw new ConflictException("Email already in use");
		}

		const passwordHash = await argon2.hash(dto.password);

		return this.userRepository.create({
			email: dto.email,
			passwordHash,
			firstName: dto.firstName,
			lastName: dto.lastName,
			phone: dto.phone ?? "",
			roleNames: dto.roleNames ?? [],
			status: "active",
		});
	}

	async updateInfo(id: string, dto: UpdateUserInfoDto) {
		await this.findById(id);

		if (dto.email) {
			const existing = await this.userRepository.findByEmail(dto.email);
			if (existing && String((existing as Record<string, unknown>)._id) !== id) {
				throw new ConflictException("Email already in use");
			}
		}

		return this.userRepository.updateById(id, { $set: dto });
	}

	async updateRoles(id: string, dto: UpdateUserRolesDto) {
		await this.findById(id);

		const update: Record<string, unknown> = {
			roleNames: dto.roleNames,
		};
		if (dto.directPermissions !== undefined) {
			update.directPermissions = dto.directPermissions;
		}
		if (dto.revokedPermissions !== undefined) {
			update.revokedPermissions = dto.revokedPermissions;
		}

		return this.userRepository.updateById(id, { $set: update });
	}

	async updateProfile(id: string, dto: UpdateProfileDto) {
		return this.userRepository.updateById(id, { $set: dto });
	}

	async changePassword(id: string, dto: ChangePasswordDto) {
		const user = await this.findById(id);
		const valid = await argon2.verify(user.passwordHash, dto.currentPassword);
		if (!valid) {
			throw new UnauthorizedException("Current password is incorrect");
		}

		const passwordHash = await argon2.hash(dto.newPassword);
		await this.userRepository.updateById(id, { $set: { passwordHash } });
	}

	async delete(id: string) {
		await this.findById(id);
		return this.userRepository.deleteById(id);
	}

	/**
	 * Resolve platform-level permissions for a user.
	 */
	async resolvePlatformPermissions(userId: string): Promise<string[]> {
		const user = await this.findById(userId);
		const rolePermissions = await this.roleService.resolvePermissionBundle(
			user.roleNames,
		);

		const permissions = new Set<string>(rolePermissions);

		for (const p of user.directPermissions) {
			permissions.add(p);
		}
		for (const p of user.revokedPermissions) {
			permissions.delete(p);
		}

		return [...permissions];
	}
}
