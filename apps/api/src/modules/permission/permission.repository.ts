import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import {
	Permission,
	type PermissionDocument,
} from "./schemas/permission.schema";

@Injectable()
export class PermissionRepository {
	constructor(
		@InjectModel(Permission.name)
		private readonly permissionModel: Model<PermissionDocument>,
	) {}

	async findAll(): Promise<Permission[]> {
		return this.permissionModel
			.find()
			.sort({ group: 1, name: 1 })
			.lean()
			.exec() as Promise<Permission[]>;
	}

	async upsertByName(
		name: string,
		data: Partial<Permission>,
	): Promise<Permission> {
		const doc = await this.permissionModel
			.findOneAndUpdate({ name }, { $set: data }, { upsert: true, new: true })
			.lean()
			.exec();
		return doc as Permission;
	}

	async findByNames(names: string[]): Promise<Permission[]> {
		return this.permissionModel
			.find({ name: { $in: names } })
			.lean()
			.exec() as Promise<Permission[]>;
	}
}
