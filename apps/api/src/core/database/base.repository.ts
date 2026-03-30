import type { FilterQuery, Model, UpdateQuery } from "mongoose";

/**
 * Abstract base repository that auto-scopes all queries by orgId.
 * Extend this for every tenant-scoped entity.
 * Platform entities (User, Organization, Membership, SystemSetting) should NOT extend this.
 */
export abstract class BaseRepository<T> {
	constructor(protected readonly model: Model<T>) {}

	async create(data: Partial<T>): Promise<T> {
		const doc = await this.model.create(data);
		return doc.toObject() as T;
	}

	async createMany(data: Partial<T>[]): Promise<T[]> {
		const docs = await this.model.insertMany(data);
		return docs.map((doc) => doc.toObject() as T);
	}

	async findOneByOrg(
		orgId: string,
		filter: FilterQuery<T> = {},
	): Promise<T | null> {
		return this.model
			.findOne({ ...filter, orgId } as FilterQuery<T>)
			.lean()
			.exec() as Promise<T | null>;
	}

	async findManyByOrg(
		orgId: string,
		filter: FilterQuery<T> = {},
		options: {
			page?: number;
			limit?: number;
			sort?: Record<string, 1 | -1>;
		} = {},
	): Promise<{ data: T[]; total: number }> {
		const page = options.page ?? 1;
		const limit = options.limit ?? 20;
		const skip = (page - 1) * limit;
		const sort = options.sort ?? { createdAt: -1 };

		const query = { ...filter, orgId } as FilterQuery<T>;

		const [data, total] = await Promise.all([
			this.model
				.find(query)
				.sort(sort)
				.skip(skip)
				.limit(limit)
				.lean()
				.exec() as Promise<T[]>,
			this.model.countDocuments(query).exec(),
		]);

		return { data, total };
	}

	async findByIdAndOrg(id: string, orgId: string): Promise<T | null> {
		return this.model
			.findOne({ _id: id, orgId } as FilterQuery<T>)
			.lean()
			.exec() as Promise<T | null>;
	}

	async updateOneByOrg(
		orgId: string,
		filter: FilterQuery<T>,
		update: UpdateQuery<T>,
	): Promise<T | null> {
		return this.model
			.findOneAndUpdate({ ...filter, orgId } as FilterQuery<T>, update, {
				new: true,
			})
			.lean()
			.exec() as Promise<T | null>;
	}

	async deleteOneByOrg(
		orgId: string,
		filter: FilterQuery<T>,
	): Promise<T | null> {
		return this.model
			.findOneAndDelete({ ...filter, orgId } as FilterQuery<T>)
			.lean()
			.exec() as Promise<T | null>;
	}

	async deleteManyByOrg(
		orgId: string,
		filter: FilterQuery<T> = {},
	): Promise<number> {
		const result = await this.model
			.deleteMany({ ...filter, orgId } as FilterQuery<T>)
			.exec();
		return result.deletedCount;
	}

	async countByOrg(
		orgId: string,
		filter: FilterQuery<T> = {},
	): Promise<number> {
		return this.model
			.countDocuments({ ...filter, orgId } as FilterQuery<T>)
			.exec();
	}
}
