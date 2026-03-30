import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoleController } from "./role.controller";
import { RoleRepository } from "./role.repository";
import { Role, RoleSchema } from "./schemas/role.schema";
import { RoleService } from "./role.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
	],
	controllers: [RoleController],
	providers: [RoleRepository, RoleService],
	exports: [RoleService, RoleRepository],
})
export class RoleModule {}
