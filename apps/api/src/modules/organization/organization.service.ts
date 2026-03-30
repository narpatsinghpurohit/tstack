import {
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import type {
	CreateOrganizationDto,
	UpdateOrganizationDto,
	UpdateOrganizationStatusDto,
} from "@tstack/shared";
import { OrganizationRepository } from "./organization.repository";

@Injectable()
export class OrganizationService {
	private readonly logger = new Logger(OrganizationService.name);

	constructor(
		private readonly orgRepository: OrganizationRepository,
	) {}

	async findById(id: string) {
		const org = await this.orgRepository.findById(id);
		if (!org) {
			throw new NotFoundException("Organization not found");
		}
		return org;
	}

	async findMany(options: { page?: number; limit?: number; search?: string }) {
		const page = options.page ?? 1;
		const limit = options.limit ?? 20;
		const filter: Record<string, unknown> = {};
		if (options.search) {
			filter.$or = [
				{ name: { $regex: options.search, $options: "i" } },
				{ slug: { $regex: options.search, $options: "i" } },
			];
		}

		const result = await this.orgRepository.findMany(filter, { page, limit });

		return {
			data: result.data,
			total: result.total,
			page,
			limit,
			totalPages: Math.ceil(result.total / limit),
		};
	}

	async create(dto: CreateOrganizationDto, ownerId: string) {
		const slug = await this.orgRepository.generateUniqueSlug(dto.name);

		return this.orgRepository.create({
			name: dto.name,
			slug,
			ownerId,
			contactEmail: dto.contactEmail,
			contactPhone: dto.contactPhone ?? "",
			address: dto.address ?? "",
			status: "active",
			isPersonal: false,
		});
	}

	async update(id: string, dto: UpdateOrganizationDto) {
		await this.findById(id);
		return this.orgRepository.updateById(id, { $set: dto });
	}

	async updateStatus(id: string, dto: UpdateOrganizationStatusDto) {
		const org = await this.findById(id);
		if (org.isPersonal && dto.status !== "active") {
			throw new ForbiddenException("Cannot deactivate a personal organization");
		}
		return this.orgRepository.updateById(id, {
			$set: { status: dto.status },
		});
	}

	async delete(id: string) {
		const org = await this.findById(id);
		if (org.isPersonal) {
			throw new ForbiddenException("Cannot delete a personal organization");
		}
		return this.orgRepository.deleteById(id);
	}
}
