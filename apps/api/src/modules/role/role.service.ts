import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import type { CreateRoleDto, UpdateRoleDto } from "@tstack/shared";
import { RoleRepository } from "./role.repository";

@Injectable()
export class RoleService {
	constructor(private readonly roleRepository: RoleRepository) {}

	async findAll() {
		return this.roleRepository.findAll();
	}

	async findById(id: string) {
		const role = await this.roleRepository.findById(id);
		if (!role) {
			throw new NotFoundException("Role not found");
		}
		return role;
	}

	async create(dto: CreateRoleDto) {
		const existing = await this.roleRepository.findByName(dto.name);
		if (existing) {
			throw new ConflictException(`Role "${dto.name}" already exists`);
		}

		return this.roleRepository.create({
			name: dto.name,
			description: dto.description ?? "",
			permissionNames: dto.permissionNames ?? [],
			isDefault: false,
		});
	}

	async update(id: string, dto: UpdateRoleDto) {
		const role = await this.findById(id);

		if (role.isDefault && dto.name && dto.name !== role.name) {
			throw new ForbiddenException("Cannot rename a default role");
		}

		if (dto.name && dto.name !== role.name) {
			const existing = await this.roleRepository.findByName(dto.name);
			if (existing) {
				throw new ConflictException(`Role "${dto.name}" already exists`);
			}
		}

		return this.roleRepository.updateById(id, { $set: dto });
	}

	async delete(id: string) {
		const role = await this.findById(id);
		if (role.isDefault) {
			throw new ForbiddenException("Cannot delete a default role");
		}
		return this.roleRepository.deleteById(id);
	}

	/**
	 * Given an array of role names, resolve the union of all permission names.
	 */
	async resolvePermissionBundle(roleNames: string[]): Promise<string[]> {
		if (roleNames.length === 0) return [];

		const roles = await this.roleRepository.findByNames(roleNames);
		const permissions = new Set<string>();

		for (const role of roles) {
			for (const perm of role.permissionNames) {
				permissions.add(perm);
			}
		}

		return [...permissions];
	}
}
