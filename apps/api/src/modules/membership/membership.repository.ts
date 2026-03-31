import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { ClientSession, FilterQuery, Model, UpdateQuery } from "mongoose";
import {
	Membership,
	type MembershipDocument,
} from "./schemas/membership.schema";

/**
 * Membership is the tenant pivot entity. Uses direct model access.
 */
@Injectable()
export class MembershipRepository {
	constructor(
		@InjectModel(Membership.name)
		private readonly membershipModel: Model<MembershipDocument>,
	) {}

	async create(
		data: Partial<Membership>,
		session?: ClientSession,
	): Promise<Membership> {
		if (session) {
			const docs = await this.membershipModel.insertMany([data], { session });
			return docs[0].toObject();
		}
		const doc = await this.membershipModel.create(data);
		return doc.toObject();
	}

	async findById(id: string): Promise<Membership | null> {
		return this.membershipModel.findById(id).lean().exec();
	}

	async findOne(filter: FilterQuery<Membership>): Promise<Membership | null> {
		return this.membershipModel.findOne(filter).lean().exec();
	}

	async findByUserAndOrg(
		userId: string,
		orgId: string,
	): Promise<Membership | null> {
		return this.membershipModel.findOne({ userId, orgId }).lean().exec();
	}

	async findByUserId(userId: string): Promise<Membership[]> {
		return this.membershipModel.find({ userId }).lean().exec() as Promise<
			Membership[]
		>;
	}

	async findByOrgId(
		orgId: string,
		options: { page?: number; limit?: number } = {},
	): Promise<{ data: Membership[]; total: number }> {
		const page = options.page ?? 1;
		const limit = options.limit ?? 20;
		const skip = (page - 1) * limit;

		const filter: FilterQuery<Membership> = { orgId };

		const [data, total] = await Promise.all([
			this.membershipModel
				.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean()
				.exec() as Promise<Membership[]>,
			this.membershipModel.countDocuments(filter).exec(),
		]);

		return { data, total };
	}

	async updateById(
		id: string,
		update: UpdateQuery<Membership>,
	): Promise<Membership | null> {
		return this.membershipModel
			.findByIdAndUpdate(id, update, { new: true })
			.lean()
			.exec();
	}

	async updateByUserAndOrg(
		userId: string,
		orgId: string,
		update: UpdateQuery<Membership>,
	): Promise<Membership | null> {
		return this.membershipModel
			.findOneAndUpdate({ userId, orgId }, update, { new: true })
			.lean()
			.exec();
	}

	async deleteById(id: string): Promise<Membership | null> {
		return this.membershipModel.findByIdAndDelete(id).lean().exec();
	}

	async deleteByUserAndOrg(
		userId: string,
		orgId: string,
	): Promise<Membership | null> {
		return this.membershipModel
			.findOneAndDelete({ userId, orgId })
			.lean()
			.exec();
	}

	async countByOrgId(orgId: string): Promise<number> {
		return this.membershipModel.countDocuments({ orgId }).exec();
	}

	async deleteByUserId(userId: string): Promise<{ deletedCount: number }> {
		return this.membershipModel.deleteMany({ userId }).exec();
	}
}
