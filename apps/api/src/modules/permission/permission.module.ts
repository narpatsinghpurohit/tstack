import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PermissionController } from "./permission.controller";
import { PermissionRepository } from "./permission.repository";
import {
	Permission,
	PermissionSchema,
} from "./schemas/permission.schema";
import { PermissionService } from "./permission.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Permission.name, schema: PermissionSchema },
		]),
	],
	controllers: [PermissionController],
	providers: [PermissionRepository, PermissionService],
	exports: [PermissionService, PermissionRepository],
})
export class PermissionModule {}
