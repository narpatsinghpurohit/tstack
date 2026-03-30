import { Module } from "@nestjs/common";
import { PermissionModule } from "../permission/permission.module";
import { RoleModule } from "../role/role.module";
import { SystemSettingModule } from "../system-setting/system-setting.module";
import { UserModule } from "../user/user.module";
import { DatabaseSeeder } from "./database.seeder";
import { PermissionSeeder } from "./seeders/permission.seeder";
import { RoleSeeder } from "./seeders/role.seeder";
import { SuperadminSeeder } from "./seeders/superadmin.seeder";
import { SystemSettingSeeder } from "./seeders/system-setting.seeder";

@Module({
	imports: [PermissionModule, RoleModule, UserModule, SystemSettingModule],
	providers: [
		DatabaseSeeder,
		PermissionSeeder,
		RoleSeeder,
		SuperadminSeeder,
		SystemSettingSeeder,
	],
	exports: [DatabaseSeeder],
})
export class SeedModule {}
