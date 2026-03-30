import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { ClientSession, FilterQuery, Model, UpdateQuery } from "mongoose";
import {
	Organization,
	type OrganizationDocument,
} from "./schemas/organization.schema";

/**
 * Organization is a platform entity (no orgId on itself). Uses direct model access.
 */
@Injectable()
export class OrganizationRepository {
	constructor(
		@InjectModel(Organization.name)
		private readonly orgModel: Model<OrganizationDocument>,
	) {}

	async create(data: Partial<Organization>, session?: ClientSession): Promise<Organization> {
		if (session) {
			const docs = await this.orgModel.insertMany([data], { session });
			return docs[0].toObject();
		}
		const doc = await this.orgModel.create(data);
		return doc.toObject();
	}

	async findById(id: string): Promise<Organization | null> {
		return this.orgModel.findById(id).lean().exec();
	}

	async findBySlug(slug: string): Promise<Organization | null> {
		return this.orgModel.findOne({ slug }).lean().exec();
	}

	async findOne(
		filter: FilterQuery<Organization>,
	): Promise<Organization | null> {
		return this.orgModel.findOne(filter).lean().exec();
	}

	async findMany(
		filter: FilterQuery<Organization> = {},
		options: { page?: number; limit?: number; sort?: Record<string, 1 | -1> } = {},
	): Promise<{ data: Organization[]; total: number }> {
		const page = options.page ?? 1;
		const limit = options.limit ?? 20;
		const skip = (page - 1) * limit;
		const sort = options.sort ?? { createdAt: -1 };

		const [data, total] = await Promise.all([
			this.orgModel
				.find(filter)
				.sort(sort)
				.skip(skip)
				.limit(limit)
				.lean()
				.exec(),
			this.orgModel.countDocuments(filter).exec(),
		]);

		return { data: data as Organization[], total };
	}

	async updateById(
		id: string,
		update: UpdateQuery<Organization>,
	): Promise<Organization | null> {
		return this.orgModel
			.findByIdAndUpdate(id, update, { new: true })
			.lean()
			.exec();
	}

	async deleteById(id: string): Promise<Organization | null> {
		return this.orgModel.findByIdAndDelete(id).lean().exec();
	}

	async count(filter: FilterQuery<Organization> = {}): Promise<number> {
		return this.orgModel.countDocuments(filter).exec();
	}

	async generateUniqueSlug(name: string): Promise<string> {
		const base = name
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");

		let slug = base;
		let counter = 1;
		while (await this.orgModel.exists({ slug })) {
			slug = `${base}-${counter}`;
			counter++;
		}
		return slug;
	}
}
