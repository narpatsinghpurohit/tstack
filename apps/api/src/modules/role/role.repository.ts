import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { FilterQuery, Model, UpdateQuery } from "mongoose";
import { Role, type RoleDocument } from "./schemas/role.schema";

@Injectable()
export class RoleRepository {
	constructor(
		@InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
	) {}

	async create(data: Partial<Role>): Promise<Role> {
		const doc = await this.roleModel.create(data);
		return doc.toObject();
	}

	async findById(id: string): Promise<Role | null> {
		return this.roleModel.findById(id).lean().exec();
	}

	async findByName(name: string): Promise<Role | null> {
		return this.roleModel.findOne({ name }).lean().exec();
	}

	async findByNames(names: string[]): Promise<Role[]> {
		return this.roleModel
			.find({ name: { $in: names } })
			.lean()
			.exec() as Promise<Role[]>;
	}

	async findAll(): Promise<Role[]> {
		return this.roleModel
			.find()
			.sort({ createdAt: -1 })
			.lean()
			.exec() as Promise<Role[]>;
	}

	async findMany(
		filter: FilterQuery<Role> = {},
		options: { page?: number; limit?: number } = {},
	): Promise<{ data: Role[]; total: number }> {
		const page = options.page ?? 1;
		const limit = options.limit ?? 20;
		const skip = (page - 1) * limit;

		const [data, total] = await Promise.all([
			this.roleModel
				.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean()
				.exec() as Promise<Role[]>,
			this.roleModel.countDocuments(filter).exec(),
		]);

		return { data, total };
	}

	async updateById(
		id: string,
		update: UpdateQuery<Role>,
	): Promise<Role | null> {
		return this.roleModel
			.findByIdAndUpdate(id, update, { new: true })
			.lean()
			.exec();
	}

	async upsertByName(name: string, data: Partial<Role>): Promise<Role> {
		const doc = await this.roleModel
			.findOneAndUpdate({ name }, { $set: data }, { upsert: true, new: true })
			.lean()
			.exec();
		return doc as Role;
	}

	async deleteById(id: string): Promise<Role | null> {
		return this.roleModel.findByIdAndDelete(id).lean().exec();
	}
}
