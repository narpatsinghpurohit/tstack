import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { FilterQuery, Model } from "mongoose";
import {
	Invitation,
	type InvitationDocument,
} from "./schemas/invitation.schema";

@Injectable()
export class InvitationRepository {
	constructor(
		@InjectModel(Invitation.name)
		private readonly invitationModel: Model<InvitationDocument>,
	) {}

	async create(data: Partial<Invitation>): Promise<Invitation> {
		const doc = await this.invitationModel.create(data);
		return doc.toObject();
	}

	async findById(id: string): Promise<Invitation | null> {
		return this.invitationModel.findById(id).lean().exec();
	}

	async findOne(
		filter: FilterQuery<Invitation>,
	): Promise<Invitation | null> {
		return this.invitationModel.findOne(filter).lean().exec();
	}

	async findByOrgId(
		orgId: string,
		options: { page?: number; limit?: number } = {},
	): Promise<{ data: Invitation[]; total: number }> {
		const page = options.page ?? 1;
		const limit = options.limit ?? 20;
		const skip = (page - 1) * limit;

		const filter: FilterQuery<Invitation> = {
			orgId,
			expiresAt: { $gt: new Date() },
		};

		const [data, total] = await Promise.all([
			this.invitationModel
				.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean()
				.exec() as Promise<Invitation[]>,
			this.invitationModel.countDocuments(filter).exec(),
		]);

		return { data, total };
	}

	async deleteById(id: string): Promise<Invitation | null> {
		return this.invitationModel.findByIdAndDelete(id).lean().exec();
	}

	async deleteByOrgAndEmail(
		orgId: string,
		email: string,
	): Promise<void> {
		await this.invitationModel.deleteMany({ orgId, email }).exec();
	}
}
