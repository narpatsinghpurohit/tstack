import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { ClientSession, FilterQuery, Model, UpdateQuery } from "mongoose";
import { User, type UserDocument } from "./schemas/user.schema";

/**
 * User is a platform entity (no orgId). Uses direct model access.
 */
@Injectable()
export class UserRepository {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
	) {}

	async create(data: Partial<User>, session?: ClientSession): Promise<User> {
		if (session) {
			const docs = await this.userModel.insertMany([data], { session });
			return docs[0].toObject();
		}
		const doc = await this.userModel.create(data);
		return doc.toObject();
	}

	async findById(id: string): Promise<User | null> {
		return this.userModel.findById(id).lean().exec();
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.userModel.findOne({ email: email.toLowerCase() }).lean().exec();
	}

	async findOne(filter: FilterQuery<User>): Promise<User | null> {
		return this.userModel.findOne(filter).lean().exec();
	}

	async findMany(
		filter: FilterQuery<User> = {},
		options: {
			page?: number;
			limit?: number;
			sort?: Record<string, 1 | -1>;
		} = {},
	): Promise<{ data: User[]; total: number }> {
		const page = options.page ?? 1;
		const limit = options.limit ?? 20;
		const skip = (page - 1) * limit;
		const sort = options.sort ?? { createdAt: -1 };

		const [data, total] = await Promise.all([
			this.userModel
				.find(filter)
				.sort(sort)
				.skip(skip)
				.limit(limit)
				.lean()
				.exec(),
			this.userModel.countDocuments(filter).exec(),
		]);

		return { data: data as User[], total };
	}

	async updateById(
		id: string,
		update: UpdateQuery<User>,
		session?: ClientSession,
	): Promise<User | null> {
		return this.userModel
			.findByIdAndUpdate(id, update, { new: true, session })
			.lean()
			.exec();
	}

	async deleteById(id: string): Promise<User | null> {
		return this.userModel.findByIdAndDelete(id).lean().exec();
	}

	async count(filter: FilterQuery<User> = {}): Promise<number> {
		return this.userModel.countDocuments(filter).exec();
	}
}
