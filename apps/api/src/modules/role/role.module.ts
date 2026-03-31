import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoleController } from "./role.controller";
import { RoleRepository } from "./role.repository";
import { RoleService } from "./role.service";
import { Role, RoleSchema } from "./schemas/role.schema";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
	],
	controllers: [RoleController],
	providers: [RoleRepository, RoleService],
	exports: [RoleService, RoleRepository],
})
export class RoleModule {}
